import CEnvironmentRating

public enum AirQuality: Int, Sendable {
    case unknown = 0
    case good
    case fair
    case moderate
    case poor
    case veryPoor
    case extremelyPoor

    init(_ value: air_quality_t) {
        switch value {
        case AIR_GOOD: self = .good
        case AIR_FAIR: self = .fair
        case AIR_MODERATE: self = .moderate
        case AIR_POOR: self = .poor
        case AIR_VERY_POOR: self = .veryPoor
        case AIR_EXTREMELY_POOR: self = .extremelyPoor
        default: self = .unknown
        }
    }
}

public enum ConcentrationLevel: Int, Sendable {
    case unknown = 0
    case low
    case medium
    case high
    case critical

    init(_ value: air_level_t) {
        switch value {
        case AIR_LEVEL_LOW: self = .low
        case AIR_LEVEL_MEDIUM: self = .medium
        case AIR_LEVEL_HIGH: self = .high
        case AIR_LEVEL_CRITICAL: self = .critical
        default: self = .unknown
        }
    }
}

public enum PMStandard: Sendable {
    case eeaAQI2024
    case hj6332026
    case epaAQI2026

    var cValue: air_pm_std_t {
        switch self {
        case .eeaAQI2024: return AIR_PM_EEA_AQI_2024
        case .hj6332026: return AIR_PM_HJ_633_2026
        case .epaAQI2026: return AIR_PM_EPA_AQI_2026
        }
    }
}

public enum FormaldehydeStandard: Sendable {
    case who2010
    case gbt188832022
    case oehha2008

    var cValue: air_hcho_std_t {
        switch self {
        case .who2010: return AIR_HCHO_WHO_2010
        case .gbt188832022: return AIR_HCHO_GBT_18883_2022
        case .oehha2008: return AIR_HCHO_OEHHA_2008
        }
    }
}

private enum AirMask {
    // These stable values mirror AIR_MASK_* in air_quality_rating.h.
    static let co2: UInt32 = 0x01
    static let pm25: UInt32 = 0x02
    static let pm10: UInt32 = 0x04
    static let formaldehyde: UInt32 = 0x08
}

public enum AirRating {
    public static func co2(_ ppm: Double) -> AirQuality {
        AirQuality(air_rate_co2(ppm))
    }

    public static func pm25(_ concentration: Double,
                            standard: PMStandard = .eeaAQI2024) -> AirQuality {
        AirQuality(air_rate_pm25(standard.cValue, concentration))
    }

    public static func pm10(_ concentration: Double,
                            standard: PMStandard = .eeaAQI2024) -> AirQuality {
        AirQuality(air_rate_pm10(standard.cValue, concentration))
    }

    public static func formaldehyde(_ concentration: Double,
                                    standard: FormaldehydeStandard = .who2010) -> AirQuality {
        AirQuality(air_rate_hcho(standard.cValue, concentration))
    }

    public static func overall(pmStandard: PMStandard = .eeaAQI2024,
                               formaldehydeStandard: FormaldehydeStandard = .who2010,
                               co2: Double? = nil,
                               pm25: Double? = nil,
                               pm10: Double? = nil,
                               formaldehyde: Double? = nil) -> AirQuality {
        var valid: UInt32 = 0
        if co2 != nil { valid |= AirMask.co2 }
        if pm25 != nil { valid |= AirMask.pm25 }
        if pm10 != nil { valid |= AirMask.pm10 }
        if formaldehyde != nil { valid |= AirMask.formaldehyde }
        return AirQuality(air_rate_all(pmStandard.cValue,
                                      formaldehydeStandard.cValue,
                                      co2 ?? 0, pm25 ?? 0, pm10 ?? 0,
                                      formaldehyde ?? 0, valid))
    }

    public static func co2Level(_ ppm: Double) -> ConcentrationLevel {
        ConcentrationLevel(air_level_co2(ppm))
    }

    public static func pm25Level(_ concentration: Double,
                                 standard: PMStandard = .eeaAQI2024) -> ConcentrationLevel {
        ConcentrationLevel(air_level_pm25(standard.cValue, concentration))
    }

    public static func pm10Level(_ concentration: Double,
                                 standard: PMStandard = .eeaAQI2024) -> ConcentrationLevel {
        ConcentrationLevel(air_level_pm10(standard.cValue, concentration))
    }

    public static func formaldehydeLevel(
        _ concentration: Double,
        standard: FormaldehydeStandard = .who2010
    ) -> ConcentrationLevel {
        ConcentrationLevel(air_level_hcho(standard.cValue, concentration))
    }
}
