package com.qingping.environmentrating

enum class ThermalSensation(internal val code: Int) {
    UNKNOWN(0),
    COLD(1),
    COOL(2),
    SLIGHTLY_COOL(3),
    NEUTRAL(4),
    SLIGHTLY_WARM(5),
    WARM(6),
    HOT(7);

    companion object {
        internal fun fromCode(code: Int): ThermalSensation =
            entries.getOrNull(code) ?: UNKNOWN
    }
}

enum class HumidityStandard(internal val code: Int) {
    EPA(0),
    UBA(1)
}

enum class HumidityRating(internal val code: Int) {
    UNKNOWN(0),
    DRY(1),
    SUITABLE(2),
    SLIGHTLY_HUMID(3),
    HUMID(4);

    companion object {
        internal fun fromCode(code: Int): HumidityRating =
            entries.getOrNull(code) ?: UNKNOWN
    }
}

data class ThermalResult(
    val pmv: Double,
    val ppd: Double,
    val sensation: ThermalSensation
)

object ThermalComfort {
    @JvmStatic
    @JvmOverloads
    fun evaluate(
        temperature: Double,
        humidity: Double,
        radiantTemperature: Double,
        airSpeed: Double,
        met: Double = 1.1,
        clo: Double = 0.7
    ): ThermalResult? {
        val pmv = NativeBridge.thermalPmv(
            temperature,
            humidity,
            radiantTemperature,
            airSpeed,
            met,
            clo
        )
        if (!pmv.isFinite()) return null
        val ppd = NativeBridge.thermalPpd(pmv)
        if (!ppd.isFinite()) return null
        return ThermalResult(
            pmv = pmv,
            ppd = ppd,
            sensation = ThermalSensation.fromCode(NativeBridge.thermalRate(pmv))
        )
    }

    @JvmStatic
    @JvmOverloads
    fun rateHumidity(
        humidity: Double,
        standard: HumidityStandard = HumidityStandard.UBA
    ): HumidityRating = HumidityRating.fromCode(
        NativeBridge.humidityRate(standard.code, humidity)
    )
}
