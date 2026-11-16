using CrossBorderReady.Api.Models;

namespace CrossBorderReady.Api.Services;

public interface IShipmentService
{
    Task<ShipmentDetailsDto?> GetShipmentAsync(string shipmentNumber);
    Task<ShipmentDetailsDto> SaveShipmentDetailsAsync(ShipmentDetailsDto details);
    Task<QwenAnalysisResponse> RunAiValidationAsync(string shipmentNumber);
    Task<QwenAnalysisResponse> ApplyFixAsync(string shipmentNumber, string issueId);
    Task<QwenAnalysisResponse> EditManuallyAsync(string shipmentNumber, string issueId, string newValue);
    Task<QwenAnalysisResponse> IgnoreIssueAsync(string shipmentNumber, string issueId, string? note);
    Task<bool> SaveExceptionNoteAsync(string shipmentNumber, string reason, string field = "gross_weight");
    Task<List<AuditRecordDto>> GetAuditRecordsAsync(string shipmentNumber);
    Task<CustomsSubmissionResponse> SubmitForClearanceAsync(string shipmentNumber);
    Task<List<PaddleOcrExtractionResponse>> GetUploadedDocumentsAsync(string shipmentNumber);
    Task<PaddleOcrExtractionResponse> RecordDocumentUploadAsync(string shipmentNumber, PaddleOcrExtractionResponse ocr);
}

