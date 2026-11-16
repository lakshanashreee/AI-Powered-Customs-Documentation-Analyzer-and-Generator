using CrossBorderReady.Api.Models;

namespace CrossBorderReady.Api.Services;

public interface IQwenReasoningService
{
    Task<QwenAnalysisResponse> AnalyzeComplianceAsync(
        ShipmentDetailsDto shipment,
        ExtractedInvoiceDataDto? invoiceData,
        CancellationToken cancellationToken = default);
}

