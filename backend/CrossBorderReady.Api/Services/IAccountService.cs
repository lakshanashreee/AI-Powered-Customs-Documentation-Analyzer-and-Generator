using CrossBorderReady.Api.Models;

namespace CrossBorderReady.Api.Services;

public interface IAccountService
{
    Task<AccountProfileDto> GetProfileAsync();
    Task<AccountProfileDto> UpdateProfileAsync(AccountProfileDto updated);
}

