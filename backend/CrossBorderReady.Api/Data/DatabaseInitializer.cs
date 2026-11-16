using System.Security.Cryptography;
using System.Text;
using Microsoft.Data.Sqlite;

namespace CrossBorderReady.Api.Data;

public static class DatabaseInitializer
{
    private static readonly string DbDirectory = Path.Combine(AppContext.BaseDirectory, "Data");
    private static readonly string DbPath = Path.Combine(DbDirectory, "crossborder.db");
    public static string ConnectionString => $"Data Source={DbPath}";

    public static void Initialize()
    {
        if (!Directory.Exists(DbDirectory))
        {
            Directory.CreateDirectory(DbDirectory);
        }

        using var connection = new SqliteConnection(ConnectionString);
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = @"
            CREATE TABLE IF NOT EXISTS Users (
                Id TEXT PRIMARY KEY,
                Email TEXT UNIQUE NOT NULL,
                PasswordHash TEXT NOT NULL,
                Salt TEXT NOT NULL,
                FullName TEXT NOT NULL,
                Role TEXT NOT NULL,
                JobTitle TEXT NOT NULL,
                CreatedAt TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS ShipperProfiles (
                Id TEXT PRIMARY KEY,
                CompanyName TEXT NOT NULL,
                UpsAccountNumber TEXT NOT NULL,
                CompanyAddress TEXT NOT NULL,
                Country TEXT NOT NULL,
                EoriNumber TEXT NOT NULL,
                Ein TEXT NOT NULL,
                IecGstNumber TEXT NOT NULL,
                DefaultShipperName TEXT NOT NULL,
                DefaultShipperContact TEXT NOT NULL,
                DefaultCurrency TEXT NOT NULL,
                DefaultIncoterms TEXT NOT NULL,
                DefaultCountryOfOrigin TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS ValidationReports (
                ReportId TEXT PRIMARY KEY,
                ShipmentId TEXT NOT NULL,
                InvoiceName TEXT NOT NULL,
                GeneratedDateTime TEXT NOT NULL,
                Route TEXT NOT NULL,
                Status TEXT NOT NULL,
                IssuesCount INTEGER NOT NULL,
                ReadinessScore INTEGER NOT NULL,
                Seller TEXT NOT NULL,
                Buyer TEXT NOT NULL,
                LineItems TEXT NOT NULL,
                DetectedIssuesJson TEXT NOT NULL,
                SuggestedCorrectionsJson TEXT NOT NULL
            );
        ";
        command.ExecuteNonQuery();

        SeedUsers(connection);
        SeedShipperProfile(connection);
    }

    private static void SeedUsers(SqliteConnection connection)
    {
        var usersToSeed = new[]
        {
            ("user-1", "priya.sharma@meridiantrade.co.uk", "Priya@2026!", "Priya Sharma", "Logistics Manager", "Shipper & Logistics Lead"),
            ("user-2", "admin@ups.com", "Admin@Customs2026!", "Admin Officer", "Global Customs Admin", "Compliance Administrator"),
            ("user-3", "broker@ups.com", "Broker@2026!", "Broker@2026!", "Licensed Customs Broker", "Brokerage Operations")
        };

        foreach (var (id, email, password, fullName, role, jobTitle) in usersToSeed)
        {
            using var checkCmd = connection.CreateCommand();
            checkCmd.CommandText = "SELECT COUNT(*) FROM Users WHERE Email = @Email";
            checkCmd.Parameters.AddWithValue("@Email", email);
            var exists = (long)(checkCmd.ExecuteScalar() ?? 0) > 0;

            if (!exists)
            {
                var (hash, salt) = HashPassword(password);
                using var insertCmd = connection.CreateCommand();
                insertCmd.CommandText = @"
                    INSERT INTO Users (Id, Email, PasswordHash, Salt, FullName, Role, JobTitle, CreatedAt)
                    VALUES (@Id, @Email, @Hash, @Salt, @FullName, @Role, @JobTitle, @CreatedAt);
                ";
                insertCmd.Parameters.AddWithValue("@Id", id);
                insertCmd.Parameters.AddWithValue("@Email", email);
                insertCmd.Parameters.AddWithValue("@Hash", hash);
                insertCmd.Parameters.AddWithValue("@Salt", salt);
                insertCmd.Parameters.AddWithValue("@FullName", fullName);
                insertCmd.Parameters.AddWithValue("@Role", role);
                insertCmd.Parameters.AddWithValue("@JobTitle", jobTitle);
                insertCmd.Parameters.AddWithValue("@CreatedAt", DateTime.UtcNow.ToString("o"));
                insertCmd.ExecuteNonQuery();
            }
        }
    }

    private static void SeedShipperProfile(SqliteConnection connection)
    {
        using var checkCmd = connection.CreateCommand();
        checkCmd.CommandText = "SELECT COUNT(*) FROM ShipperProfiles WHERE Id = 'priya-profile'";
        var exists = (long)(checkCmd.ExecuteScalar() ?? 0) > 0;

        if (!exists)
        {
            using var insertCmd = connection.CreateCommand();
            insertCmd.CommandText = @"
                INSERT INTO ShipperProfiles (Id, CompanyName, UpsAccountNumber, CompanyAddress, Country, EoriNumber, Ein, IecGstNumber, DefaultShipperName, DefaultShipperContact, DefaultCurrency, DefaultIncoterms, DefaultCountryOfOrigin)
                VALUES ('priya-profile', 'Meridian Trade Ltd.', 'M8R421', '18 Harbour Way, London E14 2AB', 'United Kingdom', 'GB123456789000', 'Not applicable', 'Not applicable', 'Meridian Trade Ltd.', 'Priya Sharma · +44 20 7946 0285', 'GBP — British Pound', 'DAP — Delivered at Place', 'United Kingdom');
            ";
            insertCmd.ExecuteNonQuery();
        }
    }

    public static (string Hash, string Salt) HashPassword(string password)
    {
        byte[] saltBytes = RandomNumberGenerator.GetBytes(16);
        string salt = Convert.ToBase64String(saltBytes);

        byte[] hashBytes = Rfc2898DeriveBytes.Pbkdf2(
            Encoding.UTF8.GetBytes(password),
            saltBytes,
            iterations: 100_000,
            HashAlgorithmName.SHA256,
            outputLength: 32);

        return (Convert.ToBase64String(hashBytes), salt);
    }

    public static bool VerifyPassword(string password, string storedHash, string storedSalt)
    {
        byte[] saltBytes = Convert.FromBase64String(storedSalt);
        byte[] hashBytes = Rfc2898DeriveBytes.Pbkdf2(
            Encoding.UTF8.GetBytes(password),
            saltBytes,
            iterations: 100_000,
            HashAlgorithmName.SHA256,
            outputLength: 32);

        return CryptographicOperations.FixedTimeEquals(hashBytes, Convert.FromBase64String(storedHash));
    }
}

