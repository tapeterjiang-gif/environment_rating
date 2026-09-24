#include "air_quality_rating.h"

#include <float.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>

static unsigned checks;
#define CHECK(expression) do { \
    ++checks; \
    if (!(expression)) { \
        fprintf(stderr, "line %d: %s\n", __LINE__, #expression); \
        exit(EXIT_FAILURE); \
    } \
} while (0)

typedef air_quality_t (*pm_function)(air_pm_std_t, double);
static const air_level_t expected_levels[] = {
    AIR_LEVEL_LOW, AIR_LEVEL_MEDIUM, AIR_LEVEL_MEDIUM,
    AIR_LEVEL_HIGH, AIR_LEVEL_HIGH, AIR_LEVEL_CRITICAL
};

static void test_boundaries(void)
{
    /* Expected transitions from the approved tables, including rounding.
     * at_lower indicates whether the exact transition stays in lower grade.
     */
    static const struct {
        air_pm_std_t standard;
        pm_function rate;
        double boundary[5];
        int at_lower[5];
    } cases[] = {
        {AIR_PM_HJ_633_2026, air_rate_pm25,
         {35.5, 60.5, 115.5, 150.5, 250.5}, {0, 1, 0, 1, 1}},
        {AIR_PM_HJ_633_2026, air_rate_pm10,
         {50.5, 120.5, 250.5, 350.5, 420.5}, {1, 1, 1, 1, 1}},
        {AIR_PM_EPA_AQI_2026, air_rate_pm25,
         {9.1, 35.5, 55.5, 125.5, 225.5}, {0, 0, 0, 0, 0}},
        {AIR_PM_EPA_AQI_2026, air_rate_pm10,
         {55, 155, 255, 355, 425}, {0, 0, 0, 0, 0}},
        {AIR_PM_EEA_AQI_2024, air_rate_pm25,
         {5, 15, 50, 90, 140}, {1, 1, 1, 1, 1}},
        {AIR_PM_EEA_AQI_2024, air_rate_pm10,
         {15, 45, 120, 195, 270}, {1, 1, 1, 1, 1}}
    };
    size_t c, i;
    for (c = 0; c < sizeof(cases) / sizeof(cases[0]); ++c) {
        pm_function rate = cases[c].rate;
        air_pm_std_t standard = cases[c].standard;
        CHECK(rate(standard, 0.0) == AIR_GOOD);
        CHECK(rate(standard, -0.0) == AIR_GOOD);
        CHECK(rate(standard, DBL_MAX) == AIR_EXTREMELY_POOR);
        for (i = 0; i < 5; ++i) {
            double b = cases[c].boundary[i];
            CHECK(rate(standard, nextafter(b, -INFINITY)) == (air_quality_t)(i + 1));
            CHECK(rate(standard, b) == (air_quality_t)(i + (cases[c].at_lower[i] ? 1 : 2)));
            CHECK(rate(standard, nextafter(b, INFINITY)) == (air_quality_t)(i + 2));
            {
                air_level_t (*level)(air_pm_std_t, double) =
                    rate == air_rate_pm25 ? air_level_pm25 : air_level_pm10;
                CHECK(level(standard, nextafter(b, -INFINITY)) == expected_levels[i]);
                CHECK(level(standard, b) == expected_levels[i + !cases[c].at_lower[i]]);
                CHECK(level(standard, nextafter(b, INFINITY)) == expected_levels[i + 1]);
            }
        }
    }
    CHECK(air_rate_pm25(AIR_PM_EPA_AQI_2026, 9.09) == AIR_GOOD);
    CHECK(air_rate_pm25(AIR_PM_EPA_AQI_2026, 35.49) == AIR_FAIR);
    CHECK(air_rate_pm10(AIR_PM_EPA_AQI_2026, 54.99) == AIR_GOOD);
    CHECK(air_rate_pm25(AIR_PM_HJ_633_2026, 35.49) == AIR_GOOD);
    CHECK(air_rate_pm25(AIR_PM_HJ_633_2026, 60.51) == AIR_MODERATE);
    CHECK(air_rate_co2(0.0) == AIR_GOOD);
    CHECK(air_rate_co2(nextafter(1000.0, 0.0)) == AIR_GOOD);
    CHECK(air_rate_co2(1000.0) == AIR_MODERATE);
    CHECK(air_rate_co2(nextafter(1000.0, INFINITY)) == AIR_MODERATE);
    CHECK(air_rate_co2(nextafter(2000.0, 0.0)) == AIR_MODERATE);
    CHECK(air_rate_co2(2000.0) == AIR_MODERATE);
    CHECK(air_rate_co2(nextafter(2000.0, INFINITY)) == AIR_POOR);
    CHECK(air_rate_co2(DBL_MAX) == AIR_POOR);

    {
        static const double boundaries[3][5] = {
            {0.025, 0.050, 0.100, 0.200, 0.500},
            {0.020, 0.040, 0.080, 0.160, 0.400},
            {0.01375, 0.0275, 0.055, 0.110, 0.275}
        };
        int standard;
        size_t i;
        for (standard = 0; standard < 3; ++standard) {
            CHECK(air_rate_hcho((air_hcho_std_t)standard, 0.0) == AIR_GOOD);
            CHECK(air_rate_hcho((air_hcho_std_t)standard, DBL_MAX) ==
                  AIR_EXTREMELY_POOR);
            for (i = 0; i < 5; ++i) {
                double b = boundaries[standard][i];
                CHECK(air_level_hcho((air_hcho_std_t)standard,
                                     nextafter(b, -INFINITY)) == expected_levels[i]);
                CHECK(air_level_hcho((air_hcho_std_t)standard, b) == expected_levels[i]);
                CHECK(air_level_hcho((air_hcho_std_t)standard,
                                     nextafter(b, INFINITY)) == expected_levels[i + 1]);
                CHECK(air_rate_hcho((air_hcho_std_t)standard,
                                    nextafter(b, -INFINITY)) ==
                      (air_quality_t)(i + 1));
                CHECK(air_rate_hcho((air_hcho_std_t)standard, b) ==
                      (air_quality_t)(i + 1));
                CHECK(air_rate_hcho((air_hcho_std_t)standard,
                                    nextafter(b, INFINITY)) ==
                      (air_quality_t)(i + 2));
            }
        }
    }
}

