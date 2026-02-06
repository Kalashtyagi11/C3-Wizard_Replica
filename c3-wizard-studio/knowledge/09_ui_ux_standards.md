# 9. UI/UX Standards  

## Design System Overview

C3 Wizard uses a **clean, modern design system** with a primary brand color of **#16A34A** (green) with a professional, accessible interface optimized for desktop, tablet, and mobile devices.

---

## 🚨 MANDATORY BRAND COLOR RULE (NO EXCEPTIONS)

> **The ONLY allowed brand/theme color is: #16A34A**
>
> This applies to:
> - Application UI (buttons, headers, accents)
> - Email templates (headers, CTA buttons, highlights)
> - PDF exports and receipts

**Design enhancements are allowed; theme color changes are NOT permitted.**

---

## Color Palette

### Primary Colors
```css
/* Main brand color - C3 Wizard Green #16A34A */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #16A34A;  /* PRIMARY - Brand Green */
--primary-600: #15803D;  /* PRIMARY HOVER */
--primary-700: #166534;
--primary-800: #14532D;
--primary-900: #0F3D22;
```

### Secondary Colors
```css
/* Accent color - Complementary Blue */
--secondary-500: #6366f1;
--secondary-600: #4f46e5;

/* Success */
--success-500: #10b981;
--success-600: #059669;

/* Warning */
--warning-500: #f59e0b;
--warning-600: #d97706;

/* Error */
--error-500: #ef4444;
--error-600: #dc2626;

/* Info */
--info-500: #3b82f6;
--info-600: #2563eb;
```

### Neutral Colors
```css
/* Background */
--bg-primary: #ffffff;
--bg-secondary: #f9fafb;
--bg-accent: #eff6ff;  /* Light blue tint */

/* Text */
--text-primary: #1f2937;    /* Dark gray */
--text-secondary: #6b7280;  /* Medium gray */
--text-muted: #9ca3af;      /* Light gray */
--text-on-primary: #ffffff; /* White text on primary color */

/* Borders */
--border-light: #e5e7eb;
--border-default: #d1d5db;
--border-accent: #bfdbfe;  /* Light blue border */
```

---

## Typography

### Font Families
```css
/* Primary font - Clean, modern sans-serif */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;

/* Monospace for numbers and codes */
--font-mono: 'Roboto Mono', 'Courier New', monospace;
```

### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Typography Scale
```css
/* Page titles */
h1 { 
  font-size: var(--text-3xl); 
  font-weight: var(--font-bold); 
  color: var(--text-primary);
}

/* Section headings */
h2 { 
  font-size: var(--text-2xl); 
  font-weight: var(--font-semibold); 
  color: var(--text-primary);
}

/* Card titles */
h3 { 
  font-size: var(--text-xl); 
  font-weight: var(--font-semibold); 
  color: var(--text-primary);
}

/* Body text */
p { 
  font-size: var(--text-base); 
  font-weight: var(--font-normal); 
  color: var(--text-secondary);
  line-height: 1.5;
}
```

---

## Spacing System

Use consistent 4px-based spacing:

```css
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
```

**Usage Guidelines**:
- Card padding: `--spacing-6` (24px)
- Section margins: `--spacing-8` (32px)
- Form field spacing: `--spacing-4` (16px)
- Button padding: `--spacing-3` `--spacing-6` (12px 24px)

---

## Component Library

### Buttons

#### Primary Button
```tsx
<Button variant="primary">
  Submit C3 Form
</Button>
```

**Style**:
```css
.btn-primary {
  background: var(--primary-500);
  color: var(--text-on-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: var(--primary-600);
  border: 2px solid var(--primary-500);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
}

.btn-secondary:hover {
  background: var(--primary-50);
}
```

#### Danger Button
```css
.btn-danger {
  background: var(--error-500);
  color: white;
}

.btn-danger:hover {
  background: var(--error-600);
}
```

---

### Input Fields

#### Text Input
```tsx
<Input 
  label="Employee Name"
  placeholder="Enter full name"
  required
/>
```

**Style**:
```css
.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-default);
  border-radius: 0.5rem;
  font-size: var(--text-base);
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.input-field.error {
  border-color: var(--error-500);
}
```

#### Input with Label
```tsx
<div className="form-group">
  <label className="form-label">
    Social Security Number <span className="required">*</span>
  </label>
  <input className="input-field" type="text" />
</div>
```

**Style**:
```css
.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
}

.required {
  color: var(--error-500);
}
```

#### Currency Input
```tsx
<CurrencyInput
  label="Wages Week 1"
  prefix="EC$ "
  value={wages}
  onChange={setWages}
/>
```

**Display**: EC$ 1,234.56 (formatted with thousand separators)

---

### Cards

#### Standard Card
```tsx
<Card>
  <CardHeader>
    <h3>Employee Summary</h3>
  </CardHeader>
  <CardContent>
    <p>Content here</p>
  </CardContent>
</Card>
```

**Style**:
```css
.card {
  background: var(--bg-primary);
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-light);
}

.card-content {
  padding: 1.5rem;
}
```

#### Stat Card (Dashboard)
```tsx
<StatCard
  label="Total Contributions"
  value="EC$ 45,230.00"
  trend="+12.5%"
  trendDirection="up"
  icon={<TrendingUpIcon />}
/>
```

**Style**:
```css
.stat-card {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.stat-value {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  font-family: var(--font-mono);
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--text-sm);
}
```

---

### Data Tables

```tsx
<DataTable
  columns={columns}
  data={employees}
  pagination
  sortable
  searchable
/>
```

