package com.qingping.environmentrating

import java.util.Locale

class RgbColor internal constructor(val rgb: Int) {
    val red: Int get() = (rgb ushr 16) and 0xFF
    val green: Int get() = (rgb ushr 8) and 0xFF
    val blue: Int get() = rgb and 0xFF
    val argb: Int get() = 0xFF000000.toInt() or rgb
    val hex: String get() = String.format(Locale.ROOT, "#%06X", rgb)

    override fun equals(other: Any?): Boolean =
        other is RgbColor && rgb == other.rgb

    override fun hashCode(): Int = rgb
    override fun toString(): String = hex
}

data class ParameterColors(
    val primary: RgbColor,
    val background: RgbColor
)

data class StateColors(
    val primary: RgbColor,
    val background: RgbColor,
    val graphic: RgbColor,
    val text: RgbColor
)

enum class EnvironmentParameter(
    internal val code: Int,
    val materialSymbolName: String,
    val iconResource: Int
) {
    TEMPERATURE(0, "device_thermostat", R.drawable.ic_environment_temperature),
    HUMIDITY(1, "humidity_percentage", R.drawable.ic_environment_humidity),
    CO2(2, "co2", R.drawable.ic_environment_co2),
    PM25(3, "air", R.drawable.ic_environment_pm),
    PM10(4, "air", R.drawable.ic_environment_pm),
    HCHO(5, "science", R.drawable.ic_environment_hcho),
    TVOC(6, "speed", R.drawable.ic_environment_tvoc),
    NOISE(7, "graphic_eq", R.drawable.ic_environment_noise),
    ILLUMINANCE(8, "light_mode", R.drawable.ic_environment_illuminance)
}

object EnvironmentColors {
    @JvmStatic
    fun parameter(parameter: EnvironmentParameter): ParameterColors? =
        NativeBridge.parameterColors(parameter.code)?.toParameterColors()

    @JvmStatic
    fun air(
        parameter: EnvironmentParameter,
        quality: AirQuality
    ): StateColors? = NativeBridge.airColors(parameter.code, quality.code)?.toStateColors()

    @JvmStatic
    fun thermal(sensation: ThermalSensation): StateColors? =
        NativeBridge.thermalColors(sensation.code)?.toStateColors()

    @JvmStatic
    fun humidity(rating: HumidityRating): StateColors? =
        NativeBridge.humidityColors(rating.code)?.toStateColors()

    @JvmStatic
    fun noise(rating: NoiseRating): StateColors? =
        NativeBridge.noiseColors(rating.code)?.toStateColors()

    @JvmStatic
    fun illuminance(rating: IlluminanceRating): StateColors? =
        NativeBridge.illuminanceColors(rating.code)?.toStateColors()

    private fun IntArray.toParameterColors(): ParameterColors? {
        if (size != 2) return null
        return ParameterColors(RgbColor(this[0]), RgbColor(this[1]))
    }

    private fun IntArray.toStateColors(): StateColors? {
        if (size != 4) return null
        return StateColors(
            primary = RgbColor(this[0]),
            background = RgbColor(this[1]),
            graphic = RgbColor(this[2]),
            text = RgbColor(this[3])
        )
    }
}
