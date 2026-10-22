package com.qingping.environmentrating

import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class EnvironmentRatingInstrumentedTest {
    @Test
    fun ratesAirAndLevelValues() {
        assertEquals(AirQuality.GOOD, AirRating.co2(999.0))
        assertEquals(AirQuality.MODERATE, AirRating.co2(1_000.0))
        assertEquals(AirQuality.FAIR, AirRating.pm25(5.1))
        assertEquals(
            AirQuality.FAIR,
            AirRating.pm10(55.0, PMStandard.EPA_AQI_2026)
        )
        assertEquals(ConcentrationLevel.HIGH, AirRating.co2Level(2_001.0))
        assertEquals(
            AirQuality.MODERATE,
            AirRating.overall(co2 = 900.0, pm25 = 16.0, pm10 = 20.0)
        )
        assertEquals(AirQuality.UNKNOWN, AirRating.overall())
        assertEquals(AirQuality.UNKNOWN, AirRating.co2(Double.NaN))
    }

    @Test
    fun ratesThermalNoiseAndIlluminance() {
        val comfort = ThermalComfort.evaluate(
            temperature = 25.0,
            humidity = 50.0,
            radiantTemperature = 25.0,
            airSpeed = 0.1
        )
        assertEquals(ThermalSensation.NEUTRAL, comfort?.sensation)
        assertTrue(comfort?.ppd?.let { it >= 5.0 } == true)
        assertEquals(HumidityRating.SUITABLE, ThermalComfort.rateHumidity(55.0))
        assertEquals(NoiseRating.NOTICEABLE, SoundLightRating.noise(35.1, NoiseScene.HOME))
        assertEquals(IlluminanceRating.DETAIL_WORK, SoundLightRating.illuminance(540.0))
        assertNull(
            ThermalComfort.evaluate(
                temperature = Double.NaN,
                humidity = 50.0,
                radiantTemperature = 25.0,
                airSpeed = 0.1
            )
        )
    }

    @Test
    fun exposesParameterAndStateColors() {
        val temperature = EnvironmentColors.parameter(EnvironmentParameter.TEMPERATURE)
        assertEquals("#F97316", temperature?.primary?.hex)
        assertEquals(0xFFF97316.toInt(), temperature?.primary?.argb)

        val pm = EnvironmentColors.air(EnvironmentParameter.PM25, AirQuality.FAIR)
        assertEquals("#65A30D", pm?.primary?.hex)
        assertEquals("#ECFCCB", pm?.background?.hex)
        assertEquals("#A3E635", pm?.graphic?.hex)
        assertEquals("#365314", pm?.text?.hex)

        assertEquals(
            pm,
            EnvironmentColors.air(EnvironmentParameter.CO2, AirQuality.MODERATE)
        )
        assertNull(EnvironmentColors.air(EnvironmentParameter.CO2, AirQuality.FAIR))
        assertNull(EnvironmentColors.air(EnvironmentParameter.TVOC, AirQuality.GOOD))
        assertEquals("#64748B", EnvironmentColors.thermal(ThermalSensation.UNKNOWN)?.primary?.hex)
    }
}
