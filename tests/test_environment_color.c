#include "environment_color.h"

#include <stdio.h>
#include <string.h>

static int failures;

#define CHECK(expression) do { \
    if (!(expression)) { \
        fprintf(stderr, "FAIL %s:%d: %s\n", __FILE__, __LINE__, #expression); \
        ++failures; \
    } \
} while (0)

static void test_parameter_colors(void)
{
    CHECK(env_color_parameter(ENV_PARAM_TEMPERATURE, ENV_COLOR_PRIMARY) ==
          UINT32_C(0xF97316));
    CHECK(env_color_parameter(ENV_PARAM_HUMIDITY, ENV_COLOR_BACKGROUND) ==
          UINT32_C(0xCFFAFE));
    CHECK(env_color_parameter(ENV_PARAM_PM25, ENV_COLOR_PRIMARY) ==
          UINT32_C(0x667A83));
    CHECK(env_color_parameter(ENV_PARAM_PM10, ENV_COLOR_PRIMARY) ==
          UINT32_C(0x9A7958));
    CHECK(env_color_parameter(ENV_PARAM_TVOC, ENV_COLOR_PRIMARY) ==
          UINT32_C(0x89941A));
    CHECK(env_color_parameter(ENV_PARAM_ILLUMINANCE, ENV_COLOR_BACKGROUND) ==
          UINT32_C(0xFEF9C3));
    CHECK(env_color_parameter(ENV_PARAM_O3, ENV_COLOR_PRIMARY) ==
          UINT32_C(0x3A6EAA));
    CHECK(env_color_parameter(ENV_PARAM_CO, ENV_COLOR_BACKGROUND) ==
          UINT32_C(0xEDF0F3));
    CHECK(env_color_parameter(ENV_PARAM_SO2, ENV_COLOR_PRIMARY) ==
          UINT32_C(0x9A6B0A));
    CHECK(env_color_parameter(ENV_PARAM_POLLEN, ENV_COLOR_PRIMARY) ==
          UINT32_C(0x3E8B5B));
    CHECK(env_color_parameter(ENV_PARAM_UV_INDEX, ENV_COLOR_BACKGROUND) ==
          UINT32_C(0xEEEAFB));
    CHECK(env_color_parameter(ENV_PARAM_CO2, ENV_COLOR_GRAPHIC) ==
          ENV_RGB_INVALID);
    CHECK(env_color_parameter((env_parameter_t)-1, ENV_COLOR_PRIMARY) ==
          ENV_RGB_INVALID);
    CHECK(env_color_parameter(ENV_PARAM_CO2, (env_color_role_t)99) ==
          ENV_RGB_INVALID);
}

static void test_parameter_icons(void)
{
    CHECK(strcmp(env_icon_name(ENV_PARAM_TEMPERATURE,
                               ENV_ICON_SF_SYMBOLS),
                 "thermometer.medium") == 0);
    CHECK(strcmp(env_icon_name(ENV_PARAM_HUMIDITY,
                               ENV_ICON_MATERIAL_SYMBOLS_ROUNDED),
                 "humidity_percentage") == 0);
    CHECK(strcmp(env_icon_name(ENV_PARAM_CO2,
                               ENV_ICON_SF_SYMBOLS),
                 "wind") == 0);
    CHECK(strcmp(env_icon_name(ENV_PARAM_CO2,
                               ENV_ICON_MATERIAL_SYMBOLS_ROUNDED),
                 "air") == 0);
    CHECK(strcmp(env_icon_name(ENV_PARAM_PM25,
                               ENV_ICON_MATERIAL_SYMBOLS_ROUNDED),
                 "blur_on") == 0);
    CHECK(strcmp(env_icon_name(ENV_PARAM_PM10,
                               ENV_ICON_MATERIAL_SYMBOLS_ROUNDED),
                 "blur_on") == 0);
    CHECK(strcmp(env_icon_name(ENV_PARAM_ILLUMINANCE,
                               ENV_ICON_SF_SYMBOLS),
                 "sun.max") == 0);
    CHECK(strcmp(env_icon_name(ENV_PARAM_O3, ENV_ICON_SF_SYMBOLS),
                 "sun.haze.fill") == 0);
    CHECK(strcmp(env_icon_name(ENV_PARAM_CO,
                               ENV_ICON_MATERIAL_SYMBOLS_ROUNDED),
                 "detector_smoke") == 0);
    CHECK(strcmp(env_icon_name(ENV_PARAM_SO2, ENV_ICON_SF_SYMBOLS),
                 "cloud.fog.fill") == 0);
    CHECK(strcmp(env_icon_name(ENV_PARAM_POLLEN,
                               ENV_ICON_MATERIAL_SYMBOLS_ROUNDED),
                 "local_florist") == 0);
    CHECK(strcmp(env_icon_name(ENV_PARAM_UV_INDEX, ENV_ICON_SF_SYMBOLS),
                 "sun.max.fill") == 0);
    CHECK(env_icon_name((env_parameter_t)-1, ENV_ICON_SF_SYMBOLS) == 0);
    CHECK(env_icon_name(ENV_PARAM_CO2, (env_icon_set_t)99) == 0);
}