static void test_invalid(void)
{
    const double invalid[] = {-1.0, -DBL_MAX, nextafter(0.0, -INFINITY), NAN, INFINITY, -INFINITY};
    const air_pm_std_t bad_pm_standards[] = {
        (air_pm_std_t)-1, (air_pm_std_t)3,
        (air_pm_std_t)99
    };
    const air_hcho_std_t bad_standards[] = {
        (air_hcho_std_t)-1, (air_hcho_std_t)3,
        (air_hcho_std_t)99
    };
    size_t i;
    int p;
    for (i = 0; i < sizeof(invalid) / sizeof(invalid[0]); ++i) {
        CHECK(air_rate_co2(invalid[i]) == AIR_UNKNOWN);
        for (p = 0; p < 3; ++p) {
            air_pm_std_t standard = (air_pm_std_t)p;
            CHECK(air_rate_pm25(standard, invalid[i]) == AIR_UNKNOWN);
            CHECK(air_rate_pm10(standard, invalid[i]) == AIR_UNKNOWN);
            CHECK(air_rate_hcho((air_hcho_std_t)p, invalid[i]) == AIR_UNKNOWN);
            CHECK(air_rate_all(standard, (air_hcho_std_t)p,
                               invalid[i], invalid[i], invalid[i], invalid[i],
                               AIR_MASK_ALL) == AIR_UNKNOWN);
            CHECK(air_rate_all(standard, (air_hcho_std_t)p,
                               invalid[i], 0, 0, 0,
                               AIR_MASK_ALL) == AIR_GOOD);
            CHECK(air_rate_all(standard, (air_hcho_std_t)p,
                               1500, invalid[i], invalid[i], invalid[i],
                               AIR_MASK_ALL) == AIR_MODERATE);
        }
    }
    for (i = 0; i < sizeof(bad_pm_standards) / sizeof(bad_pm_standards[0]); ++i) {
        CHECK(air_rate_pm25(bad_pm_standards[i], 0) == AIR_UNKNOWN);
        CHECK(air_rate_pm10(bad_pm_standards[i], 0) == AIR_UNKNOWN);
        CHECK(air_rate_all(bad_pm_standards[i], AIR_HCHO_WHO_2010,
                           1500, 0, 0, 0,
                           AIR_MASK_CO2) == AIR_UNKNOWN);
    }
    for (i = 0; i < sizeof(bad_standards) / sizeof(bad_standards[0]); ++i) {
        CHECK(air_rate_hcho(bad_standards[i], 0) == AIR_UNKNOWN);
        CHECK(air_rate_all(AIR_PM_HJ_633_2026, bad_standards[i],
                           1500, 0, 0, 0,
                           AIR_MASK_CO2) == AIR_UNKNOWN);
    }
    for (i = 4; i < 32; ++i) {
        CHECK(air_rate_all(AIR_PM_HJ_633_2026, AIR_HCHO_WHO_2010,
                          1500, 0, 0, 0,
                          AIR_MASK_ALL | (UINT32_C(1) << i)) == AIR_UNKNOWN);
    }
    CHECK(air_rate_all(AIR_PM_EEA_AQI_2024, AIR_HCHO_WHO_2010,
                       9999, 9999, 9999, 9999, 0) == AIR_UNKNOWN);
    CHECK(air_rate_all(AIR_PM_EEA_AQI_2024, AIR_HCHO_WHO_2010,
                       0, 9999, 9999, 9999,
                       AIR_MASK_CO2) == AIR_GOOD);
}

