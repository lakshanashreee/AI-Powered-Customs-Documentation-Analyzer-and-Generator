using System.Text;
using System.Text.Json;
using CrossBorderReady.Api.Data;
using CrossBorderReady.Api.Models;
using Microsoft.Data.Sqlite;

namespace CrossBorderReady.Api.Services;

public class ReportService : IReportService
{
    private readonly List<ReportItemDto> _reports = new();
    private readonly ILogger<ReportService> _logger;

    public ReportService(ILogger<ReportService> logger)
    {
        _logger = logger;
        LoadReportsFromDatabase();
    }

    private void LoadReportsFromDatabase()
    {
        try
        {
            using var connection = new SqliteConnection(DatabaseInitializer.ConnectionString);
            connection.Open();

            using var cmd = connection.CreateCommand();
            cmd.CommandText = @"
                SELECT ReportId, ShipmentId, InvoiceName, GeneratedDateTime, Route, Status, IssuesCount, 
                       ReadinessScore, Seller, Buyer, LineItems, DetectedIssuesJson, SuggestedCorrectionsJson
                FROM ValidationReports
                ORDER BY GeneratedDateTime DESC;
            ";

            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                var issuesJson = reader.GetString(11);
                var corrJson = reader.GetString(12);

                var detectedIssues = JsonSerializer.Deserialize<List<string>>(issuesJson) ?? new List<string>();
                var suggestedCorrections = JsonSerializer.Deserialize<List<string>>(corrJson) ?? new List<string>();

                _reports.Add(new ReportItemDto(
                    Id: reader.GetString(0),
                    ReportId: reader.GetString(0),
                    ShipmentId: reader.GetString(1),
                    InvoiceName: reader.GetString(2),
                    GeneratedDateTime: reader.GetString(3),
                    Route: reader.GetString(4),
                    Status: reader.GetString(5),
                    IssuesCount: reader.GetInt32(6),
                    Seller: reader.GetString(8),
                    Buyer: reader.GetString(9),
                    LineItems: reader.GetString(10),
                    ReadinessScore: reader.GetInt32(7),
                    CriticalIssues: 0,
                    Warnings: reader.GetInt32(6),
                    PassedChecks: 14,
                    DetectedIssues: detectedIssues,
                    SuggestedCorrections: suggestedCorrections
                ));
            }

            _logger.LogInformation("Loaded {Count} reports from SQLite database.", _reports.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to load reports from SQLite database.");
        }
    }

