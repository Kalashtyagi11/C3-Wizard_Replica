export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      c3_about_us: {
        Row: {
          content: string | null
          created_at: string | null
          created_by: number | null
          id: number
          is_deleted: boolean | null
          legacy_id: number | null
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          created_by?: number | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          created_by?: number | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: []
      }
      c3_audit_logs: {
        Row: {
          action: string | null
          area: string | null
          column_name: string | null
          controller: string | null
          created_at: string | null
          created_by: number | null
          event_type: string
          id: number
          ip_address: string | null
          is_active: boolean | null
          legacy_id: number | null
          message: string | null
          new_value: string | null
          old_value: string | null
          record_id: number | null
          source_data: number | null
          table_name: string | null
          url: string | null
          user_id: number | null
          username: string | null
        }
        Insert: {
          action?: string | null
          area?: string | null
          column_name?: string | null
          controller?: string | null
          created_at?: string | null
          created_by?: number | null
          event_type: string
          id?: number
          ip_address?: string | null
          is_active?: boolean | null
          legacy_id?: number | null
          message?: string | null
          new_value?: string | null
          old_value?: string | null
          record_id?: number | null
          source_data?: number | null
          table_name?: string | null
          url?: string | null
          user_id?: number | null
          username?: string | null
        }
        Update: {
          action?: string | null
          area?: string | null
          column_name?: string | null
          controller?: string | null
          created_at?: string | null
          created_by?: number | null
          event_type?: string
          id?: number
          ip_address?: string | null
          is_active?: boolean | null
          legacy_id?: number | null
          message?: string | null
          new_value?: string | null
          old_value?: string | null
          record_id?: number | null
          source_data?: number | null
          table_name?: string | null
          url?: string | null
          user_id?: number | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "c3_users"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_bank_payments: {
        Row: {
          created_at: string | null
          created_by: number | null
          file_name: string | null
          file_path: string | null
          id: number
          is_deleted: boolean | null
          legacy_id: number | null
          processed_at: string | null
          record_count: number | null
          total_amount: number | null
          updated_at: string | null
          updated_by: number | null
          upload_date: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: number | null
          file_name?: string | null
          file_path?: string | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          processed_at?: string | null
          record_count?: number | null
          total_amount?: number | null
          updated_at?: string | null
          updated_by?: number | null
          upload_date?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: number | null
          file_name?: string | null
          file_path?: string | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          processed_at?: string | null
          record_count?: number | null
          total_amount?: number | null
          updated_at?: string | null
          updated_by?: number | null
          upload_date?: string | null
        }
        Relationships: []
      }
      c3_bonus_exemptions: {
        Row: {
          created_at: string | null
          created_by: number | null
          id: number
          is_deleted: boolean | null
          is_employer_levy_exempted: boolean | null
          is_levy_exempted: boolean | null
          is_locked: boolean | null
          is_severance_exempted: boolean | null
          is_social_security_exempted: boolean | null
          legacy_id: number | null
          month: number
          updated_at: string | null
          updated_by: number | null
          year: number
        }
        Insert: {
          created_at?: string | null
          created_by?: number | null
          id?: number
          is_deleted?: boolean | null
          is_employer_levy_exempted?: boolean | null
          is_levy_exempted?: boolean | null
          is_locked?: boolean | null
          is_severance_exempted?: boolean | null
          is_social_security_exempted?: boolean | null
          legacy_id?: number | null
          month: number
          updated_at?: string | null
          updated_by?: number | null
          year: number
        }
        Update: {
          created_at?: string | null
          created_by?: number | null
          id?: number
          is_deleted?: boolean | null
          is_employer_levy_exempted?: boolean | null
          is_levy_exempted?: boolean | null
          is_locked?: boolean | null
          is_severance_exempted?: boolean | null
          is_social_security_exempted?: boolean | null
          legacy_id?: number | null
          month?: number
          updated_at?: string | null
          updated_by?: number | null
          year?: number
        }
        Relationships: []
      }
      c3_bonus_payments: {
        Row: {
          bonus_amount: number
          bonus_pay_date: string | null
          company_id: number | null
          created_at: string | null
          created_by: number | null
          employee_details: string | null
          employee_id: number | null
          end_date: string | null
          id: number
          is_deleted: boolean | null
          legacy_id: number | null
          pay_frequency: number | null
          period_month: string | null
          period_year: string | null
          start_date: string | null
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          bonus_amount: number
          bonus_pay_date?: string | null
          company_id?: number | null
          created_at?: string | null
          created_by?: number | null
          employee_details?: string | null
          employee_id?: number | null
          end_date?: string | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          pay_frequency?: number | null
          period_month?: string | null
          period_year?: string | null
          start_date?: string | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          bonus_amount?: number
          bonus_pay_date?: string | null
          company_id?: number | null
          created_at?: string | null
          created_by?: number | null
          employee_details?: string | null
          employee_id?: number | null
          end_date?: string | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          pay_frequency?: number | null
          period_month?: string | null
          period_year?: string | null
          start_date?: string | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_bonus_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "c3_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "c3_bonus_payments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "c3_employees"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_cities: {
        Row: {
          created_at: string | null
          created_by: number | null
          description: string | null
          id: number
          is_deleted: boolean | null
          legacy_id: number | null
          name: string
          state_id: number | null
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: number | null
          description?: string | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          name: string
          state_id?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: number | null
          description?: string | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          name?: string
          state_id?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_cities_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "c3_states"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_companies: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          company_name: string
          contact_person: string | null
          country: string | null
          created_at: string | null
          created_by: number | null
          email: string | null
          fax: string | null
          id: number
          is_deleted: boolean | null
          is_levy_exempt: boolean | null
          is_verified: boolean | null
          legacy_id: number | null
          legacy_machine_info: string | null
          logo_url: string | null
          mobile: string | null
          office_code: string | null
          parent_company_id: number | null
          phone: string | null
          postal_code: string | null
          registration_date: string | null
          registration_number: string | null
          state: string | null
          trade_name: string | null
          updated_at: string | null
          updated_by: number | null
          verification_token: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_name: string
          contact_person?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: number | null
          email?: string | null
          fax?: string | null
          id?: number
          is_deleted?: boolean | null
          is_levy_exempt?: boolean | null
          is_verified?: boolean | null
          legacy_id?: number | null
          legacy_machine_info?: string | null
          logo_url?: string | null
          mobile?: string | null
          office_code?: string | null
          parent_company_id?: number | null
          phone?: string | null
          postal_code?: string | null
          registration_date?: string | null
          registration_number?: string | null
          state?: string | null
          trade_name?: string | null
          updated_at?: string | null
          updated_by?: number | null
          verification_token?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_name?: string
          contact_person?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: number | null
          email?: string | null
          fax?: string | null
          id?: number
          is_deleted?: boolean | null
          is_levy_exempt?: boolean | null
          is_verified?: boolean | null
          legacy_id?: number | null
          legacy_machine_info?: string | null
          logo_url?: string | null
          mobile?: string | null
          office_code?: string | null
          parent_company_id?: number | null
          phone?: string | null
          postal_code?: string | null
          registration_date?: string | null
          registration_number?: string | null
          state?: string | null
          trade_name?: string | null
          updated_at?: string | null
          updated_by?: number | null
          verification_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "c3_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_contact_logs: {
        Row: {
          company_id: number | null
          created_at: string | null
          email: string | null
          id: number
          is_deleted: boolean | null
          legacy_id: number | null
          legacy_machine_info: string | null
          message: string | null
          registration_number: string | null
          subject: string | null
          user_id: number | null
        }
        Insert: {
          company_id?: number | null
          created_at?: string | null
          email?: string | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          legacy_machine_info?: string | null
          message?: string | null
          registration_number?: string | null
          subject?: string | null
          user_id?: number | null
        }
        Update: {
          company_id?: number | null
          created_at?: string | null
          email?: string | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          legacy_machine_info?: string | null
          message?: string | null
          registration_number?: string | null
          subject?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_contact_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "c3_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "c3_contact_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "c3_users"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_contribution_details: {
        Row: {
          bonus_amount: number | null
          created_at: string | null
          created_by: number | null
          date_of_joining: string | null
          date_terminated: string | null
          director_wage: number | null
          ei_employee: number | null
          ei_employer: number | null
          employee_id: number | null
          error_description: string | null
          finalized_at: string | null
          finalized_by: number | null
          header_id: number | null
          id: number
          is_deleted: boolean | null
          is_finalized: boolean | null
          is_submitted: boolean | null
          is_unlocked: boolean | null
          legacy_id: number | null
          levy_employee: number | null
          levy_employer: number | null
          pay_frequency: string | null
          period_month: string | null
          period_year: string | null
          remarks: string | null
          severance_employee: number | null
          severance_employer: number | null
          social_security_display: string | null
          social_security_employee: number | null
          social_security_employer: number | null
          social_security_number: string | null
          social_security_total: number | null
          submitted_at: string | null
          submitted_by: number | null
          total_holiday_pay: number | null
          updated_at: string | null
          updated_by: number | null
          week1_holiday_pay: number | null
          week1_wages: number | null
          week1_worked: boolean | null
          week2_holiday_pay: number | null
          week2_wages: number | null
          week2_worked: boolean | null
          week3_holiday_pay: number | null
          week3_wages: number | null
          week3_worked: boolean | null
          week4_holiday_pay: number | null
          week4_wages: number | null
          week4_worked: boolean | null
          week5_holiday_pay: number | null
          week5_wages: number | null
          week5_worked: boolean | null
        }
        Insert: {
          bonus_amount?: number | null
          created_at?: string | null
          created_by?: number | null
          date_of_joining?: string | null
          date_terminated?: string | null
          director_wage?: number | null
          ei_employee?: number | null
          ei_employer?: number | null
          employee_id?: number | null
          error_description?: string | null
          finalized_at?: string | null
          finalized_by?: number | null
          header_id?: number | null
          id?: number
          is_deleted?: boolean | null
          is_finalized?: boolean | null
          is_submitted?: boolean | null
          is_unlocked?: boolean | null
          legacy_id?: number | null
          levy_employee?: number | null
          levy_employer?: number | null
          pay_frequency?: string | null
          period_month?: string | null
          period_year?: string | null
          remarks?: string | null
          severance_employee?: number | null
          severance_employer?: number | null
          social_security_display?: string | null
          social_security_employee?: number | null
          social_security_employer?: number | null
          social_security_number?: string | null
          social_security_total?: number | null
          submitted_at?: string | null
          submitted_by?: number | null
          total_holiday_pay?: number | null
          updated_at?: string | null
          updated_by?: number | null
          week1_holiday_pay?: number | null
          week1_wages?: number | null
          week1_worked?: boolean | null
          week2_holiday_pay?: number | null
          week2_wages?: number | null
          week2_worked?: boolean | null
          week3_holiday_pay?: number | null
          week3_wages?: number | null
          week3_worked?: boolean | null
          week4_holiday_pay?: number | null
          week4_wages?: number | null
          week4_worked?: boolean | null
          week5_holiday_pay?: number | null
          week5_wages?: number | null
          week5_worked?: boolean | null
        }
        Update: {
          bonus_amount?: number | null
          created_at?: string | null
          created_by?: number | null
          date_of_joining?: string | null
          date_terminated?: string | null
          director_wage?: number | null
          ei_employee?: number | null
          ei_employer?: number | null
          employee_id?: number | null
          error_description?: string | null
          finalized_at?: string | null
          finalized_by?: number | null
          header_id?: number | null
          id?: number
          is_deleted?: boolean | null
          is_finalized?: boolean | null
          is_submitted?: boolean | null
          is_unlocked?: boolean | null
          legacy_id?: number | null
          levy_employee?: number | null
          levy_employer?: number | null
          pay_frequency?: string | null
          period_month?: string | null
          period_year?: string | null
          remarks?: string | null
          severance_employee?: number | null
          severance_employer?: number | null
          social_security_display?: string | null
          social_security_employee?: number | null
          social_security_employer?: number | null
          social_security_number?: string | null
          social_security_total?: number | null
          submitted_at?: string | null
          submitted_by?: number | null
          total_holiday_pay?: number | null
          updated_at?: string | null
          updated_by?: number | null
          week1_holiday_pay?: number | null
          week1_wages?: number | null
          week1_worked?: boolean | null
          week2_holiday_pay?: number | null
          week2_wages?: number | null
          week2_worked?: boolean | null
          week3_holiday_pay?: number | null
          week3_wages?: number | null
          week3_worked?: boolean | null
          week4_holiday_pay?: number | null
          week4_wages?: number | null
          week4_worked?: boolean | null
          week5_holiday_pay?: number | null
          week5_wages?: number | null
          week5_worked?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_contribution_details_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "c3_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "c3_contribution_details_header_id_fkey"
            columns: ["header_id"]
            isOneToOne: false
            referencedRelation: "c3_contribution_headers"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_contribution_headers: {
        Row: {
          company_id: number | null
          created_at: string | null
          created_by: number | null
          employee_count: number | null
          error_description: string | null
          exported_at: string | null
          exported_by: number | null
          finalized_at: string | null
          finalized_by: number | null
          grand_total: number | null
          id: number
          is_deleted: boolean | null
          is_finalized: boolean | null
          is_for_director: boolean | null
          is_imported_from_bema: boolean | null
          is_nil_return: boolean | null
          is_sent_for_edit: boolean | null
          is_submitted: boolean | null
          is_unlocked: boolean | null
          legacy_id: number | null
          legacy_machine_info: string | null
          notes: string | null
          order_key: string | null
          order_name: string | null
          period_month: string
          period_year: string
          printed_at: string | null
          printed_by: number | null
          registration_number: string | null
          schedule_number: number | null
          submitted_at: string | null
          submitted_by: number | null
          total_bonus: number | null
          total_ei_employee: number | null
          total_ei_employer: number | null
          total_holiday_pay: number | null
          total_levy_employee: number | null
          total_levy_employer: number | null
          total_levy_penalty: number | null
          total_pe_employee: number | null
          total_pe_employer: number | null
          total_pe_penalty: number | null
          total_severance: number | null
          total_social_security: number | null
          total_ss_employee: number | null
          total_ss_employer: number | null
          total_ss_penalty: number | null
          total_wages: number | null
          updated_at: string | null
          updated_by: number | null
          username: string | null
        }
        Insert: {
          company_id?: number | null
          created_at?: string | null
          created_by?: number | null
          employee_count?: number | null
          error_description?: string | null
          exported_at?: string | null
          exported_by?: number | null
          finalized_at?: string | null
          finalized_by?: number | null
          grand_total?: number | null
          id?: number
          is_deleted?: boolean | null
          is_finalized?: boolean | null
          is_for_director?: boolean | null
          is_imported_from_bema?: boolean | null
          is_nil_return?: boolean | null
          is_sent_for_edit?: boolean | null
          is_submitted?: boolean | null
          is_unlocked?: boolean | null
          legacy_id?: number | null
          legacy_machine_info?: string | null
          notes?: string | null
          order_key?: string | null
          order_name?: string | null
          period_month: string
          period_year: string
          printed_at?: string | null
          printed_by?: number | null
          registration_number?: string | null
          schedule_number?: number | null
          submitted_at?: string | null
          submitted_by?: number | null
          total_bonus?: number | null
          total_ei_employee?: number | null
          total_ei_employer?: number | null
          total_holiday_pay?: number | null
          total_levy_employee?: number | null
          total_levy_employer?: number | null
          total_levy_penalty?: number | null
          total_pe_employee?: number | null
          total_pe_employer?: number | null
          total_pe_penalty?: number | null
          total_severance?: number | null
          total_social_security?: number | null
          total_ss_employee?: number | null
          total_ss_employer?: number | null
          total_ss_penalty?: number | null
          total_wages?: number | null
          updated_at?: string | null
          updated_by?: number | null
          username?: string | null
        }
        Update: {
          company_id?: number | null
          created_at?: string | null
          created_by?: number | null
          employee_count?: number | null
          error_description?: string | null
          exported_at?: string | null
          exported_by?: number | null
          finalized_at?: string | null
          finalized_by?: number | null
          grand_total?: number | null
          id?: number
          is_deleted?: boolean | null
          is_finalized?: boolean | null
          is_for_director?: boolean | null
          is_imported_from_bema?: boolean | null
          is_nil_return?: boolean | null
          is_sent_for_edit?: boolean | null
          is_submitted?: boolean | null
          is_unlocked?: boolean | null
          legacy_id?: number | null
          legacy_machine_info?: string | null
          notes?: string | null
          order_key?: string | null
          order_name?: string | null
          period_month?: string
          period_year?: string
          printed_at?: string | null
          printed_by?: number | null
          registration_number?: string | null
          schedule_number?: number | null
          submitted_at?: string | null
          submitted_by?: number | null
          total_bonus?: number | null
          total_ei_employee?: number | null
          total_ei_employer?: number | null
          total_holiday_pay?: number | null
          total_levy_employee?: number | null
          total_levy_employer?: number | null
          total_levy_penalty?: number | null
          total_pe_employee?: number | null
          total_pe_employer?: number | null
          total_pe_penalty?: number | null
          total_severance?: number | null
          total_social_security?: number | null
          total_ss_employee?: number | null
          total_ss_employer?: number | null
          total_ss_penalty?: number | null
          total_wages?: number | null
          updated_at?: string | null
          updated_by?: number | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_contribution_headers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "c3_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "c3_contribution_headers_finalized_by_fkey"
            columns: ["finalized_by"]
            isOneToOne: false
            referencedRelation: "c3_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "c3_contribution_headers_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "c3_users"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_countries: {
        Row: {
          code: string | null
          created_at: string | null
          created_by: number | null
          description: string | null
          id: number
          is_deleted: boolean | null
          legacy_id: number | null
          name: string
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          created_by?: number | null
          description?: string | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          name: string
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          created_by?: number | null
          description?: string | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          name?: string
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: []
      }
      c3_deduction_codes: {
        Row: {
          created_at: string | null
          created_by: number | null
          deduction_code: string | null
          deduction_tax_reduction: string | null
          deduction_type: string | null
          default_apply: string | null
          default_high_deduction_amount: number | null
          default_limit: number | null
          default_low_deduction_amount: number | null
          default_pay_limit: number | null
          default_rate: number | null
          description: string | null
          from_date: string | null
          id: number
          is_locked: boolean | null
          legacy_id: number | null
          state_ein: string | null
          tax_jurisdiction: string | null
          to_date: string | null
          updated_at: string | null
          updated_by: number | null
          year_rollover: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: number | null
          deduction_code?: string | null
          deduction_tax_reduction?: string | null
          deduction_type?: string | null
          default_apply?: string | null
          default_high_deduction_amount?: number | null
          default_limit?: number | null
          default_low_deduction_amount?: number | null
          default_pay_limit?: number | null
          default_rate?: number | null
          description?: string | null
          from_date?: string | null
          id?: number
          is_locked?: boolean | null
          legacy_id?: number | null
          state_ein?: string | null
          tax_jurisdiction?: string | null
          to_date?: string | null
          updated_at?: string | null
          updated_by?: number | null
          year_rollover?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: number | null
          deduction_code?: string | null
          deduction_tax_reduction?: string | null
          deduction_type?: string | null
          default_apply?: string | null
          default_high_deduction_amount?: number | null
          default_limit?: number | null
          default_low_deduction_amount?: number | null
          default_pay_limit?: number | null
          default_rate?: number | null
          description?: string | null
          from_date?: string | null
          id?: number
          is_locked?: boolean | null
          legacy_id?: number | null
          state_ein?: string | null
          tax_jurisdiction?: string | null
          to_date?: string | null
          updated_at?: string | null
          updated_by?: number | null
          year_rollover?: string | null
        }
        Relationships: []
      }
      c3_employee_deductions: {
        Row: {
          account_number: number | null
          balance_amount: number | null
          created_at: string | null
          created_by: number | null
          deduction_apply: string | null
          deduction_code: string | null
          deduction_date: string | null
          deduction_limit: number | null
          deduction_qtd1: number | null
          deduction_qtd2: number | null
          deduction_qtd3: number | null
          deduction_qtd4: number | null
          deduction_rate: number | null
          deduction_ytd: number | null
          department: string | null
          employee_code: string | null
          employee_id: number | null
          high_deduction_amount: number | null
          id: number
          legacy_id: number | null
          line_number: number | null
          low_deduction_amount: number | null
          pay_limit: number | null
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          account_number?: number | null
          balance_amount?: number | null
          created_at?: string | null
          created_by?: number | null
          deduction_apply?: string | null
          deduction_code?: string | null
          deduction_date?: string | null
          deduction_limit?: number | null
          deduction_qtd1?: number | null
          deduction_qtd2?: number | null
          deduction_qtd3?: number | null
          deduction_qtd4?: number | null
          deduction_rate?: number | null
          deduction_ytd?: number | null
          department?: string | null
          employee_code?: string | null
          employee_id?: number | null
          high_deduction_amount?: number | null
          id?: number
          legacy_id?: number | null
          line_number?: number | null
          low_deduction_amount?: number | null
          pay_limit?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          account_number?: number | null
          balance_amount?: number | null
          created_at?: string | null
          created_by?: number | null
          deduction_apply?: string | null
          deduction_code?: string | null
          deduction_date?: string | null
          deduction_limit?: number | null
          deduction_qtd1?: number | null
          deduction_qtd2?: number | null
          deduction_qtd3?: number | null
          deduction_qtd4?: number | null
          deduction_rate?: number | null
          deduction_ytd?: number | null
          department?: string | null
          employee_code?: string | null
          employee_id?: number | null
          high_deduction_amount?: number | null
          id?: number
          legacy_id?: number | null
          line_number?: number | null
          low_deduction_amount?: number | null
          pay_limit?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: []
      }
      c3_employee_incomes: {
        Row: {
          account_number: number | null
          created_at: string | null
          created_by: number | null
          department: string | null
          employee_code: string | null
          employee_id: number | null
          high_income_amount: number | null
          id: number
          income_code: string | null
          income_hours: number | null
          income_number: number | null
          income_qtd1: number | null
          income_qtd2: number | null
          income_qtd3: number | null
          income_qtd4: number | null
          income_rate: number | null
          income_ytd: number | null
          legacy_id: number | null
          line_number: number | null
          low_income_amount: number | null
          updated_at: string | null
          updated_by: number | null
          wage_amount: number | null
        }
        Insert: {
          account_number?: number | null
          created_at?: string | null
          created_by?: number | null
          department?: string | null
          employee_code?: string | null
          employee_id?: number | null
          high_income_amount?: number | null
          id?: number
          income_code?: string | null
          income_hours?: number | null
          income_number?: number | null
          income_qtd1?: number | null
          income_qtd2?: number | null
          income_qtd3?: number | null
          income_qtd4?: number | null
          income_rate?: number | null
          income_ytd?: number | null
          legacy_id?: number | null
          line_number?: number | null
          low_income_amount?: number | null
          updated_at?: string | null
          updated_by?: number | null
          wage_amount?: number | null
        }
        Update: {
          account_number?: number | null
          created_at?: string | null
          created_by?: number | null
          department?: string | null
          employee_code?: string | null
          employee_id?: number | null
          high_income_amount?: number | null
          id?: number
          income_code?: string | null
          income_hours?: number | null
          income_number?: number | null
          income_qtd1?: number | null
          income_qtd2?: number | null
          income_qtd3?: number | null
          income_qtd4?: number | null
          income_rate?: number | null
          income_ytd?: number | null
          legacy_id?: number | null
          line_number?: number | null
          low_income_amount?: number | null
          updated_at?: string | null
          updated_by?: number | null
          wage_amount?: number | null
        }
        Relationships: []
      }
      c3_employee_obligations: {
        Row: {
          account_number: number | null
          balance_account_number: number | null
          created_at: string | null
          created_by: number | null
          deduction_rate: number | null
          department: string | null
          employee_code: string | null
          employee_id: number | null
          id: number
          legacy_id: number | null
          line_number: number | null
          obligation_apply: string | null
          obligation_code: string | null
          obligation_limit: number | null
          obligation_qtd1: number | null
          obligation_qtd2: number | null
          obligation_qtd3: number | null
          obligation_qtd4: number | null
          obligation_ytd: number | null
          pay_limit: number | null
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          account_number?: number | null
          balance_account_number?: number | null
          created_at?: string | null
          created_by?: number | null
          deduction_rate?: number | null
          department?: string | null
          employee_code?: string | null
          employee_id?: number | null
          id?: number
          legacy_id?: number | null
          line_number?: number | null
          obligation_apply?: string | null
          obligation_code?: string | null
          obligation_limit?: number | null
          obligation_qtd1?: number | null
          obligation_qtd2?: number | null
          obligation_qtd3?: number | null
          obligation_qtd4?: number | null
          obligation_ytd?: number | null
          pay_limit?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          account_number?: number | null
          balance_account_number?: number | null
          created_at?: string | null
          created_by?: number | null
          deduction_rate?: number | null
          department?: string | null
          employee_code?: string | null
          employee_id?: number | null
          id?: number
          legacy_id?: number | null
          line_number?: number | null
          obligation_apply?: string | null
          obligation_code?: string | null
          obligation_limit?: number | null
          obligation_qtd1?: number | null
          obligation_qtd2?: number | null
          obligation_qtd3?: number | null
          obligation_qtd4?: number | null
          obligation_ytd?: number | null
          pay_limit?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: []
      }
      c3_employee_types: {
        Row: {
          created_at: string | null
          created_by: number | null
          description: string | null
          id: number
          is_deleted: boolean | null
          legacy_id: number | null
          type_code: string
          type_name: string
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: number | null
          description?: string | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          type_code: string
          type_name: string
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: number | null
          description?: string | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          type_code?: string
          type_name?: string
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: []
      }
      c3_employees: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          allowances: number | null
          bank_account_number: string | null
          city: string | null
          company_id: number
          country: string | null
          created_at: string | null
          created_by: number | null
          date_of_birth: string | null
          department: string | null
          email: string | null
          employee_code: string | null
          employee_type_id: number | null
          employment_status: string | null
          first_name: string
          gender: string | null
          hire_date: string | null
          hold_payment: boolean | null
          id: number
          is_deleted: boolean | null
          is_director: boolean | null
          is_director_only: boolean | null
          is_file_created: boolean | null
          is_levy_exempt: boolean | null
          last_increment_date: string | null
          last_name: string
          last_pay_date: string | null
          legacy_id: number | null
          legacy_machine_info: string | null
          marital_status: string | null
          middle_name: string | null
          mobile: string | null
          occupation: string | null
          pay_period: string | null
          phone: string | null
          postal_code: string | null
          social_security_number: string | null
          state: string | null
          state_allowances: number | null
          state_udf: number | null
          termination_date: string | null
          tin: string | null
          updated_at: string | null
          updated_by: number | null
          wages_pay_date: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          allowances?: number | null
          bank_account_number?: string | null
          city?: string | null
          company_id: number
          country?: string | null
          created_at?: string | null
          created_by?: number | null
          date_of_birth?: string | null
          department?: string | null
          email?: string | null
          employee_code?: string | null
          employee_type_id?: number | null
          employment_status?: string | null
          first_name: string
          gender?: string | null
          hire_date?: string | null
          hold_payment?: boolean | null
          id?: number
          is_deleted?: boolean | null
          is_director?: boolean | null
          is_director_only?: boolean | null
          is_file_created?: boolean | null
          is_levy_exempt?: boolean | null
          last_increment_date?: string | null
          last_name: string
          last_pay_date?: string | null
          legacy_id?: number | null
          legacy_machine_info?: string | null
          marital_status?: string | null
          middle_name?: string | null
          mobile?: string | null
          occupation?: string | null
          pay_period?: string | null
          phone?: string | null
          postal_code?: string | null
          social_security_number?: string | null
          state?: string | null
          state_allowances?: number | null
          state_udf?: number | null
          termination_date?: string | null
          tin?: string | null
          updated_at?: string | null
          updated_by?: number | null
          wages_pay_date?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          allowances?: number | null
          bank_account_number?: string | null
          city?: string | null
          company_id?: number
          country?: string | null
          created_at?: string | null
          created_by?: number | null
          date_of_birth?: string | null
          department?: string | null
          email?: string | null
          employee_code?: string | null
          employee_type_id?: number | null
          employment_status?: string | null
          first_name?: string
          gender?: string | null
          hire_date?: string | null
          hold_payment?: boolean | null
          id?: number
          is_deleted?: boolean | null
          is_director?: boolean | null
          is_director_only?: boolean | null
          is_file_created?: boolean | null
          is_levy_exempt?: boolean | null
          last_increment_date?: string | null
          last_name?: string
          last_pay_date?: string | null
          legacy_id?: number | null
          legacy_machine_info?: string | null
          marital_status?: string | null
          middle_name?: string | null
          mobile?: string | null
          occupation?: string | null
          pay_period?: string | null
          phone?: string | null
          postal_code?: string | null
          social_security_number?: string | null
          state?: string | null
          state_allowances?: number | null
          state_udf?: number | null
          termination_date?: string | null
          tin?: string | null
          updated_at?: string | null
          updated_by?: number | null
          wages_pay_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "c3_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "c3_employees_employee_type_id_fkey"
            columns: ["employee_type_id"]
            isOneToOne: false
            referencedRelation: "c3_employee_types"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_employer_codes: {
        Row: {
          bonus_rate: number | null
          created_at: string | null
          created_by: number | null
          employer_levy_ee: number | null
          employer_severance: number | null
          employer_year_deduction_rate: number | null
          id: number
          legacy_id: number | null
          max_age: number | null
          min_age: number | null
          rate1: number | null
          rate2: number | null
          rate3: number | null
          updated_at: string | null
          updated_by: number | null
          year: number | null
        }
        Insert: {
          bonus_rate?: number | null
          created_at?: string | null
          created_by?: number | null
          employer_levy_ee?: number | null
          employer_severance?: number | null
          employer_year_deduction_rate?: number | null
          id?: number
          legacy_id?: number | null
          max_age?: number | null
          min_age?: number | null
          rate1?: number | null
          rate2?: number | null
          rate3?: number | null
          updated_at?: string | null
          updated_by?: number | null
          year?: number | null
        }
        Update: {
          bonus_rate?: number | null
          created_at?: string | null
          created_by?: number | null
          employer_levy_ee?: number | null
          employer_severance?: number | null
          employer_year_deduction_rate?: number | null
          id?: number
          legacy_id?: number | null
          max_age?: number | null
          min_age?: number | null
          rate1?: number | null
          rate2?: number | null
          rate3?: number | null
          updated_at?: string | null
          updated_by?: number | null
          year?: number | null
        }
        Relationships: []
      }
      c3_error_logs: {
        Row: {
          company_id: number | null
          controller_name: string | null
          error_message: string
          id: number
          is_active: boolean | null
          legacy_id: number | null
          logged_at: string | null
          method_name: string | null
          stack_trace: string | null
          user_id: number | null
        }
        Insert: {
          company_id?: number | null
          controller_name?: string | null
          error_message: string
          id?: number
          is_active?: boolean | null
          legacy_id?: number | null
          logged_at?: string | null
          method_name?: string | null
          stack_trace?: string | null
          user_id?: number | null
        }
        Update: {
          company_id?: number | null
          controller_name?: string | null
          error_message?: string
          id?: number
          is_active?: boolean | null
          legacy_id?: number | null
          logged_at?: string | null
          method_name?: string | null
          stack_trace?: string | null
          user_id?: number | null
        }
        Relationships: []
      }
      c3_exception_logs: {
        Row: {
          company_id: number | null
          created_at: string | null
          created_by: number | null
          error_description: string | null
          id: number
          is_self_employed: boolean | null
          legacy_id: number | null
          legacy_machine_info: string | null
          updated_at: string | null
          updated_by: number | null
          user_id: number | null
        }
        Insert: {
          company_id?: number | null
          created_at?: string | null
          created_by?: number | null
          error_description?: string | null
          id?: number
          is_self_employed?: boolean | null
          legacy_id?: number | null
          legacy_machine_info?: string | null
          updated_at?: string | null
          updated_by?: number | null
          user_id?: number | null
        }
        Update: {
          company_id?: number | null
          created_at?: string | null
          created_by?: number | null
          error_description?: string | null
          id?: number
          is_self_employed?: boolean | null
          legacy_id?: number | null
          legacy_machine_info?: string | null
          updated_at?: string | null
          updated_by?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_exception_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "c3_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "c3_exception_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "c3_users"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_holiday_pay_dates: {
        Row: {
          amount: number | null
          company_id: number | null
          created_at: string | null
          employee_id: number | null
          holiday_pay_date: string
          holiday_payment_id: number | null
          id: number
          is_deleted: boolean | null
          legacy_id: number | null
        }
        Insert: {
          amount?: number | null
          company_id?: number | null
          created_at?: string | null
          employee_id?: number | null
          holiday_pay_date: string
          holiday_payment_id?: number | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
        }
        Update: {
          amount?: number | null
          company_id?: number | null
          created_at?: string | null
          employee_id?: number | null
          holiday_pay_date?: string
          holiday_payment_id?: number | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_holiday_pay_dates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "c3_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "c3_holiday_pay_dates_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "c3_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "c3_holiday_pay_dates_holiday_payment_id_fkey"
            columns: ["holiday_payment_id"]
            isOneToOne: false
            referencedRelation: "c3_holiday_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_holiday_payments: {
        Row: {
          company_id: number | null
          created_at: string | null
          created_by: number | null
          employee_id: number | null
          holiday_date: string | null
          holiday_name: string | null
          id: number
          is_deleted: boolean | null
          legacy_id: number | null
          payment_amount: number
          payment_date: string | null
          period_month: string | null
          period_year: string | null
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          company_id?: number | null
          created_at?: string | null
          created_by?: number | null
          employee_id?: number | null
          holiday_date?: string | null
          holiday_name?: string | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          payment_amount: number
          payment_date?: string | null
          period_month?: string | null
          period_year?: string | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          company_id?: number | null
          created_at?: string | null
          created_by?: number | null
          employee_id?: number | null
          holiday_date?: string | null
          holiday_name?: string | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          payment_amount?: number
          payment_date?: string | null
          period_month?: string | null
          period_year?: string | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_holiday_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "c3_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "c3_holiday_payments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "c3_employees"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_income_codes: {
        Row: {
          account_number: number | null
          created_at: string | null
          created_by: number | null
          default_hours: number | null
          default_number: number | null
          default_rate: number | null
          department: string | null
          description: string | null
          from_date: string | null
          high_income_amount: number | null
          id: number
          income_code: string | null
          income_type: string | null
          is_locked: boolean | null
          is_subject_to_levy: boolean | null
          is_subject_to_social_security: boolean | null
          is_taxable: boolean | null
          legacy_id: number | null
          low_income_amount: number | null
          to_date: string | null
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          account_number?: number | null
          created_at?: string | null
          created_by?: number | null
          default_hours?: number | null
          default_number?: number | null
          default_rate?: number | null
          department?: string | null
          description?: string | null
          from_date?: string | null
          high_income_amount?: number | null
          id?: number
          income_code?: string | null
          income_type?: string | null
          is_locked?: boolean | null
          is_subject_to_levy?: boolean | null
          is_subject_to_social_security?: boolean | null
          is_taxable?: boolean | null
          legacy_id?: number | null
          low_income_amount?: number | null
          to_date?: string | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          account_number?: number | null
          created_at?: string | null
          created_by?: number | null
          default_hours?: number | null
          default_number?: number | null
          default_rate?: number | null
          department?: string | null
          description?: string | null
          from_date?: string | null
          high_income_amount?: number | null
          id?: number
          income_code?: string | null
          income_type?: string | null
          is_locked?: boolean | null
          is_subject_to_levy?: boolean | null
          is_subject_to_social_security?: boolean | null
          is_taxable?: boolean | null
          legacy_id?: number | null
          low_income_amount?: number | null
          to_date?: string | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: []
      }
      c3_levy_allowances: {
        Row: {
          allow_or_limit: string | null
          biweekly_allowance: number | null
          created_at: string | null
          created_by: number | null
          deduction_code: string | null
          effective_from: string | null
          effective_to: string | null
          hours_biweekly_allowance: number | null
          hours_misc_allowance: number | null
          hours_monthly_allowance: number | null
          hours_quarterly_allowance: number | null
          hours_semi_monthly_allowance: number | null
          hours_semi_yearly_allowance: number | null
          hours_weekly_allowance: number | null
          hours_yearly_allowance: number | null
          id: number
          is_deleted: boolean | null
          legacy_id: number | null
          misc_allowance: number | null
          monthly_allowance: number | null
          quarterly_allowance: number | null
          semi_monthly_allowance: number | null
          semi_yearly_allowance: number | null
          tax_year: string
          updated_at: string | null
          updated_by: number | null
          weekly_allowance: number | null
          yearly_allowance: number | null
        }
        Insert: {
          allow_or_limit?: string | null
          biweekly_allowance?: number | null
          created_at?: string | null
          created_by?: number | null
          deduction_code?: string | null
          effective_from?: string | null
          effective_to?: string | null
          hours_biweekly_allowance?: number | null
          hours_misc_allowance?: number | null
          hours_monthly_allowance?: number | null
          hours_quarterly_allowance?: number | null
          hours_semi_monthly_allowance?: number | null
          hours_semi_yearly_allowance?: number | null
          hours_weekly_allowance?: number | null
          hours_yearly_allowance?: number | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          misc_allowance?: number | null
          monthly_allowance?: number | null
          quarterly_allowance?: number | null
          semi_monthly_allowance?: number | null
          semi_yearly_allowance?: number | null
          tax_year: string
          updated_at?: string | null
          updated_by?: number | null
          weekly_allowance?: number | null
          yearly_allowance?: number | null
        }
        Update: {
          allow_or_limit?: string | null
          biweekly_allowance?: number | null
          created_at?: string | null
          created_by?: number | null
          deduction_code?: string | null
          effective_from?: string | null
          effective_to?: string | null
          hours_biweekly_allowance?: number | null
          hours_misc_allowance?: number | null
          hours_monthly_allowance?: number | null
          hours_quarterly_allowance?: number | null
          hours_semi_monthly_allowance?: number | null
          hours_semi_yearly_allowance?: number | null
          hours_weekly_allowance?: number | null
          hours_yearly_allowance?: number | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          misc_allowance?: number | null
          monthly_allowance?: number | null
          quarterly_allowance?: number | null
          semi_monthly_allowance?: number | null
          semi_yearly_allowance?: number | null
          tax_year?: string
          updated_at?: string | null
          updated_by?: number | null
          weekly_allowance?: number | null
          yearly_allowance?: number | null
        }
        Relationships: []
      }
      c3_levy_tiers: {
        Row: {
          base_amount: number | null
          created_at: string | null
          created_by: number | null
          deduction_code: string | null
          header_id: number | null
          id: number
          is_deleted: boolean | null
          legacy_id: number | null
          marital_status: string | null
          pay_period: string | null
          tax_rate: number
          tax_year: string
          threshold_amount: number
          tier_order: number
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          base_amount?: number | null
          created_at?: string | null
          created_by?: number | null
          deduction_code?: string | null
          header_id?: number | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          marital_status?: string | null
          pay_period?: string | null
          tax_rate: number
          tax_year: string
          threshold_amount: number
          tier_order: number
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          base_amount?: number | null
          created_at?: string | null
          created_by?: number | null
          deduction_code?: string | null
          header_id?: number | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          marital_status?: string | null
          pay_period?: string | null
          tax_rate?: number
          tax_year?: string
          threshold_amount?: number
          tier_order?: number
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: []
      }
      c3_login_logs: {
        Row: {
          company_id: number | null
          created_at: string | null
          failure_reason: string | null
          id: number
          ip_address: string | null
          is_locked: boolean | null
          is_self_employed: boolean | null
          legacy_id: number | null
          login_time: string
          logout_time: string | null
          user_agent: string | null
          user_id: number | null
          username: string | null
          was_successful: boolean | null
        }
        Insert: {
          company_id?: number | null
          created_at?: string | null
          failure_reason?: string | null
          id?: number
          ip_address?: string | null
          is_locked?: boolean | null
          is_self_employed?: boolean | null
          legacy_id?: number | null
          login_time: string
          logout_time?: string | null
          user_agent?: string | null
          user_id?: number | null
          username?: string | null
          was_successful?: boolean | null
        }
        Update: {
          company_id?: number | null
          created_at?: string | null
          failure_reason?: string | null
          id?: number
          ip_address?: string | null
          is_locked?: boolean | null
          is_self_employed?: boolean | null
          legacy_id?: number | null
          login_time?: string
          logout_time?: string | null
          user_agent?: string | null
          user_id?: number | null
          username?: string | null
          was_successful?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_login_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "c3_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "c3_login_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "c3_users"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_migration_logs: {
        Row: {
          auth_user_id: string | null
          c3_user_id: number | null
          email: string | null
          error_message: string | null
          id: number
          migrated_at: string | null
          status: string | null
        }
        Insert: {
          auth_user_id?: string | null
          c3_user_id?: number | null
          email?: string | null
          error_message?: string | null
          id?: number
          migrated_at?: string | null
          status?: string | null
        }
        Update: {
          auth_user_id?: string | null
          c3_user_id?: number | null
          email?: string | null
          error_message?: string | null
          id?: number
          migrated_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_migration_logs_c3_user_id_fkey"
            columns: ["c3_user_id"]
            isOneToOne: false
            referencedRelation: "c3_users"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_modules: {
        Row: {
          created_at: string | null
          created_by: number | null
          description: string | null
          display_order: number | null
          form_name: string | null
          icon: string | null
          id: number
          is_deleted: boolean | null
          legacy_id: number | null
          module_code: string
          module_level: number | null
          module_name: string
          page_url: string | null
          parent_id: number | null
          role_id: number | null
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: number | null
          description?: string | null
          display_order?: number | null
          form_name?: string | null
          icon?: string | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          module_code: string
          module_level?: number | null
          module_name: string
          page_url?: string | null
          parent_id?: number | null
          role_id?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: number | null
          description?: string | null
          display_order?: number | null
          form_name?: string | null
          icon?: string | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          module_code?: string
          module_level?: number | null
          module_name?: string
          page_url?: string | null
          parent_id?: number | null
          role_id?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_modules_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "c3_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "c3_modules_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "c3_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_nwd_rate_settings: {
        Row: {
          created_at: string | null
          created_by: number | null
          from_date: string | null
          id: number
          is_locked: boolean | null
          legacy_id: number | null
          levy_rate: number | null
          severance_rate: number | null
          social_security_ee_rate: number | null
          social_security_er_rate: number | null
          to_date: string | null
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: number | null
          from_date?: string | null
          id?: number
          is_locked?: boolean | null
          legacy_id?: number | null
          levy_rate?: number | null
          severance_rate?: number | null
          social_security_ee_rate?: number | null
          social_security_er_rate?: number | null
          to_date?: string | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: number | null
          from_date?: string | null
          id?: number
          is_locked?: boolean | null
          legacy_id?: number | null
          levy_rate?: number | null
          severance_rate?: number | null
          social_security_ee_rate?: number | null
          social_security_er_rate?: number | null
          to_date?: string | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: []
      }
      c3_obligation_codes: {
        Row: {
          account_number: number | null
          created_at: string | null
          created_by: number | null
          default_apply: string | null
          default_limit: number | null
          default_rate: number | null
          description: string | null
          id: number
          is_locked: boolean | null
          legacy_id: number | null
          obligation_code: string | null
          pay_limit: number | null
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          account_number?: number | null
          created_at?: string | null
          created_by?: number | null
          default_apply?: string | null
          default_limit?: number | null
          default_rate?: number | null
          description?: string | null
          id?: number
          is_locked?: boolean | null
          legacy_id?: number | null
          obligation_code?: string | null
          pay_limit?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          account_number?: number | null
          created_at?: string | null
          created_by?: number | null
          default_apply?: string | null
          default_limit?: number | null
          default_rate?: number | null
          description?: string | null
          id?: number
          is_locked?: boolean | null
          legacy_id?: number | null
          obligation_code?: string | null
          pay_limit?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: []
      }
      c3_payments: {
        Row: {
          amount: number
          authorization_code: string | null
          billing_address_line1: string | null
          billing_address_line2: string | null
          billing_city: string | null
          billing_country: string | null
          billing_postal_code: string | null
          billing_state: string | null
          card_expiry_month: string | null
          card_expiry_year: string | null
          card_last_four: string | null
          card_type: string | null
          cardholder_name: string | null
          company_id: number | null
          contribution_header_id: number | null
          created_at: string | null
          created_by: number | null
          currency: string | null
          error_code: string | null
          error_message: string | null
          gateway_response_code: string | null
          gateway_response_message: string | null
          id: number
          is_deleted: boolean | null
          is_reconciled: boolean | null
          legacy_id: number | null
          legacy_machine_info: string | null
          payer_type: string | null
          payment_completed_at: string | null
          payment_gateway_transaction_id: string | null
          payment_id: string | null
          payment_initiated_at: string | null
          payment_method: string | null
          payment_status: string | null
          payment_type: string | null
          period_month: string | null
          period_year: string | null
          reconciled_at: string | null
          reconciled_by: number | null
          registration_number: string | null
          self_employed_contribution_id: number | null
          self_employed_id: number | null
          system_key: string | null
          system_transaction_id: string | null
          updated_at: string | null
          updated_by: number | null
          user_id: number | null
        }
        Insert: {
          amount: number
          authorization_code?: string | null
          billing_address_line1?: string | null
          billing_address_line2?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_postal_code?: string | null
          billing_state?: string | null
          card_expiry_month?: string | null
          card_expiry_year?: string | null
          card_last_four?: string | null
          card_type?: string | null
          cardholder_name?: string | null
          company_id?: number | null
          contribution_header_id?: number | null
          created_at?: string | null
          created_by?: number | null
          currency?: string | null
          error_code?: string | null
          error_message?: string | null
          gateway_response_code?: string | null
          gateway_response_message?: string | null
          id?: number
          is_deleted?: boolean | null
          is_reconciled?: boolean | null
          legacy_id?: number | null
          legacy_machine_info?: string | null
          payer_type?: string | null
          payment_completed_at?: string | null
          payment_gateway_transaction_id?: string | null
          payment_id?: string | null
          payment_initiated_at?: string | null
          payment_method?: string | null
          payment_status?: string | null
          payment_type?: string | null
          period_month?: string | null
          period_year?: string | null
          reconciled_at?: string | null
          reconciled_by?: number | null
          registration_number?: string | null
          self_employed_contribution_id?: number | null
          self_employed_id?: number | null
          system_key?: string | null
          system_transaction_id?: string | null
          updated_at?: string | null
          updated_by?: number | null
          user_id?: number | null
        }
        Update: {
          amount?: number
          authorization_code?: string | null
          billing_address_line1?: string | null
          billing_address_line2?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_postal_code?: string | null
          billing_state?: string | null
          card_expiry_month?: string | null
          card_expiry_year?: string | null
          card_last_four?: string | null
          card_type?: string | null
          cardholder_name?: string | null
          company_id?: number | null
          contribution_header_id?: number | null
          created_at?: string | null
          created_by?: number | null
          currency?: string | null
          error_code?: string | null
          error_message?: string | null
          gateway_response_code?: string | null
          gateway_response_message?: string | null
          id?: number
          is_deleted?: boolean | null
          is_reconciled?: boolean | null
          legacy_id?: number | null
          legacy_machine_info?: string | null
          payer_type?: string | null
          payment_completed_at?: string | null
          payment_gateway_transaction_id?: string | null
          payment_id?: string | null
          payment_initiated_at?: string | null
          payment_method?: string | null
          payment_status?: string | null
          payment_type?: string | null
          period_month?: string | null
          period_year?: string | null
          reconciled_at?: string | null
          reconciled_by?: number | null
          registration_number?: string | null
          self_employed_contribution_id?: number | null
          self_employed_id?: number | null
          system_key?: string | null
          system_transaction_id?: string | null
          updated_at?: string | null
          updated_by?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "c3_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "c3_payments_contribution_header_id_fkey"
            columns: ["contribution_header_id"]
            isOneToOne: false
            referencedRelation: "c3_contribution_headers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "c3_payments_self_employed_contribution_id_fkey"
            columns: ["self_employed_contribution_id"]
            isOneToOne: false
            referencedRelation: "c3_self_employed_contributions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "c3_payments_self_employed_id_fkey"
            columns: ["self_employed_id"]
            isOneToOne: false
            referencedRelation: "c3_self_employed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "c3_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "c3_users"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_payroll_deductions: {
        Row: {
          account_number: number | null
          amount: number | null
          created_at: string | null
          created_by: number | null
          deduction_code: string | null
          deduction_description: string | null
          department: string | null
          employee_id: number | null
          id: number
          legacy_id: number | null
          line_number: number | null
          payroll_employee_id: number | null
          updated_at: string | null
          updated_by: number | null
          ytd_amount: number | null
        }
        Insert: {
          account_number?: number | null
          amount?: number | null
          created_at?: string | null
          created_by?: number | null
          deduction_code?: string | null
          deduction_description?: string | null
          department?: string | null
          employee_id?: number | null
          id?: number
          legacy_id?: number | null
          line_number?: number | null
          payroll_employee_id?: number | null
          updated_at?: string | null
          updated_by?: number | null
          ytd_amount?: number | null
        }
        Update: {
          account_number?: number | null
          amount?: number | null
          created_at?: string | null
          created_by?: number | null
          deduction_code?: string | null
          deduction_description?: string | null
          department?: string | null
          employee_id?: number | null
          id?: number
          legacy_id?: number | null
          line_number?: number | null
          payroll_employee_id?: number | null
          updated_at?: string | null
          updated_by?: number | null
          ytd_amount?: number | null
        }
        Relationships: []
      }
      c3_payroll_details: {
        Row: {
          account_number: number | null
          amount: number | null
          created_at: string | null
          created_by: number | null
          department: string | null
          description: string | null
          detail_type: string | null
          employee_id: number | null
          hours: number | null
          id: number
          legacy_id: number | null
          line_number: number | null
          payroll_header_id: number | null
          rate: number | null
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          account_number?: number | null
          amount?: number | null
          created_at?: string | null
          created_by?: number | null
          department?: string | null
          description?: string | null
          detail_type?: string | null
          employee_id?: number | null
          hours?: number | null
          id?: number
          legacy_id?: number | null
          line_number?: number | null
          payroll_header_id?: number | null
          rate?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          account_number?: number | null
          amount?: number | null
          created_at?: string | null
          created_by?: number | null
          department?: string | null
          description?: string | null
          detail_type?: string | null
          employee_id?: number | null
          hours?: number | null
          id?: number
          legacy_id?: number | null
          line_number?: number | null
          payroll_header_id?: number | null
          rate?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: []
      }
      c3_payroll_employees: {
        Row: {
          bonus_pay: number | null
          check_date: string | null
          check_number: string | null
          created_at: string | null
          created_by: number | null
          department: string | null
          employee_code: string | null
          employee_id: number | null
          federal_tax: number | null
          first_name: string | null
          gross_pay: number | null
          holiday_pay: number | null
          hours_worked: number | null
          id: number
          is_direct_deposit: boolean | null
          last_name: string | null
          legacy_id: number | null
          levy_ee: number | null
          levy_er: number | null
          net_pay: number | null
          other_pay: number | null
          overtime_hours: number | null
          overtime_pay: number | null
          pay_period: string | null
          payroll_header_id: number | null
          regular_pay: number | null
          severance_ee: number | null
          severance_er: number | null
          social_security_ee: number | null
          social_security_er: number | null
          social_security_number: string | null
          state_tax: number | null
          total_deductions: number | null
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          bonus_pay?: number | null
          check_date?: string | null
          check_number?: string | null
          created_at?: string | null
          created_by?: number | null
          department?: string | null
          employee_code?: string | null
          employee_id?: number | null
          federal_tax?: number | null
          first_name?: string | null
          gross_pay?: number | null
          holiday_pay?: number | null
          hours_worked?: number | null
          id?: number
          is_direct_deposit?: boolean | null
          last_name?: string | null
          legacy_id?: number | null
          levy_ee?: number | null
          levy_er?: number | null
          net_pay?: number | null
          other_pay?: number | null
          overtime_hours?: number | null
          overtime_pay?: number | null
          pay_period?: string | null
          payroll_header_id?: number | null
          regular_pay?: number | null
          severance_ee?: number | null
          severance_er?: number | null
          social_security_ee?: number | null
          social_security_er?: number | null
          social_security_number?: string | null
          state_tax?: number | null
          total_deductions?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          bonus_pay?: number | null
          check_date?: string | null
          check_number?: string | null
          created_at?: string | null
          created_by?: number | null
          department?: string | null
          employee_code?: string | null
          employee_id?: number | null
          federal_tax?: number | null
          first_name?: string | null
          gross_pay?: number | null
          holiday_pay?: number | null
          hours_worked?: number | null
          id?: number
          is_direct_deposit?: boolean | null
          last_name?: string | null
          legacy_id?: number | null
          levy_ee?: number | null
          levy_er?: number | null
          net_pay?: number | null
          other_pay?: number | null
          overtime_hours?: number | null
          overtime_pay?: number | null
          pay_period?: string | null
          payroll_header_id?: number | null
          regular_pay?: number | null
          severance_ee?: number | null
          severance_er?: number | null
          social_security_ee?: number | null
          social_security_er?: number | null
          social_security_number?: string | null
          state_tax?: number | null
          total_deductions?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: []
      }
      c3_payroll_headers: {
        Row: {
          batch_number: number | null
          company_id: number | null
          created_at: string | null
          created_by: number | null
          employee_count: number | null
          id: number
          is_posted: boolean | null
          is_processed: boolean | null
          legacy_id: number | null
          notes: string | null
          pay_date: string | null
          pay_period: string | null
          period_end_date: string | null
          period_start_date: string | null
          posted_by: number | null
          posted_date: string | null
          processed_by: number | null
          processed_date: string | null
          status: string | null
          total_deductions: number | null
          total_employer_taxes: number | null
          total_gross: number | null
          total_net: number | null
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          batch_number?: number | null
          company_id?: number | null
          created_at?: string | null
          created_by?: number | null
          employee_count?: number | null
          id?: number
          is_posted?: boolean | null
          is_processed?: boolean | null
          legacy_id?: number | null
          notes?: string | null
          pay_date?: string | null
          pay_period?: string | null
          period_end_date?: string | null
          period_start_date?: string | null
          posted_by?: number | null
          posted_date?: string | null
          processed_by?: number | null
          processed_date?: string | null
          status?: string | null
          total_deductions?: number | null
          total_employer_taxes?: number | null
          total_gross?: number | null
          total_net?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          batch_number?: number | null
          company_id?: number | null
          created_at?: string | null
          created_by?: number | null
          employee_count?: number | null
          id?: number
          is_posted?: boolean | null
          is_processed?: boolean | null
          legacy_id?: number | null
          notes?: string | null
          pay_date?: string | null
          pay_period?: string | null
          period_end_date?: string | null
          period_start_date?: string | null
          posted_by?: number | null
          posted_date?: string | null
          processed_by?: number | null
          processed_date?: string | null
          status?: string | null
          total_deductions?: number | null
          total_employer_taxes?: number | null
          total_gross?: number | null
          total_net?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: []
      }
      c3_payroll_incomes: {
        Row: {
          account_number: number | null
          amount: number | null
          created_at: string | null
          created_by: number | null
          department: string | null
          employee_id: number | null
          hours: number | null
          id: number
          income_code: string | null
          income_description: string | null
          legacy_id: number | null
          line_number: number | null
          payroll_employee_id: number | null
          rate: number | null
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          account_number?: number | null
          amount?: number | null
          created_at?: string | null
          created_by?: number | null
          department?: string | null
          employee_id?: number | null
          hours?: number | null
          id?: number
          income_code?: string | null
          income_description?: string | null
          legacy_id?: number | null
          line_number?: number | null
          payroll_employee_id?: number | null
          rate?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          account_number?: number | null
          amount?: number | null
          created_at?: string | null
          created_by?: number | null
          department?: string | null
          employee_id?: number | null
          hours?: number | null
          id?: number
          income_code?: string | null
          income_description?: string | null
          legacy_id?: number | null
          line_number?: number | null
          payroll_employee_id?: number | null
          rate?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: []
      }
      c3_payroll_obligations: {
        Row: {
          account_number: number | null
          amount: number | null
          created_at: string | null
          created_by: number | null
          department: string | null
          employee_id: number | null
          id: number
          legacy_id: number | null
          line_number: number | null
          obligation_code: string | null
          obligation_description: string | null
          payroll_employee_id: number | null
          updated_at: string | null
          updated_by: number | null
          ytd_amount: number | null
        }
        Insert: {
          account_number?: number | null
          amount?: number | null
          created_at?: string | null
          created_by?: number | null
          department?: string | null
          employee_id?: number | null
          id?: number
          legacy_id?: number | null
          line_number?: number | null
          obligation_code?: string | null
          obligation_description?: string | null
          payroll_employee_id?: number | null
          updated_at?: string | null
          updated_by?: number | null
          ytd_amount?: number | null
        }
        Update: {
          account_number?: number | null
          amount?: number | null
          created_at?: string | null
          created_by?: number | null
          department?: string | null
          employee_id?: number | null
          id?: number
          legacy_id?: number | null
          line_number?: number | null
          obligation_code?: string | null
          obligation_description?: string | null
          payroll_employee_id?: number | null
          updated_at?: string | null
          updated_by?: number | null
          ytd_amount?: number | null
        }
        Relationships: []
      }
      c3_reconciliation_columns: {
        Row: {
          column_name: string | null
          column_type: string | null
          created_at: string | null
          created_by: number | null
          display_order: number | null
          id: number
          is_required: boolean | null
          is_visible: boolean | null
          legacy_id: number | null
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          column_name?: string | null
          column_type?: string | null
          created_at?: string | null
          created_by?: number | null
          display_order?: number | null
          id?: number
          is_required?: boolean | null
          is_visible?: boolean | null
          legacy_id?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          column_name?: string | null
          column_type?: string | null
          created_at?: string | null
          created_by?: number | null
          display_order?: number | null
          id?: number
          is_required?: boolean | null
          is_visible?: boolean | null
          legacy_id?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: []
      }
      c3_reconciliation_payment_details: {
        Row: {
          amount: number | null
          created_at: string | null
          created_by: number | null
          id: number
          legacy_id: number | null
          notes: string | null
          payment_date: string | null
          payment_id: number | null
          reconciliation_id: number | null
          reference_number: string | null
          status: string | null
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          created_by?: number | null
          id?: number
          legacy_id?: number | null
          notes?: string | null
          payment_date?: string | null
          payment_id?: number | null
          reconciliation_id?: number | null
          reference_number?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          created_by?: number | null
          id?: number
          legacy_id?: number | null
          notes?: string | null
          payment_date?: string | null
          payment_id?: number | null
          reconciliation_id?: number | null
          reference_number?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: []
      }
      c3_reconciliation_records: {
        Row: {
          bank_amount: number | null
          bank_reference: string | null
          created_at: string | null
          created_by: number | null
          id: number
          is_deleted: boolean | null
          legacy_id: number | null
          notes: string | null
          payment_id: number | null
          reconciliation_date: string | null
          reconciliation_status: string | null
          system_amount: number | null
          updated_at: string | null
          updated_by: number | null
          variance: number | null
        }
        Insert: {
          bank_amount?: number | null
          bank_reference?: string | null
          created_at?: string | null
          created_by?: number | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          notes?: string | null
          payment_id?: number | null
          reconciliation_date?: string | null
          reconciliation_status?: string | null
          system_amount?: number | null
          updated_at?: string | null
          updated_by?: number | null
          variance?: number | null
        }
        Update: {
          bank_amount?: number | null
          bank_reference?: string | null
          created_at?: string | null
          created_by?: number | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          notes?: string | null
          payment_id?: number | null
          reconciliation_date?: string | null
          reconciliation_status?: string | null
          system_amount?: number | null
          updated_at?: string | null
          updated_by?: number | null
          variance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_reconciliation_records_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "c3_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_roles: {
        Row: {
          created_at: string | null
          created_by: number | null
          description: string | null
          id: number
          is_deleted: boolean | null
          is_system_role: boolean | null
          legacy_id: number | null
          role_category: string | null
          role_code: string
          role_name: string
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: number | null
          description?: string | null
          id?: number
          is_deleted?: boolean | null
          is_system_role?: boolean | null
          legacy_id?: number | null
          role_category?: string | null
          role_code: string
          role_name: string
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: number | null
          description?: string | null
          id?: number
          is_deleted?: boolean | null
          is_system_role?: boolean | null
          legacy_id?: number | null
          role_category?: string | null
          role_code?: string
          role_name?: string
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: []
      }
      c3_saved_cards: {
        Row: {
          card_expiry_month: string | null
          card_expiry_year: string | null
          card_last_four: string
          card_token: string
          card_type: string | null
          cardholder_name: string | null
          created_at: string | null
          created_by: number | null
          id: number
          is_active: boolean | null
          is_default: boolean | null
          is_deleted: boolean | null
          legacy_id: number | null
          updated_at: string | null
          updated_by: number | null
          user_id: number | null
        }
        Insert: {
          card_expiry_month?: string | null
          card_expiry_year?: string | null
          card_last_four: string
          card_token: string
          card_type?: string | null
          cardholder_name?: string | null
          created_at?: string | null
          created_by?: number | null
          id?: number
          is_active?: boolean | null
          is_default?: boolean | null
          is_deleted?: boolean | null
          legacy_id?: number | null
          updated_at?: string | null
          updated_by?: number | null
          user_id?: number | null
        }
        Update: {
          card_expiry_month?: string | null
          card_expiry_year?: string | null
          card_last_four?: string
          card_token?: string
          card_type?: string | null
          cardholder_name?: string | null
          created_at?: string | null
          created_by?: number | null
          id?: number
          is_active?: boolean | null
          is_default?: boolean | null
          is_deleted?: boolean | null
          legacy_id?: number | null
          updated_at?: string | null
          updated_by?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_saved_cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "c3_users"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_security_questions: {
        Row: {
          answer_hash: string
          created_at: string | null
          created_by: number | null
          id: number
          is_deleted: boolean | null
          legacy_id: number | null
          question: string
          question_number: number
          updated_at: string | null
          updated_by: number | null
          user_id: number | null
        }
        Insert: {
          answer_hash: string
          created_at?: string | null
          created_by?: number | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          question: string
          question_number: number
          updated_at?: string | null
          updated_by?: number | null
          user_id?: number | null
        }
        Update: {
          answer_hash?: string
          created_at?: string | null
          created_by?: number | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          question?: string
          question_number?: number
          updated_at?: string | null
          updated_by?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_security_questions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "c3_users"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_self_employed: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          business_name: string | null
          city: string | null
          country: string | null
          created_at: string | null
          created_by: number | null
          date_of_birth: string | null
          email: string | null
          first_name: string
          gender: string | null
          id: number
          is_active: boolean | null
          is_deleted: boolean | null
          is_verified: boolean | null
          last_name: string
          legacy_id: number | null
          legacy_machine_info: string | null
          middle_name: string | null
          mobile: string | null
          occupation: string | null
          phone: string | null
          postal_code: string | null
          registration_date: string | null
          registration_number: string | null
          social_security_number: string | null
          state: string | null
          tin: string | null
          trade_name: string | null
          updated_at: string | null
          updated_by: number | null
          user_id: number | null
          wage_category_id: number | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          business_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: number | null
          date_of_birth?: string | null
          email?: string | null
          first_name: string
          gender?: string | null
          id?: number
          is_active?: boolean | null
          is_deleted?: boolean | null
          is_verified?: boolean | null
          last_name: string
          legacy_id?: number | null
          legacy_machine_info?: string | null
          middle_name?: string | null
          mobile?: string | null
          occupation?: string | null
          phone?: string | null
          postal_code?: string | null
          registration_date?: string | null
          registration_number?: string | null
          social_security_number?: string | null
          state?: string | null
          tin?: string | null
          trade_name?: string | null
          updated_at?: string | null
          updated_by?: number | null
          user_id?: number | null
          wage_category_id?: number | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          business_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: number | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string
          gender?: string | null
          id?: number
          is_active?: boolean | null
          is_deleted?: boolean | null
          is_verified?: boolean | null
          last_name?: string
          legacy_id?: number | null
          legacy_machine_info?: string | null
          middle_name?: string | null
          mobile?: string | null
          occupation?: string | null
          phone?: string | null
          postal_code?: string | null
          registration_date?: string | null
          registration_number?: string | null
          social_security_number?: string | null
          state?: string | null
          tin?: string | null
          trade_name?: string | null
          updated_at?: string | null
          updated_by?: number | null
          user_id?: number | null
          wage_category_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_self_employed_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "c3_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "c3_self_employed_wage_category_id_fkey"
            columns: ["wage_category_id"]
            isOneToOne: false
            referencedRelation: "c3_wage_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_self_employed_contributions: {
        Row: {
          created_at: string | null
          created_by: number | null
          date_of_birth: string | null
          declared_income: number | null
          error_description: string | null
          finalized_at: string | null
          finalized_by: number | null
          fine_amount: number | null
          first_name: string | null
          id: number
          is_deleted: boolean | null
          is_finalized: boolean | null
          is_paid: boolean | null
          is_submitted: boolean | null
          last_name: string | null
          legacy_id: number | null
          levy_contribution: number | null
          notes: string | null
          order_key: string | null
          order_name: string | null
          paid_at: string | null
          penalty_amount: number | null
          period_month: string
          period_year: string
          registration_number: string | null
          self_employed_id: number | null
          social_security_contribution: number | null
          social_security_number: string | null
          submitted_at: string | null
          submitted_by: number | null
          total_contribution: number | null
          updated_at: string | null
          updated_by: number | null
          wage_category_id: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: number | null
          date_of_birth?: string | null
          declared_income?: number | null
          error_description?: string | null
          finalized_at?: string | null
          finalized_by?: number | null
          fine_amount?: number | null
          first_name?: string | null
          id?: number
          is_deleted?: boolean | null
          is_finalized?: boolean | null
          is_paid?: boolean | null
          is_submitted?: boolean | null
          last_name?: string | null
          legacy_id?: number | null
          levy_contribution?: number | null
          notes?: string | null
          order_key?: string | null
          order_name?: string | null
          paid_at?: string | null
          penalty_amount?: number | null
          period_month: string
          period_year: string
          registration_number?: string | null
          self_employed_id?: number | null
          social_security_contribution?: number | null
          social_security_number?: string | null
          submitted_at?: string | null
          submitted_by?: number | null
          total_contribution?: number | null
          updated_at?: string | null
          updated_by?: number | null
          wage_category_id?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: number | null
          date_of_birth?: string | null
          declared_income?: number | null
          error_description?: string | null
          finalized_at?: string | null
          finalized_by?: number | null
          fine_amount?: number | null
          first_name?: string | null
          id?: number
          is_deleted?: boolean | null
          is_finalized?: boolean | null
          is_paid?: boolean | null
          is_submitted?: boolean | null
          last_name?: string | null
          legacy_id?: number | null
          levy_contribution?: number | null
          notes?: string | null
          order_key?: string | null
          order_name?: string | null
          paid_at?: string | null
          penalty_amount?: number | null
          period_month?: string
          period_year?: string
          registration_number?: string | null
          self_employed_id?: number | null
          social_security_contribution?: number | null
          social_security_number?: string | null
          submitted_at?: string | null
          submitted_by?: number | null
          total_contribution?: number | null
          updated_at?: string | null
          updated_by?: number | null
          wage_category_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_self_employed_contributions_self_employed_id_fkey"
            columns: ["self_employed_id"]
            isOneToOne: false
            referencedRelation: "c3_self_employed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "c3_self_employed_contributions_wage_category_id_fkey"
            columns: ["wage_category_id"]
            isOneToOne: false
            referencedRelation: "c3_wage_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_self_employed_settings: {
        Row: {
          created_at: string | null
          created_by: number | null
          description: string | null
          id: number
          is_deleted: boolean | null
          legacy_id: number | null
          setting_key: string
          setting_value: string | null
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: number | null
          description?: string | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          setting_key: string
          setting_value?: string | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: number | null
          description?: string | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          setting_key?: string
          setting_value?: string | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: []
      }
      c3_site_settings: {
        Row: {
          created_at: string | null
          created_by: number | null
          description: string | null
          id: number
          is_deleted: boolean | null
          legacy_id: number | null
          setting_key: string
          setting_type: string | null
          setting_value: string | null
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: number | null
          description?: string | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          setting_key: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: number | null
          description?: string | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          setting_key?: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: []
      }
      c3_states: {
        Row: {
          code: string | null
          country_id: number | null
          created_at: string | null
          created_by: number | null
          description: string | null
          id: number
          is_deleted: boolean | null
          legacy_id: number | null
          name: string
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          code?: string | null
          country_id?: number | null
          created_at?: string | null
          created_by?: number | null
          description?: string | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          name: string
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          code?: string | null
          country_id?: number | null
          created_at?: string | null
          created_by?: number | null
          description?: string | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          name?: string
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_states_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "c3_countries"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_system_rates: {
        Row: {
          additional_fine_rate: number | null
          additional_penalty_rate: number | null
          bonus_levy_rate: number | null
          created_at: string | null
          created_by: number | null
          effective_from: string
          effective_to: string | null
          eib_rate: number | null
          employee_rate: number | null
          employer_rate: number | null
          fine_rate: number | null
          id: number
          is_deleted: boolean | null
          is_locked: boolean | null
          legacy_id: number | null
          max_age: number | null
          min_age: number | null
          penalty_rate: number | null
          rate_type: string
          severance_rate: number | null
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          additional_fine_rate?: number | null
          additional_penalty_rate?: number | null
          bonus_levy_rate?: number | null
          created_at?: string | null
          created_by?: number | null
          effective_from: string
          effective_to?: string | null
          eib_rate?: number | null
          employee_rate?: number | null
          employer_rate?: number | null
          fine_rate?: number | null
          id?: number
          is_deleted?: boolean | null
          is_locked?: boolean | null
          legacy_id?: number | null
          max_age?: number | null
          min_age?: number | null
          penalty_rate?: number | null
          rate_type: string
          severance_rate?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          additional_fine_rate?: number | null
          additional_penalty_rate?: number | null
          bonus_levy_rate?: number | null
          created_at?: string | null
          created_by?: number | null
          effective_from?: string
          effective_to?: string | null
          eib_rate?: number | null
          employee_rate?: number | null
          employer_rate?: number | null
          fine_rate?: number | null
          id?: number
          is_deleted?: boolean | null
          is_locked?: boolean | null
          legacy_id?: number | null
          max_age?: number | null
          min_age?: number | null
          penalty_rate?: number | null
          rate_type?: string
          severance_rate?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: []
      }
      c3_temp_registrations: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          device_ip: string | null
          device_mac: string | null
          device_name: string | null
          email: string | null
          first_name: string | null
          id: number
          is_deleted: boolean | null
          is_verified: boolean | null
          last_name: string | null
          legacy_id: number | null
          mobile: string | null
          password_hash: string | null
          postal_code: string | null
          registration_status: string | null
          registration_type: string | null
          security_answer1: string | null
          security_answer2: string | null
          security_question1: string | null
          security_question2: string | null
          tin: string | null
          token_expires_at: string | null
          trade_name: string | null
          updated_at: string | null
          username: string | null
          verification_token: string | null
          verified_at: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          device_ip?: string | null
          device_mac?: string | null
          device_name?: string | null
          email?: string | null
          first_name?: string | null
          id?: number
          is_deleted?: boolean | null
          is_verified?: boolean | null
          last_name?: string | null
          legacy_id?: number | null
          mobile?: string | null
          password_hash?: string | null
          postal_code?: string | null
          registration_status?: string | null
          registration_type?: string | null
          security_answer1?: string | null
          security_answer2?: string | null
          security_question1?: string | null
          security_question2?: string | null
          tin?: string | null
          token_expires_at?: string | null
          trade_name?: string | null
          updated_at?: string | null
          username?: string | null
          verification_token?: string | null
          verified_at?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          device_ip?: string | null
          device_mac?: string | null
          device_name?: string | null
          email?: string | null
          first_name?: string | null
          id?: number
          is_deleted?: boolean | null
          is_verified?: boolean | null
          last_name?: string | null
          legacy_id?: number | null
          mobile?: string | null
          password_hash?: string | null
          postal_code?: string | null
          registration_status?: string | null
          registration_type?: string | null
          security_answer1?: string | null
          security_answer2?: string | null
          security_question1?: string | null
          security_question2?: string | null
          tin?: string | null
          token_expires_at?: string | null
          trade_name?: string | null
          updated_at?: string | null
          username?: string | null
          verification_token?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      c3_timecard_details: {
        Row: {
          account_number: number | null
          bonus_amount: number | null
          card_number: number | null
          created_at: string | null
          created_by: number | null
          holiday_amount: number | null
          id: number
          income_code: string | null
          income_hours: number | null
          income_number: number | null
          income_rate: number | null
          legacy_id: number | null
          line_number: number | null
          timecard_header_id: number | null
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          account_number?: number | null
          bonus_amount?: number | null
          card_number?: number | null
          created_at?: string | null
          created_by?: number | null
          holiday_amount?: number | null
          id?: number
          income_code?: string | null
          income_hours?: number | null
          income_number?: number | null
          income_rate?: number | null
          legacy_id?: number | null
          line_number?: number | null
          timecard_header_id?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          account_number?: number | null
          bonus_amount?: number | null
          card_number?: number | null
          created_at?: string | null
          created_by?: number | null
          holiday_amount?: number | null
          id?: number
          income_code?: string | null
          income_hours?: number | null
          income_number?: number | null
          income_rate?: number | null
          legacy_id?: number | null
          line_number?: number | null
          timecard_header_id?: number | null
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: []
      }
      c3_timecard_headers: {
        Row: {
          card_number: number | null
          company_id: number | null
          created_at: string | null
          created_by: number | null
          employee_code: string | null
          employee_name: string | null
          end_date: string | null
          id: number
          legacy_id: number | null
          payroll_batch_id: number | null
          start_date: string | null
          updated_at: string | null
          updated_by: number | null
          used_flag: string | null
        }
        Insert: {
          card_number?: number | null
          company_id?: number | null
          created_at?: string | null
          created_by?: number | null
          employee_code?: string | null
          employee_name?: string | null
          end_date?: string | null
          id?: number
          legacy_id?: number | null
          payroll_batch_id?: number | null
          start_date?: string | null
          updated_at?: string | null
          updated_by?: number | null
          used_flag?: string | null
        }
        Update: {
          card_number?: number | null
          company_id?: number | null
          created_at?: string | null
          created_by?: number | null
          employee_code?: string | null
          employee_name?: string | null
          end_date?: string | null
          id?: number
          legacy_id?: number | null
          payroll_batch_id?: number | null
          start_date?: string | null
          updated_at?: string | null
          updated_by?: number | null
          used_flag?: string | null
        }
        Relationships: []
      }
      c3_user_granular_permissions: {
        Row: {
          created_at: string | null
          created_by: number | null
          id: number
          is_granted: boolean | null
          legacy_id: number | null
          module_id: number | null
          permission_type: string | null
          updated_at: string | null
          updated_by: number | null
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: number | null
          id?: number
          is_granted?: boolean | null
          legacy_id?: number | null
          module_id?: number | null
          permission_type?: string | null
          updated_at?: string | null
          updated_by?: number | null
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: number | null
          id?: number
          is_granted?: boolean | null
          legacy_id?: number | null
          module_id?: number | null
          permission_type?: string | null
          updated_at?: string | null
          updated_by?: number | null
          user_id?: number | null
        }
        Relationships: []
      }
      c3_user_otps: {
        Row: {
          created_at: string | null
          expires_at: string
          id: number
          is_deleted: boolean | null
          is_used: boolean | null
          legacy_id: number | null
          otp_code: string
          otp_type: string | null
          used_at: string | null
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: number
          is_deleted?: boolean | null
          is_used?: boolean | null
          legacy_id?: number | null
          otp_code: string
          otp_type?: string | null
          used_at?: string | null
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: number
          is_deleted?: boolean | null
          is_used?: boolean | null
          legacy_id?: number | null
          otp_code?: string
          otp_type?: string | null
          used_at?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_user_otps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "c3_users"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_user_permissions: {
        Row: {
          can_browse: boolean | null
          can_create: boolean | null
          can_delete: boolean | null
          can_export: boolean | null
          can_read: boolean | null
          can_update: boolean | null
          created_at: string | null
          created_by: number | null
          id: number
          is_deleted: boolean | null
          legacy_id: number | null
          module_id: number | null
          role_id: number | null
          updated_at: string | null
          updated_by: number | null
          user_id: number | null
        }
        Insert: {
          can_browse?: boolean | null
          can_create?: boolean | null
          can_delete?: boolean | null
          can_export?: boolean | null
          can_read?: boolean | null
          can_update?: boolean | null
          created_at?: string | null
          created_by?: number | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          module_id?: number | null
          role_id?: number | null
          updated_at?: string | null
          updated_by?: number | null
          user_id?: number | null
        }
        Update: {
          can_browse?: boolean | null
          can_create?: boolean | null
          can_delete?: boolean | null
          can_export?: boolean | null
          can_read?: boolean | null
          can_update?: boolean | null
          created_at?: string | null
          created_by?: number | null
          id?: number
          is_deleted?: boolean | null
          legacy_id?: number | null
          module_id?: number | null
          role_id?: number | null
          updated_at?: string | null
          updated_by?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_user_permissions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "c3_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "c3_user_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "c3_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "c3_user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "c3_users"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_user_profiles: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          country: string | null
          created_at: string | null
          created_by: number | null
          date_of_birth: string | null
          display_name: string | null
          first_name: string | null
          gender: string | null
          id: number
          is_deleted: boolean | null
          last_name: string | null
          legacy_id: number | null
          middle_name: string | null
          mobile: string | null
          phone: string | null
          postal_code: string | null
          profile_image_url: string | null
          state: string | null
          updated_at: string | null
          updated_by: number | null
          user_id: number | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: number | null
          date_of_birth?: string | null
          display_name?: string | null
          first_name?: string | null
          gender?: string | null
          id?: number
          is_deleted?: boolean | null
          last_name?: string | null
          legacy_id?: number | null
          middle_name?: string | null
          mobile?: string | null
          phone?: string | null
          postal_code?: string | null
          profile_image_url?: string | null
          state?: string | null
          updated_at?: string | null
          updated_by?: number | null
          user_id?: number | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: number | null
          date_of_birth?: string | null
          display_name?: string | null
          first_name?: string | null
          gender?: string | null
          id?: number
          is_deleted?: boolean | null
          last_name?: string | null
          legacy_id?: number | null
          middle_name?: string | null
          mobile?: string | null
          phone?: string | null
          postal_code?: string | null
          profile_image_url?: string | null
          state?: string | null
          updated_at?: string | null
          updated_by?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "c3_users"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_users: {
        Row: {
          auth_user_id: string | null
          company_id: number | null
          created_at: string | null
          created_by: number | null
          email: string | null
          failed_login_attempts: number | null
          id: number
          is_deleted: boolean | null
          is_email_verified: boolean | null
          is_locked: boolean | null
          is_verified: boolean | null
          last_login_at: string | null
          last_login_ip: string | null
          legacy_id: number | null
          legacy_machine_info: string | null
          password_changed_at: string | null
          password_hash: string | null
          password_reset_expires_at: string | null
          password_reset_token: string | null
          role_id: number | null
          self_employed_id: number | null
          updated_at: string | null
          updated_by: number | null
          user_type: string | null
          username: string
          verification_token: string | null
        }
        Insert: {
          auth_user_id?: string | null
          company_id?: number | null
          created_at?: string | null
          created_by?: number | null
          email?: string | null
          failed_login_attempts?: number | null
          id?: number
          is_deleted?: boolean | null
          is_email_verified?: boolean | null
          is_locked?: boolean | null
          is_verified?: boolean | null
          last_login_at?: string | null
          last_login_ip?: string | null
          legacy_id?: number | null
          legacy_machine_info?: string | null
          password_changed_at?: string | null
          password_hash?: string | null
          password_reset_expires_at?: string | null
          password_reset_token?: string | null
          role_id?: number | null
          self_employed_id?: number | null
          updated_at?: string | null
          updated_by?: number | null
          user_type?: string | null
          username: string
          verification_token?: string | null
        }
        Update: {
          auth_user_id?: string | null
          company_id?: number | null
          created_at?: string | null
          created_by?: number | null
          email?: string | null
          failed_login_attempts?: number | null
          id?: number
          is_deleted?: boolean | null
          is_email_verified?: boolean | null
          is_locked?: boolean | null
          is_verified?: boolean | null
          last_login_at?: string | null
          last_login_ip?: string | null
          legacy_id?: number | null
          legacy_machine_info?: string | null
          password_changed_at?: string | null
          password_hash?: string | null
          password_reset_expires_at?: string | null
          password_reset_token?: string | null
          role_id?: number | null
          self_employed_id?: number | null
          updated_at?: string | null
          updated_by?: number | null
          user_type?: string | null
          username?: string
          verification_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "c3_users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "c3_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_users_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "c3_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_users_self_employed"
            columns: ["self_employed_id"]
            isOneToOne: false
            referencedRelation: "c3_self_employed"
            referencedColumns: ["id"]
          },
        ]
      }
      c3_wage_categories: {
        Row: {
          category_code: string | null
          category_name: string
          created_at: string | null
          created_by: number | null
          description: string | null
          id: number
          is_deleted: boolean | null
          is_locked: boolean | null
          legacy_id: number | null
          max_wage: number | null
          min_wage: number | null
          settings_id: number | null
          updated_at: string | null
          updated_by: number | null
          weekly_contribution: number | null
          weekly_income: number | null
        }
        Insert: {
          category_code?: string | null
          category_name: string
          created_at?: string | null
          created_by?: number | null
          description?: string | null
          id?: number
          is_deleted?: boolean | null
          is_locked?: boolean | null
          legacy_id?: number | null
          max_wage?: number | null
          min_wage?: number | null
          settings_id?: number | null
          updated_at?: string | null
          updated_by?: number | null
          weekly_contribution?: number | null
          weekly_income?: number | null
        }
        Update: {
          category_code?: string | null
          category_name?: string
          created_at?: string | null
          created_by?: number | null
          description?: string | null
          id?: number
          is_deleted?: boolean | null
          is_locked?: boolean | null
          legacy_id?: number | null
          max_wage?: number | null
          min_wage?: number | null
          settings_id?: number | null
          updated_at?: string | null
          updated_by?: number | null
          weekly_contribution?: number | null
          weekly_income?: number | null
        }
        Relationships: []
      }
      c3_wages_details: {
        Row: {
          base_wage: number | null
          bonus_wage: number | null
          company_id: number | null
          created_at: string | null
          created_by: number | null
          employee_id: number | null
          holiday_wage: number | null
          id: number
          is_deleted: boolean | null
          is_paid: boolean | null
          legacy_id: number | null
          notes: string | null
          overtime_wage: number | null
          paid_by: number | null
          paid_date: string | null
          pay_date: string | null
          period_month: string | null
          period_year: string | null
          total_wage: number | null
          updated_at: string | null
          updated_by: number | null
          wage_category_id: number | null
        }
        Insert: {
          base_wage?: number | null
          bonus_wage?: number | null
          company_id?: number | null
          created_at?: string | null
          created_by?: number | null
          employee_id?: number | null
          holiday_wage?: number | null
          id?: number
          is_deleted?: boolean | null
          is_paid?: boolean | null
          legacy_id?: number | null
          notes?: string | null
          overtime_wage?: number | null
          paid_by?: number | null
          paid_date?: string | null
          pay_date?: string | null
          period_month?: string | null
          period_year?: string | null
          total_wage?: number | null
          updated_at?: string | null
          updated_by?: number | null
          wage_category_id?: number | null
        }
        Update: {
          base_wage?: number | null
          bonus_wage?: number | null
          company_id?: number | null
          created_at?: string | null
          created_by?: number | null
          employee_id?: number | null
          holiday_wage?: number | null
          id?: number
          is_deleted?: boolean | null
          is_paid?: boolean | null
          legacy_id?: number | null
          notes?: string | null
          overtime_wage?: number | null
          paid_by?: number | null
          paid_date?: string | null
          pay_date?: string | null
          period_month?: string | null
          period_year?: string | null
          total_wage?: number | null
          updated_at?: string | null
          updated_by?: number | null
          wage_category_id?: number | null
        }
        Relationships: []
      }
      c3_work_duration_details: {
        Row: {
          company_id: number | null
          created_at: string | null
          created_by: number | null
          designation: string | null
          employee_id: number | null
          end_date: string | null
          id: number
          is_active: boolean | null
          is_deleted: boolean | null
          legacy_id: number | null
          pay_period: string | null
          registration_number: string | null
          social_security_number: string | null
          start_date: string | null
          updated_at: string | null
          updated_by: number | null
          wage: number | null
        }
        Insert: {
          company_id?: number | null
          created_at?: string | null
          created_by?: number | null
          designation?: string | null
          employee_id?: number | null
          end_date?: string | null
          id?: number
          is_active?: boolean | null
          is_deleted?: boolean | null
          legacy_id?: number | null
          pay_period?: string | null
          registration_number?: string | null
          social_security_number?: string | null
          start_date?: string | null
          updated_at?: string | null
          updated_by?: number | null
          wage?: number | null
        }
        Update: {
          company_id?: number | null
          created_at?: string | null
          created_by?: number | null
          designation?: string | null
          employee_id?: number | null
          end_date?: string | null
          id?: number
          is_active?: boolean | null
          is_deleted?: boolean | null
          legacy_id?: number | null
          pay_period?: string | null
          registration_number?: string | null
          social_security_number?: string | null
          start_date?: string | null
          updated_at?: string | null
          updated_by?: number | null
          wage?: number | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string | null
          created_by: number | null
          from_module: string
          html_body: string
          id: number
          is_active: boolean
          is_deleted: boolean | null
          subject: string
          template_key: string
          template_name: string
          text_body: string | null
          updated_at: string | null
          updated_by: number | null
          variables: Json | null
        }
        Insert: {
          created_at?: string | null
          created_by?: number | null
          from_module?: string
          html_body: string
          id?: number
          is_active?: boolean
          is_deleted?: boolean | null
          subject: string
          template_key: string
          template_name: string
          text_body?: string | null
          updated_at?: string | null
          updated_by?: number | null
          variables?: Json | null
        }
        Update: {
          created_at?: string | null
          created_by?: number | null
          from_module?: string
          html_body?: string
          id?: number
          is_active?: boolean
          is_deleted?: boolean | null
          subject?: string
          template_key?: string
          template_name?: string
          text_body?: string | null
          updated_at?: string | null
          updated_by?: number | null
          variables?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      get_user_company_id: { Args: { user_auth_id: string }; Returns: number }
      get_user_role_id: { Args: { user_auth_id: string }; Returns: number }
      get_user_self_employed_id: {
        Args: { user_auth_id: string }
        Returns: number
      }
      is_admin: { Args: { user_auth_id: string }; Returns: boolean }
      lookup_email_for_login: {
        Args: { login_identifier: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
