# Gestia — Platform Documentation & Developer Guide

> **Gestia** is a modern, AI-powered SaaS rental management (*gestion locative*) platform tailored specifically for independent landlords managing portfolios of 2 to 20 units. It replaces spreadsheets and manual tasks with automated rent collection, intelligent lease processing, tenant portals, maintenance ticketing, and AI-driven financial reporting.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Installation & Setup](#5-installation--setup)
6. [Usage Guide](#6-usage-guide)
7. [Detailed Features & Capabilities](#7-detailed-features--capabilities)
8. [API Documentation](#8-api-documentation)
9. [Database & Schema Design](#9-database--schema-design)
10. [Authentication & Security](#10-authentication--security)
11. [Configuration & Environment Variables](#11-configuration--environment-variables)
12. [Automation Workflows (n8n)](#12-automation-workflows-n8n)
13. [Development Guide](#13-development-guide)
14. [Deployment](#14-deployment)
15. [Troubleshooting & Known Limitations](#15-troubleshooting--known-limitations)
16. [Dependencies & Integrations](#16-dependencies--integrations)
17. [Future Improvements & Technical Debt](#17-future-improvements--technical-debt)
18. [Complete Project Flow](#18-complete-project-flow)
19. [Quick Start](#19-quick-start)

---

## 1. Project Overview

### What is Gestia?
Gestia simplifies property management for independent real estate owners (*propriétaires indépendants*). Instead of relying on expensive real estate agencies or fragmented spreadsheets, landlords get a centralized dashboard to track properties, units, tenants, leases, payments, documents, and maintenance requests.

### Core Objectives
* **Eliminate Rent Tracking Overhead**: Automate payment due dates, late reminders, and receipt generation.
* **Streamline Tenant Communication**: Provide tenants with a dedicated, magic-token-based Tenant Portal for accessing receipts and filing maintenance tickets.
* **Harness AI for Operations**: Automate lease data extraction (OpenAI GPT-4o-mini) and generate monthly financial summaries.
* **Tiered Monetization**: Enable SaaS subscription tiers (*Starter*, *Pro*, *Investor*) via Stripe Checkout and webhooks.

### Key Problems Solved
| Problem | Gestia Solution |
| :--- | :--- |
| Manual tracking of monthly rent payments | Automated payment statuses + n8n cron reminders via Resend & Twilio |
| Lost baux (lease agreements) & manual data entry | Digital Document Vault + AI-assisted PDF extraction using OpenAI |
| Friction in tenant defect reporting | Token-secured Tenant Portal for submitting ticket photos & descriptions |
| Lack of portfolio financial clarity | Automated monthly AI analytical summaries and metrics breakdown |

---

## 2. System Architecture

Gestia is built as a hybrid full-stack application using **Next.js 14 App Router**, **Supabase** (PostgreSQL, Auth, Storage, Row-Level Security), **OpenAI GPT-4o-mini**, **Stripe**, and **n8n Automation Engine**.

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT LAYER                                      |
|                                                                                   |
|   +--------------------------+                      +-------------------------+   |
|   |   Landlord Dashboard     |                      |   Public Tenant Portal  |   |
|   |  (/dashboard/* Protected)|                      |   (/portal/[token] Open)|   |
|   +------------+-------------+                      +------------+------------+   |
+----------------|-------------------------------------------------|----------------+
                 |                                                 |
                 v                                                 v
+-----------------------------------------------------------------------------------+
|                            NEXT.JS 14 APP ROUTER LAYER                            |
|                                                                                   |
|  +------------------------+  +------------------------+  +---------------------+  |
|  | Middleware Guard       |  | App Server Components  |  | API Routes          |  |
|  | (updateSession)        |  | (SSR & Client views)   |  | (/api/ai, /webhooks)|  |
|  +-----------+------------+  +-----------+------------+  +----------+----------+  |
+--------------|---------------------------|--------------------------|-------------+
               |                           |                          |
               v                           v                          v
+-----------------------------------------------------------------------------------+
|                            EXTERNAL SERVICES & BACKEND                            |
|                                                                                   |
|  +-------------------------+  +-----------------------+  +---------------------+  |
|  | Supabase                |  | OpenAI API            |  | Stripe              |  |
|  | (Postgres, RLS, Storage)|  | (GPT-4o-mini)         |  | (Billing Webhooks)  |  |
|  +------------+------------+  +-----------------------+  +---------------------+  |
|               ^                                                                   |
|               |                                                                   |
|  +------------+----------------------------------------------------------------+  |
|  | n8n Automation Engine (Cron-triggered Email/SMS Workflows via Resend/Twilio) |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

### Data Flow Overview

1. **Authentication & Session**: Next.js `middleware.ts` intercept requests to `/dashboard/*` routes. It uses `@supabase/ssr` to validate user sessions and redirect unauthenticated users to `/login`. Logged-in users visiting `/login` or `/signup` are redirected to `/dashboard`.
2. **Landlord Workspace**: Landlords create Properties, Units, Tenants, and Leases. Data is persisted in Supabase with PostgreSQL Row-Level Security (RLS) ensuring strict multi-tenant isolation.
3. **Tenant Portal Access**: Landlords invite tenants, each assigned a unique `portal_token` (UUID). Tenants access `/portal/[token]` without requiring password authentication.
4. **AI Services**:
   * **Lease Extraction (`/api/ai/extract-lease`)**: Analyzes lease PDFs and outputs structured JSON containing start date, end date, rent amount, and tenant name.
   * **Report Generation (`/api/ai/generate-report`)**: Generates monthly landlord performance text based on revenues, occupancy, expenses, and open maintenance tickets.
5. **n8n Automation Engine**: Scheduled crons connect to Supabase DB directly to query upcoming/overdue payments and lease expirations, sending email notifications via Resend and SMS via Twilio.

---

## 3. Technology Stack

| Category | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js | `14.2.3` | App Router full-stack web framework |
| **Language** | TypeScript | `^5` | Strict static typing across client & server |
| **UI Library** | React | `^18` | Core component tree |
| **Styling** | Tailwind CSS | `^3.4.1` | Utility-first styling engine |
| **UI Design System** | shadcn/ui + Radix UI | `--` | Accessible primitives (`@radix-ui/react-slot`, `tailwindcss-animate`) |
| **Icons** | Lucide React | `^0.368.0` | UI vector iconography |
| **Database** | Supabase PostgreSQL | `--` | Relational DB with Row-Level Security (RLS) & Triggers |
| **Auth** | Supabase Auth | `--` | Magic link authentication and session tokens |
| **Storage** | Supabase Storage | `--` | Cloud storage buckets for baux, receipts, and ticket photos |
| **SSR Supabase** | `@supabase/ssr` | `^0.3.0` | Server-side cookie management & auth middleware |
| **Client Supabase** | `@supabase/supabase-js` | `^2.42.0` | Client-side database and storage querying |
| **AI Integration** | OpenAI API (`gpt-4o-mini`) | `--` | Automated lease PDF data parsing & monthly report summaries |
| **Payments** | Stripe | `--` | Subscription billing & checkout webhooks |
| **Automation** | n8n | `--` | Self-hosted or cloud automation workflows |
| **Messaging** | Resend / Twilio | `--` | Automated notification channels (Email / SMS) |

---

## 4. Project Structure

```
Gestia/
├── app/                        # Next.js 14 App Router Directory
│   ├── (auth)/                 # Authentication Route Group
│   │   ├── login/
│   │   │   └── page.tsx        # Login page (Magic Link form)
│   │   └── signup/
│   │       └── page.tsx        # Signup page
│   ├── (dashboard)/            # Protected Landlord Dashboard Group
│   │   ├── documents/
│   │   │   └── page.tsx        # Vault view for baux, invoices, insurance
│   │   ├── leases/
│   │   │   └── new/
│   │   │       └── page.tsx    # Create lease form with file upload
│   │   ├── payments/
│   │   │   └── page.tsx        # Rent collection tracking & status updates
│   │   ├── properties/
│   │   │   ├── page.tsx        # Property list view
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx    # Property details & units list
│   │   │   └── new/
│   │   │       └── page.tsx    # Add new property form
│   │   ├── reports/
│   │   │   └── page.tsx        # AI monthly financial performance reports
│   │   ├── settings/
│   │   │   └── page.tsx        # Profile info & Stripe subscription plans
│   │   ├── tenants/
│   │   │   ├── page.tsx        # Tenant directory
│   │   │   └── new/
│   │   │       └── page.tsx    # Add tenant form
│   │   ├── tickets/
│   │   │   └── page.tsx        # Maintenance ticket management
│   │   ├── units/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx    # Unit details (Tenant, Lease, Tickets)
│   │   │   └── new/
│   │   │       └── page.tsx    # Add unit to a property
│   │   ├── layout.tsx          # Dashboard layout (Sidebar + Header)
│   │   └── page.tsx            # Main overview dashboard metrics
│   ├── api/                    # Serverless API Endpoints
│   │   ├── ai/
│   │   │   ├── extract-lease/
│   │   │   │   └── route.ts    # POST: GPT-4o-mini lease PDF parsing
│   │   │   └── generate-report/
│   │   │       └── route.ts    # POST: GPT-4o-mini monthly report synthesis
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts    # POST: Stripe checkout & subscription hook
│   ├── portal/
│   │   └── [token]/            # Public Tenant Portal
│   │       ├── tickets/
│   │       │   └── new/
│   │       │       └── page.tsx # Submit new maintenance issue
│   │       ├── layout.tsx      # Tenant portal header/footer layout
│   │       └── page.tsx        # Tenant portal dashboard (Rent, Receipts, Tickets)
│   ├── globals.css             # Tailwind imports & custom theme tokens
│   ├── layout.tsx              # Root app layout
│   └── page.tsx                # Marketing landing homepage
├── lib/                        # Shared utility libraries
│   └── utils.ts                # Class merging utility (`cn`)
├── middleware.ts               # Next.js global middleware entry point
├── n8n-workflows/              # Importable n8n Automation Workflows
│   ├── workflow_1_rappel_j2.json          # Payment reminder (J-2)
│   ├── workflow_2_relance_j5.json          # Late payment warning (J+5)
│   ├── workflow_3_alerte_critique_j10.json # Critical late payment alert (J+10)
│   ├── workflow_4_renouvellement.json      # Lease renewal notices (30/60/90 days)
│   └── workflow_5_rapport_mensuel.json     # 1st of month report trigger
├── utils/                      # Supabase Client initializers
│   └── supabase/
│       ├── client.ts           # Browser client (`createBrowserClient`)
│       ├── middleware.ts       # Server middleware session handler
│       └── server.ts           # Server component client (`createServerClient`)
├── supabase/
│   └── schema.sql              # PostgreSQL DDL script with tables & RLS
├── .env.example                # Template for environment variables
├── components.json             # shadcn/ui configuration
├── next.config.js              # Next.js build configuration
├── package.json                # Dependencies & npm scripts
├── tailwind.config.ts          # Tailwind styling design tokens
└── tsconfig.json               # TypeScript compiler config
```

---

## 5. Installation & Setup

### Prerequisites
* **Node.js**: v20.0.0 or higher
* **npm**: v9.0.0 or higher
* **Supabase Project**: A valid project URL & anon key (from [Supabase Console](https://supabase.com))
* **OpenAI API Key**: For AI extraction & summary features (optional for basic UI testing)

### Step 1: Clone the Repository & Install Dependencies
```bash
git clone <repository-url>
cd Gestia
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in the required values in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

OPENAI_API_KEY="sk-..."

RESEND_API_KEY="re_..."

TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+1234567890"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 3: Initialize Database Schema (Supabase)
1. Log into your **Supabase Dashboard**.
2. Navigate to the **SQL Editor**.
3. Open `supabase/schema.sql` from this repository, paste its contents into the editor, and click **Run**.
4. Create the following **Storage Buckets** in Supabase Storage if you intend to upload files:
   * `leases` (Public / RLS policy configured)
   * `documents` (Private / Landlord accessible)
   * `maintenance` (Public / Ticket photos)

### Step 4: Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Usage Guide

### For Landlords
1. **Accessing Dashboard**: Navigate to `/login` and submit your email. For production, Supabase sends a Magic Link. In development mode with mock credentials, navigate directly to `/dashboard`.
2. **Creating Properties & Units**:
   * Go to **Propriétés & Unités** (`/dashboard/properties`).
   * Click **Ajouter une propriété** (`/dashboard/properties/new`). Fill in name, address, postal code, and city.
   * Inside the property view (`/dashboard/properties/[id]`), click **Ajouter une unité** to add apartments (rent amount, area m², floor).
3. **Registering Tenants**:
   * Navigate to **Locataires** (`/dashboard/tenants/new`). Fill in the tenant's full name, email, and phone number.
4. **Creating a Lease**:
   * Go to a Unit's detail page (`/dashboard/units/[id]`) and click **Créer un bail** (`/dashboard/leases/new?unit_id=...`).
   * Select the tenant, start/end dates, monthly rent, deposit amount, and upload the signed PDF.
5. **Managing Payments**:
   * Go to **Loyers & Paiements** (`/dashboard/payments`). Change status drop-down options between `Pending`, `Paid`, `Late`, and `Partial`.
6. **Handling Maintenance**:
   * Go to **Maintenance** (`/dashboard/tickets`). View tickets submitted by tenants and update their status (`open`, `in_progress`, `resolved`, `closed`).
7. **Viewing AI Reports**:
   * Go to **Rapports IA** (`/dashboard/reports`). Click **Générer manuellement** to trigger an automated synthesis of monthly cash flow and occupancy metrics.

### For Tenants (Tenant Portal)
1. **Accessing the Portal**: Tenants receive a direct link formatted as `http://localhost:3000/portal/[portal_token]`.
2. **Dashboard Overview**: View current lease details, monthly rent due, and rent payment history.
3. **Rent Receipts**: Download rent receipt PDFs directly from the table.
4. **Reporting Defects**: Click **Signaler un problème** (`/portal/[token]/tickets/new`), select urgency, describe the problem, optionally upload a photo, and submit directly to the landlord.

---

## 7. Detailed Features & Capabilities

```
+---------------------------------------------------------------------------------------+
|                                GESTIA CORE MODULES                                    |
+-------------------+-------------------+------------------------+----------------------+
| PROPERTY SYSTEM   | TENANT PORTAL     | AI INTEGRATION         | AUTOMATIONS (n8n)    |
| - Properties CRUD | - Passwordless    | - PDF Lease Parsing    | - Rent Reminders     |
| - Units CRUD      | - Receipt Downloads| - Monthly Summaries   | - Late Alerts        |
| - Occupancy Status| - Maintenance Logs| - Cashflow Insights    | - Lease Expiration   |
+-------------------+-------------------+------------------------+----------------------+
```

### 1. Multi-Unit Property Hierarchy
* Properties represent buildings (*immeubles*).
* Units represent individual flats/apartments tied to a parent property with calculated occupancy stats.

### 2. Tenant Management & Token-Based Portal
* Each tenant record possesses an automatically generated unique `portal_token` (UUID).
* Bypasses complex passwords for tenants while maintaining isolation per lease.

### 3. Smart Document Vault & AI Lease Processing
* Storage for Baux, Insurances, Invoices, and Inspection Reports (*états des lieux*).
* Integration with OpenAI `gpt-4o-mini` extracts metadata (`start_date`, `end_date`, `monthly_rent`, `tenant_name`) directly from PDF text.

### 4. Rent Collection & Automated Reminders
* Status tracking (`pending`, `paid`, `late`, `partial`).
* Database columns `reminder_1_sent`, `reminder_2_sent`, `reminder_3_sent` prevent duplicate reminder notifications.

### 5. Maintenance Ticket Management
* Multi-priority ticket system (`low`, `normal`, `high`, `urgent`).
* Direct tenant upload of defect photos stored in Supabase Storage buckets.

### 6. Stripe Monetization Engine
* Tiers: **Starter** ($29/mo), **Pro** ($59/mo), **Investor** ($99/mo).
* Automated syncing via Stripe Webhook to update `profiles.plan`.

---

## 8. API Documentation

### 1. Lease Extraction API
Extracts structured JSON metadata from lease PDF files using OpenAI GPT-4o-mini.

* **Endpoint**: `POST /api/ai/extract-lease`
* **Content-Type**: `multipart/form-data`
* **Request Body**:
  * `file`: `File` (PDF binary)

* **Response Format (200 OK)**:
```json
{
  "success": true,
  "data": {
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "monthly_rent": 850,
    "tenant_name": "Jean Dupont"
  }
}
```

* **Error Response (400 / 500)**:
```json
{
  "error": "No file provided"
}
```

---

### 2. Monthly AI Report Generator API
Aggregates landlord performance data and produces an executive narrative summary.

* **Endpoint**: `POST /api/ai/generate-report`
* **Content-Type**: `application/json`
* **Request Body**:
```json
{
  "owner_id": "uuid-of-landlord-profile"
}
```

* **Response Format (200 OK)**:
```json
{
  "success": true,
  "summary": "Le mois de Novembre 2024 a été très positif...",
  "metrics": {
    "period": "Novembre 2024",
    "total_revenue": 4500,
    "total_expenses": 320,
    "occupancy_rate": 95,
    "resolved_tickets": 2,
    "late_payments": 1
  }
}
```

---

### 3. Stripe Webhook API
Listens to subscription events from Stripe and updates profile access tiers in Supabase.

* **Endpoint**: `POST /api/webhooks/stripe`
* **Headers**: `stripe-signature: <signature>`
* **Handled Events**:
  * `checkout.session.completed`: Updates `profiles.plan`, `stripe_customer_id`, and `stripe_subscription_id`.
  * `customer.subscription.deleted`: Reverts `profiles.plan` back to `starter`.

* **Response Format (200 OK)**:
```json
{ "received": true }
```

---

## 9. Database & Schema Design

Gestia uses PostgreSQL on Supabase. Row-Level Security (RLS) is enabled on every table.

```
                   +-------------------+
                   |   auth.users      |
                   +---------+---------+
                             | 1:1
                             v
                   +-------------------+
                   |     profiles      |
                   +---------+---------+
                             | 1:N
                             v
                   +-------------------+
                   |    properties     |
                   +---------+---------+
                             | 1:N
                             v
                   +-------------------+
                   |       units       |
                   +----+---------+----+
                        |         |
                    1:N |         | 1:N
                        v         v
         +------------------+  +------------------------+
         |     tenants      |  |  maintenance_tickets   |
         +--------+---------+  +------------------------+
                  |
              1:N |
                  v
         +------------------+
         |      leases      |
         +--------+---------+
                  |
              1:N |
                  v
         +------------------+
         |     payments     |
         +------------------+
```

### Table Definitions & RLS Summary

#### 1. `profiles`
Extends `auth.users`. Automatically created via PostgreSQL trigger `on_auth_user_created`.
* **Fields**: `id` (uuid, PK), `full_name`, `email`, `phone`, `plan` (`starter` | `pro` | `investor`), `stripe_customer_id`, `stripe_subscription_id`, `created_at`.
* **RLS**: Owners can view and update only their own profile (`auth.uid() = id`).

#### 2. `properties`
Buildings owned by landlords.
* **Fields**: `id` (uuid, PK), `owner_id` (FK -> `profiles.id`), `name`, `address`, `city`, `postal_code`, `country`, `created_at`.
* **RLS**: Owners can perform all operations where `owner_id = auth.uid()`.

#### 3. `units`
Apartments/lots within a property.
* **Fields**: `id` (uuid, PK), `property_id` (FK -> `properties.id`), `unit_number`, `floor`, `bedrooms`, `bathrooms`, `area_sqft`, `monthly_rent`, `status` (`vacant` | `occupied` | `maintenance`), `created_at`.
* **RLS**: Access verified via parent `properties.owner_id = auth.uid()`.

#### 4. `tenants`
Renters occupying units.
* **Fields**: `id` (uuid, PK), `unit_id` (FK -> `units.id`), `full_name`, `email`, `phone`, `portal_token` (uuid, unique), `created_at`.
* **RLS**: Owners manage via parent property relationship; public read permitted for token matching.

#### 5. `leases`
Rental contracts linking units and tenants.
* **Fields**: `id` (uuid, PK), `unit_id` (FK -> `units.id`), `tenant_id` (FK -> `tenants.id`), `start_date`, `end_date`, `monthly_rent`, `deposit`, `status` (`active` | `expired` | `terminated`), `pdf_url`, `ai_extracted` (jsonb), `renewal_sent_at`, `created_at`.

#### 6. `payments`
Monthly rent invoices.
* **Fields**: `id` (uuid, PK), `lease_id` (FK -> `leases.id`), `due_date`, `paid_date`, `amount`, `status` (`pending` | `paid` | `late` | `partial`), `reminder_1_sent`, `reminder_2_sent`, `reminder_3_sent`, `created_at`.

#### 7. `maintenance_tickets`
Tenant maintenance requests.
* **Fields**: `id` (uuid, PK), `unit_id` (FK -> `units.id`), `tenant_id` (FK -> `tenants.id`), `title`, `description`, `priority` (`low` | `normal` | `high` | `urgent`), `status` (`open` | `in_progress` | `resolved` | `closed`), `photos` (text[]), `assigned_to`, `created_at`.

#### 8. `documents`
Landlord file repository.
* **Fields**: `id` (uuid, PK), `unit_id`, `lease_id`, `owner_id` (FK -> `profiles.id`), `name`, `type` (`lease` | `inspection` | `insurance` | `invoice` | `other`), `file_url`, `file_size`, `created_at`.

#### 9. `monthly_reports`
Generated AI summaries.
* **Fields**: `id` (uuid, PK), `owner_id` (FK -> `profiles.id`), `period`, `total_revenue`, `total_expenses`, `net_income`, `occupancy_rate`, `ai_summary`, `pdf_url`, `created_at`.

---

## 10. Authentication & Security

### Authentication Architecture
* **Landlord Auth**: Powered by Supabase Auth Magic Links. User sessions are synchronized in Next.js Server Components and Middleware via `@supabase/ssr`.
* **Tenant Access Security**: Access to `/portal/[token]` requires a valid 128-bit UUID `portal_token`. Tokens act as secret URLs, preventing brute-force enumeration.

### Route Protection Matrix
| Path Pattern | Access Level | Enforcement Mechanism |
| :--- | :--- | :--- |
| `/` | Public | Unrestricted |
| `/login`, `/signup` | Guest Only | Redirects authenticated users to `/dashboard` |
| `/dashboard/*` | Landlord Only | `middleware.ts` validates session token; redirects unauthenticated to `/login` |
| `/portal/[token]/*` | Tenant (Token) | Validated against database `tenants.portal_token` |
| `/api/ai/*` | Private/Internal | Server-side execution only |
| `/api/webhooks/stripe` | Public/Signed | Validates `stripe-signature` header & uses Supabase admin service key |

### Security Measures & Best Practices
* **Database Isolation**: PostgreSQL RLS policies restrict cross-account data leaks even if an API endpoint query omits explicit `WHERE owner_id` checks.
* **Secret Hygiene**: Zero plain text secrets in client bundles. Public variables are prefixed with `NEXT_PUBLIC_`.
* **File Permissions**: Storage buckets enforce tenant upload-only and owner full-access rules.

---

## 11. Configuration & Environment Variables

| Variable Name | Required | Description | Example / Default |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | Supabase project API Gateway URL | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | Supabase anonymous API key (safe for client) | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | Admin service key (server-only, bypasses RLS for webhooks) | `eyJhbGciOi...` |
| `STRIPE_SECRET_KEY` | Optional | Stripe backend secret key | `sk_test_51...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional | Stripe client key for Checkout UI | `pk_test_51...` |
| `STRIPE_WEBHOOK_SECRET` | Optional | Stripe webhook signature signing secret | `whsec_...` |
| `OPENAI_API_KEY` | **Yes** | OpenAI API key for lease parsing & report generation | `sk-proj-...` |
| `RESEND_API_KEY` | Optional | Resend API key for transactional emails | `re_123456...` |
| `TWILIO_ACCOUNT_SID` | Optional | Twilio account SID for automated SMS | `AC123456789...` |
| `TWILIO_AUTH_TOKEN` | Optional | Twilio authentication token | `9876543210...` |
| `TWILIO_PHONE_NUMBER` | Optional | Twilio sender phone number | `+1234567890` |
| `NEXT_PUBLIC_APP_URL` | **Yes** | Root app URL for links and webhooks | `http://localhost:3000` |

---

## 12. Automation Workflows (n8n)

The `n8n-workflows/` directory contains 5 ready-to-import n8n JSON workflow templates:

```
+-------------------------------------------------------------------------------------------+
|                                N8N AUTOMATION WORKFLOWS                                   |
+------------------------+-----------------------+-------------------+----------------------+
| Workflow 1: J-2        | Workflow 2: J+5       | Workflow 3: J+10  | Workflow 4 & 5       |
| Rent Due Reminder      | Late Rent Warning     | Critical Alert    | - Lease Renewal      |
| (Email + SMS)          | (Tenant + Owner)      | (Owner Alert)     | - Monthly AI Summary |
+------------------------+-----------------------+-------------------+----------------------+
```

1. **`workflow_1_rappel_j2.json` (Payment Reminder J-2)**:
   * **Trigger**: Daily Cron at 08:00 AM.
   * **Action**: Queries `payments` due in 2 days where `reminder_1_sent IS NULL`. Sends Email (Resend) + SMS (Twilio) to tenant. Updates `reminder_1_sent = NOW()`.
2. **`workflow_2_relance_j5.json` (Late Payment Notice J+5)**:
   * **Trigger**: Daily Cron at 09:00 AM.
   * **Action**: Queries overdue payments (>5 days) where status is not `paid`. Sends urgent email to tenant and warning email to landlord. Updates `reminder_2_sent = NOW()`.
3. **`workflow_3_alerte_critique_j10.json` (Critical Late Alert J+10)**:
   * **Trigger**: Daily Cron at 10:00 AM.
   * **Action**: Queries overdue payments (>10 days). Sends high-priority email to landlord recommending formal notice / guarantor contact. Updates `reminder_3_sent = NOW()`.
4. **`workflow_4_renouvellement.json` (Lease Renewal Notice)**:
   * **Trigger**: Daily Cron at 07:00 AM.
   * **Action**: Queries active leases expiring in 90, 60, or 30 days. Notifies landlord to send renewal terms.
5. **`workflow_5_rapport_mensuel.json` (1st of Month AI Report Trigger)**:
   * **Trigger**: Cron on 1st of every month at 06:00 AM.
   * **Action**: Triggers `POST /api/ai/generate-report` for Pro/Investor owners and emails the generated financial summary.

---

## 13. Development Guide

### Coding Standards & Conventions
* **Framework Pattern**: Use Next.js 14 App Router conventions (`page.tsx`, `layout.tsx`, `route.ts`).
* **Component Architecture**: Keep server components default; use `"use client"` only for interactive components with local state or event handlers.
* **Styling**: Use Tailwind CSS utility classes with shadcn design system principles.

### Utility Imports
* Use `@/utils/supabase/client` inside Client Components (`"use client"`).
* Use `@/utils/supabase/server` inside Server Components & Server Actions.
* Combine Tailwind classes with `cn()` from `@/lib/utils`.

### Useful Commands
```bash
# Start development server
npm run dev

# Run TypeScript checking & Next.js linter
npm run lint

# Build production bundle
npm run build

# Start production server
npm run start
```

---

## 14. Deployment

### Deploying to Vercel
1. Push your repository to GitHub / GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Environment Variables defined in Section 11 inside Vercel Project Settings.
4. Click **Deploy**. Vercel will automatically build the Next.js App Router application.

### Setting Up Production Webhooks
* **Stripe Webhooks**: Point Stripe Webhooks to `https://your-domain.com/api/webhooks/stripe` listening to `checkout.session.completed` and `customer.subscription.deleted`.
* **Supabase Production**: Execute `supabase/schema.sql` on your production Supabase database.
* **n8n Engine**: Host n8n via Docker or n8n Cloud, import JSON files from `n8n-workflows/`, and update PostgreSQL database connection credentials to point to your Supabase host (`db.xxx.supabase.co`).

---

## 15. Troubleshooting & Known Limitations

### Common Issues & Fixes

> [!WARNING]
> **Issue**: `Upload Error: Bucket not found` when uploading a PDF or ticket image.
> **Solution**: Ensure you have created the `leases`, `documents`, and `maintenance` storage buckets in your Supabase Dashboard under Storage.

> [!IMPORTANT]
> **Issue**: AI Report generation fails with `OpenAI API Error`.
> **Solution**: Check that `OPENAI_API_KEY` is set in `.env.local` and that your OpenAI account has available credits for `gpt-4o-mini`.

> [!NOTE]
> **Issue**: n8n workflows fail to query Supabase PostgreSQL.
> **Solution**: Enable direct connection in Supabase Database settings and ensure port `5432` or `6543` (connection pooler) is open and accessible from your n8n server.

---

## 16. Dependencies & Integrations

```
+----------------------------------------------------------------------------------+
|                              DEPENDENCY LANDSCAPE                                |
+------------------------+-------------------------+-------------------------------+
| @supabase/ssr          | Next.js (14.2.3)        | lucide-react                  |
| Server-side session &  | Core React framework &  | Vector icons for UI dashboard |
| cookie synchronization | App Router architecture | & tenant portal               |
+------------------------+-------------------------+-------------------------------+
| @supabase/supabase-js  | class-variance-authority| tailwind-merge                |
| Client-side Supabase   | Utility for UI variance | Merges Tailwind class names   |
| queries & storage      | component composition   | safely without conflicts      |
+------------------------+-------------------------+-------------------------------+
```

---

## 17. Future Improvements & Technical Debt

During our deep analysis of the codebase, we identified the following areas for production hardening and feature expansion:

1. **Replace Mock UI Data with Real Supabase Client Calls**:
   * Several dashboard views (e.g., `properties/page.tsx`, `tenants/page.tsx`, `payments/page.tsx`, `reports/page.tsx`, `tickets/page.tsx`) currently contain client-side or server-side stub arrays for demonstration purposes. These should be hooked directly to Supabase table queries.
2. **Complete Server Actions for Forms**:
   * Form handlers in `properties/new`, `units/new`, and `tenants/new` currently console.log submitted data (`"use server"` stubs). Replace these with actual Supabase `insert()` operations.
3. **Integrate Official `stripe` Node SDK**:
   * `/api/webhooks/stripe/route.ts` currently parses raw JSON instead of using `stripe.webhooks.constructEvent` with `STRIPE_WEBHOOK_SECRET`. Importing `stripe` will ensure cryptographic signature verification in production.
4. **PDF Text Parser for Lease AI API**:
   * `/api/ai/extract-lease/route.ts` currently uses mock extracted text. Adding `pdf-parse` or an OCR reader will enable live file-to-text conversion before passing raw text to GPT-4o-mini.
5. **Dynamic Tenant Portal Token Verification**:
   * Enhance `portal/[token]/page.tsx` with a database query verifying that `token` matches a valid row in `tenants.portal_token` before displaying unit details.

---

## 18. Complete Project Flow

Here is the step-by-step end-to-end journey of a landlord using Gestia:

```
[1. Landlord Signs Up] ---> [2. Creates Property & Units] ---> [3. Adds Tenant & Generates Token]
                                                                              |
[6. AI Monthly Report] <--- [5. Rent Collection & Reminders] <--- [4. Uploads Lease PDF]
         |
         v
[7. Tenant files maintenance issue via Portal token] ---> [8. Landlord manages ticket]
```

1. **Onboarding**: Landlord signs up via Magic Link auth (`/signup`). A record is inserted into `auth.users` and automatically triggers profile generation in `public.profiles`.
2. **Property Setup**: Landlord creates property "Le Clos des Vignes" and adds unit "Apt 2" ($800/mo).
3. **Tenant Registration**: Landlord adds tenant "Alice Martin" (`alice@example.com`). Gestia generates a unique `portal_token` for Alice.
4. **Lease Agreement**: Landlord attaches Alice to "Apt 2", uploads the signed lease PDF, and triggers AI extraction (`/api/ai/extract-lease`) to populate lease terms.
5. **Rent Collection**: Monthly payments are automatically tracked in `payments`. If unpaid by J-2 or J+5, n8n sends automatic reminders via Resend and Twilio.
6. **Financial Summary**: On the 1st of the month, n8n calls `/api/ai/generate-report` to generate a financial performance overview powered by GPT-4o-mini.
7. **Maintenance Request**: Alice faces a sink leak, opens her portal URL (`/portal/[token]`), uploads a photo, and submits a ticket. Landlord sees the alert on `/dashboard/tickets` and updates its status to `in_progress`.

---

## 19. Quick Start

Want to get Gestia up and running in **under 3 minutes**? Follow these quick steps:

```bash
# 1. Clone & Install
git clone <repository-url>
cd Gestia
npm install

# 2. Setup Environment Variables
cp .env.example .env.local
# Add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local

# 3. Apply DB Schema
# Copy supabase/schema.sql into your Supabase SQL Editor and execute it.

# 4. Launch Application
npm run dev
```

Navigate to `http://localhost:3000` to start exploring Gestia!
#   G e s t i a  
 #   G e s t i a  
 