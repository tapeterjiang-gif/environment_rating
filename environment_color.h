#ifndef ENVIRONMENT_COLOR_H
#define ENVIRONMENT_COLOR_H

#include <stdint.h>

#include "air_quality_rating.h"
#include "outdoor_index_rating.h"
#include "sound_light_rating.h"
#include "thermal_comfort.h"

#ifdef __cplusplus
extern "C" {
#endif

/* RGB color encoded as 0x00RRGGBB. Alpha and dark-mode composition belong to
 * the UI layer. ENV_RGB_INVALID marks an invalid enum, role, or combination.
 */
typedef uint32_t env_rgb_t;
#define ENV_RGB_INVALID UINT32_MAX

typedef enum {
    ENV_COLOR_PRIMARY = 0, /* Parameter identity color or rating status color. */
    ENV_COLOR_BACKGROUND = 1, /* Light label/background color. */
    ENV_COLOR_GRAPHIC = 2,    /* Large-area chart, gauge, or illustration color. */
    ENV_COLOR_TEXT = 3        /* Label text color. */
} env_color_role_t;

/* Stable parameter order used by the color guide and platform wrappers. */
typedef enum {
    ENV_PARAM_TEMPERATURE = 0,
    ENV_PARAM_HUMIDITY = 1,
    ENV_PARAM_CO2 = 2,
    ENV_PARAM_PM25 = 3,
    ENV_PARAM_PM10 = 4,
    ENV_PARAM_HCHO = 5,
    ENV_PARAM_TVOC = 6,
    ENV_PARAM_NOISE = 7,
    ENV_PARAM_ILLUMINANCE = 8,
    ENV_PARAM_O3 = 9,
    ENV_PARAM_CO = 10,
    ENV_PARAM_SO2 = 11,
    ENV_PARAM_POLLEN = 12,
    ENV_PARAM_UV_INDEX = 13,
    ENV_PARAM_NO2 = 14 /* Appended to preserve existing numeric values. */
} env_parameter_t;

/* UI icon families. Apple platforms use SF Symbols; Android, Web, Linux,
 * and device UIs use Material Symbols Rounded. env_icon_name() returns a
 * static string owned by the library, or NULL for an invalid enum.
 */
typedef enum {
    ENV_ICON_SF_SYMBOLS = 0,
    ENV_ICON_MATERIAL_SYMBOLS_ROUNDED = 1
} env_icon_set_t;

const char *env_icon_name(env_parameter_t parameter,
                          env_icon_set_t icon_set);

/* Parameter identity colors support PRIMARY and BACKGROUND. Other roles,
 * invalid parameters, and invalid roles return ENV_RGB_INVALID.
 */
env_rgb_t env_color_parameter(env_parameter_t parameter,
                              env_color_role_t role);

/* Rating colors support all four roles. These functions consume rating enums;
 * they never repeat concentration, PMV, humidity, noise, or illuminance
 * thresholds. A valid UNKNOWN rating returns the documented gray palette.
 * Invalid enum values or unsupported combinations return ENV_RGB_INVALID.
 *
 * env_color_air supports CO2, PM2.5, PM10, HCHO, O3, CO, SO2 and NO2. CO2 accepts its
 * actual GOOD/MODERATE/POOR results; its MODERATE result intentionally uses
 * the yellow palette used by MODERATE for other pollutants. There is no overall-air,
 * tVOC, or Matter LevelValue color mapping.
 */
env_rgb_t env_color_air(env_parameter_t parameter,
                        air_quality_t quality,
                        env_color_role_t role);
/* External index colors require the scheme AND its native grade ordinal.
 * EEA uses its six-band pollutant palette; HJ/EPA use green, yellow, orange,
 * red, purple, maroon. NEA uses green, yellow, orange, red, maroon (five).
 * Unknown is gray; NEA grade 6, invalid schemes/grades/roles are invalid.
 * Product UI palettes, not official scheme color specifications. */
env_rgb_t env_color_index(outdoor_index_std_t standard,
                          outdoor_index_grade_t grade,
                          env_color_role_t role);
env_rgb_t env_color_thermal(thermal_sensation_t sensation,
                            env_color_role_t role);
env_rgb_t env_color_humidity(thermal_humidity_t humidity,
                             env_color_role_t role);
env_rgb_t env_color_noise(noise_level_t level,
                          env_color_role_t role);
env_rgb_t env_color_illuminance(illuminance_level_t level,
                                env_color_role_t role);

/* Pure, reentrant C99 lookups with no initialization or allocation. The
 * palettes are product UI rules documented in COLOR_STANDARD.md; they are not
 * colors prescribed by Matter or the referenced environmental standards.
 */

#ifdef __cplusplus
}
#endif
#endif /* ENVIRONMENT_COLOR_H */
