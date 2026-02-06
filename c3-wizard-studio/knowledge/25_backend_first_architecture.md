# Backend-First Architecture Guide

**Last Updated**: February 5, 2026  
**Purpose**: Ensure all business logic is server-side for .NET Core migration compatibility

---

## 🏗️ Architecture Overview

```
┌──────────────────────┐
│ FRONTEND (React)     │  ➜ UI/UX only, NO logic
└──────────┬───────────┘
           │ API calls
           ▼
┌──────────────────────┐
│ BACKEND (Edge Funcs) │  ➜ ALL business logic
└──────────┬───────────┘
           │ Queries
           ▼
┌──────────────────────┐
│ DATABASE (Postgres)  │  ➜ Data storage
└──────────────────────┘
```

### Future Migration Path

```
Current:  React → Edge Functions → PostgreSQL
Future:   React → .NET Core API → PostgreSQL
          ↑ (no change)  ↑ (just replace this)
```

---

## ✅ Critical Requirements

### 1. Optimized Schema Only
- Use `c3_*` tables (NOT legacy `MasterEmployee`, etc.)
- Legacy schema for reference only

### 2. Data-Driven Architecture
- **NO hardcoded rates, caps, or thresholds**
- Fetch from `c3_system_rates` and `c3_levy_tiers`

### 3. Backend-First Architecture
- **ALL business logic in Supabase Edge Functions**
- **Frontend is ONLY for UI/UX**
- Designed for easy migration to .NET Core

---

## 📋 What MUST Be Server-Side

| Category | Examples |
|----------|----------|
| Calculations | SS, EI, Levy, PE contributions |
| Validation | Age checks, SSN format, date validation |
| Business Rules | Bonus exemptions, caps, age exemptions |
| Data Transformations | Holiday pay distribution |
| External APIs | BIMA API calls |
| Payments | Payment gateway integration |
| Reports | PDF generation, data exports |

---

## 🚫 What Frontend CANNOT Do

| ❌ Forbidden | ✅ Allowed |
|-------------|-----------|
| Calculate contributions | Display calculated values |
| Enforce business rules | Show validation messages |
| Transform data | Format for display |
| Call external APIs directly | Call backend endpoints |
| Generate reports | Display generated reports |
| Access database directly | Use API responses |

**Frontend responsibilities**:
- Display data from API
- Collect user input
- Call backend APIs
- Show loading/error states
- Client-side validation (UX only, not enforced)

---

## 📊 Example: C3 Calculation Flow

### ❌ WRONG (Logic in Frontend)

```typescript
// Frontend React component - BAD!
function calculateSS(wages: number) {
  const rate = 0.05;  // Hardcoded!
  const cap = 750;    // Hardcoded!
  return Math.min(wages * rate, cap);  // Logic in frontend!
}
```

**Problems**:
- ❌ Hardcoded values
- ❌ Logic in frontend
- ❌ Hard to migrate to .NET

---

### ✅ CORRECT (Logic in Backend)

**Frontend** (`C3WagesGrid.tsx`):
```typescript
// Frontend - Just calls API
async function onWageChange(employeeId: string, wages: number) {
  const { data } = await supabase.functions.invoke('calculate-c3-contributions', {
    body: { employee_id: employeeId, wages, month, year }
  });
  
  // Display results from backend
  setCalculatedValues(data);
}
```

**Backend** (`calculate-c3-contributions` Edge Function):
```typescript
// Backend - Contains ALL logic
Deno.serve(async (req) => {
  const { employee_id, wages, month, year } = await req.json();
  
  // Fetch rates from database (data-driven)
  const { data: rates } = await supabase
    .from('c3_system_rates')
    .select('*')
    .eq('is_active', true);
  
  // Get employee data for age calculation
  const { data: employee } = await supabase
    .from('c3_employees')
    .select('date_of_birth, is_levy_exempt')
    .eq('id', employee_id)
    .single();
  
  // Apply business logic (server-side only)
  const age = calculateAge(employee.date_of_birth);
  const ssRate = getRateByCode(rates, 'SS_EE');
  
  const ssEmployee = age < 16 || age > 62 
    ? 0 
    : Math.min(wages * ssRate.rate_value, ssRate.monthly_cap);
  
  // Return calculated values
  return new Response(JSON.stringify({ 
    ssEmployee, 
    ssEmployer,
    levyEmployee,
    levyEmployer,
    // ... all calculated values
  }));
});
```

