using CrossBorderReady.Api.Data;
using CrossBorderReady.Api.Models;
using CrossBorderReady.Api.Services;
using Microsoft.AspNetCore.Mvc;

// Initialize SQLite Database and Seed Users
DatabaseInitializer.Initialize();

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. Dependency Injection Configuration
// ==========================================

// Add CORS Policy for React Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddHttpClient();

// Register Core Domain Services & AI Pipelines
builder.Services.AddSingleton<IAuthService, AuthService>();
builder.Services.AddSingleton<IOcrExtractionService, PaddleOcrExtractionService>();
builder.Services.AddSingleton<ICustomsRuleEngine, CustomsComplianceEngine>();
builder.Services.AddSingleton<IQwenReasoningService, QwenComplianceService>();
builder.Services.AddSingleton<IShipmentService, ShipmentService>();
builder.Services.AddSingleton<IReportService, ReportService>();
builder.Services.AddSingleton<IAccountService, AccountService>();
builder.Services.AddSingleton<IAiChatService, AiChatService>();

// Swagger / OpenAPI Setup
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ==========================================
// 2. HTTP Request Pipeline & Middleware
// ==========================================

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "CrossBorder Ready v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowReactApp");

// ==========================================
// 3. API Endpoints
// ==========================================

// --- Group: Health Check ---
app.MapGet("/api/health", () => Results.Ok(new
{
    Status = "Healthy",
    Service = "UPS CrossBorder Ready .NET 10 API",
    Timestamp = DateTime.UtcNow,
    Database = "SQLite (crossborder.db)",
    Features = new[] { "PaddleOCR Ingestion", "Qwen-2.5 Discrepancy Reasoning", "Customs Tariff Validation Engine", "SQLite Auth" }
}))
.WithName("HealthCheck")
.WithTags("System");

// --- Group: Authentication (SQLite Database) ---
app.MapPost("/api/auth/login", async ([FromBody] LoginRequest request, IAuthService authService) =>
{
    var response = await authService.LoginAsync(request);
    return response.Success ? Results.Ok(response) : Results.Json(response, statusCode: 401);
})
.WithName("Login")
.WithTags("Authentication");

app.MapGet("/api/auth/users", async (IAuthService authService) =>
{
    var users = await authService.GetRegisteredUsersAsync();
    return Results.Ok(users);
})
.WithName("GetRegisteredUsers")
.WithTags("Authentication");

// --- Group: PaddleOCR Document Ingestion ---
app.MapPost("/api/ocr/extract", async (
    IFormFile document,
    IOcrExtractionService ocrService,
    IShipmentService shipmentService,
    [FromQuery] string? shipmentNumber,
    CancellationToken ct) =>
{
    if (document == null || document.Length == 0)
    {
        return Results.BadRequest(new { Error = "No document provided for OCR extraction." });
    }

    var extraction = await ocrService.ExtractInvoiceAsync(document, ct);
    var targetShipment = shipmentNumber ?? "0412";
    await shipmentService.RecordDocumentUploadAsync(targetShipment, extraction);

    return Results.Ok(extraction);
})
.WithName("ExtractDocumentWithPaddleOcr")
.WithTags("OCR Pipeline")
.DisableAntiforgery();

// --- Group: Qwen Compliance Reasoning & Analysis ---
app.MapPost("/api/qwen/analyze", async (
    [FromBody] ShipmentDetailsDto shipment,
    IQwenReasoningService qwenService,
    CancellationToken ct) =>
{
    var analysis = await qwenService.AnalyzeComplianceAsync(shipment, null, ct);
    return Results.Ok(analysis);
})
.WithName("RunQwenComplianceAnalysis")
.WithTags("AI Reasoning");

// --- Group: Shipments Management & Wizard Actions ---
app.MapGet("/api/shipments/{id}", async (string id, IShipmentService shipmentService) =>
{
    var shipment = await shipmentService.GetShipmentAsync(id);
    return shipment != null ? Results.Ok(shipment) : Results.NotFound(new { Message = $"Shipment #{id} not found." });
})
.WithName("GetShipmentById")
.WithTags("Shipments");

app.MapPost("/api/shipments", async ([FromBody] ShipmentDetailsDto details, IShipmentService shipmentService) =>
{
    var saved = await shipmentService.SaveShipmentDetailsAsync(details);
    return Results.Ok(saved);
})
.WithName("SaveShipmentDetails")
.WithTags("Shipments");

app.MapPost("/api/shipments/{id}/validate", async (string id, IShipmentService shipmentService) =>
{
    var analysis = await shipmentService.RunAiValidationAsync(id);
    return Results.Ok(analysis);
})
.WithName("ValidateShipment")
.WithTags("Shipments");

