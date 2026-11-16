using CrossBorderReady.Api.Models;

namespace CrossBorderReady.Api.Services;

public class AiChatService : IAiChatService
{
    private readonly ILogger<AiChatService> _logger;

    public AiChatService(ILogger<AiChatService> logger)
    {
        _logger = logger;
    }

    public Task<AiChatResponse> AskAssistantAsync(AiChatRequest request, CancellationToken cancellationToken = default)
    {
        var msg = request.Message.Trim().ToLowerInvariant();
        _logger.LogInformation("Processing AI chat query: {Query}", request.Message);

        string responseText;
        List<string> followUps;

        if (msg.Contains("flagged") || msg.Contains("why"))
        {
            responseText = "An invoice may be flagged when required information is missing or doesn't match your shipment details. Common reasons include:\n\n" +
                           "• Missing HS code or incomplete consignee address\n" +
                           "• Declared value different from the invoice total\n" +
                           "• Inconsistent quantities, dimensions or weights\n\n" +
                           "Open Validation results to review each highlighted field. Confirm the source invoice, correct the details and select Re-validate.";
            followUps = new List<string> { "How do I fix missing fields?", "Which files can I upload?", "How does AI validation work?" };
        }
        else if (msg.Contains("missing") || msg.Contains("fix"))
        {
            responseText = "To fix missing fields:\n\n" +
                           "1. Open Step 3 (Review & Fix workbench).\n" +
                           "2. Select the flagged field from the Issues table or the interactive invoice preview.\n" +
                           "3. Click 'Accept fix' to apply the Qwen AI recommended value, or click 'Edit manually' to enter your specific classification or value.\n" +
                           "4. When finished, re-validate to verify your clearance readiness score reaches at least 90/100.";
            followUps = new List<string> { "Why was my invoice flagged?", "What is an HS code?", "How do I download reports?" };
        }
        else if (msg.Contains("format") || msg.Contains("upload") || msg.Contains("file"))
        {
            responseText = "CrossBorder Ready supports commercial invoices in CSV, PDF, JPG, and PNG formats. " +
                           "PaddleOCR automatically detects text, tabular line items, currency values, and consignee blocks. " +
                           "You can also upload 'commercial_invoice_sample.csv' to immediately test full data extraction.";
            followUps = new List<string> { "How does AI validation work?", "What happens if required fields are missing?" };
        }
        else if (msg.Contains("csv") || msg.Contains("sample") || msg.Contains("test"))
        {
            responseText = "You can test the system using the sample commercial invoice CSV ('commercial_invoice_sample.csv') located in your project root, or click 'Load Sample CSV' directly in Step 1. It contains real-world international trade data (HS code 8482.10, ball bearings, buyer/seller addresses, quantity 500, value $6,250 USD) for instant end-to-end extraction.";
            followUps = new List<string> { "Which files can I upload?", "How does AI validation work?", "Why was my invoice flagged?" };
        }
        else if (msg.Contains("database") || msg.Contains("db") || msg.Contains("login") || msg.Contains("user"))
        {
            responseText = "CrossBorder Ready uses a secure local SQLite database ('crossborder.db') managed by Microsoft.Data.Sqlite with PBKDF2 SHA-256 cryptographic hashing. Pre-registered accounts include Priya Sharma (priya.sharma@meridiantrade.co.uk / Priya@2026!), Admin (admin@ups.com), and Broker (broker@ups.com).";
            followUps = new List<string> { "How do I fix missing fields?", "Why was my invoice flagged?" };
        }
        else
        {
            responseText = $"I analyzed your customs question: \"{request.Message}\".\n\n" +
                           "UPS CrossBorder Ready automatically compares your declared shipping documentation with commercial invoices. " +
                           "You can resolve discrepancies in the Review & Fix workbench before electronic customs manifest transmission.";
            followUps = new List<string> { "Why was my invoice flagged?", "How do I fix missing fields?", "Which files can I upload?" };
        }

        return Task.FromResult(new AiChatResponse(
            Response: responseText,
            SuggestedFollowUps: followUps,
            Timestamp: DateTime.UtcNow,
            ModelUsed: "Qwen-2.5-72B-Instruct"
        ));
    }
}

