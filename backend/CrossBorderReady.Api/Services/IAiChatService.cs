using CrossBorderReady.Api.Models;

namespace CrossBorderReady.Api.Services;

public interface IAiChatService
{
    Task<AiChatResponse> AskAssistantAsync(AiChatRequest request, CancellationToken cancellationToken = default);
}

