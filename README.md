# UPS CrossBorder Ready: AI-Powered Customs Documentation Analyzer and Generator

An enterprise web application designed for customs compliance officers, import/export brokers, and shippers. The application extracts commercial invoices via OCR (PaddleOCR), cross-examines line items against declared customs entries using an LLM reasoning engine (Qwen), identifies discrepancies, guides compliance resolutions, generates certified customs documentation packets, and manages audit reports, AI chatbot support, and account preferences.

---

## 🌟 Application Architecture

```
AI-Powered-Customs-Documentation-Analyzer-and-Generator/
├── frontend/                          # React + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                # Header (UPS Shield, Nav links, Account dropdown), Stepper, Badges, Modals
│   │   │   ├── step1_upload/          # Page 1: Upload Commercial Invoice & Shipment Details
│   │   │   ├── step2_validation_summary/ # Page 2: Validation Results & Priority Issues View
│   │   │   ├── step3_review_workbench/# Page 3: Split-View Document Review Workbench & Invoice Visualizer
│   │   │   ├── step4_report_submit/   # Page 4: Correction Report & Customs Clearance Submission
│   │   │   ├── reports/               # Generated Reports Page (Search, Filters, Empty State, Detail Drawer, CSV/PDF Export)
│   │   │   ├── help/                  # Help & Support Page (Searchable FAQs & Interactive AI Assistant Chatbot)
│   │   │   ├── account/               # Account Profile (Personal Info, Shipper Details, AI Validation Preferences)
│   │   │   └── shipments/             # Directory of All Shipments & Entries
│   │   ├── context/                   # ShipmentContext (Global state & scoring engine)
│   │   ├── services/                  # api.ts (PaddleOCR & Qwen Model integration adapters)
│   │   └── types/                     # TypeScript Interfaces
├── backend/                           # .NET 10 Web API
│   └── CrossBorderReady.Api/
│       ├── Controllers/Endpoints      # /api/ocr/extract, /api/qwen/analyze, /api/shipments
│       └── Models/                    # DTOs aligning 1:1 with frontend TypeScript contracts
```

---

## 📸 Complete Suite of Pages Developed From Designs

### 1. New Shipment Check (`Upload & Details`)
* **Header & Stepper**: UPS branded header with golden shield, 4-step wizard stepper, and decorative aircraft watermark.
* **Upload Commercial Invoice (A)**: Drag-and-drop dropzone supporting PDF, JPG, and PNG formats. Active document status (`invoice_0412.pdf` Extracted, `packing_list.jpg` Processing 60%) and **Extracted Data Preview** summary card.
* **Shipment Details (B)**: Form covering Product Description, Quantity, Total Weight (kg), Dimensions (L × W × H cm), Declared Value & Currency (USD), and Origin (India) to Destination (USA).
* **Actions**: *Save Draft* and primary gold *Run AI Validation →*.

### 2. Validation Results (`Priority Issues View`)
* **Validation Status Card**: `Validation failed` with red `• Fail` badge.
* **KPI Error Cards**: Real-time counter for `Errors - Critical issues` (2) and `Warnings` (3).
* **Top 3 Issues (Priority Ordered)**:
  1. **Declared Value** (`• Critical`): Invoice total ($4,800) vs entered value ($3,900), "Why it matters", and "Correction Guidance" box.
  2. **HS Code** (`• Critical`): Warning on missing Harmonized System tariff code.
  3. **Gross Weight** (`• Warning`): 118 kg invoice vs 96 kg entered discrepancy.
* **Bottom Controls**: *Download report*, *Recheck corrections*, blocking warning notice, and *Continue →*.

### 3. Review & Fix (`Interactive Split-Workbench & Invoice Visualizer`)
* **Clearance Readiness Gauge**: Starts at `62 / 100` (`Needs review`), increases dynamically to `94 / 100` as fixes are accepted.
* **Issues Found Table (Left)**: Interactive table with severity filter dropdown (`Filter: All`, `Critical`, `Warning`, `Passed`). Clicking any row dynamically selects that issue.
* **AI Explanation Panel (Right)**: Powered by Qwen model reasoning, with **Suggested Correction** box and 3 instant action buttons:
  * `✓ Accept fix` (automatically resolves the field, adjusts score, and updates invoice highlight).
  * `Edit manually` (opens a popover modal to enter custom verified figures).
  * `Ignore` (flags warning for exception documentation).
