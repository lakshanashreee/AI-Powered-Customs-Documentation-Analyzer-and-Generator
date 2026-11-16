using CrossBorderReady.Api.Data;
using CrossBorderReady.Api.Models;
using Microsoft.Data.Sqlite;

namespace CrossBorderReady.Api.Services;

public class AccountService : IAccountService
{
    private readonly ILogger<AccountService> _logger;
    private ValidationPreferencesDto _preferences = new(
        ValidationStrictness: "Standard",
        AutoValidateOnUpload: true,
        HighlightMissingFields: true,
        FlagValueCurrencyMismatches: true,
        CheckHsCodeOriginConsistency: true,
        ShowAiExplanations: true,
        DefaultReportFormat: "PDF"
    );

    public AccountService(ILogger<AccountService> logger)
    {
        _logger = logger;
    }

    public async Task<AccountProfileDto> GetProfileAsync()
    {
        using var connection = new SqliteConnection(DatabaseInitializer.ConnectionString);
        await connection.OpenAsync();

        // 1. Fetch Priya's Personal Info from Users table
        using var userCmd = connection.CreateCommand();
        userCmd.CommandText = "SELECT FullName, Email, JobTitle FROM Users WHERE Email = 'priya.sharma@meridiantrade.co.uk'";
        string fullName = "Priya Sharma";
        string email = "priya.sharma@meridiantrade.co.uk";
        string jobTitle = "Logistics Manager";

        using (var reader = await userCmd.ExecuteReaderAsync())
        {
            if (await reader.ReadAsync())
            {
                fullName = reader.GetString(0);
                email = reader.GetString(1);
                jobTitle = reader.GetString(2);
            }
        }

        var personalInfo = new PersonalInfoDto(
            FullName: fullName,
            Email: email,
            PhoneNumber: "+44 20 7946 0285",
            JobTitle: jobTitle,
            PreferredLanguage: "English (United Kingdom)",
            TimeZone: "(GMT+00:00) London",
            AvatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop",
            InvoicesChecked: 248,
            ErrorsFixed: 86,
            ReportsSubmitted: 128
        );

        // 2. Fetch Priya's Company & Shipper Details from ShipperProfiles table
        using var shipperCmd = connection.CreateCommand();
        shipperCmd.CommandText = "SELECT CompanyName, UpsAccountNumber, CompanyAddress, Country, EoriNumber, Ein, IecGstNumber, DefaultShipperName, DefaultShipperContact, DefaultCurrency, DefaultIncoterms, DefaultCountryOfOrigin FROM ShipperProfiles WHERE Id = 'priya-profile'";

        CompanyShipperDetailsDto companyDetails = new(
            CompanyName: "Meridian Trade Ltd.",
            UpsAccountNumber: "M8R421",
            CompanyAddress: "18 Harbour Way, London E14 2AB",
            Country: "United Kingdom",
            EoriNumber: "GB123456789000",
            Ein: "Not applicable",
            IecGstNumber: "Not applicable",
            DefaultShipperName: "Meridian Trade Ltd.",
            DefaultShipperContact: "Priya Sharma · +44 20 7946 0285",
            DefaultCurrency: "GBP — British Pound",
            DefaultIncoterms: "DAP — Delivered at Place",
            DefaultCountryOfOrigin: "United Kingdom"
        );

        using (var reader = await shipperCmd.ExecuteReaderAsync())
        {
            if (await reader.ReadAsync())
            {
                companyDetails = new CompanyShipperDetailsDto(
                    CompanyName: reader.GetString(0),
                    UpsAccountNumber: reader.GetString(1),
                    CompanyAddress: reader.GetString(2),
                    Country: reader.GetString(3),
                    EoriNumber: reader.GetString(4),
                    Ein: reader.GetString(5),
                    IecGstNumber: reader.GetString(6),
                    DefaultShipperName: reader.GetString(7),
                    DefaultShipperContact: reader.GetString(8),
                    DefaultCurrency: reader.GetString(9),
                    DefaultIncoterms: reader.GetString(10),
                    DefaultCountryOfOrigin: reader.GetString(11)
                );
            }
        }

        return new AccountProfileDto(personalInfo, companyDetails, _preferences);
    }

    public async Task<AccountProfileDto> UpdateProfileAsync(AccountProfileDto updated)
    {
        using var connection = new SqliteConnection(DatabaseInitializer.ConnectionString);
        await connection.OpenAsync();

        // Update ShipperProfiles in SQLite
        using var cmd = connection.CreateCommand();
        cmd.CommandText = @"
            UPDATE ShipperProfiles
            SET CompanyName = @CompanyName,
                UpsAccountNumber = @UpsAccountNumber,
                CompanyAddress = @CompanyAddress,
                Country = @Country,
                EoriNumber = @EoriNumber,
                Ein = @Ein,
                IecGstNumber = @IecGstNumber,
                DefaultShipperName = @DefaultShipperName,
                DefaultShipperContact = @DefaultShipperContact,
                DefaultCurrency = @DefaultCurrency,
                DefaultIncoterms = @DefaultIncoterms,
                DefaultCountryOfOrigin = @DefaultCountryOfOrigin
            WHERE Id = 'priya-profile';
        ";
        cmd.Parameters.AddWithValue("@CompanyName", updated.CompanyDetails.CompanyName);
        cmd.Parameters.AddWithValue("@UpsAccountNumber", updated.CompanyDetails.UpsAccountNumber);
        cmd.Parameters.AddWithValue("@CompanyAddress", updated.CompanyDetails.CompanyAddress);
        cmd.Parameters.AddWithValue("@Country", updated.CompanyDetails.Country);
        cmd.Parameters.AddWithValue("@EoriNumber", updated.CompanyDetails.EoriNumber);
        cmd.Parameters.AddWithValue("@Ein", updated.CompanyDetails.Ein);
        cmd.Parameters.AddWithValue("@IecGstNumber", updated.CompanyDetails.IecGstNumber);
        cmd.Parameters.AddWithValue("@DefaultShipperName", updated.CompanyDetails.DefaultShipperName);
        cmd.Parameters.AddWithValue("@DefaultShipperContact", updated.CompanyDetails.DefaultShipperContact);
        cmd.Parameters.AddWithValue("@DefaultCurrency", updated.CompanyDetails.DefaultCurrency);
        cmd.Parameters.AddWithValue("@DefaultIncoterms", updated.CompanyDetails.DefaultIncoterms);
        cmd.Parameters.AddWithValue("@DefaultCountryOfOrigin", updated.CompanyDetails.DefaultCountryOfOrigin);

        await cmd.ExecuteNonQueryAsync();
        _preferences = updated.ValidationPreferences;

        _logger.LogInformation("Priya Sharma profile updated in SQLite database");
        return await GetProfileAsync();
    }
}
