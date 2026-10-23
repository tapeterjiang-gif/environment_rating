#include "environment_color.h"

typedef struct {
    env_rgb_t primary;
    env_rgb_t background;
    env_rgb_t graphic;
    env_rgb_t text;
} palette_t;

#define RGB(value) UINT32_C(0x##value)
#define PALETTE(primary, background, graphic, text) \
    { RGB(primary), RGB(background), RGB(graphic), RGB(text) }

static const palette_t unknown_palette =
    PALETTE(64748B, F1F5F9, 94A3B8, 334155);

static const palette_t air_palettes[] = {
    PALETTE(64748B, F1F5F9, 94A3B8, 334155), /* Unknown */
    PALETTE(16A34A, DCFCE7, 4ADE80, 14532D), /* Good */
    PALETTE(65A30D, ECFCCB, A3E635, 365314), /* Fair */
    PALETTE(CA8A04, FEF9C3, FACC15, 713F12), /* Moderate */
    PALETTE(EA580C, FFEDD5, FB923C, 7C2D12), /* Poor */
    PALETTE(DC2626, FEE2E2, F87171, 7F1D1D), /* Very poor */
    PALETTE(7E22CE, F3E8FF, C084FC, 581C87)  /* Extremely poor */
};

static const palette_t thermal_palettes[] = {
    PALETTE(64748B, F1F5F9, 94A3B8, 334155), /* Unknown */
    PALETTE(1D4ED8, DBEAFE, 60A5FA, 1E3A8A), /* Cold */
    PALETTE(0284C7, E0F2FE, 38BDF8, 0C4A6E), /* Cool */
    PALETTE(0891B2, CFFAFE, 22D3EE, 155E75), /* Slightly cool */
    PALETTE(16A34A, DCFCE7, 4ADE80, 14532D), /* Neutral */
    PALETTE(CA8A04, FEF9C3, FACC15, 713F12), /* Slightly warm */
    PALETTE(EA580C, FFEDD5, FB923C, 7C2D12), /* Warm */
    PALETTE(DC2626, FEE2E2, F87171, 7F1D1D)  /* Hot */
};

static const palette_t humidity_palettes[] = {
    PALETTE(64748B, F1F5F9, 94A3B8, 334155), /* Unknown */
    PALETTE(D97706, FEF3C7, FBBF24, 78350F), /* Dry */
    PALETTE(16A34A, DCFCE7, 4ADE80, 14532D), /* Suitable */
    PALETTE(0284C7, E0F2FE, 38BDF8, 0C4A6E), /* Slightly humid */
    PALETTE(1D4ED8, DBEAFE, 60A5FA, 1E3A8A)  /* Humid */
};

static const palette_t noise_palettes[] = {
    PALETTE(64748B, F1F5F9, 94A3B8, 334155), /* Unknown */
    PALETTE(16A34A, DCFCE7, 4ADE80, 14532D), /* Quiet */
    PALETTE(CA8A04, FEF9C3, FACC15, 713F12), /* Noticeable */
    PALETTE(EA580C, FFEDD5, FB923C, 7C2D12), /* Loud */
    PALETTE(DC2626, FEE2E2, F87171, 7F1D1D)  /* Very loud */
};

static const palette_t illuminance_palettes[] = {
    PALETTE(64748B, F1F5F9, 94A3B8, 334155), /* Unknown */
    PALETTE(475569, E2E8F0, 94A3B8, 1E293B), /* Low light */
    PALETTE(6366F1, E0E7FF, 818CF8, 3730A3), /* Ambient */
    PALETTE(0284C7, E0F2FE, 38BDF8, 0C4A6E), /* Daily activity */
    PALETTE(0D9488, CCFBF1, 2DD4BF, 134E4A), /* Reading */
    PALETTE(D97706, FEF3C7, FBBF24, 78350F), /* Focused activity */
    PALETTE(CA8A04, FEF9C3, FACC15, 713F12)  /* Detail work */
};

static env_rgb_t palette_color(const palette_t *palette,
                               env_color_role_t role)
{
    if (palette == 0) return ENV_RGB_INVALID;
    switch (role) {
        case ENV_COLOR_PRIMARY: return palette->primary;
        case ENV_COLOR_BACKGROUND: return palette->background;
        case ENV_COLOR_GRAPHIC: return palette->graphic;
        case ENV_COLOR_TEXT: return palette->text;
        default: return ENV_RGB_INVALID;
    }
}