* **Interactive Invoice Preview (Bottom)**: Document visualizer simulating `COMMERCIAL INVOICE (invoice_0412.pdf)` with interactive bounding boxes ($4,800 total in gold, missing HS code in red dashed, weight, quantity).

### 4. Correction Report (`Report & Submit`)
* **Readiness After Fixes Banner**: Dynamic score progression display: `62 → 94 / 100` (`4 fields updated · 1 exception needs a note`).
* **Summary by Severity Cards**: Critical issues (2 corrected), Warnings (2 corrected · 1 ignored), Checks passed (14 passed).
* **Field-by-Field Corrections Table**: Audit trail showing Field, Original value, Corrected/Review Outcome, and status pills (`• Corrected`, `• Added`, `• Updated`, `• Needs note`).
* **Before You Submit & Exception Justification**:
  * Mandatory textarea: `Reason for ignoring weight mismatch *` with a "Suggest note" quick-fill button.
  * Documented note unlocks the primary **Submit for Customs Clearance** CTA.
* **Document Exports**: Client-side **PDF export** (`jsPDF`) and **CSV export**.
* **Submission Confirmation Modal**: Displays confirmed clearance reference `UPS-CB-2026-0412-X99`.

### 5. Generated Reports (`Reports Tab`)
* **KPI Metrics**: Total Reports (128), Passed (84), Needs Review (31), Failed (13).
* **Filters Card**: Multi-criteria search by report ID, shipment ID, invoice name, date range (`All dates`, `Today`, `Last 7 Days`, `Last 30 Days`), time range, status, origin, and destination country.
* **Dynamic Table & Empty State**: Renders all 128 reports (`RPT-0412`, `RPT-0411`, etc.); searching non-matching items (e.g. `INV-9999`) transitions into the empty state with a *Clear All* button.
* **Report Details Slide-Over Drawer**: Clicking *View* slides open a side pane with invoice info, 4 validation findings, detected issues list, and suggested corrections with PDF & CSV export.

### 6. Help & Support (`Help Tab`)
* **Interactive Knowledge Base**: Searchable accordion FAQs categorized under *Getting Started*, *Document Uploads*, *AI Validation*, *Customs Documentation*, *Reports & Downloads*, and *Troubleshooting*.
* **CrossBorder AI Assistant Chatbot**:
  * Live interactive assistant with chat history, typing indicators, and prompt suggestions (`How do I fix missing fields?`, `Which files can I upload?`).
  * Instant intelligent responses to custom customs questions.

### 7. Account Profile (`Account Tab`)
* **Shipper Profile Banner**: Verified badge, avatar, and metrics (`248 Invoices checked`, `86 Errors fixed`, `128 Reports submitted`).
* **Personal Info**: Full name (`Priya Sharma`), email, phone, role (`Logistics Manager`), language, and timezone settings.
* **Company & Shipper Details**: Company name (`Meridian Trade Ltd.`), UPS account # (`M8R421`), EORI, EIN, IEC/GST, default Incoterms (`DAP`), and currency.
* **AI Validation Preferences**:
  * Strictness level segmented control (`Basic`, `Standard`, `Strict`).
  * 5 toggle switches: *Auto-validate on upload*, *Highlight missing fields*, *Flag value/currency mismatches*, *Check HS code consistency*, *Show AI explanations*.
  * Default report format toggle (`PDF` vs `Excel`).
* **Notifications & Security**: Email notification settings and backend AI connection credentials.

---

## 💻 .NET 10 Backend & AI Architecture

The backend is built with **.NET 10** (`CrossBorderReady.Api`), utilizing C# 13/14 language features, clean architecture, dependency injection, and minimal API endpoints.

