import CEnvironmentRating

public enum NoiseScene: Sendable {
    case home
    case sleep

    var cValue: noise_scene_t {
        switch self {
        case .home: return NOISE_HOME
        case .sleep: return NOISE_SLEEP
        }
    }
}

public enum NoiseRating: Int, Sendable {
    case unknown = 0
    case quiet
    case noticeable
    case loud
    case veryLoud

    init(_ value: noise_level_t) {
        switch value {
        case NOISE_QUIET: self = .quiet
        case NOISE_NOTICEABLE: self = .noticeable
        case NOISE_LOUD: self = .loud
        case NOISE_VERY_LOUD: self = .veryLoud
        default: self = .unknown
        }
    }
}

public enum IlluminanceRating: Int, Sendable {
    case unknown = 0
    case dim
    case bedroomActivity
    case dailyActivity
    case dining
    case bedsideReading
    case readingAndTasks

    init(_ value: illuminance_level_t) {
        switch value {
        case ILLUMINANCE_DIM: self = .dim
        case ILLUMINANCE_BEDROOM_ACTIVITY: self = .bedroomActivity
        case ILLUMINANCE_DAILY_ACTIVITY: self = .dailyActivity
        case ILLUMINANCE_DINING: self = .dining
        case ILLUMINANCE_BEDSIDE_READING: self = .bedsideReading
        case ILLUMINANCE_READING_AND_TASKS: self = .readingAndTasks
        default: self = .unknown
        }
    }
}

public enum SoundLightRating {
    public static func noise(_ decibels: Double,
                             scene: NoiseScene) -> NoiseRating {
        NoiseRating(noise_rate(scene.cValue, decibels))
    }

    public static func illuminance(_ lux: Double) -> IlluminanceRating {
        IlluminanceRating(illuminance_rate(lux))
    }
}
