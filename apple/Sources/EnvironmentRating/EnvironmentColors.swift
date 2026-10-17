import CEnvironmentRating

public struct RGBColor: Equatable, Hashable, Sendable {
    public let rawValue: UInt32

    public var red: UInt8 { UInt8((rawValue >> 16) & 0xFF) }
    public var green: UInt8 { UInt8((rawValue >> 8) & 0xFF) }
    public var blue: UInt8 { UInt8(rawValue & 0xFF) }

    public var hex: String {
        let digits = String(rawValue, radix: 16, uppercase: true)
        return "#" + String(repeating: "0", count: 6 - digits.count) + digits
    }

    init?(_ value: env_rgb_t) {
        guard value != UInt32.max else { return nil }
        rawValue = value
    }
}

public struct ParameterColors: Equatable, Sendable {
    public let primary: RGBColor
    public let background: RGBColor
}

public struct StateColors: Equatable, Sendable {
    public let primary: RGBColor
    public let background: RGBColor
    public let graphic: RGBColor
    public let text: RGBColor
}

public enum EnvironmentParameter: Sendable {
    case temperature
    case humidity
    case co2
    case pm25
    case pm10
    case formaldehyde
    case tvoc
    case noise
    case illuminance

    var cValue: env_parameter_t {
        switch self {
        case .temperature: return ENV_PARAM_TEMPERATURE
        case .humidity: return ENV_PARAM_HUMIDITY
        case .co2: return ENV_PARAM_CO2
        case .pm25: return ENV_PARAM_PM25
        case .pm10: return ENV_PARAM_PM10
        case .formaldehyde: return ENV_PARAM_HCHO
        case .tvoc: return ENV_PARAM_TVOC
        case .noise: return ENV_PARAM_NOISE
        case .illuminance: return ENV_PARAM_ILLUMINANCE
        }
    }
}

public enum EnvironmentColors {
    public static func parameter(_ parameter: EnvironmentParameter) -> ParameterColors? {
        guard
            let primary = RGBColor(env_color_parameter(parameter.cValue,
                                                       ENV_COLOR_PRIMARY)),
            let background = RGBColor(env_color_parameter(parameter.cValue,
                                                          ENV_COLOR_BACKGROUND))
        else { return nil }
        return ParameterColors(primary: primary, background: background)
    }

    public static func air(_ parameter: EnvironmentParameter,
                           quality: AirQuality) -> StateColors? {
        state { role in
            env_color_air(parameter.cValue, quality.cValue, role)
        }
    }

    public static func thermal(_ sensation: ThermalSensation) -> StateColors? {
        state { role in env_color_thermal(sensation.cValue, role) }
    }

    public static func humidity(_ rating: HumidityRating) -> StateColors? {
        state { role in env_color_humidity(rating.cValue, role) }
    }

    public static func noise(_ rating: NoiseRating) -> StateColors? {
        state { role in env_color_noise(rating.cValue, role) }
    }

    public static func illuminance(_ rating: IlluminanceRating) -> StateColors? {
        state { role in env_color_illuminance(rating.cValue, role) }
    }

    private static func state(
        _ lookup: (env_color_role_t) -> env_rgb_t
    ) -> StateColors? {
        guard
            let primary = RGBColor(lookup(ENV_COLOR_PRIMARY)),
            let background = RGBColor(lookup(ENV_COLOR_BACKGROUND)),
            let graphic = RGBColor(lookup(ENV_COLOR_GRAPHIC)),
            let text = RGBColor(lookup(ENV_COLOR_TEXT))
        else { return nil }
        return StateColors(primary: primary,
                           background: background,
                           graphic: graphic,
                           text: text)
    }
}
