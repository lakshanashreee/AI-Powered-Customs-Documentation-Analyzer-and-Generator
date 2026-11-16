using CrossBorderReady.Api.Models;

namespace CrossBorderReady.Api.Services;

public interface ICustomsRuleEngine
{
    (int ReadinessScore, int CriticalCount, int WarningsCount, int PassedCount, List<ValidationIssueDto> Issues)
        EvaluateCompliance(ShipmentDetailsDto shipment, ExtractedInvoiceDataDto? invoiceData);
}

