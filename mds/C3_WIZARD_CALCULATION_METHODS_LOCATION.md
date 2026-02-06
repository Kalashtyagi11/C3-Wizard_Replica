# C3 Wizard - Calculation Methods Location Guide

## 📍 File Location
**All calculation logic is in**: `c3Api/c3Api/C3WizardRepository/Repository/RepoC3.cs`

---

## 🔢 Core Calculation Methods

### 1. Employee Social Security (SS) Calculation
**Method**: `SSEmployee()`  
**Line**: ~831-834

```csharp
public decimal? SSEmployee(int age, decimal? amount, float Soc_EE_Rate, decimal? Soc_EE_Pay_Limit)
{
    return age < Min_Age || age >= Max_Age ? 0 : 
           (amount * (decimal)Soc_EE_Rate > (decimal)(Soc_EE_Pay_Limit) ? 
            (decimal)(Soc_EE_Pay_Limit) : 
            amount * (decimal)Soc_EE_Rate);
}
```

**What it does**:
- Checks if employee age is within range (16-62)
- If age < 16 or >= 62: Returns 0 (exempt)
- If within range: Calculates wages × 5%
- **Applies maximum cap** (`Soc_EE_Pay_Limit`)

**Parameters**:
- `age`: Employee age
- `amount`: Total wages for the period
- `Soc_EE_Rate`: Employee SS rate (typically 0.05 for 5%)
- `Soc_EE_Pay_Limit`: Maximum SS contribution cap

---

### 2. Employer SS & EI Calculation
**Method**: `SSEIB()`  
**Line**: ~836-839

```csharp
public decimal? SSEIB(int age, decimal? amount, float EIB_Rate, decimal? EIB_Pay_Limit)
{
    return (amount * (decimal)(EIB_Rate)) > (decimal)(EIB_Pay_Limit) ? 
           (decimal)(EIB_Pay_Limit) : 
           amount * (decimal)(EIB_Rate);
}
```

**What it does**:
- Calculates employer SS or EI contribution
- Applies wages × rate (5% for SS, 1% for EI)
- **Applies maximum cap** (`EIB_Pay_Limit`)
- Note: Age check is done before calling this method

**Parameters**:
- `age`: Employee age (for context, but age check is external)
- `amount`: Total wages for the period
- `EIB_Rate`: Employer rate (0.05 for SS, 0.01 for EI)
- `EIB_Pay_Limit`: Maximum contribution cap

---

### 3. Employee Levy (Progressive Tax)
**Method**: `CalculateLevyEmployee()`  
**Line**: ~Not shown in grep, but exists in RepoC3.cs

**Helper Method**: `Levy_amount()`  
**Line**: ~822-829

```csharp
public decimal? Levy_amount(List<BLDeductionsTaxTableDetails> DeductionsTaxDetailslist, decimal? amount)
{
    decimal OverAmt = DeductionsTaxDetailslist.Count > 0 ? 
                      decimal.Parse(DeductionsTaxDetailslist.Max(x => x.OverAmt).ToString()) : 0;
    decimal BaseAmt = DeductionsTaxDetailslist.Count > 0 ? 
                      decimal.Parse(DeductionsTaxDetailslist.Max(x => x.BaseAmt).ToString()) : 0;
    decimal TaxRate = DeductionsTaxDetailslist.Count > 0 ? 
                      decimal.Parse(DeductionsTaxDetailslist.Max(x => x.TaxRate).ToString()) : 0;
    decimal? LEVYEE = (amount - OverAmt) * TaxRate + BaseAmt;
    return LEVYEE;
}
```

**What it does**:
- Uses progressive tax brackets from `DeductionsTaxTable`
- Finds the highest bracket where `over_amt <= wages`
- Applies formula: `Levy = (wages - over_amt) × tax_rate + base_amt`

**Parameters**:
- `DeductionsTaxDetailslist`: Tax bracket data for the pay period
- `amount`: Wages for the week/period being calculated

---

### 4. Bonus Levy Calculation
**Method**: `Employee_Levy_Bonus()`  
**Line**: ~790-794

```csharp
public decimal? Employee_Levy_Bonus(decimal? amount, int monthno, string year, string ssn, 
                                     int CompanyId, bool exemptedLevybonus)
{
    decimal? LEVYEE = monthno == 12 && exemptedLevybonus ? 0 : 
                      Total_Amout_Get_Rmployee_in_year(year, ssn, CompanyId) >= 18720 ? 
                      amount * (decimal?)Bonus_Levy_EE_Rate : 0;
    return LEVYEE;
}
```

**What it does**:
- Checks if bonus is exempted from levy (December bonus exemption)
- Calculates employee's YTD wages (Year-To-Date)
- **If YTD < $18,720 (appears to be old threshold, doc says $28,000)**: Levy = 0
- **If YTD >= threshold**: Applies levy rate to bonus