---

## 🔄 Edge Function Pattern

### Standard Edge Function Structure

```typescript
// supabase/functions/<function-name>/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Parse request
    const { param1, param2 } = await req.json();
    
    // 2. Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    // 3. Fetch required data from database
    const { data: rates } = await supabase
      .from('c3_system_rates')
      .select('*');
    
    // 4. Apply ALL business logic here
    const result = performCalculations(rates, param1, param2);
    
    // 5. Return results
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
```

---

## 🔄 Migration to .NET Core (Future)

### Phase 1: Current (Supabase Edge Functions)
```
React → supabase.functions.invoke('calculate-c3') → PostgreSQL
```

### Phase 2: Future (.NET Core)

**Replace Edge Function with .NET Controller**:

```csharp
// .NET Core API Controller
[ApiController]
[Route("api/[controller]")]
public class C3CalculationController : ControllerBase
{
    private readonly AppDbContext _db;
    
    [HttpPost("calculate")]
    public async Task<ActionResult> Calculate([FromBody] CalculationRequest req)
    {
        // Fetch rates from database (same logic!)
        var rates = await _db.SystemRates
            .Where(r => r.IsActive)
            .ToListAsync();
        
        // Apply business logic (same as Edge Function!)
        var ssRate = rates.First(r => r.RateCode == "SS_EE");
        var ssEmployee = Math.Min(
            req.Wages * ssRate.RateValue,
            ssRate.MonthlyCap ?? decimal.MaxValue
        );
        
        return Ok(new { ssEmployee, ... });
    }
}
```

**Frontend change is minimal**:
```typescript
// Before (Edge Function)
const { data } = await supabase.functions.invoke('calculate-c3', { body });

// After (.NET Core) - just change the endpoint
const { data } = await fetch('/api/c3calculation/calculate', {
  method: 'POST',
  body: JSON.stringify(body)
}).then(r => r.json());
```

✅ **No frontend business logic changes needed!**

---

## 📁 Required Edge Functions for C3 Module

| Function Name | Purpose |
|---------------|---------|
| `calculate-c3-contributions` | Calculate all contributions for employees |
| `validate-c3-submission` | Validate C3 before BIMA submission |
| `submit-c3-to-bima` | Submit C3 to BIMA API |
| `generate-c3-report` | Generate PDF/printable C3 form |
| `get-ytd-wages` | Calculate year-to-date wages for bonus exemption |
| `distribute-holiday-pay` | Distribute holiday pay across weeks |

---

## ⚠️ Common Mistakes to Avoid

### 1. Hardcoding Rates
```typescript
// ❌ WRONG
const SS_RATE = 0.05;
const SS_CAP = 750;

// ✅ CORRECT
const { data: rates } = await supabase.from('c3_system_rates').select('*');
const ssRate = rates.find(r => r.rate_code === 'SS_EE');
```

### 2. Frontend Calculations
```typescript
// ❌ WRONG - Logic in React component
const total = wages * 0.05 + wages * 0.03;

// ✅ CORRECT - Call backend API
const { data } = await supabase.functions.invoke('calculate-totals', { body: { wages } });
```

### 3. Direct Database Mutations for Complex Operations
```typescript
// ❌ WRONG - Complex logic on frontend
const contribution = calculateAll(employee, wages);
await supabase.from('c3_contribution_details').insert(contribution);

// ✅ CORRECT - Backend handles everything
await supabase.functions.invoke('save-c3-contribution', { 
  body: { employee_id, wages, month, year } 
});
```

---

## 🔗 Related Documentation

- `knowledge/05_contribution_calculations.md` - Calculation formulas
- `knowledge/11_bima_integration.md` - BIMA API integration
- `knowledge/04_database_schema.md` - Database tables
- `PRDs/03_c3_generation.md` - C3 module requirements

---

**Remember**: If you're writing calculation logic in a `.tsx` file, you're doing it wrong. All logic belongs in Edge Functions.
