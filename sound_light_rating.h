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

/* Residential activity hints derived from GB/T 50034-2024, Table 5.2.1.
 * https://zcsys.ncepu.edu.cn/docs/2025-01/d5c197c2837e4892ac7d02faae298500.pdf#page=34
 * Continuous bands and labels are product rules, not official grades.
 * These describe illuminance references, not detected room types or quality.
 */
typedef enum {
    ILLUMINANCE_UNKNOWN = 0,        /* 未知 */
    ILLUMINANCE_DIM,                /* 光线较暗 */
    ILLUMINANCE_BEDROOM_ACTIVITY,   /* 卧室活动 */
    ILLUMINANCE_DAILY_ACTIVITY,     /* 日常活动 */
    ILLUMINANCE_DINING,             /* 用餐 */
    ILLUMINANCE_BEDSIDE_READING,    /* 床头阅读 */
    ILLUMINANCE_READING_AND_TASKS   /* 读写与操作 */
} illuminance_level_t;

/* Instantaneous illuminance in lux, finite and >=0; zero is valid.
 * [0,75) Dim; [75,100) BedroomActivity; [100,150) DailyActivity;
 * [150,200) Dining; [200,300) BedsideReading; [300,+inf) ReadingAndTasks
 * (finite inputs only). Negative, NAN or infinite inputs return UNKNOWN.
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
