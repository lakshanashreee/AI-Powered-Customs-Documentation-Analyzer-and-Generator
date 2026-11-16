using CrossBorderReady.Api.Data;
using CrossBorderReady.Api.Models;
using Microsoft.Data.Sqlite;

namespace CrossBorderReady.Api.Services;

public class AuthService : IAuthService
{
    private readonly ILogger<AuthService> _logger;

    public AuthService(ILogger<AuthService> logger)
    {
        _logger = logger;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        _logger.LogInformation("Attempting login for email: {Email}", request.Email);

        using var connection = new SqliteConnection(DatabaseInitializer.ConnectionString);
        await connection.OpenAsync();

        using var command = connection.CreateCommand();
        command.CommandText = "SELECT Id, Email, PasswordHash, Salt, FullName, Role, JobTitle FROM Users WHERE LOWER(Email) = LOWER(@Email)";
        command.Parameters.AddWithValue("@Email", request.Email.Trim());

        using var reader = await command.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            var id = reader.GetString(0);
            var email = reader.GetString(1);
            var storedHash = reader.GetString(2);
            var salt = reader.GetString(3);
            var fullName = reader.GetString(4);
            var role = reader.GetString(5);
            var jobTitle = reader.GetString(6);

            bool isValid = DatabaseInitializer.VerifyPassword(request.Password, storedHash, salt);
            if (isValid)
            {
                var userDto = new AuthUserDto(id, email, fullName, role, jobTitle);
                var token = $"ups_jwt_{Guid.NewGuid():N}_{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";
                _logger.LogInformation("Login successful for user {Email} ({FullName})", email, fullName);

                return new AuthResponse(
                    Success: true,
                    Message: "Authentication successful.",
                    Token: token,
                    User: userDto
                );
            }
        }

        _logger.LogWarning("Invalid credentials attempt for email: {Email}", request.Email);
        return new AuthResponse(
            Success: false,
            Message: "Invalid email or password. Only registered credentials can access CrossBorder Ready.",
            Token: null,
            User: null
        );
    }

    public async Task<List<AuthUserDto>> GetRegisteredUsersAsync()
    {
        var users = new List<AuthUserDto>();
        using var connection = new SqliteConnection(DatabaseInitializer.ConnectionString);
        await connection.OpenAsync();

        using var command = connection.CreateCommand();
        command.CommandText = "SELECT Id, Email, FullName, Role, JobTitle FROM Users";

        using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            users.Add(new AuthUserDto(
                reader.GetString(0),
                reader.GetString(1),
                reader.GetString(2),
                reader.GetString(3),
                reader.GetString(4)
            ));
        }

        return users;
    }
}