**Business Rule**:
- If employee hasn't earned enough this year, no levy on bonus
- If exempted (December bonus), no levy

**Parameters**:
- `amount`: Bonus amount
- `monthno`: Contribution month (1-12)
- `year`: Contribution year
- `ssn`: Employee SSN
- `CompanyId`: Employer ID
- `exemptedLevybonus`: Flag from `DECEMBER_BONUS_EXEMPTED_CONTRIBUTION` table

---

### 5. YTD Wage Calculation (for Bonus Levy)
**Method**: `Total_Amout_Get_Rmployee_in_year()`  
**Line**: ~795-821

```csharp
public decimal Total_Amout_Get_Rmployee_in_year(string year, string SSn, int CompanyId)
{
    decimal T_Amount = 0;
    DataSet dataSetHPD = new DataSet();
    DataTable dtHPD = new DataTable();
    SqlConnection staticConnectionHPD = C3WizardLayerConn_BaseData.StaticSqlConnection;
    staticConnectionHPD.Open();
    SqlCommand cmdHPD = new SqlCommand(
        "Select cast((pc.WAGES1+pc.WAGES2+pc.WAGES3+pc.WAGES4+pc.WAGES5-" +
        "case when pc.Remarks Like '%Other%' then 0 else pc.HPay end) as numeric(18,2)) as TotalWages " +
        "from Process_Contributions pc, PROCESS_C3Header pc3h " +
        "Where pc3h.Is_Fianalize = 1 and pc3h.C3HEADERID = pc.C3HEADERID " +
        "and pc3h.EmployerID=" + CompanyId +
        " and pc.SSN='" + SSn + "' and pc3h.PERIOD_YEAR='" + year + "'", 
        staticConnectionHPD);
    
    cmdHPD.CommandType = CommandType.Text;
    SqlDataAdapter adapterHPD = new SqlDataAdapter();
    adapterHPD.SelectCommand = cmdHPD;
    adapterHPD.Fill(dataSetHPD);
    dtHPD = dataSetHPD.Tables[0];
    
    if (dtHPD.Rows.Count > 0)
    {
        foreach (DataRow rowHPD in dtHPD.Rows)
        {
            T_Amount += Convert.IsDBNull(rowHPD["TotalWages"]) ? 0 : 
                        Math.Round((decimal.Parse(rowHPD["TotalWages"].ToString())), 2);
        }
        staticConnectionHPD.Close();
    }
    return T_Amount;
}
```

**What it does**:
- Queries all **finalized** C3 submissions for this employee in the given year
- Sums total wages across all months
- Excludes "Other" pay from holiday pay
- **Used to determine if employee qualifies for bonus levy exemption**

**SQL Logic**:
```sql
SELECT SUM(WAGES1 + WAGES2 + WAGES3 + WAGES4 + WAGES5 - 
           CASE WHEN Remarks LIKE '%Other%' THEN 0 ELSE HPay END) 
FROM Process_Contributions pc
JOIN PROCESS_C3Header pc3h ON pc3h.C3HEADERID = pc.C3HEADERID
WHERE pc3h.Is_Fianalize = 1
  AND pc3h.EmployerID = @CompanyId
  AND pc.SSN = @SSN
  AND pc3h.PERIOD_YEAR = @Year
```

---

## 📊 Main Calculation Orchestration

### Main C3 Calculation Flow
**Method**: Appears in large calculation block around lines ~1750-1920

**Process**:
1. Retrieve rate settings from `MasterRateSetting` table
2. For each employee:
   - Get employee details (age, wages, etc.)
   - Check if director without wages (auto-calculate from salary)
   - Distribute holiday pay across non-working weeks
   - Calculate employee SS using `SSEmployee()`
   - Calculate employer SS using `SSEIB()`
   - Calculate employer EI using `SSEIB()`
   - Calculate employee PE (severance)
   - Calculate employee levy using `CalculateLevyEmployee()` (progressive tax)
   - Calculate employer levy (3% of wages + bonus)
   - Calculate bonus levy using `Employee_Levy_Bonus()`
3. Aggregate all employee contributions
4. Calculate penalties based on late submission
5. Save to database using stored procedure `Process_Contributions_Insert_One`

---

## 🗄️ Database Tables Used

### Rate Configuration
- **Table**: `MasterRateSetting`
- **Fields**:
  - `SocEeRate` - Employee SS rate (5%)
  - `SocErRate` - Employer SS rate (5%)
  - `Eib` - Employer EI rate & cap (1%)
  - `SeveranceRate` - Employee PE rate (1%)
  - `EmployerLevy` - Employer levy rate (3%)
  - `SocEePayLimit` - Employee SS maximum cap
  - `MinAge` - Minimum age for SS (16)
  - `MaxAge` - Maximum age for SS (62)
  - `FineRate` - SS penalty rate (5%)
  - `PenaltyRate` - Levy/PE first month penalty (10%)
  - `AdditionalPenaltyRate` - Subsequent month penalty (1%)

