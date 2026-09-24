#include "air_quality_rating.h"

#include <math.h>
#include <stddef.h>

/* These optimizations can remove the required NaN/infinity checks. */
#if defined(__FAST_MATH__) || (defined(__FINITE_MATH_ONLY__) && __FINITE_MATH_ONLY__ > 0)
#error "air_quality_rating requires finite-math-only and fast-math to be disabled"
#endif

static int valid_pm_standard(air_pm_std_t standard)
{
    return standard == AIR_PM_HJ_633_2026 || standard == AIR_PM_EPA_AQI_2026 ||
           standard == AIR_PM_EEA_AQI_2024;
}

static int valid_hcho_standard(air_hcho_std_t standard)
{
    return standard == AIR_HCHO_GBT_18883_2022 ||
           standard == AIR_HCHO_WHO_2010 ||
           standard == AIR_HCHO_OEHHA_2008;
}

static int valid_value(double value)
{
    return isfinite(value) && value >= 0.0;
}

/* Rows: PM2.5, PM10. China/Europe store upper bounds; USA stores the
 * first concentration in each next grade after truncation.
 * Sources and product mapping: README.md (section 1.4).
 */
static const unsigned china_upper[2][5] = {
    {35, 60, 115, 150, 250},
    {50, 120, 250, 350, 420}
};
static const double usa_next[2][5] = {
    {9.1, 35.5, 55.5, 125.5, 225.5},
    {55, 155, 255, 355, 425}
};
static const double europe_upper[2][5] = {
    {5, 15, 50, 90, 140},
    {15, 45, 120, 195, 270}
};

/* Upper-inclusive product bands derived from 0.25, 0.5, 1, 2 and 5 times
 * each standard's reference concentration. See README.md section 1.6.
 */
static const double hcho_upper[3][5] = {
    [AIR_HCHO_WHO_2010] = {0.025, 0.050, 0.100, 0.200, 0.500},
    [AIR_HCHO_GBT_18883_2022] = {0.020, 0.040, 0.080, 0.160, 0.400},
    [AIR_HCHO_OEHHA_2008] = {0.01375, 0.0275, 0.055, 0.110, 0.275}
};

static air_quality_t rate_pm(air_pm_std_t standard, double value,
                             size_t parameter)
{
    size_t i;
    if (!valid_pm_standard(standard) || !valid_value(value)) {
        return AIR_UNKNOWN;
    }
    for (i = 0; i < 5; ++i) {
        int in_grade;
        if (standard == AIR_PM_HJ_633_2026) {
            unsigned upper = china_upper[parameter][i];
            double boundary = (double)upper + 0.5;
            /* Integer round-to-nearest, ties-to-even: a half value stays
             * below the transition only when the upper integer is even.
             * Compare directly to avoid rounding-mode and overflow issues.
             */
            in_grade = value < boundary ||
                       (value == boundary && upper % 2u == 0u);
        } else if (standard == AIR_PM_EPA_AQI_2026) {
            /* Equivalent grading after truncation, without multiplying
             * by ten (which can round an adjacent double across a boundary).
             * Decimal thresholds use their nearest double representation.
             */
            in_grade = value < usa_next[parameter][i];
        } else {
            in_grade = value <= europe_upper[parameter][i];
        }
        if (in_grade) {
            return (air_quality_t)(i + 1);
        }
    }
    return AIR_EXTREMELY_POOR;
}

air_quality_t air_rate_co2(double co2)
{
    if (!valid_value(co2)) {
        return AIR_UNKNOWN;
    }
    if (co2 < 1000.0) {
        return AIR_GOOD;
    }
    return co2 <= 2000.0 ? AIR_MODERATE : AIR_POOR;
}

air_quality_t air_rate_pm25(air_pm_std_t standard, double pm25)
{
    return rate_pm(standard, pm25, 0);
}

air_quality_t air_rate_pm10(air_pm_std_t standard, double pm10)
{
    return rate_pm(standard, pm10, 1);
}

air_quality_t air_rate_hcho(air_hcho_std_t standard, double hcho)
{
    size_t i;
    if (!valid_hcho_standard(standard) || !valid_value(hcho)) {
        return AIR_UNKNOWN;
    }
    for (i = 0; i < 5; ++i) {
        if (hcho <= hcho_upper[standard][i]) {
            return (air_quality_t)(i + 1);
        }
    }
    return AIR_EXTREMELY_POOR;
}

/* Product mapping; Matter defines the enum, not these grade conversions. */
static air_level_t quality_to_level(air_quality_t quality)
{
    switch (quality) {
    case AIR_GOOD: return AIR_LEVEL_LOW;
    case AIR_FAIR:
    case AIR_MODERATE: return AIR_LEVEL_MEDIUM;
    case AIR_POOR:
    case AIR_VERY_POOR: return AIR_LEVEL_HIGH;
    case AIR_EXTREMELY_POOR: return AIR_LEVEL_CRITICAL;
    default: return AIR_LEVEL_UNKNOWN;
    }
}

air_level_t air_level_co2(double co2)
{
    return quality_to_level(air_rate_co2(co2));
}

air_level_t air_level_pm25(air_pm_std_t standard, double pm25)
{
    return quality_to_level(air_rate_pm25(standard, pm25));
}

air_level_t air_level_pm10(air_pm_std_t standard, double pm10)
{
    return quality_to_level(air_rate_pm10(standard, pm10));
}

air_level_t air_level_hcho(air_hcho_std_t standard, double hcho)
{
    return quality_to_level(air_rate_hcho(standard, hcho));
}

air_quality_t air_rate_all(air_pm_std_t pm_std, air_hcho_std_t hcho_std,
                           double co2, double pm25, double pm10, double hcho,
                           air_param_mask_t valid_mask)
{
    air_quality_t overall = AIR_UNKNOWN;
    air_quality_t grade;
    if (!valid_pm_standard(pm_std) || !valid_hcho_standard(hcho_std) ||
        (valid_mask & ~AIR_MASK_ALL) != 0u) {
        return AIR_UNKNOWN;
    }
    if ((valid_mask & AIR_MASK_CO2) != 0u) {
        overall = air_rate_co2(co2);
    }
    if ((valid_mask & AIR_MASK_PM25) != 0u) {
        grade = air_rate_pm25(pm_std, pm25);
        if (grade > overall) {
            overall = grade;
        }
    }
    if ((valid_mask & AIR_MASK_PM10) != 0u) {
        grade = air_rate_pm10(pm_std, pm10);
        if (grade > overall) {
            overall = grade;
        }
    }
    if ((valid_mask & AIR_MASK_HCHO) != 0u) {
        grade = air_rate_hcho(hcho_std, hcho);
        if (grade > overall) {
            overall = grade;
        }
    }
    return overall;
}
