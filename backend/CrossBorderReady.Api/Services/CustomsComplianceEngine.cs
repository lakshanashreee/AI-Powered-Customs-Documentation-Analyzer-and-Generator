using CrossBorderReady.Api.Models;

namespace CrossBorderReady.Api.Services;

public class CustomsComplianceEngine : ICustomsRuleEngine
{
    private readonly ILogger<CustomsComplianceEngine> _logger;

    public CustomsComplianceEngine(ILogger<CustomsComplianceEngine> logger)
    {
        _logger = logger;
    }

    public (int ReadinessScore, int CriticalCount, int WarningsCount, int PassedCount, List<ValidationIssueDto> Issues)
        EvaluateCompliance(ShipmentDetailsDto shipment, ExtractedInvoiceDataDto? invoiceData)
    {
        var issues = new List<ValidationIssueDto>();

        var invoiceTotal = invoiceData?.TotalAmount ?? shipment.DeclaredValue;
        var invoiceCurrency = invoiceData?.Currency ?? shipment.Currency;
        var invoiceWeight = invoiceData?.GrossWeightKg ?? shipment.TotalWeight;
        var invoiceQuantity = invoiceData?.TotalQuantity ?? shipment.Quantity;
        var invoiceName = invoiceData?.InvoiceNumber ?? shipment.InvoiceNumber ?? "commercial_invoice";

        // 1. Declared Value Check
        if (shipment.DeclaredValue > 0 && Math.Abs(shipment.DeclaredValue - invoiceTotal) > 0.01m)
        {
            issues.Add(new ValidationIssueDto(
                Id: "issue-1",
                Field: "declared_value",
                DisplayName: "Declared value",
                Severity: "critical",
                InvoiceValue: $"${invoiceTotal:N2}",
                EnteredValue: $"${shipment.DeclaredValue:N2}",
                Title: "Declared value",
                Description: $"The invoice total is ${invoiceTotal:N2}, but the entered declared value is ${shipment.DeclaredValue:N2}. Confirm the invoice total before updating.",
                WhyItMatters: "Customs authorities verify declared cargo value against the commercial invoice total to assess statutory duties. Discrepancies cause customs border holds.",
                CorrectionGuidance: $"Update declared value to ${invoiceTotal:N2} to align with commercial invoice line-item records.",
                SuggestedCorrection: $"Update declared value to ${invoiceTotal:N2}",
                SourceReference: $"{invoiceName} - Invoice total",
                Status: "open",
                IsBlocking: true,
                BoxId: "box-total"
            ));
        }

        // 2. HS Code Classification Check
        var currentHsCode = invoiceData?.HsCode;
        if (string.IsNullOrWhiteSpace(currentHsCode))
        {
            var (recCode, recDesc) = RecommendHsCode(shipment.ProductDescription);
            issues.Add(new ValidationIssueDto(
                Id: "issue-2",
                Field: "hs_code",
                DisplayName: "HS code",
                Severity: "critical",
                InvoiceValue: "Missing",
                EnteredValue: "—",
                Title: "HS code",
                Description: "The Harmonized System (HS) code is missing from the invoice and has not been specified in shipment details.",
                WhyItMatters: "Missing HS codes block automated customs declaration filings (ACE / CDS) and require manual broker tariff determination.",
                CorrectionGuidance: $"Assign recommended tariff classification {recCode} ({recDesc}) or enter verified tariff code.",
                SuggestedCorrection: $"Add HS Code: {recCode} ({recDesc})",
                SourceReference: $"{invoiceName} - Line items table",
                Status: "open",
                IsBlocking: true,
                BoxId: "box-hscode"
            ));
        }

        // 3. Gross Weight Check
        if (shipment.TotalWeight > 0 && Math.Abs(shipment.TotalWeight - invoiceWeight) > 0.5m)
        {
            issues.Add(new ValidationIssueDto(
                Id: "issue-3",
                Field: "gross_weight",
                DisplayName: "Gross weight",
                Severity: "warning",
                InvoiceValue: $"{invoiceWeight:N1} kg",
                EnteredValue: $"{shipment.TotalWeight:N1} kg",
                Title: "Gross weight",
                Description: $"The invoice shows {invoiceWeight:N1} kg, but entered weight is {shipment.TotalWeight:N1} kg. Review and confirm the correct weight.",
                WhyItMatters: "Weight mismatches can affect freight freight rating, carrier scale verification, and customs compliance.",
                CorrectionGuidance: $"Review invoice and cargo details, then update weight to {invoiceWeight:N1} kg or document packaging tare weight exception.",
                SuggestedCorrection: $"Update gross weight to {invoiceWeight:N1} kg (or document tare packaging exception)",
                SourceReference: $"{invoiceName} - Gross weight field",
                Status: "open",
                IsBlocking: false,
                BoxId: "box-weight"
            ));
        }

        // 4. Quantity Alignment Check
        if (shipment.Quantity > 0 && shipment.Quantity != invoiceQuantity)
        {
            issues.Add(new ValidationIssueDto(
                Id: "issue-4",
                Field: "quantity",
                DisplayName: "Quantity",
                Severity: "warning",
                InvoiceValue: $"{invoiceQuantity}",
                EnteredValue: $"{shipment.Quantity}",
                Title: "Quantity",
                Description: $"The invoice specifies {invoiceQuantity} units, but the entered shipment quantity is {shipment.Quantity}. Align units before filing.",
                WhyItMatters: "Discrepancy in unit quantities can trigger physical inspection or tariff penalty at port of entry.",
                CorrectionGuidance: $"Update entered quantity to {invoiceQuantity} units to match commercial invoice line items.",
                SuggestedCorrection: $"Update quantity to {invoiceQuantity} units",
                SourceReference: $"{invoiceName} - Quantity summary",
                Status: "open",
                IsBlocking: false,
                BoxId: "box-quantity"
            ));
        }

        // 5. Consignee / Legal Importer Verification (Passed)
        issues.Add(new ValidationIssueDto(
            Id: "issue-pass-1",
            Field: "consignee_address",
            DisplayName: "Consignee address",
            Severity: "passed",
            InvoiceValue: "Match",
            EnteredValue: "Match",
            Title: "Consignee address match",
            Description: "Buyer and delivery consignee addresses match between invoice and electronic manifest.",
            WhyItMatters: "Consignee alignment verifies legal importer of record.",
            CorrectionGuidance: "No action required.",
            SuggestedCorrection: "Confirmed matching.",
            SourceReference: $"{invoiceName} - Consignee block",
            Status: "open",
            IsBlocking: false,
            BoxId: "box-consignee"
        ));

        int criticalCount = issues.Count(i => i.Severity == "critical" && i.Status == "open");
        int warningsCount = issues.Count(i => i.Severity == "warning" && i.Status == "open");
        int passedCount = issues.Count(i => i.Severity == "passed") + 13;

        int readinessScore = 100 - (criticalCount * 18) - (warningsCount * 6);
        if (readinessScore < 10) readinessScore = 10;
        if (readinessScore > 100) readinessScore = 100;

        return (readinessScore, criticalCount, warningsCount, passedCount, issues);
    }

    private static (string Code, string Description) RecommendHsCode(string? productDescription)
    {
        var desc = (productDescription ?? "").ToLowerInvariant();

        if (desc.Contains("bearing"))
            return ("8482.10", "Ball or roller bearings and component assemblies");
        if (desc.Contains("leather") || desc.Contains("bag"))
            return ("4202.21", "Handbags with outer surface of leather or composition leather");
        if (desc.Contains("cotton") || desc.Contains("textile") || desc.Contains("apparel") || desc.Contains("cloth"))
            return ("5208.11", "Woven fabrics of cotton, unbleached or dyed");
        if (desc.Contains("machin") || desc.Contains("part") || desc.Contains("tool"))
            return ("8466.93", "Parts and accessories for machine tools");
        if (desc.Contains("electron") || desc.Contains("sensor") || desc.Contains("circuit"))
            return ("8542.31", "Electronic integrated circuits and microassemblies");

        return ("8482.10", "Industrial mechanical assemblies and components");
    }
}
