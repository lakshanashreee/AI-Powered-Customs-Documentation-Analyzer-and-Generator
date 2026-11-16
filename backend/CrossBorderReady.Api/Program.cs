using CrossBorderReady.Api.Models;

var builder = WebApplication.CreateBuilder(args);

// Add CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

// --- API Endpoints ---

// 1. PaddleOCR Document Ingestion Endpoint
app.MapPost("/api/ocr/extract", async (IFormFile document) =>
{
    // PaddleOCR pipeline connector will execute here
    return Results.Ok(new PaddleOcrExtractionResponse(
        FileName: document.FileName,
        InvoiceNo: "INV-0412",
        InvoiceDate: "2026-04-12",
        SellerName: "ABC Exports Ltd.",
        BuyerName: "Global Traders Inc.",
        TotalAmount: 4800m,
        Currency: "USD",
        GrossWeightKg: 118m,
        Confidence: 0.984
    ));
});

// 2. Qwen LLM Discrepancy & Compliance Reasoning Endpoint
app.MapPost("/api/qwen/analyze", (ShipmentDetailsDto shipment) =>
{
    // Qwen model reasoning pipeline will process shipment vs invoice OCR
    var issues = new List<ValidationIssueDto>
    {
        new(
            Id: "issue-1",
            Field: "declared_value",
            DisplayName: "Declared value",
            Severity: "critical",
            InvoiceValue: "$4,800",
            EnteredValue: "$3,900",
            Title: "Declared value",
            Description: "The invoice total is $4,800, but the entered declared value is $3,900. Confirm the invoice total before updating.",
            WhyItMatters: "Customs may question or delay the shipment if the declared value does not match the invoice total.",
            CorrectionGuidance: "Update declared value to $4,800 and review the invoice total before continuing.",
            SuggestedCorrection: "Update declared value to $4,800",
            SourceReference: "invoice_0412.pdf - Invoice total",
            Status: "open",
            IsBlocking: true
        ),
        new(
            Id: "issue-2",
            Field: "hs_code",
            DisplayName: "HS code",
            Severity: "critical",
            InvoiceValue: "Missing",
            EnteredValue: "—",
            Title: "HS code",
            Description: "The HS code is missing from the invoice and has not been entered. Add the correct HS code for this shipment.",
            WhyItMatters: "Missing HS codes can block customs submission and delay clearance until the classification is confirmed.",
            CorrectionGuidance: "Add the correct HS code from the invoice or supplier documentation before continuing.",
            SuggestedCorrection: "Add HS Code: 4202.21 (Handbags with outer surface of leather)",
            SourceReference: "invoice_0412.pdf - Line items table",
            Status: "open",
            IsBlocking: true
        ),
        new(
            Id: "issue-3",
            Field: "gross_weight",
            DisplayName: "Gross weight",
            Severity: "warning",
            InvoiceValue: "118 kg",
            EnteredValue: "96 kg",
            Title: "Gross weight",
            Description: "The invoice shows 118 kg, but the entered gross weight is 96 kg. Review and confirm the correct weight.",
            WhyItMatters: "Weight mismatches can affect freight costs, customs calculations, and shipment compliance.",
            CorrectionGuidance: "Review the invoice and shipment details, then update the gross weight to 118 kg if confirmed.",
            SuggestedCorrection: "Update gross weight to 118 kg (or document why net weight 96 kg was retained)",
            SourceReference: "invoice_0412.pdf - Gross weight field",
            Status: "open",
            IsBlocking: false
        )
    };

    return Results.Ok(new QwenAnalysisResponse(
        ShipmentId: shipment.ShipmentNumber,
        ReadinessScore: 62,
        Issues: issues,
        AiNotes: new List<string>
        {
            "Declared value now matches the $4,800 invoice total. Quantity is aligned to 240; an HS code and a more specific description have been added for review.",
            "Gross weight remains 96 kg against 118 kg on the invoice. This warning was ignored, not resolved. A reason is required before submission."
        }
    ));
});

// 3. Customs Clearance Submission
app.MapPost("/api/shipments/{id}/submit", (string id) =>
{
    return Results.Ok(new
    {
        Success = true,
        SubmissionReference = $"UPS-CB-2026-{id}-X99",
        SubmittedAt = DateTime.UtcNow
    });
});

app.Run();

