#include "sound_light_rating.h"
#include <math.h>

#if defined(__FAST_MATH__) || (defined(__FINITE_MATH_ONLY__) && __FINITE_MATH_ONLY__ > 0)
#error "sound_light_rating requires finite-math-only and fast-math to be disabled"
#endif

static int valid_level(double value)
{
    return isfinite(value) && value >= -200 && value <= 200;
}

static double reference(noise_scene_t scene)
{
    switch (scene) {
    case NOISE_HOME: return 35;
    case NOISE_SLEEP: return 30;
    default: return NAN;
    }
}

noise_level_t noise_rate(noise_scene_t scene, double noise)
{
    double base = reference(scene);
    if (!isfinite(base) || !valid_level(noise)) return NOISE_UNKNOWN;
    if (noise <= base) return NOISE_QUIET;
    if (noise <= base + 10) return NOISE_NOTICEABLE;
    if (noise <= base + 20) return NOISE_LOUD;
    return NOISE_VERY_LOUD;
}

illuminance_level_t illuminance_rate(double illuminance)
{
    if (!isfinite(illuminance) || illuminance < 0) return ILLUMINANCE_UNKNOWN;
    if (illuminance < 75) return ILLUMINANCE_DIM;
    if (illuminance < 100) return ILLUMINANCE_BEDROOM_ACTIVITY;
    if (illuminance < 150) return ILLUMINANCE_DAILY_ACTIVITY;
    if (illuminance < 200) return ILLUMINANCE_DINING;
    if (illuminance < 300) return ILLUMINANCE_BEDSIDE_READING;
    return ILLUMINANCE_READING_AND_TASKS;
}