static void test_air_colors(void)
{
    CHECK(env_color_air(ENV_PARAM_PM25, AIR_GOOD, ENV_COLOR_PRIMARY) ==
          UINT32_C(0x16A34A));
    CHECK(env_color_air(ENV_PARAM_PM10, AIR_FAIR, ENV_COLOR_GRAPHIC) ==
          UINT32_C(0xA3E635));
    CHECK(env_color_air(ENV_PARAM_HCHO, AIR_EXTREMELY_POOR, ENV_COLOR_TEXT) ==
          UINT32_C(0x581C87));
    CHECK(env_color_air(ENV_PARAM_PM25, AIR_EXTREMELY_POOR,
                        ENV_COLOR_BACKGROUND) == UINT32_C(0xF3E8FF));
    CHECK(env_color_air(ENV_PARAM_CO2, AIR_MODERATE, ENV_COLOR_PRIMARY) ==
          UINT32_C(0xCA8A04));
    CHECK(env_color_air(ENV_PARAM_CO2, AIR_MODERATE, ENV_COLOR_GRAPHIC) ==
          UINT32_C(0xFACC15));
    CHECK(env_color_air(ENV_PARAM_CO2, AIR_MODERATE, ENV_COLOR_BACKGROUND) ==
          UINT32_C(0xFEF9C3));
    CHECK(env_color_air(ENV_PARAM_CO2, AIR_MODERATE, ENV_COLOR_TEXT) ==
          UINT32_C(0x713F12));
    CHECK(env_color_air(ENV_PARAM_CO2, AIR_UNKNOWN, ENV_COLOR_PRIMARY) ==
          UINT32_C(0x64748B));
    CHECK(env_color_air(ENV_PARAM_CO2, AIR_FAIR, ENV_COLOR_PRIMARY) ==
          ENV_RGB_INVALID);
    CHECK(env_color_air(ENV_PARAM_TVOC, AIR_GOOD, ENV_COLOR_PRIMARY) ==
          ENV_RGB_INVALID);
    CHECK(env_color_air(ENV_PARAM_PM25, (air_quality_t)99,
                        ENV_COLOR_PRIMARY) == ENV_RGB_INVALID);
    CHECK(env_color_air(ENV_PARAM_PM25, AIR_GOOD, (env_color_role_t)99) ==
          ENV_RGB_INVALID);
}

static void test_other_state_colors(void)
{
    CHECK(env_color_thermal(THERMAL_COLD, ENV_COLOR_PRIMARY) ==
          UINT32_C(0x1D4ED8));
    CHECK(env_color_thermal(THERMAL_HOT, ENV_COLOR_GRAPHIC) ==
          UINT32_C(0xF87171));
    CHECK(env_color_humidity(THERMAL_HUMIDITY_DRY, ENV_COLOR_TEXT) ==
          UINT32_C(0x78350F));
    CHECK(env_color_noise(NOISE_LOUD, ENV_COLOR_BACKGROUND) ==
          UINT32_C(0xFFEDD5));
    CHECK(env_color_illuminance(ILLUMINANCE_READING, ENV_COLOR_GRAPHIC) ==
          UINT32_C(0x2DD4BF));
    CHECK(env_color_illuminance(ILLUMINANCE_UNKNOWN, ENV_COLOR_PRIMARY) ==
          UINT32_C(0x64748B));
    CHECK(env_color_thermal((thermal_sensation_t)-1, ENV_COLOR_PRIMARY) ==
          ENV_RGB_INVALID);
    CHECK(env_color_humidity((thermal_humidity_t)99, ENV_COLOR_PRIMARY) ==
          ENV_RGB_INVALID);
    CHECK(env_color_noise((noise_level_t)99, ENV_COLOR_PRIMARY) ==
          ENV_RGB_INVALID);
    CHECK(env_color_illuminance((illuminance_level_t)99,
                                ENV_COLOR_PRIMARY) == ENV_RGB_INVALID);
}