app.MapPost("/api/shipments/{id}/apply-fix", async (string id, [FromBody] ApplyFixRequest request, IShipmentService shipmentService) =>
{
    var updated = await shipmentService.ApplyFixAsync(id, request.IssueId);
    return Results.Ok(updated);
})
.WithName("ApplyFix")
.WithTags("Shipments");

app.MapPost("/api/shipments/{id}/edit-field", async (string id, [FromBody] ManualEditRequest request, IShipmentService shipmentService) =>
{
    var updated = await shipmentService.EditManuallyAsync(id, request.IssueId, request.NewValue);
    return Results.Ok(updated);
})
.WithName("EditFieldManually")
.WithTags("Shipments");

app.MapPost("/api/shipments/{id}/ignore-issue", async (string id, [FromBody] IgnoreIssueRequest request, IShipmentService shipmentService) =>
{
    var updated = await shipmentService.IgnoreIssueAsync(id, request.IssueId, request.Note);
    return Results.Ok(updated);
})
.WithName("IgnoreIssue")
.WithTags("Shipments");

app.MapPost("/api/shipments/{id}/exception-note", async (string id, [FromBody] ExceptionNoteRequest request, IShipmentService shipmentService) =>
{
    var success = await shipmentService.SaveExceptionNoteAsync(id, request.Reason, request.Field ?? "gross_weight");
    return Results.Ok(new { Success = success, ShipmentId = id, SavedAt = DateTime.UtcNow });
})
.WithName("SaveExceptionNote")
.WithTags("Shipments");

app.MapGet("/api/shipments/{id}/audit", async (string id, IShipmentService shipmentService) =>
{
    var audit = await shipmentService.GetAuditRecordsAsync(id);
    return Results.Ok(audit);
})
.WithName("GetAuditTrail")
.WithTags("Shipments");

app.MapPost("/api/shipments/{id}/submit", async (string id, IShipmentService shipmentService) =>
{
    var response = await shipmentService.SubmitForClearanceAsync(id);
    return Results.Ok(response);
})
.WithName("SubmitForCustomsClearance")
.WithTags("Shipments");

app.MapGet("/api/shipments/{id}/documents", async (string id, IShipmentService shipmentService) =>
{
    var docs = await shipmentService.GetUploadedDocumentsAsync(id);
    return Results.Ok(docs);
})
.WithName("GetUploadedDocuments")
.WithTags("Shipments");

// --- Group: Generated Reports Section ---
app.MapGet("/api/reports", async (
    [FromQuery] string? search,
    [FromQuery] string? dateRange,
    [FromQuery] string? status,
    [FromQuery] string? destination,
    [FromQuery] string? sortBy,
    IReportService reportService) =>
{
    var filter = new ReportQueryFilter(search, dateRange, status, destination, sortBy);
    var reports = await reportService.GetReportsAsync(filter);
    return Results.Ok(reports);
})
.WithName("GetReports")
.WithTags("Reports");

app.MapGet("/api/reports/{id}", async (string id, IReportService reportService) =>
{
    var report = await reportService.GetReportByIdAsync(id);
    return report != null ? Results.Ok(report) : Results.NotFound(new { Message = $"Report {id} not found." });
})
.WithName("GetReportDetails")
.WithTags("Reports");

app.MapGet("/api/reports/export/csv", async (
    [FromQuery] string? search,
    IReportService reportService) =>
{
    var filter = new ReportQueryFilter(SearchQuery: search);
    var csv = await reportService.ExportReportsCsvAsync(filter);
    return Results.File(System.Text.Encoding.UTF8.GetBytes(csv), "text/csv", "UPS_Customs_Reports.csv");
})
.WithName("ExportReportsCsv")
.WithTags("Reports");

// --- Group: Account Profile & Preferences ---
app.MapGet("/api/account/profile", async (IAccountService accountService) =>
{
    var profile = await accountService.GetProfileAsync();
    return Results.Ok(profile);
})
.WithName("GetAccountProfile")
.WithTags("Account");

app.MapPut("/api/account/profile", async ([FromBody] AccountProfileDto updated, IAccountService accountService) =>
{
    var profile = await accountService.UpdateProfileAsync(updated);
    return Results.Ok(profile);
})
.WithName("UpdateAccountProfile")
.WithTags("Account");

// --- Group: AI Customs Chatbot ---
app.MapPost("/api/chat/ask", async ([FromBody] AiChatRequest request, IAiChatService chatService, CancellationToken ct) =>
{
    var reply = await chatService.AskAssistantAsync(request, ct);
    return Results.Ok(reply);
})
.WithName("AskAiCustomsAssistant")
.WithTags("AI Assistant");

app.Run();
