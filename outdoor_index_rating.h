#ifndef OUTDOOR_INDEX_RATING_H
#define OUTDOOR_INDEX_RATING_H
#ifdef __cplusplus
extern "C" {
#endif

/* Published index schemes, independent of indoor ratings and Matter. */
typedef enum {
    OUTDOOR_INDEX_HJ_633_2026 = 0,
    OUTDOOR_INDEX_EPA_AQI_2026,
    OUTDOOR_INDEX_EEA_2024,
    OUTDOOR_INDEX_NEA_PSI
} outdoor_index_std_t;

/* Ordinal within the SELECTED scheme; equal ordinals across schemes do not
 * imply equal concentrations, risk or names. UNKNOWN is not a grade.
 * HJ: excellent, good, light/moderate/heavy/severe pollution (1..6).
 * EPA: good, moderate, unhealthy for sensitive groups, unhealthy,
 *      very unhealthy, hazardous (1..6).
 * EEA: good, fair, moderate, poor, very poor, extremely poor (1..6).
 * NEA: good, moderate, unhealthy, very unhealthy, hazardous (1..5).
 */
typedef enum {
    OUTDOOR_INDEX_UNKNOWN = 0,
    OUTDOOR_INDEX_GRADE_1,
    OUTDOOR_INDEX_GRADE_2,
    OUTDOOR_INDEX_GRADE_3,
    OUTDOOR_INDEX_GRADE_4,
    OUTDOOR_INDEX_GRADE_5,
    OUTDOOR_INDEX_GRADE_6
} outdoor_index_grade_t;

/* Accept an external published index, NOT a pollutant concentration.
 * HJ/EPA: integer AQI 0..500; boundaries 50,100,150,200,300.
 * Values beyond the supported AQI scale return UNKNOWN (never clamp).
 * NEA: nonnegative integer 24-hour PSI; boundaries 50,100,200,300,
 *      >300 is grade 5. Keep the PSI name, not AQI.
 * EEA: integer 1..6 encodes the external native grade, NOT an AQI number.
 *      The caller must explicitly translate the provider's native labels;
 *      do not pass proprietary interpolated European numeric indices.
 * Fractions, negatives, NaN, infinity, invalid schemes return UNKNOWN.
 * No averaging, freshness checking, concentration-to-index computation,
 * cross-scheme conversion, overall indoor rating, or Matter mapping occurs.
 * Sources:
 * https://www.mee.gov.cn/ywgz/fgbz/bz/bzwb/jcffbz/202602/t20260225_1144441.shtml
 * https://document.airnow.gov/technical-assistance-document-for-the-reporting-of-daily-air-quailty.pdf
 * https://airindex.eea.europa.eu/AQI/
 * https://www.nea.gov.sg/our-services/pollution-control/air-pollution/faqs
 */
outdoor_index_grade_t outdoor_index_rate(outdoor_index_std_t standard,
                                          double value);
#ifdef __cplusplus
}
#endif
#endif
