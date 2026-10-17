package com.qingping.environmentrating

internal object NativeBridge {
    init {
        System.loadLibrary("environment_rating")
    }

    external fun airRateCo2(value: Double): Int
    external fun airRatePm25(standard: Int, value: Double): Int
    external fun airRatePm10(standard: Int, value: Double): Int
    external fun airRateHcho(standard: Int, value: Double): Int
    external fun airRateAll(
        pmStandard: Int,
        hchoStandard: Int,
        co2: Double,
        pm25: Double,
        pm10: Double,
        hcho: Double,
        validMask: Int
    ): Int

    external fun airLevelCo2(value: Double): Int
    external fun airLevelPm25(standard: Int, value: Double): Int
    external fun airLevelPm10(standard: Int, value: Double): Int
    external fun airLevelHcho(standard: Int, value: Double): Int

    external fun thermalPmv(
        temperature: Double,
        humidity: Double,
        radiantTemperature: Double,
        airSpeed: Double,
        met: Double,
        clo: Double
    ): Double

    external fun thermalPpd(pmv: Double): Double
    external fun thermalRate(pmv: Double): Int
    external fun humidityRate(standard: Int, value: Double): Int
    external fun noiseRate(scene: Int, value: Double): Int
    external fun illuminanceRate(value: Double): Int

    external fun parameterColors(parameter: Int): IntArray?
    external fun airColors(parameter: Int, quality: Int): IntArray?
    external fun thermalColors(sensation: Int): IntArray?
    external fun humidityColors(rating: Int): IntArray?
    external fun noiseColors(rating: Int): IntArray?
    external fun illuminanceColors(rating: Int): IntArray?
}