### Levy Tax Brackets
- **Table**: `DeductionsTaxTable`
- **Fields**:
  - `PayPeriod` - 'W', 'E2W', 'M', '2M'
  - `OverAmt` - Wage threshold for bracket
  - `BaseAmt` - Base levy amount for bracket
  - `TaxRate` - Tax rate for bracket

### Bonus Exemption
- **Table**: `DECEMBER_BONUS_EXEMPTED_CONTRIBUTION`
- **Purpose**: Marks if bonus should be excluded from SS/PE calculations

### YTD Wages
- **Table**: `Process_Contributions` (joined with `PROCESS_C3Header`)
- **Query**: Sums wages for all finalized C3s in current year
- **Used for**: Bonus levy exemption check

---

## 🔄 Stored Procedures (CRUD Only, NO Calculations)

| Stored Procedure | Purpose | Used For |
|------------------|---------|----------|
| `get_C3Genrated_data` | Retrieve C3 header records | Data retrieval |
| `get_C3Genrated_Employee_Data` | Retrieve employee contributions | Data retrieval |
| `C3Header_Insert_One` | Insert new C3 header | Data persistence |
| `C3Header_Update` | Update C3 header | Data persistence |
| `Process_Contributions_Insert_One` | Insert employee contribution | Data persistence |
| `Get_Master_C3_Setting_Rates` | Get rate configuration | Data retrieval |
| `Holiday_Pay_Employee_Select_All` | Get holiday pay data | Data retrieval |
| `C3Header_Finalize` | Mark C3 as finalized | Status update |

**Important**: These stored procedures do **NOT contain any calculation logic**. They are purely for CRUD operations (Create, Read, Update, Delete).

---

## 🎯 Key Differences from C3 Management

### What C3 Wizard Has (in C# Code)

✅ **Maximum caps on contributions**:
- `SSEmployee()` method applies `Soc_EE_Pay_Limit` cap
- `SSEIB()` method applies `EIB_Pay_Limit` cap

✅ **Bonus logic**:
- `Employee_Levy_Bonus()` checks YTD wages
- Checks `DECEMBER_BONUS_EXEMPTED_CONTRIBUTION` table
- Employer levy includes bonus amount

✅ **YTD wage tracking**:
- `Total_Amout_Get_Rmployee_in_year()` calculates total annual wages
- Used for bonus levy exemption ($18,720 or $28,000 threshold)

✅ **Holiday pay distribution**:
- Code distributes holiday pay across non-working weeks
- Recalculates levy on distributed amounts

✅ **Director auto-wage calculation**:
- Checks if employee is director without wages
- Retrieves salary from `MasterEmployee.Salary`
- Distributes monthly salary across weeks

✅ **Age-based exemptions**:
- `SSEmployee()` returns 0 for age < 16 or >= 62
- Employer SS also exempted for these ages
- Employer EI still applies

### What C3 Management is Missing

❌ No maximum caps mentioned
❌ No bonus handling logic
❌ No YTD wage tracking
❌ No holiday pay distribution
❌ No director auto-wage calculation
❌ Calculations likely in stored procedures (harder to maintain)

---

## 📝 Summary

**C3 Wizard Approach**:
- **All calculation logic in C# methods** (lines 790-840, 1750-1920 in `RepoC3.cs`)
- **Stored procedures used ONLY for CRUD operations**
- **Modular design**: Each contribution type has its own method
- **Easy to test and modify**: Logic is in application code
- **Comprehensive features**: Bonus, holiday pay, director wages, caps, exemptions

**To Match C3 Wizard in C3 Management**:
1. Move calculations from stored procedures to application code
2. Implement all missing methods (bonus, YTD, holiday pay, director logic)
3. Add maximum cap checks
4. Create same database tables for configuration

**Estimated Lines of Code**: ~500-800 lines for all calculation logic

**Files to Create in C3 Management**:
- `ContributionCalculationService.cs` - Main calculation logic
- Methods needed:
  - `CalculateEmployeeSS()`
  - `CalculateEmployerSS()`
  - `CalculateEmployerEI()`
  - `CalculateEmployeePE()`
  - `CalculateEmployeeLevy()`
  - `CalculateEmployerLevy()`
  - `CalculateBonusLevy()`
  - `GetYTDWages()`
  - `DistributeHolidayPay()`
  - `CalculateDirectorWages()`
  - `CalculatePenalties()`
