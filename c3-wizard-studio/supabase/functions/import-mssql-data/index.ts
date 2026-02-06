import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

function cleanUtf16Text(text: string): string {
  // Remove BOM (U+FEFF)
  let cleaned = text.replace(/^\uFEFF/, '');
  
  // Remove null bytes (UTF-16 LE to ASCII)
  cleaned = cleaned.replace(/\x00/g, '');
  
  // Remove replacement characters
  cleaned = cleaned.replace(/\uFFFD/g, '');
  
  // Handle UTF-16 wide-spacing: "I N S E R T" -> "INSERT"
  // If we detect this pattern, fix it
  if (cleaned.includes('I N S E R T') || cleaned.includes('V A L U E S')) {
    // Pattern: single character followed by space and another single character
    // We need to remove these artifact spaces
    cleaned = cleaned.replace(/(\w) (?=\w)/g, '$1');
  }
  
  // Normalize line endings
  cleaned = cleaned.replace(/[\r\n]+/g, '\n');
  
  // Remove any remaining control characters except newline and tab
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
  
  // Collapse multiple spaces to single space
  cleaned = cleaned.replace(/ +/g, ' ');
  
  return cleaned.trim();
}

function parseInsertStatements(content: string, tableName: string): any[] {
  const records: any[] = [];
  const cleanContent = cleanUtf16Text(content);

  // Regex-only parsing fails frequently with MS SQL scripts because VALUES may contain
  // nested parentheses (CAST/CONVERT) and commas inside function calls.
  // We only use regex to find INSERT statement starts, then we scan characters to
  // find the matching parens for (columns) and (values).
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const startRegex = new RegExp(
    // Supports: INSERT [dbo].[Table] (...) VALUES (...)
    //           INSERT INTO [dbo].[Table] (...) VALUES (...)
    //           INSERT INTO [Table] (...) VALUES (...)
    `INSERT\\s+(?:INTO\\s+)?(?:\\[dbo\\]\\.\\s*)?\\[${escapeRegExp(tableName)}\\]`,
    'gi'
  );

  const findMatchingParen = (text: string, openIndex: number) => {
    let depth = 0;
    let inString = false;
    for (let i = openIndex; i < text.length; i++) {
      const ch = text[i];

      if (ch === "'") {
        if (inString) {
          // SQL escape: doubled single-quote inside string
          if (text[i + 1] === "'") {
            i++; // skip escaped quote
          } else {
            inString = false;
          }
        } else {
          inString = true;
        }
        continue;
      }

      if (inString) continue;

      if (ch === '(') {
        depth++;
      } else if (ch === ')') {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  };

  let match;
  while ((match = startRegex.exec(cleanContent)) !== null) {
    try {
      // Find columns parens
      let cursor = startRegex.lastIndex;
      // Skip whitespace
      while (cursor < cleanContent.length && /\s/.test(cleanContent[cursor])) cursor++;
      // Find the next '(' after INSERT ... [Table]
      const colOpen = cleanContent.indexOf('(', cursor);
      if (colOpen === -1) continue;
      const colClose = findMatchingParen(cleanContent, colOpen);
      if (colClose === -1) continue;

      const columnsStr = cleanContent.substring(colOpen + 1, colClose);
      const columns = columnsStr
        .split(',')
        .map(col => col.replace(/[\[\]]/g, '').trim())
        .filter(Boolean);

      // Find VALUES keyword after columns
      const afterCols = cleanContent.substring(colClose + 1);
      const valuesRel = afterCols.search(/\bVALUES\b/i);
      if (valuesRel === -1) continue;
      const valuesKw = colClose + 1 + valuesRel;
      const valOpen = cleanContent.indexOf('(', valuesKw);
      if (valOpen === -1) continue;
      const valClose = findMatchingParen(cleanContent, valOpen);
      if (valClose === -1) continue;

      const valuesStr = cleanContent.substring(valOpen + 1, valClose);
      const values = parseValues(valuesStr);

      if (columns.length === values.length) {
        const record: any = {};
        columns.forEach((col, i) => {
          record[col] = values[i];
        });
        records.push(record);
      } else {
        // Keep going; mismatch usually means a malformed statement in file
        // or an unsupported edge case. We'll log the first few mismatches.
        if (records.length < 3) {
          console.warn(
            `[parseInsertStatements] Column/value mismatch for ${tableName}: cols=${columns.length} vals=${values.length}`
          );
        }
      }

      // Advance regex cursor past this statement's values to avoid accidental
      // re-matching inside the same statement.
      startRegex.lastIndex = valClose + 1;
    } catch (e) {
      console.error('Error parsing INSERT:', e);
    }
  }

  return records;
}

function parseValues(valuesStr: string): any[] {
  const values: any[] = [];
  let current = '';
  let inString = false;
  let parenDepth = 0;
  
  for (let i = 0; i < valuesStr.length; i++) {
    const char = valuesStr[i];
    const prevChar = i > 0 ? valuesStr[i - 1] : '';
    
    if (char === "'" && prevChar !== "'") {
      inString = !inString;
      current += char;
    } else if (char === '(' && !inString) {
      parenDepth++;
      current += char;
    } else if (char === ')' && !inString) {
      parenDepth--;
      current += char;
    } else if (char === ',' && !inString && parenDepth === 0) {
      values.push(parseValue(current.trim()));
      current = '';
    } else {
      current += char;
    }
  }
  
  if (current.trim()) {
    values.push(parseValue(current.trim()));
  }
  
  return values;
}

function parseValue(val: string): any {
  val = val.trim();
  
  if (val.toUpperCase() === 'NULL') {
    return null;
  }
  
  if (val.startsWith("N'") && val.endsWith("'")) {
    return val.slice(2, -1).replace(/''/g, "'");
  }
  
  if (val.startsWith("'") && val.endsWith("'")) {
    return val.slice(1, -1).replace(/''/g, "'");
  }
  
  const castMatch = val.match(/CAST\s*\(\s*N?'([^']+)'\s+AS\s+\w+\s*\)/i);
  if (castMatch) {
    return castMatch[1];
  }
  
  if (/^-?\d+\.?\d*$/.test(val)) {
    return parseFloat(val);
  }
  
  return val;
}

function formatDate(dateVal: any): string | null {
  if (!dateVal) return null;
  if (typeof dateVal === 'string') {
    const match = dateVal.match(/(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : null;
  }
  return null;
}

function toBool(val: any): boolean {
  return val === 1 || val === true || val === '1' || val === 'true';
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/__+/g, '_');
}

// ========================================
// TABLE MAPPING CONFIGURATION
// All 59 production tables with field mappings
// ========================================

interface TableMapping {
  legacyTable: string;
  supabaseTable: string;
  fieldMap: Record<string, string>;
  transforms?: Record<string, (val: any) => any>;
}

const TABLE_MAPPINGS: TableMapping[] = [
  // ============= COMPANY & EMPLOYEE =============
  {
    legacyTable: 'MasterCompany',
    supabaseTable: 'c3_master_company',
    fieldMap: {
      'Company_Id': 'company_id',
      'Company_Name': 'company_name',
      'Trade_Name': 'trade_name',
      'REG_NUMBER': 'reg_number',
      'Address1': 'address1',
      'Address2': 'address2',
      'City': 'city',
      'State': 'state',
      'ZIP': 'zip',
      'Country': 'country',
      'Mobile': 'mobile',
      'Landline': 'landline',
      'FAX': 'fax',
      'Contact_Person': 'contact_person',
      'Email': 'email',
      'CompanyLogo': 'company_logo',
      'IsActive': 'is_active',
      'IsLevyExempt': 'is_levy_exempt',
      'IsVerified': 'is_verified',
      'officeCode': 'office_code',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info',
      'Reg_Date': 'reg_date',
      'ParentId': 'parent_id',
      'Tokan': 'tokan',
      'Checked': 'checked'
    },
    transforms: {
      'is_active': toBool,
      'is_levy_exempt': toBool,
      'is_verified': toBool
    }
  },
  {
    legacyTable: 'MasterEmployee',
    supabaseTable: 'c3_master_employee',
    fieldMap: {
      'EmployeeID': 'emp_id',
      'Company_Id': 'company_id',
      'Soc_Sec_Num': 'soc_sec_num',
      'First_Name': 'first_name',
      'Last_Name': 'last_name',
      'Middle_Name': 'middle_name',
      'BirthDate': 'birth_date',
      'Gender': 'gender',
      'Address1': 'address1',
      'Address2': 'address2',
      'City': 'city',
      'State': 'state',
      'ZIP': 'zip',
      'Country': 'country',
      'Phone': 'phone',
      'Mobile': 'mobile',
      'Email': 'email',
      'JoiningDate': 'joining_date',
      'TerminationDate': 'termination_date',
      'IsActive': 'is_active',
      'IsDirectorOnly': 'is_director_only',
      'IsEmployeeDirector': 'is_employee_director',
      'IsLevyExempt': 'is_levy_exempt',
      'PayPeriod': 'pay_period',
      'Occupation': 'occupation',
      'AnnualSalary': 'annual_salary',
      'BankAcctNo': 'bank_acct_no',
      'Marital_Stat': 'marital_stat',
      'Empl_Code': 'empl_code',
      'Empl_Status': 'empl_status',
      'TIN': 'tin',
      'CategoryType': 'category_type',
      'OfficeCode': 'office_code',
      'IsWageCategoryFromAPI': 'is_wage_category_from_api',
      'Allowances': 'allowances',
      'State_Allow': 'state_allow',
      'State_UDF': 'state_udf',
      'LastIncDate': 'last_inc_date',
      'LastPayDate': 'last_pay_date',
      'FlexDeptAcctType': 'flex_dept_acct_type',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info',
      'Checked': 'checked'
    },
    transforms: {
      'is_active': toBool,
      'is_director_only': toBool,
      'is_employee_director': toBool,
      'is_levy_exempt': toBool,
      'is_wage_category_from_api': toBool,
      'birth_date': formatDate,
      'joining_date': formatDate,
      'termination_date': formatDate
    }
  },
  {
    legacyTable: 'SelfEmployee',
    supabaseTable: 'c3_self_employee',
    fieldMap: {
      'EmployeeID': 'employee_id',
      'Company_Id': 'company_id',
      'Soc_Sec_Num': 'soc_sec_num',
      'First_Name': 'first_name',
      'Last_Name': 'last_name',
      'Middle_Name': 'middle_name',
      'BirthDate': 'birth_date',
      'Gender': 'gender',
      'Address1': 'address1',
      'Address2': 'address2',
      'City': 'city',
      'State': 'state',
      'ZIP': 'zip',
      'Country': 'country',
      'Phone': 'phone',
      'Mobile': 'mobile',
      'Email': 'email',
      'AppointDate': 'appint_date',
      'RegDate': 'reg_date',
      'Terminated': 'terminated',
      'IsActive': 'is_active',
      'IsDirectorOnly': 'is_director_only',
      'IsEmployeeDirector': 'is_employee_director',
      'PayPeriod': 'pay_period',
      'Occupation': 'occupation',
      'BankAcctNo': 'bank_acct_no',
      'Marital_Stat': 'marital_stat',
      'Empl_Code': 'empl_code',
      'Empl_Status': 'empl_status',
      'TIN': 'tin',
      'CategoryType': 'category_type',
      'OfficeCode': 'office_code',
      'IsWageCategoryFromAPI': 'is_wage_category_from_api',
      'Allowances': 'allowances',
      'State_Allow': 'state_allow',
      'State_UDF': 'state_udf',
      'LastIncDate': 'last_inc_date',
      'LastPayDate': 'last_pay_date',
      'FlexDeptAcctType': 'flex_dept_acct_type',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info',
      'Checked': 'checked'
    },
    transforms: {
      'is_active': toBool,
      'is_director_only': toBool,
      'is_employee_director': toBool,
      'is_wage_category_from_api': toBool,
      'birth_date': formatDate
    }
  },
  {
    legacyTable: 'MasterEmpType',
    supabaseTable: 'c3_master_emp_type',
    fieldMap: {
      'EmpTypeId': 'emp_type_id',
      'EmpTypeName': 'emp_type_name',
      'Description': 'description',
      'IsActive': 'is_active',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    },
    transforms: { 'is_active': toBool }
  },
  {
    legacyTable: 'MasterEmployerCodes',
    supabaseTable: 'c3_master_employer_codes',
    fieldMap: {
      'EmployerCodeId': 'employer_code_id',
      'Company_Id': 'company_id',
      'Code': 'code',
      'Description': 'description',
      'IsActive': 'is_active',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    },
    transforms: { 'is_active': toBool }
  },
  
  // ============= RATE & CONFIG =============
  {
    legacyTable: 'Master_Rate_Setting',
    supabaseTable: 'c3_master_rate_setting',
    fieldMap: {
      'MRS_Id': 'mrs_id',
      'Soc_EE_Rate': 'soc_ee_rate',
      'Soc_ER_Rate': 'soc_er_rate',
      'Severance_Rate': 'severance_rate',
      'Employer_Levy': 'employer_levy',
      'Bonus_Levy_EE_Rate': 'bonus_levy_ee_rate',
      'EIB': 'eib',
      'Penalty_Rate': 'penalty_rate',
      'Fine_Rate': 'fine_rate',
      'Additional_Penalty_Rate': 'additional_penalty_rate',
      'Additional_Fine_Rate': 'additional_fine_rate',
      'Min_Age': 'min_age',
      'Max_Age': 'max_age',
      'From_Date': 'from_date',
      'To_Date': 'to_date',
      'IsLocked': 'is_locked'
    },
    transforms: { 'is_locked': toBool }
  },
  {
    legacyTable: 'Deductions_Tax_Table_Header',
    supabaseTable: 'c3_deductions_tax_table_header',
    fieldMap: {
      'Tax_Tab_HId': 'tax_tab_hid',
      'Tax_Year': 'tax_year',
      'Ded_Code': 'ded_code',
      'Start_Date': 'start_date',
      'End_Date': 'end_date',
      'Allow_Or_Limit': 'allow_or_limit',
      'Week_Allow': 'week_allow',
      'BiWeek_Allow': 'biweek_allow',
      'SMonth_Allow': 'smonth_allow',
      'Month_Allow': 'month_allow',
      'Quarter_Allow': 'quarter_allow',
      'SYear_Allow': 'syear_allow',
      'Year_Allow': 'year_allow',
      'Misc_Allow': 'misc_allow',
      'Hrs_Week_Allow': 'hrs_week_allow',
      'Hrs_BiWeek_Allow': 'hrs_biweek_allow',
      'Hrs_SMonth_Allow': 'hrs_smonth_allow',
      'Hrs_Month_Allow': 'hrs_month_allow',
      'Hrs_Quarter_Allow': 'hrs_quarter_allow',
      'Hrs_SYear_Allow': 'hrs_syear_allow',
      'Hrs_Year_Allow': 'hrs_year_allow',
      'Hrs_Misc_Allow': 'hrs_misc_allow'
    }
  },
  {
    legacyTable: 'Deductions_Tax_Table_Details',
    supabaseTable: 'c3_deductions_tax_table_details',
    fieldMap: {
      'Tax_Tab_Id': 'tax_tab_id',
      'Tax_Header_Id': 'tax_header_id',
      'Tax_Year': 'tax_year',
      'Ded_Code': 'ded_code',
      'Pay_Period': 'pay_period',
      'Order_No': 'order_no',
      'Over_Amt': 'over_amt',
      'Base_Amt': 'base_amt',
      'Tax_Rate': 'tax_rate',
      'Marital_Stat': 'marital_stat'
    }
  },
  {
    legacyTable: 'DECEMBER_BONUS_EXEMPTED_CONTRIBUTION',
    supabaseTable: 'c3_december_bonus_exempted_contribution',
    fieldMap: {
      'DBS_Id': 'dbs_id',
      'Year': 'year',
      'Month_No': 'month_no',
      'Is_Exempted_Social_Security': 'is_exempted_social_security',
      'Is_Exempted_Severance': 'is_exempted_severance',
      'Is_Exempted_Levy': 'is_exempted_levy',
      'Is_Exempted_Employer_Levy': 'is_exempted_employer_levy',
      'IsLocked': 'is_locked',
      'Deletable': 'deletable',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    },
    transforms: {
      'is_exempted_social_security': toBool,
      'is_exempted_severance': toBool,
      'is_exempted_levy': toBool,
      'is_exempted_employer_levy': toBool,
      'is_locked': toBool,
      'deletable': toBool
    }
  },
  {
    legacyTable: 'Self_Employed_Settings',
    supabaseTable: 'c3_self_employed_settings',
    fieldMap: {
      'Id': 'id',
      'SettingKey': 'setting_key',
      'SettingValue': 'setting_value',
      'Description': 'description',
      'IsActive': 'is_active'
    },
    transforms: { 'is_active': toBool }
  },
  {
    legacyTable: 'NWD_Master_Rate_Settings',
    supabaseTable: 'c3_nwd_master_rate_settings',
    fieldMap: {
      'Id': 'id',
      'RateType': 'rate_type',
      'RateValue': 'rate_value',
      'From_Date': 'from_date',
      'To_Date': 'to_date',
      'IsActive': 'is_active',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on'
    },
    transforms: { 'is_active': toBool }
  },
  {
    legacyTable: 'SiteSettings',
    supabaseTable: 'c3_site_settings',
    fieldMap: {
      'Id': 'id',
      'SettingKey': 'setting_key',
      'SettingValue': 'setting_value',
      'SettingType': 'setting_type',
      'Description': 'description',
      'IsActive': 'is_active',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    },
    transforms: { 'is_active': toBool }
  },
  
  // ============= C3 FORM & CONTRIBUTIONS =============
  {
    legacyTable: 'PROCESS_C3Header',
    supabaseTable: 'c3_process_c3_header',
    fieldMap: {
      'C3Header_Id': 'c3_header_id',
      'Company_Id': 'company_id',
      'REG_NUMBER': 'reg_number',
      'PeriodMonth': 'period_month',
      'PeriodYear': 'period_year',
      'ScheduleNo': 'schedule_no',
      'Total_Wages': 'total_wages',
      'Total_EE_SS': 'total_ee_ss',
      'Total_ER_SS': 'total_er_ss',
      'Total_SS_Contribution': 'total_ss_contribution',
      'Total_SS_Penalty': 'total_ss_penalty',
      'Total_Severance': 'total_severance',
      'Total_Severance_Penalty': 'total_severance_penalty',
      'Total_EE_Levy': 'total_ee_levy',
      'Total_ER_Levy': 'total_er_levy',
      'Total_Levy': 'total_levy',
      'Total_Levy_Penalty': 'total_levy_penalty',
      'Total_Contributions': 'total_contributions',
      'Total_Fine': 'total_fine',
      'Grand_Total': 'grand_total',
      'Amount_Paid': 'amount_paid',
      'Balance_Due': 'balance_due',
      'Is_Finalized': 'is_finalized',
      'C3_Finalized_By': 'c3_finalized_by',
      'C3_Finalized_Date': 'c3_finalized_date',
      'Is_Submitted': 'is_submitted',
      'C3_Submitted_By': 'c3_submitted_by',
      'C3_Submitted_Date': 'c3_submitted_date',
      'Is_Unlocked': 'is_unlocked',
      'Is_Sent_For_Edit': 'is_sent_for_edit',
      'Sent_On_For_Edit': 'sent_on_for_edit',
      'Edit_Permitted_By': 'edit_permitted_by',
      'Bima_Submit_Response': 'bima_submit_response',
      'Error_Desc': 'error_desc',
      'Is_Import_From_BEMA': 'is_import_from_bema',
      'Notes': 'notes',
      'Remarks': 'remarks',
      'InsertedBy': 'inserted_by',
      'Insert_Machine_Info': 'insert_machine_info',
      'Insert_DateTime_Info': 'insert_datetime_info',
      'ModifiedBy': 'modified_by',
      'Modified_Machine_Info': 'modified_machine_info',
      'ModifiedOn': 'modified_on',
      'Print_By': 'print_by',
      'Print_DateTime_Info': 'print_datetime_info',
      'Export_By': 'export_by',
      'Export_On': 'export_on'
    },
    transforms: {
      'is_finalized': toBool,
      'is_submitted': toBool,
      'is_unlocked': toBool,
      'is_sent_for_edit': toBool,
      'is_import_from_bema': toBool
    }
  },
  {
    legacyTable: 'Process_Contributions',
    supabaseTable: 'c3_process_contributions',
    fieldMap: {
      'Contribution_Id': 'contribution_id',
      'C3Header_Id': 'c3_header_id',
      'Company_Id': 'company_id',
      'EmployeeID': 'employee_id',
      'Soc_Sec_Num': 'soc_sec_num',
      'Employee_Name': 'employee_name',
      'BirthDate': 'birth_date',
      'PeriodMonth': 'period_month',
      'PeriodYear': 'period_year',
      'WeeksWorked': 'weeks_worked',
      'DaysWorked': 'days_worked',
      'HoursWorked': 'hours_worked',
      'Total_Wages': 'total_wages',
      'Insurable_Wages': 'insurable_wages',
      'SS_EE_Contribution': 'ss_ee_contribution',
      'SS_ER_Contribution': 'ss_er_contribution',
      'SS_Total': 'ss_total',
      'SS_Penalty': 'ss_penalty',
      'Severance': 'severance',
      'Severance_Penalty': 'severance_penalty',
      'Levy_EE': 'levy_ee',
      'Levy_ER': 'levy_er',
      'Levy_Total': 'levy_total',
      'Levy_Penalty': 'levy_penalty',
      'Total_Contribution': 'total_contribution',
      'Total_Penalty': 'total_penalty',
      'Grand_Total': 'grand_total',
      'IsActive': 'is_active',
      'IsDirectorOnly': 'is_director_only',
      'IsEmployeeDirector': 'is_employee_director',
      'IsLevyExempt': 'is_levy_exempt',
      'Wage_Category_Id': 'wage_category_id',
      'Remarks': 'remarks',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    },
    transforms: {
      'is_active': toBool,
      'is_director_only': toBool,
      'is_employee_director': toBool,
      'is_levy_exempt': toBool,
      'birth_date': formatDate
    }
  },
  {
    legacyTable: 'PROCESS_Self_EmployedC3',
    supabaseTable: 'c3_process_self_employed_c3',
    fieldMap: {
      'SEC3_Id': 'sec3_id',
      'SSN': 'ssn',
      'User_Name': 'user_name',
      'PeriodMonth': 'period_month',
      'PeriodYear': 'period_year',
      'Category_Type': 'category_type',
      'ScheduleNo': 'schedule_no',
      'Week1': 'week1',
      'Week2': 'week2',
      'Week3': 'week3',
      'Week4': 'week4',
      'Week5': 'week5',
      'Wages1': 'wages1',
      'Wages2': 'wages2',
      'Wages3': 'wages3',
      'Wages4': 'wages4',
      'Wages5': 'wages5',
      'Selected_Type_Week1': 'selected_type_week1',
      'Selected_Type_Week2': 'selected_type_week2',
      'Selected_Type_Week3': 'selected_type_week3',
      'Selected_Type_Week4': 'selected_type_week4',
      'Selected_Type_Week5': 'selected_type_week5',
      'Total_Wages': 'total_wages',
      'Total_Contributions': 'total_contributions',
      'Total_Fine': 'total_fine',
      'Is_Finalized': 'is_finalized',
      'C3_Is_Finalized': 'c3_is_finalized',
      'C3_Finalized_By': 'c3_finalized_by',
      'C3_Finalized_Date': 'c3_finalized_date',
      'Is_Submitted': 'is_submitted',
      'C3_Submitted_By': 'c3_submitted_by',
      'C3_Submitted_Date': 'c3_submitted_date',
      'Is_Unlocked': 'is_unlocked',
      'Is_Sent_For_Edit': 'is_sent_for_edit',
      'Sent_On_For_Edit': 'sent_on_for_edit',
      'Edit_Permitted_By': 'edit_permitted_by',
      'Bima_Submit_Response': 'bima_submit_response',
      'Error_Desc': 'error_desc',
      'Is_Import_From_BEMA': 'is_import_from_bema',
      'Notes': 'notes',
      'Remarks': 'remarks',
      'InsertedBy': 'inserted_by',
      'Insert_Machine_Info': 'insert_machine_info',
      'Insert_DateTime_Info': 'insert_datetime_info',
      'ModifiedBy': 'modified_by',
      'Modified_Machine_Info': 'modified_machine_info',
      'ModifiedOn': 'modified_on',
      'Print_By': 'print_by',
      'Print_DateTime_Info': 'print_datetime_info',
      'Export_By': 'export_by',
      'Export_On': 'export_on'
    },
    transforms: {
      'is_finalized': toBool,
      'c3_is_finalized': toBool,
      'is_submitted': toBool,
      'is_unlocked': toBool,
      'is_sent_for_edit': toBool,
      'is_import_from_bema': toBool
    }
  },
  
  // ============= INCOME/DEDUCTION CODES =============
  {
    legacyTable: 'MasterIncCodes',
    supabaseTable: 'c3_master_inc_codes',
    fieldMap: {
      'Inc_Code_Id': 'inc_code_id',
      'Inc_Code': 'inc_code',
      'Inc_Description': 'inc_description',
      'Inc_Type': 'inc_type',
      'IsTaxable': 'is_taxable',
      'IsInsurable': 'is_insurable',
      'IsActive': 'is_active',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    },
    transforms: {
      'is_taxable': toBool,
      'is_insurable': toBool,
      'is_active': toBool
    }
  },
  {
    legacyTable: 'MasterDeductionCodes',
    supabaseTable: 'c3_master_deduction_codes',
    fieldMap: {
      'Ded_Code_Id': 'ded_code_id',
      'Ded_Code': 'ded_code',
      'Ded_Description': 'ded_description',
      'Ded_Type': 'ded_type',
      'IsPreTax': 'is_pretax',
      'IsActive': 'is_active',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    },
    transforms: {
      'is_pretax': toBool,
      'is_active': toBool
    }
  },
  {
    legacyTable: 'MasterObligationCodes',
    supabaseTable: 'c3_master_obligation_codes',
    fieldMap: {
      'Obl_Code_Id': 'obl_code_id',
      'Obl_Code': 'obl_code',
      'Obl_Description': 'obl_description',
      'IsActive': 'is_active',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    },
    transforms: { 'is_active': toBool }
  },
  {
    legacyTable: 'MasterEmployeeIncomes',
    supabaseTable: 'c3_master_employee_incomes',
    fieldMap: {
      'Id': 'id',
      'EmployeeID': 'employee_id',
      'Inc_Code_Id': 'inc_code_id',
      'Amount': 'amount',
      'EffectiveDate': 'effective_date',
      'EndDate': 'end_date',
      'IsActive': 'is_active',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    },
    transforms: { 'is_active': toBool }
  },
  {
    legacyTable: 'MasterEmployeeDeductions',
    supabaseTable: 'c3_master_employee_deductions',
    fieldMap: {
      'Id': 'id',
      'EmployeeID': 'employee_id',
      'Ded_Code_Id': 'ded_code_id',
      'Amount': 'amount',
      'Percentage': 'percentage',
      'EffectiveDate': 'effective_date',
      'EndDate': 'end_date',
      'IsActive': 'is_active',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    },
    transforms: { 'is_active': toBool }
  },
  {
    legacyTable: 'MasterEmployeeObligations',
    supabaseTable: 'c3_master_employee_obligations',
    fieldMap: {
      'Id': 'id',
      'EmployeeID': 'employee_id',
      'Obl_Code_Id': 'obl_code_id',
      'Amount': 'amount',
      'EffectiveDate': 'effective_date',
      'EndDate': 'end_date',
      'IsActive': 'is_active',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    },
    transforms: { 'is_active': toBool }
  },
  
  // ============= WAGES & BONUS =============
  {
    legacyTable: 'WageCategories',
    supabaseTable: 'c3_wage_categories',
    fieldMap: {
      'WageCategoryId': 'wage_category_id',
      'CategoryName': 'category_name',
      'WeeklyMinimum': 'weekly_minimum',
      'WeeklyMaximum': 'weekly_maximum',
      'Description': 'description',
      'IsActive': 'is_active',
      'InsertedOn': 'inserted_on',
      'UpdatedOn': 'updated_on'
    },
    transforms: { 'is_active': toBool }
  },
  {
    legacyTable: 'WagesPayDetails',
    supabaseTable: 'c3_wages_pay_details',
    fieldMap: {
      'Id': 'id',
      'EmployeeID': 'employee_id',
      'Company_Id': 'company_id',
      'PeriodMonth': 'period_month',
      'PeriodYear': 'period_year',
      'BasicWages': 'basic_wages',
      'Overtime': 'overtime',
      'Allowances': 'allowances',
      'Bonus': 'bonus',
      'TotalWages': 'total_wages',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    }
  },
  {
    legacyTable: 'BonusPayDetails',
    supabaseTable: 'c3_bonus_pay_details',
    fieldMap: {
      'BonusPayId': 'bonus_pay_id',
      'Company_Id': 'company_id',
      'EmployeeID': 'employee_id',
      'EmployeeDetails': 'employee_details',
      'PeriodMonth': 'period_month',
      'PeriodYear': 'period_year',
      'Amount': 'amount',
      'BonusPayDate': 'bonus_pay_date',
      'PayNoOfTimes': 'pay_no_of_times',
      'StartDate': 'start_date',
      'EndDate': 'end_date',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    }
  },
  {
    legacyTable: 'MasterHolidayPayDetails',
    supabaseTable: 'c3_master_holiday_pay_details',
    fieldMap: {
      'HolidayPayId': 'holiday_pay_id',
      'Company_Id': 'company_id',
      'EmployeeID': 'employee_id',
      'EmployeeDetails': 'employee_details',
      'PeriodMonth': 'period_month',
      'PeriodYear': 'period_year',
      'Amount': 'amount',
      'PayNoOfTimes': 'pay_no_of_times',
      'IsWithoutLeave': 'is_without_leave',
      'OtherHPayDes': 'other_hpay_des',
      'StartDate': 'start_date',
      'EndDate': 'end_date',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    },
    transforms: { 'is_without_leave': toBool }
  },
  {
    legacyTable: 'HolidayPayDates',
    supabaseTable: 'c3_holiday_pay_dates',
    fieldMap: {
      'Id': 'id',
      'HolidayPayId': 'holiday_pay_id',
      'Company_Id': 'company_id',
      'EmployeeID': 'employee_id',
      'HolidayPayDate': 'holiday_pay_date',
      'Amount': 'amount'
    }
  },
  
  // ============= PAYROLL =============
  {
    legacyTable: 'Payroll_Process_Header',
    supabaseTable: 'c3_payroll_process_header',
    fieldMap: {
      'PayrollId': 'payroll_id',
      'Company_Id': 'company_id',
      'PayPeriod': 'pay_period',
      'PayDate': 'pay_date',
      'PeriodStartDate': 'period_start_date',
      'PeriodEndDate': 'period_end_date',
      'Status': 'status',
      'TotalGross': 'total_gross',
      'TotalDeductions': 'total_deductions',
      'TotalNet': 'total_net',
      'IsFinalized': 'is_finalized',
      'FinalizedBy': 'finalized_by',
      'FinalizedOn': 'finalized_on',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    },
    transforms: { 'is_finalized': toBool }
  },
  {
    legacyTable: 'Payroll_Process_Details',
    supabaseTable: 'c3_payroll_process_details',
    fieldMap: {
      'Id': 'id',
      'PayrollId': 'payroll_id',
      'EmployeeID': 'employee_id',
      'HoursWorked': 'hours_worked',
      'OvertimeHours': 'overtime_hours',
      'GrossPay': 'gross_pay',
      'TotalDeductions': 'total_deductions',
      'NetPay': 'net_pay',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on'
    }
  },
  {
    legacyTable: 'Process_PayEmployee',
    supabaseTable: 'c3_process_pay_employee',
    fieldMap: {
      'Id': 'id',
      'PayrollId': 'payroll_id',
      'Company_Id': 'company_id',
      'EmployeeID': 'employee_id',
      'PayPeriod': 'pay_period',
      'PayDate': 'pay_date',
      'RegularHours': 'regular_hours',
      'OvertimeHours': 'overtime_hours',
      'GrossPay': 'gross_pay',
      'TotalDeductions': 'total_deductions',
      'NetPay': 'net_pay',
      'SS_EE': 'ss_ee',
      'SS_ER': 'ss_er',
      'Levy_EE': 'levy_ee',
      'Levy_ER': 'levy_er',
      'Severance': 'severance',
      'IsProcessed': 'is_processed',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on'
    },
    transforms: { 'is_processed': toBool }
  },
  {
    legacyTable: 'Process_PayIncomes',
    supabaseTable: 'c3_process_pay_incomes',
    fieldMap: {
      'Id': 'id',
      'PayEmployeeId': 'pay_employee_id',
      'Inc_Code_Id': 'inc_code_id',
      'Inc_Code': 'inc_code',
      'Hours': 'hours',
      'Rate': 'rate',
      'Amount': 'amount',
      'IsTaxable': 'is_taxable',
      'InsertedOn': 'inserted_on'
    },
    transforms: { 'is_taxable': toBool }
  },
  {
    legacyTable: 'Process_PayDeductions',
    supabaseTable: 'c3_process_pay_deductions',
    fieldMap: {
      'Id': 'id',
      'PayEmployeeId': 'pay_employee_id',
      'Ded_Code_Id': 'ded_code_id',
      'Ded_Code': 'ded_code',
      'Amount': 'amount',
      'IsPreTax': 'is_pretax',
      'InsertedOn': 'inserted_on'
    },
    transforms: { 'is_pretax': toBool }
  },
  {
    legacyTable: 'Process_Payobligations',
    supabaseTable: 'c3_process_pay_obligations',
    fieldMap: {
      'Id': 'id',
      'PayEmployeeId': 'pay_employee_id',
      'Obl_Code_Id': 'obl_code_id',
      'Obl_Code': 'obl_code',
      'Amount': 'amount',
      'InsertedOn': 'inserted_on'
    }
  },
  
  // ============= TIME CARD =============
  {
    legacyTable: 'EmployeeTCard_Header',
    supabaseTable: 'c3_employee_tcard_header',
    fieldMap: {
      'Id': 'id',
      'Company_Id': 'company_id',
      'EmployeeID': 'employee_id',
      'PeriodStart': 'period_start',
      'PeriodEnd': 'period_end',
      'TotalHours': 'total_hours',
      'Status': 'status',
      'InsertedOn': 'inserted_on',
      'UpdatedOn': 'updated_on'
    }
  },
  {
    legacyTable: 'EmployeeTCard_Details',
    supabaseTable: 'c3_employee_tcard_details',
    fieldMap: {
      'Id': 'id',
      'TCardHeaderId': 'tcard_header_id',
      'WorkDate': 'work_date',
      'TimeIn': 'time_in',
      'TimeOut': 'time_out',
      'BreakHours': 'break_hours',
      'HoursWorked': 'hours_worked',
      'OvertimeHours': 'overtime_hours',
      'Notes': 'notes'
    }
  },
  {
    legacyTable: 'EmployeeWorkDurationDetails',
    supabaseTable: 'c3_employee_work_duration_details',
    fieldMap: {
      'Id': 'id',
      'Company_Id': 'company_id',
      'EmployeeID': 'employee_id',
      'PeriodMonth': 'period_month',
      'PeriodYear': 'period_year',
      'WeeksWorked': 'weeks_worked',
      'DaysWorked': 'days_worked',
      'HoursWorked': 'hours_worked',
      'OvertimeHours': 'overtime_hours',
      'SickDays': 'sick_days',
      'VacationDays': 'vacation_days',
      'InsertedOn': 'inserted_on',
      'UpdatedOn': 'updated_on'
    }
  },
  
  // ============= PAYMENTS =============
  {
    legacyTable: 'OnlinePayments',
    supabaseTable: 'c3_online_payments',
    fieldMap: {
      'Id': 'id',
      'C3Header_Id': 'c3_header_id',
      'HeaderId': 'header_id',
      'UserId': 'user_id',
      'TransactionFor': 'transaction_for',
      'TransactionTypeId': 'transaction_type_id',
      'PaymentAmount': 'payment_amount',
      'PaymentAmountUSD': 'payment_amount_usd',
      'Currency': 'currency',
      'ExchangeRate': 'exchange_rate',
      'FromAccountAmount': 'from_account_amount',
      'NeedToPay': 'need_to_pay',
      'PaymentStatus': 'payment_status',
      'Mode': 'mode',
      'CardType': 'card_type',
      'CardNumber': 'card_number',
      'CardHolderName': 'card_holder_name',
      'CardMonthExpiry': 'card_month_expiry',
      'CVV': 'cvv',
      'BankName': 'bank_name',
      'CheckNum': 'check_num',
      'CheckDate': 'check_date',
      'PaymentId': 'payment_id',
      'PaymentPayerId': 'payment_payer_id',
      'PaymentGatewayTransactionId': 'payment_gateway_transaction_id',
      'TransactionDate': 'transaction_date',
      'CreateTime': 'create_time',
      'SystemKey': 'system_key',
      'SystemTransId': 'system_trans_id',
      'ReasonForPayment': 'reason_for_payment',
      'RefCustomerName': 'ref_customer_name',
      'BimaRefNum': 'bima_ref_num',
      'BimaReceiptNumber': 'bima_receipt_number',
      'BimaPaymentResponse': 'bima_payment_response',
      'API_Response': 'api_response',
      'TotalSsContributions': 'total_ss_contributions',
      'TotalSsPenalty': 'total_ss_penalty',
      'TotalServayance': 'total_servayance',
      'TotalLeavy': 'total_leavy',
      'TotalLevyeePenalty': 'total_levyee_penalty',
      'TotalPePenalty': 'total_pe_penalty',
      'RenewalYear': 'renewal_year',
      'IsReconciled': 'is_reconciled',
      'ReconciledBy': 'reconciled_by',
      'ReconciledOn': 'reconciled_on',
      'JVNumber': 'jv_number',
      'JVDate': 'jv_date',
      'CreditTransactionId': 'credit_transaction_id',
      'DebitTransactionId': 'debit_transaction_id',
      'IsActive': 'is_active',
      'IsCardView': 'is_card_view',
      'Message': 'message',
      'Description': 'description',
      'Notes': 'notes',
      'OldSystemId': 'old_system_id',
      'SourceData': 'source_data',
      'CreatedBy': 'created_by',
      'CreatedOn': 'created_on',
      'ModifiedBy': 'modified_by',
      'ModifiedOn': 'modified_on'
    },
    transforms: {
      'is_reconciled': toBool,
      'is_active': toBool,
      'is_card_view': toBool
    }
  },
  {
    legacyTable: 'BankPaymentsMain',
    supabaseTable: 'c3_bank_payments_main',
    fieldMap: {
      'Id': 'id',
      'Company_Id': 'company_id',
      'BankName': 'bank_name',
      'CheckNumber': 'check_number',
      'CheckDate': 'check_date',
      'Amount': 'amount',
      'IsActive': 'is_active'
    },
    transforms: { 'is_active': toBool }
  },
  {
    legacyTable: 'UserCardDetail',
    supabaseTable: 'c3_user_card_detail',
    fieldMap: {
      'Id': 'id',
      'UserId': 'user_id',
      'CardType': 'card_type',
      'CardNumber': 'card_number',
      'CardHolderName': 'card_holder_name',
      'CardExpiry': 'card_expiry',
      'IsDefault': 'is_default',
      'IsActive': 'is_active',
      'InsertedOn': 'inserted_on',
      'UpdatedOn': 'updated_on'
    },
    transforms: {
      'is_default': toBool,
      'is_active': toBool
    }
  },
  {
    legacyTable: 'Reconciliation_Cyber_Space',
    supabaseTable: 'c3_reconciliation_cyber_space',
    fieldMap: {
      'Id': 'id',
      'ReconciliationId': 'reconciliation_id',
      'UploadDate': 'upload_date',
      'FileName': 'file_name',
      'FileSize': 'file_size',
      'TotalRecords': 'total_records',
      'MatchedRecords': 'matched_records',
      'UnmatchedRecords': 'unmatched_records',
      'Status': 'status',
      'ProcessedBy': 'processed_by',
      'ProcessedOn': 'processed_on',
      'Notes': 'notes'
    }
  },
  {
    legacyTable: 'Reconciliation_Cyber_Space_Column',
    supabaseTable: 'c3_reconciliation_cyber_space_column',
    fieldMap: {
      'Id': 'id',
      'ReconciliationId': 'reconciliation_id',
      'ColumnName': 'column_name',
      'ColumnValue': 'column_value',
      'IsMatched': 'is_matched',
      'Notes': 'notes'
    },
    transforms: { 'is_matched': toBool }
  },
  {
    legacyTable: 'ReconciliationPayment_Details',
    supabaseTable: 'c3_reconciliation_payment_details',
    fieldMap: {
      'Id': 'id',
      'ReconciliationId': 'reconciliation_id',
      'PaymentId': 'payment_id',
      'PaymentAmount': 'payment_amount',
      'MatchStatus': 'match_status',
      'Notes': 'notes',
      'InsertedOn': 'inserted_on',
      'UpdatedOn': 'updated_on'
    }
  },
  
  // ============= AUTH & SECURITY =============
  {
    legacyTable: 'SECUsers',
    supabaseTable: 'c3_sec_users',
    fieldMap: {
      'UserId': 'user_id',
      'LoginId': 'login_id',
      'Password': 'password',
      'First_Name': 'first_name',
      'Middle_Name': 'middle_name',
      'Last_Name': 'last_name',
      'Email_Id': 'email_id',
      'Emp_Id': 'emp_id',
      'Self_Emp_Id': 'self_emp_id',
      'REG_NUMBER': 'reg_number',
      'RoleId': 'role_id',
      'Department': 'department',
      'Status': 'status',
      'UserStts': 'userstts',
      'IsActive': 'is_active',
      'IsLoggedIn': 'is_logged_in',
      'IsPPOC': 'is_ppoc',
      'IsSelfEmployee': 'is_self_employee',
      'LastLoginTime': 'last_login_time',
      'LastPwdUpdDate': 'last_pwd_upddate',
      'PwdExpiresOn': 'pwd_expires_on',
      'UserExpiresOn': 'user_expires_on',
      'ParentUserId': 'parentuserid',
      'Token': 'token',
      'UserImage': 'user_image',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    },
    transforms: {
      'is_active': toBool,
      'is_logged_in': toBool,
      'is_ppoc': toBool,
      'is_self_employee': toBool
    }
  },
  {
    legacyTable: 'SECUsersProfile',
    supabaseTable: 'c3_sec_users_profile',
    fieldMap: {
      'ProfileId': 'profile_id',
      'UserId': 'user_id',
      'Address': 'address',
      'City': 'city',
      'State': 'state',
      'Country': 'country',
      'ZIP': 'zip',
      'Phone': 'phone',
      'Mobile': 'mobile',
      'SecurityQuestion': 'security_question',
      'SecurityAnswer': 'security_answer',
      'InsertedOn': 'inserted_on',
      'UpdatedOn': 'updated_on'
    }
  },
  {
    legacyTable: 'SECRole',
    supabaseTable: 'c3_sec_role',
    fieldMap: {
      'RoleId': 'role_id',
      'RoleName': 'role_name',
      'RoleDescription': 'role_description',
      'IsActive': 'is_active',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    },
    transforms: { 'is_active': toBool }
  },
  {
    legacyTable: 'SECModule',
    supabaseTable: 'c3_sec_module',
    fieldMap: {
      'ModuleId': 'module_id',
      'ModuleName': 'module_name',
      'ModuleDescription': 'module_description',
      'ParentModuleId': 'parent_module_id',
      'ModuleUrl': 'module_url',
      'DisplayOrder': 'display_order',
      'Icon': 'icon',
      'IsActive': 'is_active',
      'IsVisible': 'is_visible',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    },
    transforms: {
      'is_active': toBool,
      'is_visible': toBool
    }
  },
  {
    legacyTable: 'SECUserModule',
    supabaseTable: 'c3_sec_user_module',
    fieldMap: {
      'UserModuleId': 'user_module_id',
      'UserId': 'user_id',
      'ModuleId': 'module_id',
      'CanView': 'can_view',
      'CanAdd': 'can_add',
      'CanEdit': 'can_edit',
      'CanDelete': 'can_delete',
      'CanPrint': 'can_print',
      'CanExport': 'can_export',
      'IsActive': 'is_active',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    },
    transforms: {
      'can_view': toBool,
      'can_add': toBool,
      'can_edit': toBool,
      'can_delete': toBool,
      'can_print': toBool,
      'can_export': toBool,
      'is_active': toBool
    }
  },
  {
    legacyTable: 'UserPermission',
    supabaseTable: 'c3_user_permission',
    fieldMap: {
      'Id': 'id',
      'UserId': 'user_id',
      'PermissionKey': 'permission_key',
      'PermissionValue': 'permission_value',
      'IsActive': 'is_active'
    },
    transforms: { 'is_active': toBool }
  },
  {
    legacyTable: 'SecurityQuestionAnswer',
    supabaseTable: 'c3_security_question_answer',
    fieldMap: {
      'Id': 'id',
      'UserId': 'user_id',
      'Question1': 'question1',
      'Answer1': 'answer1',
      'Question2': 'question2',
      'Answer2': 'answer2',
      'Question3': 'question3',
      'Answer3': 'answer3',
      'IsActive': 'is_active',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    },
    transforms: { 'is_active': toBool }
  },
  {
    legacyTable: 'UserOtp',
    supabaseTable: 'c3_user_otp',
    fieldMap: {
      'Id': 'id',
      'UserId': 'user_id',
      'OtpCode': 'otp_code',
      'ExpiresAt': 'expires_at',
      'IsUsed': 'is_used',
      'CreatedAt': 'created_at'
    },
    transforms: { 'is_used': toBool }
  },
  
  // ============= AUDIT & LOGS =============
  {
    legacyTable: 'AuditLogs',
    supabaseTable: 'c3_audit_logs',
    fieldMap: {
      'AuditId': 'audit_id',
      'UserId': 'user_id',
      'UserName': 'user_name',
      'Company_Id': 'company_id',
      'REG_NUMBER': 'reg_number',
      'EmployeeID': 'employee_id',
      'C3Header_Id': 'c3_header_id',
      'Module': 'module',
      'TableName': 'table_name',
      'RecordId': 'record_id',
      'Action': 'action',
      'Description': 'description',
      'OldValues': 'old_values',
      'NewValues': 'new_values',
      'PeriodMonth': 'period_month',
      'PeriodYear': 'period_year',
      'ActionDate': 'action_date',
      'IPAddress': 'ip_address',
      'MachineInfo': 'machine_info',
      'BrowserInfo': 'browser_info',
      'IsActive': 'is_active'
    },
    transforms: { 'is_active': toBool }
  },
  {
    legacyTable: 'LoginLog',
    supabaseTable: 'c3_login_log',
    fieldMap: {
      'LogId': 'log_id',
      'UserId': 'user_id',
      'LoginId': 'login_id',
      'LoginTime': 'login_time',
      'LogoutTime': 'logout_time',
      'IPAddress': 'ip_address',
      'MachineInfo': 'machine_info',
      'IsActive': 'is_active'
    },
    transforms: { 'is_active': toBool }
  },
  {
    legacyTable: 'CustomErrorLogs',
    supabaseTable: 'c3_custom_error_logs',
    fieldMap: {
      'Id': 'id',
      'UserId': 'user_id',
      'ErrorType': 'error_type',
      'ErrorMessage': 'error_message',
      'StackTrace': 'stack_trace',
      'ErrorDate': 'error_date',
      'MachineInfo': 'machine_info'
    }
  },
  {
    legacyTable: 'ErrorLog',
    supabaseTable: 'c3_error_log',
    fieldMap: {
      'Id': 'id',
      'UserId': 'user_id',
      'ErrorMessage': 'error_message',
      'ErrorStack': 'error_stack',
      'PageUrl': 'page_url',
      'ErrorTime': 'error_time'
    }
  },
  {
    legacyTable: 'Exception_log',
    supabaseTable: 'c3_exception_log',
    fieldMap: {
      'Id': 'id',
      'UserId': 'user_id',
      'ExceptionType': 'exception_type',
      'ExceptionMessage': 'exception_message',
      'StackTrace': 'stack_trace',
      'InnerException': 'inner_exception',
      'Source': 'source',
      'MethodName': 'method_name',
      'ExceptionDate': 'exception_date',
      'MachineInfo': 'machine_info',
      'AdditionalInfo': 'additional_info'
    }
  },
  
  // ============= LOOKUP & REFERENCE =============
  {
    legacyTable: 'Country',
    supabaseTable: 'c3_country',
    fieldMap: {
      // Actual legacy columns from dbo.Country.Table.sql
      'ConId': 'country_id',
      'Name': 'country_name',
      'Description': 'country_code',  // Maps Description to country_code (nullable)
      'IsActive': 'is_active',
      'Deletable': 'phone_code',  // Maps Deletable to phone_code (nullable) 
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    },
    transforms: { 'is_active': toBool }
  },
  {
    legacyTable: 'State',
    supabaseTable: 'c3_state',
    fieldMap: {
      'StateId': 'state_id',
      'CountryId': 'country_id',
      'StateName': 'state_name',
      'StateCode': 'state_code',
      'IsActive': 'is_active',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    },
    transforms: { 'is_active': toBool }
  },
  {
    legacyTable: 'City',
    supabaseTable: 'c3_city',
    fieldMap: {
      'CityId': 'city_id',
      'StateId': 'state_id',
      'CityName': 'city_name',
      'CityCode': 'city_code',
      'IsActive': 'is_active',
      'InsertedBy': 'inserted_by',
      'InsertedOn': 'inserted_on',
      'InsertedMachineInfo': 'inserted_machine_info',
      'UpdatedBy': 'updated_by',
      'UpdatedOn': 'updated_on',
      'UpdatedMachineInfo': 'updated_machine_info'
    },
    transforms: { 'is_active': toBool }
  },
  
  // ============= CMS & CONTENT =============
  {
    legacyTable: 'AboutUs',
    supabaseTable: 'c3_about_us',
    fieldMap: {
      'Id': 'id',
      'Content': 'content'
    }
  },
  {
    legacyTable: 'ContactUs_Log',
    supabaseTable: 'c3_contact_us_log',
    fieldMap: {
      'CUS_Id': 'cus_id',
      'UserId': 'user_id',
      'Company_Id': 'company_id',
      'RegistrationNo': 'registration_no',
      'Name': 'name',
      'EmailId': 'emailid',
      'Phone': 'phone',
      'Subject': 'subject',
      'Description': 'description',
      'Status': 'status',
      'InsertDate': 'insert_date',
      'InsertMachineInfo': 'insert_machine_info'
    }
  }
];

// ========================================
// TRANSFORMATION FUNCTION
// ========================================

function transformRecord(record: any, mapping: TableMapping): any {
  const transformed: any = {};
  
  for (const [legacyField, value] of Object.entries(record)) {
    // Find matching field (case-insensitive)
    const mappedField = Object.entries(mapping.fieldMap).find(
      ([key]) => key.toLowerCase() === legacyField.toLowerCase()
    );
    
    if (mappedField) {
      const [, supabaseField] = mappedField;
      let transformedValue = value;
      
      // Apply transform if exists
      if (mapping.transforms && mapping.transforms[supabaseField]) {
        transformedValue = mapping.transforms[supabaseField](value);
      }
      
      transformed[supabaseField] = transformedValue;
    } else {
      // Auto-convert to snake_case if no mapping found
      const snakeCaseField = toSnakeCase(legacyField);
      transformed[snakeCaseField] = value;
    }
  }
  
  return transformed;
}

// ========================================
// MAIN HANDLER
// ========================================

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { action, data, legacyTable, targetTable, batchSize = 100 } = await req.json();
    
    // ============= PARSE AND IMPORT TABLE =============
    if (action === 'import-table') {
      // Find mapping for this table
      const mapping = TABLE_MAPPINGS.find(
        m => m.legacyTable.toLowerCase() === legacyTable?.toLowerCase()
      );
      
      if (!mapping && !targetTable) {
        return new Response(JSON.stringify({ 
          error: `No mapping found for table: ${legacyTable}. Provide targetTable for generic import.`
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      
      const tableToUse = mapping?.supabaseTable || targetTable;
      const records = parseInsertStatements(data, legacyTable);
      
      const transformed = mapping 
        ? records.map(r => transformRecord(r, mapping))
        : records;
      
      let inserted = 0;
      let errors: string[] = [];
      
      for (let i = 0; i < transformed.length; i += batchSize) {
        const batch = transformed.slice(i, i + batchSize);
        const { error } = await supabase
          .from(tableToUse)
          .insert(batch);
        
        if (error) {
          errors.push(`Batch ${i}-${i + batch.length}: ${error.message}`);
        } else {
          inserted += batch.length;
        }
      }
      
      return new Response(JSON.stringify({
        success: true,
        legacyTable,
        supabaseTable: tableToUse,
        parsed: records.length,
        inserted,
        errors
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // ============= LIST TABLE MAPPINGS =============
    if (action === 'list-mappings') {
      const mappings = TABLE_MAPPINGS.map(m => ({
        legacyTable: m.legacyTable,
        supabaseTable: m.supabaseTable,
        fieldCount: Object.keys(m.fieldMap).length
      }));
      
      return new Response(JSON.stringify({
        totalTables: mappings.length,
        mappings
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // ============= GET TABLE MAPPING DETAILS =============
    if (action === 'get-mapping') {
      const mapping = TABLE_MAPPINGS.find(
        m => m.legacyTable.toLowerCase() === legacyTable?.toLowerCase()
      );
      
      if (!mapping) {
        return new Response(JSON.stringify({ error: `No mapping for: ${legacyTable}` }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      
      return new Response(JSON.stringify(mapping), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // ============= GET STATS =============
    if (action === 'get-stats') {
      const stats: Record<string, number> = {};
      
      for (const mapping of TABLE_MAPPINGS) {
        try {
          const { count } = await supabase
            .from(mapping.supabaseTable)
            .select('*', { count: 'exact', head: true });
          stats[mapping.supabaseTable] = count || 0;
        } catch (e) {
          stats[mapping.supabaseTable] = -1; // Error indicator
        }
      }
      
      return new Response(JSON.stringify({
        totalTables: TABLE_MAPPINGS.length,
        stats
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // ============= PARSE ONLY (DRY RUN) =============
    if (action === 'parse-only') {
      const mapping = TABLE_MAPPINGS.find(
        m => m.legacyTable.toLowerCase() === legacyTable?.toLowerCase()
      );
      
      // Debug: log first 500 chars of cleaned data
      const cleanedData = cleanUtf16Text(data || '');
      console.log(`[PARSE-ONLY] legacyTable: ${legacyTable}`);
      console.log(`[PARSE-ONLY] Data length: ${data?.length || 0}, Cleaned length: ${cleanedData.length}`);
      console.log(`[PARSE-ONLY] First 300 chars: ${cleanedData.substring(0, 300)}`);
      
      const records = parseInsertStatements(data, legacyTable);
      console.log(`[PARSE-ONLY] Records parsed: ${records.length}`);
      
      const transformed = mapping 
        ? records.map(r => transformRecord(r, mapping))
        : records;
      
      return new Response(JSON.stringify({
        legacyTable,
        supabaseTable: mapping?.supabaseTable || 'unknown',
        parsed: records.length,
        sample: transformed.slice(0, 3),
        debug: {
          dataLength: data?.length || 0,
          cleanedLength: cleanedData.length,
          first200: cleanedData.substring(0, 200)
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // ============= BULK IMPORT MULTIPLE TABLES =============
    if (action === 'bulk-import') {
      const { tables } = data; // Array of { legacyTable, content }
      const results: any[] = [];
      
      for (const tableData of tables) {
        const mapping = TABLE_MAPPINGS.find(
          m => m.legacyTable.toLowerCase() === tableData.legacyTable.toLowerCase()
        );
        
        if (!mapping) {
          results.push({
            legacyTable: tableData.legacyTable,
            error: 'No mapping found'
          });
          continue;
        }
        
        const records = parseInsertStatements(tableData.content, tableData.legacyTable);
        const transformed = records.map(r => transformRecord(r, mapping));
        
        let inserted = 0;
        let errors: string[] = [];
        
        for (let i = 0; i < transformed.length; i += batchSize) {
          const batch = transformed.slice(i, i + batchSize);
          const { error } = await supabase
            .from(mapping.supabaseTable)
            .insert(batch);
          
          if (error) {
            errors.push(error.message);
          } else {
            inserted += batch.length;
          }
        }
        
        results.push({
          legacyTable: tableData.legacyTable,
          supabaseTable: mapping.supabaseTable,
          parsed: records.length,
          inserted,
          errors
        });
      }
      
      return new Response(JSON.stringify({ results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    return new Response(JSON.stringify({ 
      error: 'Unknown action',
      availableActions: [
        'import-table',
        'list-mappings',
        'get-mapping',
        'get-stats',
        'parse-only',
        'bulk-import'
      ]
    }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