    public Task AddReportAsync(ReportItemDto report)
    {
        _reports.Insert(0, report);

        try
        {
            using var connection = new SqliteConnection(DatabaseInitializer.ConnectionString);
            connection.Open();

            using var cmd = connection.CreateCommand();
            cmd.CommandText = @"
                INSERT OR REPLACE INTO ValidationReports (
                    ReportId, ShipmentId, InvoiceName, GeneratedDateTime, Route, Status, 
                    IssuesCount, ReadinessScore, Seller, Buyer, LineItems, 
                    DetectedIssuesJson, SuggestedCorrectionsJson
                ) VALUES (
                    @ReportId, @ShipmentId, @InvoiceName, @GeneratedDateTime, @Route, @Status,
                    @IssuesCount, @ReadinessScore, @Seller, @Buyer, @LineItems,
                    @DetectedIssuesJson, @SuggestedCorrectionsJson
                );
            ";

            cmd.Parameters.AddWithValue("@ReportId", report.ReportId);
            cmd.Parameters.AddWithValue("@ShipmentId", report.ShipmentId);
            cmd.Parameters.AddWithValue("@InvoiceName", report.InvoiceName);
            cmd.Parameters.AddWithValue("@GeneratedDateTime", report.GeneratedDateTime);
            cmd.Parameters.AddWithValue("@Route", report.Route);
            cmd.Parameters.AddWithValue("@Status", report.Status);
            cmd.Parameters.AddWithValue("@IssuesCount", report.IssuesCount);
            cmd.Parameters.AddWithValue("@ReadinessScore", report.ReadinessScore);
            cmd.Parameters.AddWithValue("@Seller", report.Seller);
            cmd.Parameters.AddWithValue("@Buyer", report.Buyer);
            cmd.Parameters.AddWithValue("@LineItems", report.LineItems);
            cmd.Parameters.AddWithValue("@DetectedIssuesJson", JsonSerializer.Serialize(report.DetectedIssues));
            cmd.Parameters.AddWithValue("@SuggestedCorrectionsJson", JsonSerializer.Serialize(report.SuggestedCorrections));

            cmd.ExecuteNonQuery();
            _logger.LogInformation("Persisted report {ReportId} to SQLite.", report.ReportId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed persisting report {ReportId} to SQLite.", report.ReportId);
        }

        return Task.CompletedTask;
    }

    public Task<ReportsResponse> GetReportsAsync(ReportQueryFilter filter)
    {
        var query = _reports.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(filter.SearchQuery))
        {
            var q = filter.SearchQuery.Trim().ToLowerInvariant();
            query = query.Where(r =>
                r.ReportId.ToLowerInvariant().Contains(q) ||
                r.ShipmentId.ToLowerInvariant().Contains(q) ||
                r.InvoiceName.ToLowerInvariant().Contains(q) ||
                r.Seller.ToLowerInvariant().Contains(q) ||
                r.Buyer.ToLowerInvariant().Contains(q)
            );
        }

        if (!string.IsNullOrWhiteSpace(filter.Status) && !filter.Status.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(r => r.Status.Equals(filter.Status, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(filter.Destination) && !filter.Destination.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(r => r.Route.Contains(filter.Destination, StringComparison.OrdinalIgnoreCase));
        }

        var list = query.ToList();

        var total = _reports.Count;
        var passed = _reports.Count(r => r.Status.Equals("Passed", StringComparison.OrdinalIgnoreCase));
        var needsReview = _reports.Count(r => r.Status.Equals("Needs Review", StringComparison.OrdinalIgnoreCase));
        var failed = _reports.Count(r => r.Status.Equals("Failed", StringComparison.OrdinalIgnoreCase));

        var stats = new ReportSummaryStatsDto(
            TotalReports: total,
            PassedCount: passed,
            NeedsReviewCount: needsReview,
            FailedCount: failed
        );

        return Task.FromResult(new ReportsResponse(list, list.Count, stats));
    }

    public Task<ReportItemDto?> GetReportByIdAsync(string id)
    {
        var report = _reports.FirstOrDefault(r => r.Id == id || r.ReportId.Equals(id, StringComparison.OrdinalIgnoreCase));
        return Task.FromResult(report);
    }

    public Task<string> ExportReportsCsvAsync(ReportQueryFilter filter)
    {
        var sb = new StringBuilder();
        sb.AppendLine("REPORT ID,SHIPMENT ID,INVOICE NAME,DATE,ROUTE,STATUS,ISSUES COUNT,SELLER,BUYER,READINESS");

        var query = _reports.AsEnumerable();
        if (!string.IsNullOrWhiteSpace(filter.SearchQuery))
        {
            var q = filter.SearchQuery.Trim().ToLowerInvariant();
            query = query.Where(r => r.ReportId.ToLowerInvariant().Contains(q) || r.ShipmentId.ToLowerInvariant().Contains(q));
        }

        foreach (var r in query)
        {
            sb.AppendLine($"\"{r.ReportId}\",\"{r.ShipmentId}\",\"{r.InvoiceName}\",\"{r.GeneratedDateTime}\",\"{r.Route}\",\"{r.Status}\",\"{r.IssuesCount}\",\"{r.Seller}\",\"{r.Buyer}\",\"{r.ReadinessScore}\"");
        }

        return Task.FromResult(sb.ToString());
    }
}
