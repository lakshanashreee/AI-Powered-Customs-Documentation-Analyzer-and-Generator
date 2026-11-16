namespace CrossBorderReady.Api.Models;

public record ReportItemDto(
    string Id,
    string ReportId,
    string ShipmentId,
    string InvoiceName,
    string GeneratedDateTime,
    string Route,
    string Status, // "Passed" | "Needs Review" | "Failed"
    int IssuesCount,
    string Seller,
    string Buyer,
    string LineItems,
    int ReadinessScore,
    int CriticalIssues,
    int Warnings,
    int PassedChecks,
    List<string> DetectedIssues,
    List<string> SuggestedCorrections
);

public record ReportQueryFilter(
    string? SearchQuery = null,
    string? DateRange = null,
    string? Status = null,
    string? Destination = null,
    string? SortBy = null
);

public record ReportSummaryStatsDto(
    int TotalReports,
    int PassedCount,
    int NeedsReviewCount,
    int FailedCount
);

public record ReportsResponse(
    List<ReportItemDto> Reports,
    int TotalCount,
    ReportSummaryStatsDto Stats
);

