#ifndef AIR_QUALITY_RATING_H
#define AIR_QUALITY_RATING_H

#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef uint32_t air_param_mask_t;
#define AIR_MASK_CO2  UINT32_C(0x01)
#define AIR_MASK_PM25 UINT32_C(0x02)
#define AIR_MASK_PM10 UINT32_C(0x04)
#define AIR_MASK_HCHO UINT32_C(0x08)
#define AIR_MASK_ALL  (AIR_MASK_CO2 | AIR_MASK_PM25 | AIR_MASK_PM10 | \
                       AIR_MASK_HCHO)

/* PM2.5/PM10 threshold and numeric-processing standard.
 * The selection names the referenced standard, not a product region.
 * It applies only to PM; CO2 uses one common rule.
 * Product ratings use instantaneous concentrations, not a complete official
 * AQI calculation: no averaging or NowCast. Thresholds and Matter mappings
 * are documented in README.md (section 1.4).
 */
typedef enum {
    /* Europe: EEA European Air Quality Index (checked 2026-09-12).
     * Compare unrounded values using continuous, upper-inclusive bands;
     * the highest band is above the final upper bound (product rule).
     */
    AIR_PM_EEA_AQI_2024 = 0,
    /* China: HJ 633-2026; round both PM values to integers per GB/T 8170. */
    AIR_PM_HJ_633_2026,
    /* USA: EPA AQI (May 2026); truncate PM2.5 to one decimal, PM10 to integer. */
    AIR_PM_EPA_AQI_2026
} air_pm_std_t;

/* Formaldehyde rating standard. This selection is independent of the PM
 * standard and does not represent a product region. Each standard supplies
 * one reference concentration; the six Matter grades use the common product
 * multipliers 0.25, 0.5, 1, 2 and 5 documented in README.md section 1.6.
 */
typedef enum {
    /* WHO Guidelines for Indoor Air Quality (2010):
     * Recommended default: 0.10 mg/m3, 30-minute average.
     */
    AIR_HCHO_WHO_2010 = 0,
    /* GB/T 18883-2022: 0.08 mg/m3, 1-hour average. */
    AIR_HCHO_GBT_18883_2022,
    /* California OEHHA Acute REL (2008): 0.055 mg/m3. This is a
     * California reference exposure level, not a US federal standard.
     */
    AIR_HCHO_OEHHA_2008
} air_hcho_std_t;

/* Matter 1.6 Air Quality Cluster (0x005B), AirQualityEnum:
 * six quality grades (1..6), plus Unknown (0), excluded from comparison.
 * These values are not LevelValueEnum. Concentration thresholds and their
 * mapping to grades are product rules, not thresholds defined by Matter.
 * Reporting all six grades requires FAIR, MOD, VPOOR and XPOOR features.
 * Specification: Application Cluster Specification, section 2.9.5.1
 * (printed page 207 / PDF page 211):
 * https://csa-iot.org/wp-content/uploads/2026/06/23-27350-010_Matter-1.6-Application-Cluster-Specification.pdf#page=211
 * Official Matter 1.6 data model (enum values and feature requirements):
 * https://github.com/project-chip/connectedhomeip/blob/master/data_model/1.6/clusters/AirQuality.xml
 */
typedef enum {
    AIR_UNKNOWN = 0,
    AIR_GOOD = 1,
    AIR_FAIR = 2,
    AIR_MODERATE = 3,
    AIR_POOR = 4,
    AIR_VERY_POOR = 5,
    AIR_EXTREMELY_POOR = 6
} air_quality_t;

/* Matter 1.6 Concentration Measurement LevelValueEnum, not AirQualityEnum.
 * LevelIndication is required; MediumLevel enables MEDIUM and CriticalLevel
 * enables CRITICAL. CO2 uses LOW/MEDIUM/HIGH only; PM and HCHO use all four.
 * https://github.com/project-chip/connectedhomeip/blob/master/data_model/1.6/clusters/ConcentrationMeasurement.xml
 */
typedef enum {
    AIR_LEVEL_UNKNOWN = 0,
    AIR_LEVEL_LOW = 1,
    AIR_LEVEL_MEDIUM = 2,
    AIR_LEVEL_HIGH = 3,
    AIR_LEVEL_CRITICAL = 4
} air_level_t;

/* Units: CO2 in ppm; PM in ug/m3; HCHO in mg/m3.
 * Reuse the corresponding air_rate_* rules, then apply this product mapping:
 * Good -> Low; Fair/Moderate -> Medium; Poor/VeryPoor -> High;
 * ExtremelyPoor -> Critical; Unknown -> Unknown.
 * Invalid concentrations or standards return AIR_LEVEL_UNKNOWN.
 * CO2 retains its three bands and never returns CRITICAL.
 * These results are for LevelValue only, not overall AirQuality aggregation.
 */
air_level_t air_level_co2(double co2);
air_level_t air_level_pm25(air_pm_std_t standard, double pm25);
air_level_t air_level_pm10(air_pm_std_t standard, double pm10);
air_level_t air_level_hcho(air_hcho_std_t standard, double hcho);


/* CO2 bands reference UBA 2008, Health evaluation of carbon dioxide in
 * indoor air, section 6.2 and Table 4:
 * https://www.umweltbundesamt.de/system/files/medien/pdfs/kohlendioxid_2008.pdf
 * Units: CO2 in ppm; PM2.5 and PM10 in ug/m3; HCHO in mg/m3.
 * Single-parameter helpers return the Matter grade directly.
 * Negative/NaN/infinite values return UNKNOWN. PM helpers also return UNKNOWN
 * for an invalid standard; HCHO returns UNKNOWN for an invalid standard.
 * No error codes are returned.
 */
air_quality_t air_rate_co2(double co2);
air_quality_t air_rate_pm25(air_pm_std_t standard, double pm25);
air_quality_t air_rate_pm10(air_pm_std_t standard, double pm10);
air_quality_t air_rate_hcho(air_hcho_std_t standard, double hcho);

/* Returns the overall grade: the worst available single-parameter grade.
 * Unset valid_mask bits ignore corresponding values.
 * Negative/NaN/infinite values are excluded from the evaluation.
 * No available values means UNKNOWN; UNKNOWN is excluded from comparison.
 * Invalid PM standard, HCHO standard, or undefined mask bits return UNKNOWN
 * (even if CO2 could otherwise be rated).
 * Uses the same grading rules as the single-parameter helpers.
 */
air_quality_t air_rate_all(air_pm_std_t pm_std,
                           air_hcho_std_t hcho_std,
                           double co2,
                           double pm25,
                           double pm10,
                           double hcho,
                           air_param_mask_t valid_mask);

/* Inputs and results are passed by value. No allocations, retained pointers,
 * history, or mutable global state. Calls are reentrant. Caller checks sensor
 * health, range, and freshness before setting valid_mask.
 */

#ifdef __cplusplus
}
#endif
#endif /* AIR_QUALITY_RATING_H */