```
backend/CrossBorderReady.Api/
├── Program.cs                                  # Startup, DI container, CORS, and Minimal API routes
├── CrossBorderReady.Api.csproj                 # .NET 10 SDK & Swashbuckle OpenAPI
├── appsettings.json                            # AI service endpoints configuration
├── Models/
│   ├── ShipmentModels.cs                       # Shipment, ValidationIssue, BoundingBox, AuditRecord DTOs
│   ├── ReportModels.cs                         # ReportItem, QueryFilter, ReportStats DTOs
│   ├── AccountModels.cs                        # PersonalInfo, CompanyShipper, ValidationPreferences DTOs
│   └── ChatModels.cs                           # AI Chat request/response DTOs
└── Services/
    ├── IOcrExtractionService.cs                # OCR abstraction contract
    ├── PaddleOcrExtractionService.cs           # PaddleOCR integration & C# tokenization engine
    ├── ICustomsRuleEngine.cs                   # Customs rules contract
    ├── CustomsComplianceEngine.cs              # Multi-factor tariff validation & readiness scoring
    ├── IQwenReasoningService.cs                # Qwen reasoning abstraction contract
    ├── QwenComplianceService.cs                # Qwen prompt orchestration & LLM reasoning engine
    ├── IShipmentService.cs                     # Shipment lifecycle & workbench state contract
    ├── ShipmentService.cs                      # Thread-safe shipment repository & workbench logic
    ├── IReportService.cs                       # Customs reports management contract
    ├── ReportService.cs                        # Reports filtering, searching, and CSV generation
    ├── IAccountService.cs                      # Account profile & preferences contract
    ├── AccountService.cs                       # Shipper profile and AI settings service
    ├── IAiChatService.cs                       # AI Assistant chatbot contract
    └── AiChatService.cs                        # Qwen-powered customs compliance assistant
```

### 🎯 Where & For What the .NET Stack is Used

| Feature / Module | .NET Implementation Component | Responsibility & C# Features |
| :--- | :--- | :--- |
| **OCR Document Pipeline** | `PaddleOcrExtractionService.cs` | Receives multipart form uploads (`IFormFile`), performs image/PDF tokenization, computes document bounding-box coordinates for the interactive visualizer, and interfaces with external PaddleOCR endpoints using `HttpClient`. |
| **Customs Rule Engine** | `CustomsComplianceEngine.cs` | Implements customs validation logic: compares declared value against invoice total, validates HS codes against tariff schedules, flags weight tolerance deviations, checks commodity description specificity, and calculates dynamic 0–100 Readiness Scores. |
| **Qwen AI Reasoning** | `QwenComplianceService.cs` | Orchestrates LLM discrepancy analysis, generates plain-English *Why it matters* and *Correction Guidance* explanations, and suggests automated fixes. |
| **Shipment State & Workbench** | `ShipmentService.cs` | Thread-safe in-memory shipment store (`ConcurrentDictionary`), handling fix applications (`ApplyFix`), manual edits (`EditManually`), issue ignores (`IgnoreIssue`), and audit trail generation. |
| **Clearance Submission** | `ShipmentService.cs` (`SubmitForClearanceAsync`) | Generates certified electronic customs submission references (e.g. `UPS-CB-2026-0412-X99`), locks validated shipments, and timestamps audit trails. |
| **Generated Reports Engine** | `ReportService.cs` | Powers the Reports section with multi-parameter LINQ filtering (search, date range, status, destination), pagination, and CSV file stream generation. |
| **Customs AI Chatbot** | `AiChatService.cs` | Natural language customs assistant answering compliance queries, filing rules, and document formatting questions. |
| **Account & Shipper Settings** | `AccountService.cs` | Manages verified shipper credentials, EORI/EIN tax identifiers, Incoterms defaults, and AI strictness modes. |
| **RESTful API Surface** | `Program.cs` (Minimal APIs) | Exposes clean, OpenAPI-documented endpoints with CORS policies, dependency injection, and typed record model binding. |

---

## 🤖 AI & Backend Integration Guide

### PaddleOCR Integration (`POST /api/ocr/extract`)
* Uploaded files (`PDF`, `JPG`, `PNG`) are sent to PaddleOCR.
* The extracted payload provides structured key-value pairs (`invoiceNo`, `sellerName`, `buyerName`, `items`, `totalAmount`, `grossWeightKg`, `currency`).
* Configured in `frontend/src/services/api.ts` under `extractDocumentWithPaddleOcr`.

### Qwen Model Integration (`POST /api/qwen/analyze`)
* Compares the PaddleOCR document extraction against the shipper-entered values.
* Suggests Harmonized System (HS) classifications (e.g. `4202.21` for Leather Handbags).
* Computes discrepancy severity (`critical` vs `warning`).
* Generates clear, regulatory-compliant reasoning ("Why it matters" and "Correction Guidance").

### .NET 10 Web API Backend
* Scaffolding provided in `backend/CrossBorderReady.Api/`.
* Strongly typed models in `backend/CrossBorderReady.Api/Models/ShipmentModels.cs`.
* Program endpoints ready in `backend/CrossBorderReady.Api/Program.cs`.

---

## 🚀 How to Run the Frontend

```powershell
cd d:\AI-Powered-Customs-Documentation-Analyzer-and-Generator\frontend
npm run dev
```
Open **`http://localhost:5173`** in your browser.
