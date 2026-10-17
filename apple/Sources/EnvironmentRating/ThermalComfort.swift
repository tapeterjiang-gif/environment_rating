import CEnvironmentRating

public enum ThermalSensation: Int, Sendable {
    case unknown = 0
    case cold
    case cool
    case slightlyCool
    case neutral
    case slightlyWarm
    case warm
    case hot

    init(_ value: thermal_sensation_t) {
        switch value {
        case THERMAL_COLD: self = .cold
        case THERMAL_COOL: self = .cool
        case THERMAL_SLIGHTLY_COOL: self = .slightlyCool
        case THERMAL_NEUTRAL: self = .neutral
        case THERMAL_SLIGHTLY_WARM: self = .slightlyWarm
        case THERMAL_WARM: self = .warm
        case THERMAL_HOT: self = .hot
        default: self = .unknown
        }
    }

    var cValue: thermal_sensation_t {
        switch self {
        case .unknown: return THERMAL_UNKNOWN
        case .cold: return THERMAL_COLD
        case .cool: return THERMAL_COOL
        case .slightlyCool: return THERMAL_SLIGHTLY_COOL
        case .neutral: return THERMAL_NEUTRAL
        case .slightlyWarm: return THERMAL_SLIGHTLY_WARM
        case .warm: return THERMAL_WARM
        case .hot: return THERMAL_HOT
        }
    }
}

public enum HumidityStandard: Sendable {
    case epa
    case uba

    var cValue: thermal_humidity_std_t {
        switch self {
        case .epa: return THERMAL_HUMIDITY_EPA
        case .uba: return THERMAL_HUMIDITY_UBA
        }
    }
}

public enum HumidityRating: Int, Sendable {
    case unknown = 0
    case dry
    case suitable
    case slightlyHumid
    case humid

    init(_ value: thermal_humidity_t) {
        switch value {
        case THERMAL_HUMIDITY_DRY: self = .dry
        case THERMAL_HUMIDITY_SUITABLE: self = .suitable
        case THERMAL_HUMIDITY_SLIGHTLY_HUMID: self = .slightlyHumid
        case THERMAL_HUMIDITY_HUMID: self = .humid
        default: self = .unknown
        }
    }

    var cValue: thermal_humidity_t {
        switch self {
        case .unknown: return THERMAL_HUMIDITY_UNKNOWN
        case .dry: return THERMAL_HUMIDITY_DRY
        case .suitable: return THERMAL_HUMIDITY_SUITABLE
        case .slightlyHumid: return THERMAL_HUMIDITY_SLIGHTLY_HUMID
        case .humid: return THERMAL_HUMIDITY_HUMID
        }
    }
}

public struct ThermalResult: Sendable {
    public let pmv: Double
    public let ppd: Double
    public let sensation: ThermalSensation
}

public enum ThermalComfort {
    public static func evaluate(temperature: Double,
                                humidity: Double,
                                radiantTemperature: Double,
                                airSpeed: Double,
                                met: Double = 1.1,
                                clo: Double = 0.7) -> ThermalResult? {
        let pmv = thermal_pmv(temperature, humidity, radiantTemperature,
                              airSpeed, met, clo)
        guard pmv.isFinite else { return nil }
        let ppd = thermal_ppd(pmv)
        guard ppd.isFinite else { return nil }
        return ThermalResult(pmv: pmv,
                             ppd: ppd,
                             sensation: ThermalSensation(thermal_rate(pmv)))
    }

    public static func rateHumidity(_ humidity: Double,
                                    standard: HumidityStandard = .uba) -> HumidityRating {
        HumidityRating(thermal_rate_humidity(standard.cValue, humidity))
    }
}
