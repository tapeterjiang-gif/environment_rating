#include "air_quality_rating.h"
#include "thermal_comfort.h"
#include <cmath>
#include "sound_light_rating.h"

int main()
{
    if (noise_rate(NOISE_SLEEP, 30) != NOISE_QUIET) return 1;
    if (illuminance_rate(100) != ILLUMINANCE_DAILY_ACTIVITY) return 1;
    return thermal_rate_humidity(THERMAL_HUMIDITY_EPA, 55) ==
               THERMAL_HUMIDITY_SLIGHTLY_HUMID &&
           std::isfinite(thermal_pmv(25,50,25,0.1,1.1,0.7)) &&
           thermal_ppd(0) == 5 && thermal_rate(0) == THERMAL_NEUTRAL &&
           air_rate_co2(1500.0) == AIR_MODERATE &&
           air_level_co2(1500.0) == AIR_LEVEL_MEDIUM &&
           air_level_pm25(AIR_PM_EEA_AQI_2024, 150.0) == AIR_LEVEL_CRITICAL &&
           air_level_pm10(AIR_PM_EEA_AQI_2024, 150.0) == AIR_LEVEL_HIGH &&
           air_level_hcho(AIR_HCHO_WHO_2010, 0.08) == AIR_LEVEL_MEDIUM &&
           air_rate_pm25(AIR_PM_EEA_AQI_2024, 5.5) == AIR_FAIR &&
           air_rate_pm10(AIR_PM_EEA_AQI_2024, 20.0) == AIR_FAIR &&
           air_rate_hcho(AIR_HCHO_WHO_2010, 0.08) == AIR_MODERATE &&
           air_rate_all(AIR_PM_EEA_AQI_2024, AIR_HCHO_WHO_2010,
                        1500.0, 5.5, 20.0, 0.08,
                        AIR_MASK_ALL) == AIR_MODERATE ? 0 : 1;
}
