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

    var cValue: noise_level_t {
        switch self {
        case .unknown: return NOISE_UNKNOWN
        case .quiet: return NOISE_QUIET
        case .noticeable: return NOISE_NOTICEABLE
        case .loud: return NOISE_LOUD
        case .veryLoud: return NOISE_VERY_LOUD
        }
    }
}

public enum IlluminanceRating: Int, Sendable {
    case unknown = 0
    case lowLight
    case ambient
    case dailyActivity
    case reading
    case focusedActivity
    case detailWork

    init(_ value: illuminance_level_t) {
        switch value {
        case ILLUMINANCE_LOW_LIGHT: self = .lowLight
        case ILLUMINANCE_AMBIENT: self = .ambient
        case ILLUMINANCE_DAILY_ACTIVITY: self = .dailyActivity
        case ILLUMINANCE_READING: self = .reading
        case ILLUMINANCE_FOCUSED_ACTIVITY: self = .focusedActivity
        case ILLUMINANCE_DETAIL_WORK: self = .detailWork
        default: self = .unknown
        }
    }

    var cValue: illuminance_level_t {
        switch self {
        case .unknown: return ILLUMINANCE_UNKNOWN
        case .lowLight: return ILLUMINANCE_LOW_LIGHT
        case .ambient: return ILLUMINANCE_AMBIENT
        case .dailyActivity: return ILLUMINANCE_DAILY_ACTIVITY
        case .reading: return ILLUMINANCE_READING
        case .focusedActivity: return ILLUMINANCE_FOCUSED_ACTIVITY
        case .detailWork: return ILLUMINANCE_DETAIL_WORK
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