const char *env_icon_name(env_parameter_t parameter,
                          env_icon_set_t icon_set)
{
    static const char *const sf_symbols[] = {
        "thermometer.medium",
        "humidity.fill",
        "carbon.dioxide.cloud",
        "aqi.medium",
        "aqi.medium",
        "atom",
        "speedometer",
        "waveform",
        "sun.max"
    };
    static const char *const material_symbols[] = {
        "device_thermostat",
        "humidity_percentage",
        "co2",
        "air",
        "air",
        "science",
        "speed",
        "graphic_eq",
        "light_mode"
    };

    if ((int)parameter < (int)ENV_PARAM_TEMPERATURE ||
        (int)parameter > (int)ENV_PARAM_ILLUMINANCE)
        return 0;
    if (icon_set == ENV_ICON_SF_SYMBOLS)
        return sf_symbols[(int)parameter];
    if (icon_set == ENV_ICON_MATERIAL_SYMBOLS_ROUNDED)
        return material_symbols[(int)parameter];
    return 0;
}

env_rgb_t env_color_parameter(env_parameter_t parameter,
                              env_color_role_t role)
{
    static const env_rgb_t colors[][2] = {
        { RGB(F97316), RGB(FFEDD5) }, /* Temperature */
        { RGB(0891B2), RGB(CFFAFE) }, /* Humidity */
        { RGB(15803D), RGB(DCFCE7) }, /* CO2 */
        { RGB(667A83), RGB(E8EEF0) }, /* PM2.5 */
        { RGB(9A7958), RGB(F1EBE4) }, /* PM10 */
        { RGB(DB2777), RGB(FCE7F3) }, /* HCHO */
        { RGB(89941A), RGB(F1F5D5) }, /* tVOC */
        { RGB(9333EA), RGB(F3E8FF) }, /* Noise */
        { RGB(F2C94C), RGB(FEF9C3) }  /* Illuminance */
    };

    if ((int)parameter < (int)ENV_PARAM_TEMPERATURE ||
        (int)parameter > (int)ENV_PARAM_ILLUMINANCE)
        return ENV_RGB_INVALID;
    if (role == ENV_COLOR_PRIMARY || role == ENV_COLOR_BACKGROUND)
        return colors[(int)parameter][(int)role];
    return ENV_RGB_INVALID;
}

env_rgb_t env_color_air(env_parameter_t parameter,
                        air_quality_t quality,
                        env_color_role_t role)
{
    const palette_t *palette;

    if ((int)quality < (int)AIR_UNKNOWN ||
        (int)quality > (int)AIR_EXTREMELY_POOR)
        return ENV_RGB_INVALID;

    if (parameter == ENV_PARAM_CO2) {
        switch (quality) {
            case AIR_UNKNOWN: palette = &unknown_palette; break;
            case AIR_GOOD: palette = &air_palettes[AIR_GOOD]; break;
            case AIR_MODERATE: palette = &air_palettes[AIR_FAIR]; break;
            case AIR_POOR: palette = &air_palettes[AIR_POOR]; break;
            default: return ENV_RGB_INVALID;
        }
    } else if (parameter == ENV_PARAM_PM25 ||
               parameter == ENV_PARAM_PM10 ||
               parameter == ENV_PARAM_HCHO) {
        palette = &air_palettes[(int)quality];
    } else {
        return ENV_RGB_INVALID;
    }
    return palette_color(palette, role);
}

env_rgb_t env_color_thermal(thermal_sensation_t sensation,
                            env_color_role_t role)
{
    if ((int)sensation < (int)THERMAL_UNKNOWN ||
        (int)sensation > (int)THERMAL_HOT)
        return ENV_RGB_INVALID;
    return palette_color(&thermal_palettes[(int)sensation], role);
}

env_rgb_t env_color_humidity(thermal_humidity_t humidity,
                             env_color_role_t role)
{
    if ((int)humidity < (int)THERMAL_HUMIDITY_UNKNOWN ||
        (int)humidity > (int)THERMAL_HUMIDITY_HUMID)
        return ENV_RGB_INVALID;
    return palette_color(&humidity_palettes[(int)humidity], role);
}

env_rgb_t env_color_noise(noise_level_t level,
                          env_color_role_t role)
{
    if ((int)level < (int)NOISE_UNKNOWN ||
        (int)level > (int)NOISE_VERY_LOUD)
        return ENV_RGB_INVALID;
    return palette_color(&noise_palettes[(int)level], role);
}

env_rgb_t env_color_illuminance(illuminance_level_t level,
                                env_color_role_t role)
{
    if ((int)level < (int)ILLUMINANCE_UNKNOWN ||
        (int)level > (int)ILLUMINANCE_DETAIL_WORK)
        return ENV_RGB_INVALID;
    return palette_color(&illuminance_palettes[(int)level], role);
}

#undef PALETTE
#undef RGB
