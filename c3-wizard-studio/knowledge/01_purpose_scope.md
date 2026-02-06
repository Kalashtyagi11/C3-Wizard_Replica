# 1. Purpose & Scope

**Document Version**: 1.0
**Last Updated**: January 22, 2026
**Purpose**: Define the high-level objectives, boundaries, and goals of the C3 Wizard system.

---

## 1.1 Executive Summary

The **C3 Wizard** is a specialized web application designed for the **St. Kitts & Nevis Social Security Board (SSB)**. Its primary purpose is to facilitate the accurate calculation, reporting, and payment of social security contributions by Employers and Self-Employed individuals.

The system replaces manual paper-based processes and legacy desktop applications with a modern, secure, and accessible web platform.

---

## 1.2 Core Objectives

1.  **Accuracy**: Ensure 100% compliance with St. Kitts & Nevis Social Security contribution formulas, including Levy and Severance Pay.
2.  **Efficiency**: Reduce the time required to prepare and submit C3 forms (Contribution Certificates).
3.  **Compliance**: Enforce business rules regarding wage caps, age exemptions, and submission deadlines.
4.  **Integration**: Seamlessly integrate with the SSB's backend system (**BIMA**) for data validation and direct submission.
5.  **Accessibility**: Provide a responsive, user-friendly interface for stakeholders (Admins, Employers, Self-Employed).

---

## 1.3 Scope of Work

### In-Scope Features
*   **User Management**: Registration, Authentication, MFA, Role-based Access Control (Admin, Employer, Self-Employed).
*   **Employee Management**: CRUD operations, Import from BIMA.
*   **C3 Form Processing**:
    *   Weekly/Monthly wage entry.
    *   Automatic calculation of SS, Levy, EI, and Severance.
    *   Handling of Bonuses and Holiday Pay.
    *   Draft saving and validation.
*   **Payment Processing**:
    *   Online payments via CyberSource and PayPal.
    *   Offline payment recording (Check, Cash).
    *   Receipt generation (PDF).
*   **Reporting**: Historical view of submissions and payments.
*   **Administration**: System configuration, User oversight.

### Out-of-Scope (Phase 1)
*   **Payroll Processing**: The system is *not* a full payroll system (does not handle income tax, net pay, etc., only Social Security contributions).
*   **Mobile App**: Native mobile applications (iOS/Android) are out of scope; the web app must be responsive.
*   **Multi-language**: The system is English-only.

---

## 1.4 Target Audience

1.  **Employers**: Companies operating in St. Kitts & Nevis required to remit social security contributions for their employees.
2.  **Self-Employed Individuals**: Independent contractors or business owners paying their own contributions.
3.  **System Administrators (SSB Staff)**: Personnel responsible for managing the system, assisting users, and reconciling payments.

---

## 1.5 System Boundaries

The system interacts with the following external entities:
*   **Users**: via Web Browser.
*   **BIMA API**: For employee verification and data submission.
*   **Payment Gateways**: CyberSource and PayPal for transaction processing.
*   **SendGrid**: For transactional email notifications.

---

**Document Status**: Active
