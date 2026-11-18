#include "outdoor_index_rating.h"
#include <math.h>

#if defined(__FAST_MATH__) || (defined(__FINITE_MATH_ONLY__) && __FINITE_MATH_ONLY__ > 0)
#error "outdoor_index_rating requires finite-math-only and fast-math to be disabled"
#endif

outdoor_index_grade_t outdoor_index_rate(outdoor_index_std_t standard,
                                          double value)
{
    if (!isfinite(value) || value < 0 || floor(value) != value)
        return OUTDOOR_INDEX_UNKNOWN;
    if ((standard != OUTDOOR_INDEX_HJ_633_2026 &&
         standard != OUTDOOR_INDEX_EPA_AQI_2026) || value > 500)
        return OUTDOOR_INDEX_UNKNOWN;
    if (value <= 50) return OUTDOOR_INDEX_GRADE_1;
    if (value <= 100) return OUTDOOR_INDEX_GRADE_2;
    if (value <= 150) return OUTDOOR_INDEX_GRADE_3;
    if (value <= 200) return OUTDOOR_INDEX_GRADE_4;
    if (value <= 300) return OUTDOOR_INDEX_GRADE_5;
    return OUTDOOR_INDEX_GRADE_6;
}
