#include "uv_index_rating.h"

#include <math.h>

uv_index_rating_t uv_index_rate(double uvi)
{
    if (!isfinite(uvi) || uvi < 0) return UV_INDEX_UNKNOWN;
    if (uvi < 2.5) return UV_INDEX_LOW;
    if (uvi < 5.5) return UV_INDEX_MODERATE;
    if (uvi < 7.5) return UV_INDEX_HIGH;
    if (uvi < 10.5) return UV_INDEX_VERY_HIGH;
    return UV_INDEX_EXTREME;
}
