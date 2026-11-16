using CrossBorderReady.Api.Models;

namespace CrossBorderReady.Api.Services;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<List<AuthUserDto>> GetRegisteredUsersAsync();
}

