namespace CrossBorderReady.Api.Models;

public record PersonalInfoDto(
    string FullName,
    string Email,
    string PhoneNumber,
    string JobTitle,
    string PreferredLanguage,
    string TimeZone,
    string AvatarUrl,
    int InvoicesChecked,
    int ErrorsFixed,
    int ReportsSubmitted
);

public record CompanyShipperDetailsDto(
    string CompanyName,
    string UpsAccountNumber,
    string CompanyAddress,
    string Country,
    string EoriNumber,
    string Ein,
    string IecGstNumber,
    string DefaultShipperName,
    string DefaultShipperContact,
    string DefaultCurrency,
    string DefaultIncoterms,
    string DefaultCountryOfOrigin
);

public record ValidationPreferencesDto(
    string ValidationStrictness, // "Basic" | "Standard" | "Strict"
    bool AutoValidateOnUpload,
    bool HighlightMissingFields,
    bool FlagValueCurrencyMismatches,
    bool CheckHsCodeOriginConsistency,
    bool ShowAiExplanations,
    string DefaultReportFormat // "PDF" | "Excel"
);

public record AccountProfileDto(
    PersonalInfoDto PersonalInfo,
    CompanyShipperDetailsDto CompanyDetails,
    ValidationPreferencesDto ValidationPreferences
);

public record LoginRequest(
    string Email,
    string Password
);

public record AuthUserDto(
    string Id,
    string Email,
    string FullName,
    string Role,
    string JobTitle
);

public record AuthResponse(
    bool Success,
    string Message,
    string? Token,
    AuthUserDto? User
);

