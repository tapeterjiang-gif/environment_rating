#include "environment_color.h"

#include <stdio.h>

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
    CHECK(env_color_parameter(ENV_PARAM_CO2, ENV_COLOR_GRAPHIC) ==
          ENV_RGB_INVALID);
    CHECK(env_color_parameter((env_parameter_t)-1, ENV_COLOR_PRIMARY) ==
          ENV_RGB_INVALID);
    CHECK(env_color_parameter(ENV_PARAM_CO2, (env_color_role_t)99) ==
          ENV_RGB_INVALID);
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
          UINT32_C(0x65A30D));
    CHECK(env_color_air(ENV_PARAM_CO2, AIR_MODERATE, ENV_COLOR_GRAPHIC) ==
          UINT32_C(0xA3E635));
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
    test_parameter_colors();
    test_air_colors();
    test_other_state_colors();
    return failures == 0 ? 0 : 1;
}
