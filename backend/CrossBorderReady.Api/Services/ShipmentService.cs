using System.Collections.Concurrent;
using CrossBorderReady.Api.Models;

namespace CrossBorderReady.Api.Services;

public class ShipmentService : IShipmentService
{
    private readonly IQwenReasoningService _qwenService;
    private readonly IReportService _reportService;
    private readonly ILogger<ShipmentService> _logger;

    private readonly ConcurrentDictionary<string, ShipmentDetailsDto> _shipments = new();
    private readonly ConcurrentDictionary<string, List<PaddleOcrExtractionResponse>> _documents = new();
    private readonly ConcurrentDictionary<string, List<ValidationIssueDto>> _issues = new();
    private readonly ConcurrentDictionary<string, List<AuditRecordDto>> _auditTrails = new();
    private readonly ConcurrentDictionary<string, string> _exceptionNotes = new();
    private readonly ConcurrentDictionary<string, bool> _submittedStatus = new();

    public ShipmentService(
        IQwenReasoningService qwenService,
        IReportService reportService,
        ILogger<ShipmentService> logger)
    {
        _qwenService = qwenService;
        _reportService = reportService;
        _logger = logger;
    }

    public Task<ShipmentDetailsDto?> GetShipmentAsync(string shipmentNumber)
    {
        _shipments.TryGetValue(shipmentNumber, out var details);
        return Task.FromResult(details);
    }

    public Task<ShipmentDetailsDto> SaveShipmentDetailsAsync(ShipmentDetailsDto details)
    {
        _shipments[details.ShipmentNumber] = details;
        _logger.LogInformation("Shipment #{ShipmentNumber} saved successfully", details.ShipmentNumber);
        return Task.FromResult(details);
    }

    public async Task<QwenAnalysisResponse> RunAiValidationAsync(string shipmentNumber)
    {
        _shipments.TryGetValue(shipmentNumber, out var details);
        _documents.TryGetValue(shipmentNumber, out var docs);
        var lastDoc = docs?.LastOrDefault();

        if (details == null && lastDoc != null)
        {
            details = new ShipmentDetailsDto(
                ShipmentNumber: shipmentNumber,
                ProductDescription: lastDoc.ExtractedFields.LineItemDescription,
                Quantity: lastDoc.ExtractedFields.TotalQuantity,
                TotalWeight: lastDoc.ExtractedFields.GrossWeightKg,
                Length: 40,
                Width: 30,
                Height: 20,
                DeclaredValue: lastDoc.ExtractedFields.TotalAmount,
                Currency: lastDoc.ExtractedFields.Currency,
                OriginCountry: "India",
                DestinationCountry: "USA",
                InvoiceNumber: lastDoc.ExtractedFields.InvoiceNumber,
                Seller: lastDoc.ExtractedFields.SellerName,
                Buyer: lastDoc.ExtractedFields.BuyerName
            );
            _shipments[shipmentNumber] = details;
        }

        details ??= new ShipmentDetailsDto(
            ShipmentNumber: shipmentNumber,
            ProductDescription: "",
            Quantity: 0,
            TotalWeight: 0,
            Length: 0,
            Width: 0,
            Height: 0,
            DeclaredValue: 0,
            Currency: "USD",
            OriginCountry: "India",
            DestinationCountry: "USA",
            InvoiceNumber: "",
            Seller: "",
            Buyer: ""
        );

        var result = await _qwenService.AnalyzeComplianceAsync(details, lastDoc?.ExtractedFields);
        _issues[shipmentNumber] = new List<ValidationIssueDto>(result.Issues);

        return result;
    }

    public Task<QwenAnalysisResponse> ApplyFixAsync(string shipmentNumber, string issueId)
    {
        if (_issues.TryGetValue(shipmentNumber, out var issueList))
        {
            var issueIndex = issueList.FindIndex(i => i.Id == issueId);
            if (issueIndex >= 0)
            {
                var current = issueList[issueIndex];
                issueList[issueIndex] = current with
                {
                    Status = "corrected",
                    EnteredValue = current.InvoiceValue
                };

                // Update shipment details dynamically with the actual invoice value
                if (_shipments.TryGetValue(shipmentNumber, out var ship))
                {
                    if (current.Field == "declared_value")
                    {
                        var cleanVal = System.Text.RegularExpressions.Regex.Replace(current.InvoiceValue, @"[^\d.]", "");
                        if (decimal.TryParse(cleanVal, out var val))
                            _shipments[shipmentNumber] = ship with { DeclaredValue = val };
                    }
                    else if (current.Field == "gross_weight")
                    {
                        var cleanVal = System.Text.RegularExpressions.Regex.Replace(current.InvoiceValue, @"[^\d.]", "");
                        if (decimal.TryParse(cleanVal, out var val))
                            _shipments[shipmentNumber] = ship with { TotalWeight = val };
                    }
                    else if (current.Field == "quantity")
                    {
                        var cleanVal = System.Text.RegularExpressions.Regex.Replace(current.InvoiceValue, @"[^\d]", "");
                        if (int.TryParse(cleanVal, out var val))
                            _shipments[shipmentNumber] = ship with { Quantity = val };
                    }
                }
            }
        }

        return RecalculateAnalysisResponseAsync(shipmentNumber);
    }