int main(void)
{
    int q, role, standard;
    const air_quality_t native[] = {AIR_UNKNOWN,AIR_GOOD,AIR_MODERATE,AIR_POOR,AIR_VERY_POOR,AIR_EXTREMELY_POOR};
    const env_rgb_t maroon[] = {0x9F1239,0xFFE4E6,0xFB7185,0x881337};
    for(role=0;role<4;role++) {
        for(q=0;q<=6;q++) {
            CHECK(env_color_index(OUTDOOR_INDEX_HJ_633_2026,(outdoor_index_grade_t)q,(env_color_role_t)role)==env_color_index(OUTDOOR_INDEX_EPA_AQI_2026,(outdoor_index_grade_t)q,(env_color_role_t)role));
            if(q<6)CHECK(env_color_index(OUTDOOR_INDEX_HJ_633_2026,(outdoor_index_grade_t)q,(env_color_role_t)role)==env_color_air(ENV_PARAM_PM25,native[q],(env_color_role_t)role));
        }
        CHECK(env_color_index(OUTDOOR_INDEX_EPA_AQI_2026,OUTDOOR_INDEX_GRADE_6,(env_color_role_t)role)==maroon[role]);
    }
    CHECK(env_color_index((outdoor_index_std_t)2,OUTDOOR_INDEX_GRADE_1,ENV_COLOR_PRIMARY)==ENV_RGB_INVALID);
    CHECK(env_color_index((outdoor_index_std_t)3,OUTDOOR_INDEX_UNKNOWN,ENV_COLOR_PRIMARY)==ENV_RGB_INVALID);
    for(standard=0;standard<2;standard++) {
        CHECK(env_color_index((outdoor_index_std_t)standard,(outdoor_index_grade_t)-1,ENV_COLOR_PRIMARY)==ENV_RGB_INVALID);
        CHECK(env_color_index((outdoor_index_std_t)standard,(outdoor_index_grade_t)7,ENV_COLOR_PRIMARY)==ENV_RGB_INVALID);
        CHECK(env_color_index((outdoor_index_std_t)standard,OUTDOOR_INDEX_GRADE_1,(env_color_role_t)99)==ENV_RGB_INVALID);
    }
    CHECK(env_color_index((outdoor_index_std_t)99,OUTDOOR_INDEX_UNKNOWN,ENV_COLOR_PRIMARY)==ENV_RGB_INVALID);
    CHECK(env_color_parameter(ENV_PARAM_NO2, ENV_COLOR_PRIMARY) == UINT32_C(0xB4533C));
    CHECK(env_color_parameter(ENV_PARAM_NO2, ENV_COLOR_BACKGROUND) == UINT32_C(0xF8EAE5));
    CHECK(strcmp(env_icon_name(ENV_PARAM_NO2, ENV_ICON_SF_SYMBOLS), "car.side.fill") == 0);
    CHECK(strcmp(env_icon_name(ENV_PARAM_NO2, ENV_ICON_MATERIAL_SYMBOLS_ROUNDED), "directions_car") == 0);
    for (q=0;q<=6;q++) for(role=0;role<=3;role++) {
        CHECK(env_color_air(ENV_PARAM_NO2,(air_quality_t)q,(env_color_role_t)role) ==
              env_color_air(ENV_PARAM_PM25,(air_quality_t)q,(env_color_role_t)role));
    }

    test_parameter_colors();
    test_parameter_icons();
    test_air_colors();
    test_other_state_colors();
    return failures == 0 ? 0 : 1;
}
