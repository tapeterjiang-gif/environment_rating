package com.qingping.environmentrating

enum class AirQuality(internal val code: Int) {
    UNKNOWN(0),
    GOOD(1),
    FAIR(2),
    MODERATE(3),
    POOR(4),
    VERY_POOR(5),
    EXTREMELY_POOR(6);

    companion object {
        internal fun fromCode(code: Int): AirQuality =
            entries.getOrNull(code) ?: UNKNOWN
    }
}

enum class ConcentrationLevel(internal val code: Int) {
    UNKNOWN(0),
    LOW(1),
    MEDIUM(2),
    HIGH(3),
    CRITICAL(4);

    companion object {
        internal fun fromCode(code: Int): ConcentrationLevel =
            entries.getOrNull(code) ?: UNKNOWN
    }
}

enum class PMStandard(internal val code: Int) {
    EEA_AQI_2024(0),
    HJ_633_2026(1),
    EPA_AQI_2026(2)
}

enum class FormaldehydeStandard(internal val code: Int) {
    WHO_2010(0),
    GBT_18883_2022(1),
    OEHHA_2008(2)
}

object AirRating {
    @JvmStatic
    fun co2(ppm: Double): AirQuality =
        AirQuality.fromCode(NativeBridge.airRateCo2(ppm))

    @JvmStatic
    @JvmOverloads
    fun pm25(
        concentration: Double,
        standard: PMStandard = PMStandard.EEA_AQI_2024
    ): AirQuality = AirQuality.fromCode(
        NativeBridge.airRatePm25(standard.code, concentration)
    )

    @JvmStatic
    @JvmOverloads
    fun pm10(
        concentration: Double,
        standard: PMStandard = PMStandard.EEA_AQI_2024
    ): AirQuality = AirQuality.fromCode(
        NativeBridge.airRatePm10(standard.code, concentration)
    )

    @JvmStatic
    @JvmOverloads
    fun formaldehyde(
        concentration: Double,
        standard: FormaldehydeStandard = FormaldehydeStandard.WHO_2010
    ): AirQuality = AirQuality.fromCode(
        NativeBridge.airRateHcho(standard.code, concentration)
    )

    @JvmStatic
    @JvmOverloads
    fun overall(
        pmStandard: PMStandard = PMStandard.EEA_AQI_2024,
        formaldehydeStandard: FormaldehydeStandard = FormaldehydeStandard.WHO_2010,
        co2: Double? = null,
        pm25: Double? = null,
        pm10: Double? = null,
        formaldehyde: Double? = null
    ): AirQuality {
        var mask = 0
        if (co2 != null) mask = mask or 0x01
        if (pm25 != null) mask = mask or 0x02
        if (pm10 != null) mask = mask or 0x04
        if (formaldehyde != null) mask = mask or 0x08
        return AirQuality.fromCode(
            NativeBridge.airRateAll(
                pmStandard.code,
                formaldehydeStandard.code,
                co2 ?: 0.0,
                pm25 ?: 0.0,
                pm10 ?: 0.0,
                formaldehyde ?: 0.0,
                mask
            )
        )
    }

    @JvmStatic
    fun co2Level(ppm: Double): ConcentrationLevel =
        ConcentrationLevel.fromCode(NativeBridge.airLevelCo2(ppm))

    @JvmStatic
    @JvmOverloads
    fun pm25Level(
        concentration: Double,
        standard: PMStandard = PMStandard.EEA_AQI_2024
    ): ConcentrationLevel = ConcentrationLevel.fromCode(
        NativeBridge.airLevelPm25(standard.code, concentration)
    )

    @JvmStatic
    @JvmOverloads
    fun pm10Level(
        concentration: Double,
        standard: PMStandard = PMStandard.EEA_AQI_2024
    ): ConcentrationLevel = ConcentrationLevel.fromCode(
        NativeBridge.airLevelPm10(standard.code, concentration)
    )

    @JvmStatic
    @JvmOverloads
    fun formaldehydeLevel(
        concentration: Double,
        standard: FormaldehydeStandard = FormaldehydeStandard.WHO_2010
    ): ConcentrationLevel = ConcentrationLevel.fromCode(
        NativeBridge.airLevelHcho(standard.code, concentration)
    )
}