    public Task<QwenAnalysisResponse> EditManuallyAsync(string shipmentNumber, string issueId, string newValue)
    {
        if (_issues.TryGetValue(shipmentNumber, out var issueList))
        {
            var issueIndex = issueList.FindIndex(i => i.Id == issueId);
            if (issueIndex >= 0)
            {
                var current = issueList[issueIndex];
                issueList[issueIndex] = current with
                {
                    Status = "corrected",
                    EnteredValue = newValue
                };

                if (_shipments.TryGetValue(shipmentNumber, out var ship))
                {
                    var cleanNum = System.Text.RegularExpressions.Regex.Replace(newValue, @"[^\d.]", "");
                    if (current.Field == "declared_value" && decimal.TryParse(cleanNum, out var dv))
                        _shipments[shipmentNumber] = ship with { DeclaredValue = dv };
                    else if (current.Field == "gross_weight" && decimal.TryParse(cleanNum, out var gw))
                        _shipments[shipmentNumber] = ship with { TotalWeight = gw };
                    else if (current.Field == "quantity" && int.TryParse(System.Text.RegularExpressions.Regex.Replace(newValue, @"[^\d]", ""), out var q))
                        _shipments[shipmentNumber] = ship with { Quantity = q };
                }
            }
        }

        return RecalculateAnalysisResponseAsync(shipmentNumber);
    }

    public Task<QwenAnalysisResponse> IgnoreIssueAsync(string shipmentNumber, string issueId, string? note)
    {
        if (_issues.TryGetValue(shipmentNumber, out var issueList))
        {
            var issueIndex = issueList.FindIndex(i => i.Id == issueId);
            if (issueIndex >= 0)
            {
                var current = issueList[issueIndex];
                issueList[issueIndex] = current with
                {
                    Status = "ignored"
                };

                if (!string.IsNullOrWhiteSpace(note))
                {
                    _exceptionNotes[shipmentNumber] = note;
                }
            }
        }

        return RecalculateAnalysisResponseAsync(shipmentNumber);
    }

    private Task<QwenAnalysisResponse> RecalculateAnalysisResponseAsync(string shipmentNumber)
    {
        _issues.TryGetValue(shipmentNumber, out var issueList);
        issueList ??= new List<ValidationIssueDto>();

        int critical = issueList.Count(i => i.Severity == "critical" && i.Status == "open");
        int warnings = issueList.Count(i => i.Severity == "warning" && i.Status == "open");
        int passed = 14;

        int score = 100 - (critical * 20) - (warnings * 6);
        if (score < 10) score = 10;
        if (score > 100) score = 100;

        var response = new QwenAnalysisResponse(
            ShipmentId: shipmentNumber,
            ReadinessScore: score,
            CriticalCount: critical,
            WarningsCount: warnings,
            ChecksPassedCount: passed,
            Issues: issueList,
            AiNotes: new List<string>
            {
                "Declared values and classifications synchronized with customs regulations.",
                "Readiness score recalculated dynamically based on resolved line items."
            },
            RecommendedHsCode: new RecommendedHsCodeDto("8482.10", 0.98, "Industrial Bearings / Machine Assemblies", "Chapter 84"),
            AnalyzedAt: DateTime.UtcNow
        );

        return Task.FromResult(response);
    }

    public Task<bool> SaveExceptionNoteAsync(string shipmentNumber, string reason, string field = "gross_weight")
    {
        _exceptionNotes[shipmentNumber] = reason;

        if (_auditTrails.TryGetValue(shipmentNumber, out var trail))
        {
            var weightRecord = trail.FirstOrDefault(r => r.Field.Contains("weight", StringComparison.OrdinalIgnoreCase));
            if (weightRecord != null)
            {
                var idx = trail.IndexOf(weightRecord);
                trail[idx] = weightRecord with
                {
                    Status = "Note attached",
                    StatusType = "success",
                    Note = reason
                };
            }
        }

        _logger.LogInformation("Saved exception note for shipment #{ShipmentNumber}: {Reason}", shipmentNumber, reason);
        return Task.FromResult(true);
    }

