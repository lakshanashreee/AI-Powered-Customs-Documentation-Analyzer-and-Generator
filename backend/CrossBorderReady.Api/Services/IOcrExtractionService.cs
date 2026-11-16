using CrossBorderReady.Api.Models;

namespace CrossBorderReady.Api.Services;

public interface IOcrExtractionService
{
    Task<PaddleOcrExtractionResponse> ExtractInvoiceAsync(IFormFile file, CancellationToken cancellationToken = default);
}

