namespace CrossBorderReady.Api.Models;

public record AiChatMessage(
    string Sender, // "user" | "assistant"
    string Content,
    DateTime Timestamp
);

public record AiChatRequest(
    string Message,
    string? ShipmentId = null,
    string? Context = null
);

public record AiChatResponse(
    string Response,
    List<string>? SuggestedFollowUps,
    DateTime Timestamp,
    string ModelUsed = "Qwen-2.5-72B-Instruct"
);

