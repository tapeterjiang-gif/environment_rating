#ifndef POLLEN_RATING_H
#define POLLEN_RATING_H

#ifdef __cplusplus
extern "C" {
#endif

/* The standard names identify the published grading scheme, not a region. */
typedef enum {
    POLLEN_STD_NAB = 0,
    POLLEN_STD_METEOSWISS = 1
} pollen_std_t;

/* NAB uses group totals. MeteoSwiss uses individual taxa (and grass).
 * POLLEN_TOTAL means a measured total with no taxonomic breakdown;
 * POLLEN_TYPE_UNKNOWN means that the measurement type is not known.
 */
typedef enum {
    POLLEN_TYPE_UNKNOWN = 0,
    POLLEN_TOTAL,
    POLLEN_TREE,
    POLLEN_GRASS,
    POLLEN_WEED,
    POLLEN_HAZEL,
    POLLEN_ALDER,
    POLLEN_ASH,
    POLLEN_BIRCH,
    POLLEN_HORNBEAM,
    POLLEN_PLANE,
    POLLEN_OAK,
    POLLEN_BEECH,
    POLLEN_CHESTNUT,
    POLLEN_SORREL,
    POLLEN_PLANTAIN,
    POLLEN_MUGWORT,
    POLLEN_RAGWEED
} pollen_type_t;

/* ABSENT is a product display state for a measured zero. The cited schemes
 * define four positive-load grades; UNKNOWN is not a grade.
 */
typedef enum {
    POLLEN_UNKNOWN = 0,
    POLLEN_ABSENT,
    POLLEN_LOW,
    POLLEN_MODERATE,
    POLLEN_HIGH,
    POLLEN_VERY_HIGH
} pollen_rating_t;

/* concentration: valid daily mean, pollen grains/m3. The caller supplies
 * the correct taxon/group count and performs sampling, averaging, freshness
 * checks, and source validation. A positive untyped total cannot be graded.
 * A measured total of zero returns ABSENT; UNKNOWN type always returns UNKNOWN.
 * Unsupported standard/type pairs or negative/nonfinite values return UNKNOWN.
 * Continuous comparisons use the start of the next published integer band:
 * e.g. MeteoSwiss birch 1-10 is 0<x<11, 11-69 is 11<=x<70.
 * This function never returns a Matter AirQuality or LevelValue enum.
 * NAB: https://pollenandmold.stlouisco.com/html/PollenLevels.html
 * MeteoSwiss: https://www.meteoswiss.admin.ch/dam/jcr%3A43b4f361-8bc1-4af7-a232-c126de0f2f80/Belastungsklassen-der-allergenen-Pollenarten_E.pdf
 */
pollen_rating_t pollen_rate(pollen_std_t standard,
                            pollen_type_t type,
                            double concentration);

#ifdef __cplusplus
}
#endif
#endif /* POLLEN_RATING_H */
