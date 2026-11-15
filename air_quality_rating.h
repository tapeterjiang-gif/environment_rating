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
 * The caller supplies concentrations averaged using the selected standard's
 * required time basis. This library performs threshold lookup only; it does
 * not retain samples or calculate averages, NowCast, or a complete official
 * AQI. Thresholds and Matter mappings are documented in README.md section 2.4.
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
 * multipliers 0.25, 0.5, 1, 2 and 5 documented in README.md section 2.6.
 * The caller supplies a concentration averaged over the selected standard's
 * stated time window; the library does not calculate that average.
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
 * enables CRITICAL. CO2 uses LOW/MEDIUM/HIGH only; PM, HCHO, O3 and CO
 * use all four.
 * https://github.com/project-chip/connectedhomeip/blob/master/data_model/1.6/clusters/ConcentrationMeasurement.xml
 */
typedef enum {
    AIR_LEVEL_UNKNOWN = 0,
    AIR_LEVEL_LOW = 1,
    AIR_LEVEL_MEDIUM = 2,
    AIR_LEVEL_HIGH = 3,
    AIR_LEVEL_CRITICAL = 4
} air_level_t;

/* Units: CO2 in ppm; PM in ug/m3; HCHO in mg/m3. Outdoor O3 and CO
 * units are documented beside their separate declarations below.
 * Inputs are measurement results already averaged or otherwise processed by
 * the caller according to the applicable reference and reporting mode.
 * Reuse the corresponding air_rate_* rules, then apply this product mapping:
 * Good/Fair -> Low; Moderate -> Medium; Poor/VeryPoor -> High;
 * ExtremelyPoor -> Critical; Unknown -> Unknown.
 * Invalid concentrations or standards return AIR_LEVEL_UNKNOWN.
 * CO2 retains its three bands and never returns CRITICAL.
 * These results are for LevelValue only, not overall AirQuality aggregation.
 */
air_level_t air_level_co2(double co2);
air_level_t air_level_pm25(air_pm_std_t standard, double pm25);
air_level_t air_level_pm10(air_pm_std_t standard, double pm10);
air_level_t air_level_hcho(air_hcho_std_t standard, double hcho);

/* Outdoor ozone, rated independently from the indoor overall grade.
 * EEA and HJ inputs are 1-hour averages in ug/m3. EPA inputs are ppm:
 * the 8-hour average is required; pass NAN for an unavailable optional
 * 1-hour average. The caller prepares the averaging windows.
 * EPA 8-hour ozone does not define AQI >= 301; that grade requires a
 * qualifying 1-hour value. Invalid required inputs return UNKNOWN.
 * Matter's Ozone Concentration Measurement cluster is 0x0415; Matter
 * defines LevelValue labels but does not define these thresholds.
 */
air_quality_t air_rate_o3_eea(double one_hour);
air_quality_t air_rate_o3_hj(double one_hour);
air_quality_t air_rate_o3_epa(double eight_hour, double one_hour);
air_level_t air_level_o3_eea(double one_hour);
air_level_t air_level_o3_hj(double one_hour);
air_level_t air_level_o3_epa(double eight_hour, double one_hour);

/* Outdoor carbon monoxide, independent of indoor overall rating.
 * HJ 633-2026 uses a 1-hour average in mg/m3, rounded to one decimal.
 * EPA AQI uses an 8-hour average in ppm, truncated to one decimal.
 * The caller prepares the averaging window; invalid values return UNKNOWN.
 * Matter's Carbon Monoxide Concentration Measurement cluster is 0x040C.
 */
air_quality_t air_rate_co_hj(double one_hour);
air_quality_t air_rate_co_epa(double eight_hour);
air_level_t air_level_co_hj(double one_hour);
air_level_t air_level_co_epa(double eight_hour);

/* Outdoor sulfur dioxide; all results are single-pollutant grades only.
 * EEA and HJ use ug/m3; EPA uses ppb. EEA and HJ hourly inputs are
 * 1-hour averages; HJ daily is a 24-hour average. EPA requires both the
 * 1-hour concentration and 24-hour average. For an official daily EPA
 * report, supply the daily maximum 1-hour concentration.
 * HJ hourly IAQI is capped at 200 above 800 ug/m3, so it never returns
 * VERY_POOR or EXTREMELY_POOR. Invalid inputs return UNKNOWN.
 * Matter 1.6 has no SO2 concentration-measurement cluster; these functions
 * do not provide a Matter LevelValue mapping.
 */
air_quality_t air_rate_so2_eea(double one_hour);
air_quality_t air_rate_so2_hj_hourly(double one_hour);
air_quality_t air_rate_so2_hj_daily(double twenty_four_hour);
air_quality_t air_rate_so2_epa(double one_hour, double twenty_four_hour);


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
 * health, range, freshness, and required averaging window before calling.
 */

#ifdef __cplusplus
}
#endif
#endif /* AIR_QUALITY_RATING_H */
