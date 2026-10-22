#ifndef SOUND_LIGHT_RATING_H
#define SOUND_LIGHT_RATING_H

#ifdef __cplusplus
extern "C" {
#endif

/* WHO Guidelines for Community Noise (1999), indoor scenarios only.
 * https://www.who.int/publications/i/item/a68672
 * Noise and illuminance outputs are independent, not Matter values.
 */
typedef enum {
    NOISE_HOME = 0, /* Residential daytime/evening: LAeq,16h <= 35 dB(A). */
    NOISE_SLEEP     /* Bedroom reference: LAeq,8h <= 30 dB(A). */
} noise_scene_t;

typedef enum {
    NOISE_UNKNOWN = 0,
    NOISE_QUIET,
    NOISE_NOTICEABLE,
    NOISE_LOUD,
    NOISE_VERY_LOUD
} noise_level_t;

/* Product bands, NOT WHO grades: <= B, (B,B+10], (B+10,B+20], > B+20.
 * Reference values originate from long-term LAeq recommendations; this
 * function does not calculate LAeq/LAmax or evaluate WHO compliance.
 * B=30 for sleep, 35 for HOME. Input: calibrated current A-weighted
 * Fast sound level, dB(A), NOT raw microphone samples or dBFS.
 * All sound inputs accept finite [-200,200] dB(A), including negative dB.
 * Outside this numerical operating range returns UNKNOWN; invalid scenes also return UNKNOWN.
 */
noise_level_t noise_rate(noise_scene_t scene, double noise);

/* Residential activity hints derived from ANSI/IES/ALA RP-11-26,
 * especially its Annex A illuminance recommendations.
 * https://store.ies.org/product/recommended-practice-lighting-for-interior-and-exterior-residential-environments/
 * The source recommendations are task-specific maintained illuminance targets
 * in footcandles. Continuous bands and labels are product rules, not official
 * RP-11-26 grades. They describe supported activity levels, not room types,
 * visual comfort, health effects or standards compliance.
 */
typedef enum {
    ILLUMINANCE_UNKNOWN = 0,       /* 未知 */
    ILLUMINANCE_LOW_LIGHT,         /* 低照环境 */
    ILLUMINANCE_AMBIENT,           /* 氛围照明 */
    ILLUMINANCE_DAILY_ACTIVITY,    /* 日常活动 */
    ILLUMINANCE_READING,           /* 阅读学习 */
    ILLUMINANCE_FOCUSED_ACTIVITY,  /* 专注活动 */
    ILLUMINANCE_DETAIL_WORK        /* 精细作业 */
} illuminance_level_t;

/* Instantaneous illuminance in lux, finite and >=0; zero is valid.
 * Boundaries are exact conversions of 5, 10, 20, 30 and 50 footcandles:
 * [0,53.819552...) LowLight; [53.819552...,107.639104...) Ambient;
 * [107.639104...,215.278208...) DailyActivity;
 * [215.278208...,322.917312...) Reading;
 * [322.917312...,538.195521...) FocusedActivity;
 * [538.195521...,+inf) DetailWork (finite inputs only).
 * Negative, NAN or infinite inputs return UNKNOWN.
 * No rounding, clamping, scene selection or upper brightness warning.
 * Standard values concern maintained average illuminance at specified
 * reference/task planes; a single instantaneous sample is only a hint,
 * not a compliance or visual-comfort assessment. Caller checks sensor range,
 * calibration, placement and freshness. Suggested UI: 照度参考：日常活动.
 */
illuminance_level_t illuminance_rate(double illuminance);

/* Pure, reentrant C99 functions; no initialization, history or allocation.
 * Disable fast-math and finite-math-only to preserve invalid-value checks.
 */
#ifdef __cplusplus
}
#endif
#endif
