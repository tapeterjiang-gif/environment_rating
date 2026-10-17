package com.qingping.environmentrating

enum class NoiseScene(internal val code: Int) {
    HOME(0),
    SLEEP(1)
}

enum class NoiseRating(internal val code: Int) {
    UNKNOWN(0),
    QUIET(1),
    NOTICEABLE(2),
    LOUD(3),
    VERY_LOUD(4);

    companion object {
        internal fun fromCode(code: Int): NoiseRating =
            entries.getOrNull(code) ?: UNKNOWN
    }
}

enum class IlluminanceRating(internal val code: Int) {
    UNKNOWN(0),
    DIM(1),
    BEDROOM_ACTIVITY(2),
    DAILY_ACTIVITY(3),
    DINING(4),
    BEDSIDE_READING(5),
    READING_AND_TASKS(6);

    companion object {
        internal fun fromCode(code: Int): IlluminanceRating =
            entries.getOrNull(code) ?: UNKNOWN
    }
}

object SoundLightRating {
    @JvmStatic
    fun noise(decibels: Double, scene: NoiseScene): NoiseRating =
        NoiseRating.fromCode(NativeBridge.noiseRate(scene.code, decibels))

    @JvmStatic
    fun illuminance(lux: Double): IlluminanceRating =
        IlluminanceRating.fromCode(NativeBridge.illuminanceRate(lux))
}
