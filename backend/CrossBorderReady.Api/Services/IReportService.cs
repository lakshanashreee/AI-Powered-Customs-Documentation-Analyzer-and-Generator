using CrossBorderReady.Api.Models;

namespace CrossBorderReady.Api.Services;

public interface IReportService
{
    Task<ReportsResponse> GetReportsAsync(ReportQueryFilter filter);
    Task<ReportItemDto?> GetReportByIdAsync(string id);
    Task<string> ExportReportsCsvAsync(ReportQueryFilter filter);
    Task AddReportAsync(ReportItemDto report);
}