static void test_combinations(void)
{
    /* Independent representative values and expected grades for each region.
     * Exhaust all subsets, grade combinations and unavailable numeric inputs.
     */
    const double co2[] = {0, 1500, 2500, NAN};
    const air_quality_t co2_grade[] = {AIR_GOOD, AIR_MODERATE, AIR_POOR, AIR_UNKNOWN};
    const double pm25[3][7] = {
        {0, 10, 20, 60, 100, 150, NAN},
        {0, 40, 70, 120, 200, 300, NAN},
        {0, 10, 40, 60, 150, 300, NAN}
    };
    const double pm10[3][7] = {
        {0, 20, 60, 150, 220, 300, NAN},
        {0, 60, 130, 300, 400, 500, NAN},
        {0, 60, 160, 300, 400, 500, NAN}
    };
    const air_quality_t pm_grade[] = {
        AIR_GOOD, AIR_FAIR, AIR_MODERATE, AIR_POOR,
        AIR_VERY_POOR, AIR_EXTREMELY_POOR, AIR_UNKNOWN
    };
    const double hcho[3][7] = {
        {0, 0.04, 0.08, 0.15, 0.30, 0.60, NAN},
        {0, 0.03, 0.06, 0.10, 0.20, 0.50, NAN},
        {0, 0.02, 0.04, 0.08, 0.20, 0.30, NAN}
    };
    int p, s;
    size_t c, a, b, d;
    air_param_mask_t mask;
    for (p = 0; p < 3; ++p) {
        for (s = 0; s < 3; ++s) {
            for (c = 0; c < 4; ++c) {
                for (a = 0; a < 7; ++a) {
                    for (b = 0; b < 7; ++b) {
                        for (d = 0; d < 7; ++d) {
                            for (mask = 0; mask <= AIR_MASK_ALL; ++mask) {
                                air_quality_t expected = AIR_UNKNOWN;
                                if (mask & AIR_MASK_CO2) expected = co2_grade[c];
                                if ((mask & AIR_MASK_PM25) && pm_grade[a] > expected) expected = pm_grade[a];
                                if ((mask & AIR_MASK_PM10) && pm_grade[b] > expected) expected = pm_grade[b];
                                if ((mask & AIR_MASK_HCHO) && pm_grade[d] > expected) expected = pm_grade[d];
                                CHECK(air_rate_all((air_pm_std_t)p,
                                                   (air_hcho_std_t)s,
                                                   co2[c], pm25[p][a], pm10[p][b],
                                                   hcho[s][d], mask) == expected);
                            }
                        }
                    }
                }
            }
        }
    }
}

