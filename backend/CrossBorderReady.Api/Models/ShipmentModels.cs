namespace CrossBorderReady.Api.Models;

public record ShipmentDetailsDto(
    string ShipmentNumber,
    string ProductDescription,
    decimal Quantity,
    decimal TotalWeight,
    decimal Length,
    decimal Width,
    decimal Height,
    decimal DeclaredValue,
    string Currency,
    string OriginCountry,
    string DestinationCountry,
    string InvoiceNumber,
    string Seller,
    string Buyer
);

public record ValidationIssueDto(
    string Id,
    string Field,
    string DisplayName,
    string Severity, // "critical" | "warning" | "passed"
    string InvoiceValue,
    string EnteredValue,
    string Title,
    string Description,
    string WhyItMatters,
    string CorrectionGuidance,
    string SuggestedCorrection,
    string SourceReference,
    string Status, // "open" | "corrected" | "added" | "updated" | "ignored"
    bool IsBlocking
);

public record ExceptionNoteDto(
    string Field,
    string Reason,
    string SavedAt,
    string Author
);

public record AuditRecordDto(
    string Field,
    string Original,
    string Corrected,
    string Status,
    string StatusType,
    string? Note
);

public record PaddleOcrExtractionResponse(
    string FileName,
    string InvoiceNo,
    string InvoiceDate,
    string SellerName,
    string BuyerName,
    decimal TotalAmount,
    string Currency,
    decimal GrossWeightKg,
    double Confidence
);

public record QwenAnalysisResponse(
    string ShipmentId,
    int ReadinessScore,
    List<ValidationIssueDto> Issues,
    List<string> AiNotes
);

