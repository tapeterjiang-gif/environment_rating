#ifndef THERMAL_COMFORT_H
#define THERMAL_COMFORT_H

#ifdef __cplusplus
extern "C" {
#endif

/* ASHRAE seven-point thermal sensation labels; enum values are internal,
 * not Matter values. Continuous bands are product rules (see README.md).
 * COLD/HOT are reserved: strict ISO PMV validity [-2, 2] cannot reach them.
 * Sources:
 * https://www.iso.org/standard/85803.html
 * https://www.ashrae.org/file%20library/technical%20resources/standards%20and%20guidelines/standards%20addenda/55_2017_d_20200731.pdf#page=17
 */
typedef enum {
    THERMAL_UNKNOWN = 0,
    THERMAL_COLD,
    THERMAL_COOL,
    THERMAL_SLIGHTLY_COOL,
    THERMAL_NEUTRAL,
    THERMAL_SLIGHTLY_WARM,
    THERMAL_WARM,
    THERMAL_HOT
} thermal_sensation_t;

/* Select an explicit reference, independently of PM/HCHO standards.
 * EPA/UBA are official guidance, not formal grading standards.
 * EPA: ideal 30..50%, below 60% recommended.
 * https://www.epa.gov/mold/brief-guide-mold-moisture-and-your-home
 * UBA: recommended 40..60%.
 * https://www.umweltbundesamt.de/en/node/3086
 * No automatic region selection or fallback for invalid enums.
 */
typedef enum {
    THERMAL_HUMIDITY_EPA = 0,
    THERMAL_HUMIDITY_UBA
} thermal_humidity_std_t;

/* Product labels, not official grades or Matter enum values. */
typedef enum {
    THERMAL_HUMIDITY_UNKNOWN = 0,
    THERMAL_HUMIDITY_DRY,
    THERMAL_HUMIDITY_SUITABLE,
    THERMAL_HUMIDITY_SLIGHTLY_HUMID,
    THERMAL_HUMIDITY_HUMID
} thermal_humidity_t;

/* Instantaneous RH in percent [0,100], without rounding.
 * EPA: <30 Dry; [30,50] Suitable; (50,60) SlightlyHumid; >=60 Humid.
 * UBA: <40 Dry; [40,60] Suitable; >60 Humid.
 * Invalid reference, nonfinite or out-of-range RH returns UNKNOWN.
 * Independent of PMV validity; does not diagnose mould or condensation.
 */
thermal_humidity_t thermal_rate_humidity(thermal_humidity_std_t standard,
                                         double humidity);

/* Fanger PMV, referencing ISO 7730:2025. External mechanical work is zero.
 * temperature: air temperature, degrees C, [10, 30].
 * humidity: relative humidity, percent, [0, 100].
 * radiant_temperature: mean radiant temperature, degrees C, [10, 40].
 * air_speed: relative air speed at the body, m/s, [0, 1].
 * met: metabolic rate in met, [0.8, 4].
 * clo: effective clothing insulation in clo, [0, 2].
 * Bounds are inclusive; water vapour partial pressure must be <= 2700 Pa.
 * Returns NAN for nonfinite/out-of-range inputs, failed convergence or a PMV
 * outside [-2, 2]. No rounding, clamping, hidden defaults or activity/clothing
 * corrections. Caller supplies relative speed and appropriate insulation.
 * Assumed inputs yield an estimate, not a measured personal comfort result.
 */
double thermal_pmv(double temperature, double humidity,
                   double radiant_temperature, double air_speed,
                   double met, double clo);

/* Predicted percentage dissatisfied, in percent [5, about 77].
 * Returns NAN unless pmv is finite and within [-2, 2].
 */
double thermal_ppd(double pmv);

/* Product bands: [-2,-1.5) Cool; [-1.5,-0.5) SlightlyCool;
 * [-0.5,0.5] Neutral; (0.5,1.5] SlightlyWarm; (1.5,2] Warm.
 * Invalid or out-of-model PMV returns UNKNOWN. Neutral is not a certificate
 * of overall comfort; local discomfort is not evaluated.
 */
thermal_sensation_t thermal_rate(double pmv);

/* Pure, reentrant C99 functions; independent of Matter and air_quality_rating.
 * No sensor drivers, history or dynamic allocation. Link the math library
 * where required. Fast-math/finite-math-only must be disabled.
 */
#ifdef __cplusplus
}
#endif
#endif
