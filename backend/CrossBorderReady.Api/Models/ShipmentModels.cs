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
    string? InvoiceNumber,
    string? Seller,
    string? Buyer
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
    bool IsBlocking,
    string? BoxId = null
);

public record BoundingBoxDto(
    string BoxId,
    string FieldName,
    string Label,
    string TextValue,
    string EnteredValue,
    double X,
    double Y,
    double Width,
    double Height,
    string Severity
);

public record ExtractedInvoiceDataDto(
    string InvoiceNumber,
    string InvoiceDate,
    string SellerName,
    string SellerAddress,
    string BuyerName,
    string BuyerAddress,
    string Currency,
    decimal Subtotal,
    decimal TotalAmount,
    decimal GrossWeightKg,
    int TotalQuantity,
    string LineItemDescription,
    string? HsCode,
    List<BoundingBoxDto> BoundingBoxes
);

public record PaddleOcrExtractionResponse(
    string DocumentId,
    string FileName,
    long FileSizeBytes,
    string FileType,
    string UploadedAt,
    ExtractedInvoiceDataDto ExtractedFields,
    double Confidence,
    long ProcessingTimeMs,
    string Engine = "PaddleOCR v4"
);

public record QwenAnalysisResponse(
    string ShipmentId,
    int ReadinessScore,
    int CriticalCount,
    int WarningsCount,
    int ChecksPassedCount,
    List<ValidationIssueDto> Issues,
    List<string> AiNotes,
    RecommendedHsCodeDto? RecommendedHsCode,
    DateTime AnalyzedAt
);

public record RecommendedHsCodeDto(
    string Code,
    double Confidence,
    string Description,
    string Chapter
);

public record ApplyFixRequest(
    string IssueId
);

public record ManualEditRequest(
    string IssueId,
    string NewValue
);

public record IgnoreIssueRequest(
    string IssueId,
    string? Note
);

public record ExceptionNoteRequest(
    string Reason,
    string? Field = "gross_weight"
);

public record AuditRecordDto(
    string Field,
    string Original,
    string Corrected,
    string Status,
    string StatusType,
    string? Note = null
);

public record CustomsSubmissionResponse(
    bool Success,
    string SubmissionReference,
    string ShipmentId,
    DateTime SubmittedAt,
    string Status,
    string ManifestUrl,
    int FinalReadinessScore
);