**Style**:
```css
.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.data-table thead {
  background: var(--bg-accent);
}

.data-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 2px solid var(--border-accent);
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-light);
}

.data-table tbody tr:hover {
  background: var(--bg-secondary);
}
```

---

### Forms

#### Multi-Step Form (C3 Generation)
```tsx
<MultiStepForm steps={['Employee Selection', 'Wage Entry', 'Review', 'Submit']}>
  <Step1 />
  <Step2 />
  <Step3 />
  <Step4 />
</MultiStepForm>
```

**Progress Indicator**:
```css
.step-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.step {
  flex: 1;
  text-align: center;
  position: relative;
}

.step.active .step-number {
  background: var(--primary-500);
  color: white;
}

.step.completed .step-number {
  background: var(--success-500);
  color: white;
}

.step-number {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.step-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.step.active .step-label {
  color: var(--primary-600);
  font-weight: 600;
}
```

---

### Navigation

#### Top Navbar
```tsx
<Navbar>
  <Logo />
  <NavLinks />
  <UserMenu />
</Navbar>
```

**Style** (Inspired by SecureServe):
```css
.navbar {
  background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  font-size: var(--text-xl);
  font-weight: 700;
}

.navbar-links a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background 0.2s;
}

.navbar-links a:hover {
  background: rgba(255, 255, 255, 0.2);
}

.navbar-links a.active {
  background: rgba(255, 255, 255, 0.25);
  font-weight: 600;
}
```

#### Sidebar (Dashboard)
```css
.sidebar {
  width: 16rem;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-light);
  height: 100vh;
  position: fixed;
  padding: 1rem;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s;
}

.sidebar-item:hover {
  background: var(--bg-accent);
  color: var(--primary-600);
}

.sidebar-item.active {
  background: var(--primary-500);
  color: white;
font-weight: 600;
}
```

---

## Validation & Feedback

### Inline Validation
```tsx
<Input 
  error={errors.ssn}
  helperText={errors.ssn?.message}
/>
```

**Style**:
```css
.input-error {
  color: var(--error-500);
  font-size: var(--text-sm);
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.input-error::before {
  content: '⚠';
}
```

### Toast Notifications
```tsx
toast.success('C3 form submitted successfully!');
toast.error('Payment failed. Please try again.');
toast.info('Changes saved as draft.');
```

**Style**:
```css
.toast {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 300px;
}

.toast.success {
  border-left: 4px solid var(--success-500);
}

.toast.error {
  border-left: 4px solid var(--error-500);
}

.toast.info {
  border-left: 4px solid var(--info-500);
}
```

---

## Responsive Design

### Breakpoints
```css
/* Mobile */
@media (max-width: 640px) { ... }  /* sm */

/* Tablet */
@media (max-width: 768px) { ... }  /* md */

/* Desktop */
@media (max-width: 1024px) { ... } /* lg */

/* Wide Desktop */
@media (max-width: 1280px) { ... } /* xl */
```

### Mobile-First Approach
- Stack cards vertically on mobile
- Hide sidebar, use hamburger menu
- Simplify data tables (show key columns only, allow row expansion)
- Larger touch targets (min 44px × 44px)

---

## Accessibility

### WCAG 2.1 AA Compliance

#### Color Contrast
- Text on primary (#10b981): Use white text (contrast ratio > 4.5:1)
- Text on white background: Use `--text-primary` (#1f2937) (contrast ratio > 7:1)

#### Focus States
```css
*:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

#### ARIA Labels
```tsx
<button aria-label="Submit C3 Form">
  <SendIcon />
</button>

<input aria-describedby="ssn-help" />
<span id="ssn-help">Format: XXX-XX-XXXX</span>
```

#### Keyboard Navigation
- All interactive elements reachable via Tab
- Modal dialogs trap focus
- Escape key closes modals

---

## Animation & Transitions

### Micro-Interactions
```css
/* Smooth transitions */
.transition {
  transition: all 0.2s ease-in-out;
}

/* Hover lift effect */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Loading spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

### Page Transitions
- Fade in: 200ms
- Slide in (modals): 300ms with ease-out
- No excessive animation (keep it professional)

---

## Icon System

Use **Lucide React** icons:

```tsx
import { User, FileText, CreditCard, Settings, LogOut } from 'lucide-react';

<FileText className="icon" size={20} />
```

**Icon Sizing**:
- Small: 16px (navigation items)
- Medium: 20px (buttons, form labels)
- Large: 24px (page headers)
- X-Large: 32px (empty states)

---

## Loading States

### Skeleton Loaders
```tsx
<Skeleton className="h-8 w-48" />  // For text
<Skeleton className="h-48 w-full" /> // For cards
```

### Spinner
```tsx
<Spinner size="lg" />
```

---

## Error States

### Empty State
```tsx
<EmptyState
  icon={<InboxIcon />}
  title="No employees found"
  description="Add your first employee to get started"
  action={<Button>Add Employee</Button>}
/>
```

### 404 Page
```tsx
<ErrorPage
  code="404"
  title="Page Not Found"
  message="The page you're looking for doesn't exist."
  action={<Button>Back to Dashboard</Button>}
/>
```

---

## Design Principles

### 1. Clarity Over Cleverness
- Use clear labels, not jargon
- Minimize cognitive load
- One primary action per screen

### 2. Consistency
- Same patterns for similar actions
- Consistent spacing and alignment
- Predictable navigation

### 3. Feedback
- Loading states for async actions
- Success/error messages for all actions
- Disable buttons during processing (prevent double-clicks)

### 4. Forgiveness
- Confirmation dialogs for destructive actions
- Undo options where possible
- Auto-save drafts

---

**Next**: See [13_api_contracts.md](13_api_contracts.md) for API endpoint specifications.