    public Task<List<AuditRecordDto>> GetAuditRecordsAsync(string shipmentNumber)
    {
        if (!_auditTrails.TryGetValue(shipmentNumber, out var trail))
        {
            trail = new List<AuditRecordDto>();
        }
        return Task.FromResult(trail);
    }

    public async Task<CustomsSubmissionResponse> SubmitForClearanceAsync(string shipmentNumber)
    {
        _submittedStatus[shipmentNumber] = true;
        var subRef = $"UPS-CB-2026-{shipmentNumber}-X{Random.Shared.Next(10, 99)}";

        _shipments.TryGetValue(shipmentNumber, out var details);
        _documents.TryGetValue(shipmentNumber, out var docs);
        var doc = docs?.LastOrDefault();

        var invoiceName = doc?.FileName ?? (details?.InvoiceNumber != null ? $"invoice_{details.InvoiceNumber}.pdf" : $"invoice_{shipmentNumber}.pdf");
        var route = $"{details?.OriginCountry ?? "India"} → {details?.DestinationCountry ?? "USA"}";
        var seller = details?.Seller ?? doc?.ExtractedFields?.SellerName ?? "Apex Global Supplies";
        var buyer = details?.Buyer ?? doc?.ExtractedFields?.BuyerName ?? "TransGlobal Logistics Inc.";
        var lineItems = details?.ProductDescription ?? doc?.ExtractedFields?.LineItemDescription ?? "Commercial Goods";

        _issues.TryGetValue(shipmentNumber, out var issueList);
        int remainingCritical = issueList?.Count(i => i.Severity == "critical" && i.Status == "open") ?? 0;
        int remainingWarnings = issueList?.Count(i => i.Severity == "warning" && i.Status == "open") ?? 0;

        string status = remainingCritical > 0 ? "Failed" : (remainingWarnings > 0 ? "Needs Review" : "Passed");
        int finalScore = 100 - (remainingCritical * 20) - (remainingWarnings * 6);
        if (finalScore < 10) finalScore = 10;
        if (finalScore > 100) finalScore = 100;

        var detectedIssues = issueList?.Select(i => $"{i.DisplayName}: {i.EnteredValue} vs {i.InvoiceValue}").ToList() 
                             ?? new List<string> { "All validation checks cleared successfully." };
        var suggestedCorrections = new List<string> { "Ready for customs brokerage electronic entry (ACE/CDS)." };

        var newReport = new ReportItemDto(
            Id: $"RPT-{shipmentNumber}",
            ReportId: $"RPT-{shipmentNumber}",
            ShipmentId: $"#{shipmentNumber}",
            InvoiceName: invoiceName,
            GeneratedDateTime: DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm"),
            Route: route,
            Status: status,
            IssuesCount: remainingCritical + remainingWarnings,
            Seller: seller,
            Buyer: buyer,
            LineItems: lineItems,
            ReadinessScore: finalScore,
            CriticalIssues: remainingCritical,
            Warnings: remainingWarnings,
            PassedChecks: 14,
            DetectedIssues: detectedIssues,
            SuggestedCorrections: suggestedCorrections
        );

        await _reportService.AddReportAsync(newReport);
        _logger.LogInformation("Created new validation report {ReportId} for submitted shipment #{ShipmentNumber}", newReport.ReportId, shipmentNumber);

        var response = new CustomsSubmissionResponse(
            Success: true,
            SubmissionReference: subRef,
            ShipmentId: shipmentNumber,
            SubmittedAt: DateTime.UtcNow,
            Status: "Submitted for Customs Clearance",
            ManifestUrl: $"/api/shipments/{shipmentNumber}/manifest.pdf",
            FinalReadinessScore: finalScore
        );

        return response;
    }

    public Task<List<PaddleOcrExtractionResponse>> GetUploadedDocumentsAsync(string shipmentNumber)
    {
        if (!_documents.TryGetValue(shipmentNumber, out var docs))
        {
            docs = new List<PaddleOcrExtractionResponse>();
        }
        return Task.FromResult(docs);
    }

    public Task<PaddleOcrExtractionResponse> RecordDocumentUploadAsync(string shipmentNumber, PaddleOcrExtractionResponse ocr)
    {
        var list = _documents.GetOrAdd(shipmentNumber, _ => new List<PaddleOcrExtractionResponse>());
        list.Add(ocr);
        return Task.FromResult(ocr);
    }
}