static void test_levels(void)
{
    const double invalid[] = {-1, NAN, INFINITY, -INFINITY};
    size_t i;
    int s;
    CHECK(AIR_LEVEL_UNKNOWN == 0 && AIR_LEVEL_LOW == 1 &&
          AIR_LEVEL_MEDIUM == 2 && AIR_LEVEL_HIGH == 3 && AIR_LEVEL_CRITICAL == 4);
    CHECK(air_level_co2(0) == AIR_LEVEL_LOW);
    CHECK(air_level_co2(nextafter(1000, 0)) == AIR_LEVEL_LOW);
    CHECK(air_level_co2(1000) == AIR_LEVEL_MEDIUM);
    CHECK(air_level_co2(2000) == AIR_LEVEL_MEDIUM);
    CHECK(air_level_co2(nextafter(2000, INFINITY)) == AIR_LEVEL_HIGH);
    CHECK(air_level_co2(DBL_MAX) == AIR_LEVEL_HIGH);
    for (i = 0; i < sizeof(invalid) / sizeof(invalid[0]); ++i) {
        CHECK(air_level_co2(invalid[i]) == AIR_LEVEL_UNKNOWN);
        for (s = 0; s < 3; ++s) {
            CHECK(air_level_pm25((air_pm_std_t)s, invalid[i]) == AIR_LEVEL_UNKNOWN);
            CHECK(air_level_pm10((air_pm_std_t)s, invalid[i]) == AIR_LEVEL_UNKNOWN);
            CHECK(air_level_hcho((air_hcho_std_t)s, invalid[i]) == AIR_LEVEL_UNKNOWN);
        }
    }
    for (s = 0; s < 3; ++s) {
        CHECK(air_level_pm25((air_pm_std_t)s, 0) == AIR_LEVEL_LOW);
        CHECK(air_level_pm10((air_pm_std_t)s, 0) == AIR_LEVEL_LOW);
        CHECK(air_level_hcho((air_hcho_std_t)s, 0) == AIR_LEVEL_LOW);
        CHECK(air_level_pm25((air_pm_std_t)s, DBL_MAX) == AIR_LEVEL_CRITICAL);
        CHECK(air_level_pm10((air_pm_std_t)s, DBL_MAX) == AIR_LEVEL_CRITICAL);
        CHECK(air_level_hcho((air_hcho_std_t)s, DBL_MAX) == AIR_LEVEL_CRITICAL);
    }
    CHECK(air_level_pm25((air_pm_std_t)-1, 0) == AIR_LEVEL_UNKNOWN);
    CHECK(air_level_pm10((air_pm_std_t)3, 0) == AIR_LEVEL_UNKNOWN);
    CHECK(air_level_hcho((air_hcho_std_t)3, 0) == AIR_LEVEL_UNKNOWN);
}

int main(void)
{
    /* Bind public names to distinct reference outcomes independently of
     * the positional tables above; catch accidental enum/table reordering.
     */
    CHECK(AIR_PM_EEA_AQI_2024 == 0);
    CHECK(AIR_HCHO_WHO_2010 == 0);
    CHECK(air_rate_pm25(AIR_PM_EEA_AQI_2024, 40) == AIR_MODERATE);
    CHECK(air_rate_pm25(AIR_PM_HJ_633_2026, 40) == AIR_FAIR);
    CHECK(air_rate_pm25(AIR_PM_EPA_AQI_2026, 10) == AIR_FAIR);
    CHECK(air_rate_hcho(AIR_HCHO_WHO_2010, 0.09) == AIR_MODERATE);
    CHECK(air_rate_hcho(AIR_HCHO_GBT_18883_2022, 0.09) == AIR_POOR);
    CHECK(air_rate_hcho(AIR_HCHO_OEHHA_2008, 0.06) == AIR_POOR);
    CHECK(AIR_UNKNOWN == 0 && AIR_GOOD == 1 && AIR_FAIR == 2 &&
          AIR_MODERATE == 3 && AIR_POOR == 4 && AIR_VERY_POOR == 5 &&
          AIR_EXTREMELY_POOR == 6);
    test_boundaries();
    test_levels();
    test_invalid();
    test_combinations();
    printf("Passed %u checks\n", checks);
    return EXIT_SUCCESS;
}
