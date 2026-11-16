#include "uv_index_rating.h"
#include <math.h>
#include <stdio.h>
#include <stdlib.h>

#define CHECK(value, expected) do { \
    uv_index_rating_t actual = uv_index_rate(value); \
    if (actual != (expected)) { \
        fprintf(stderr, "line %d: expected %d, got %d\n", \
                __LINE__, (int)(expected), (int)actual); \
        exit(EXIT_FAILURE); \
    } \
} while (0)

int main(void)
{
    static const double boundaries[] = {2.5, 5.5, 7.5, 10.5};
    unsigned int i;
    for (i = 0; i < sizeof(boundaries) / sizeof(boundaries[0]); ++i) {
        CHECK(nextafter(boundaries[i], -INFINITY), (uv_index_rating_t)(i + 1));
        CHECK(boundaries[i], (uv_index_rating_t)(i + 2));
        CHECK(nextafter(boundaries[i], INFINITY), (uv_index_rating_t)(i + 2));
    }
    CHECK(0, UV_INDEX_LOW);
    CHECK(2.499999, UV_INDEX_LOW);
    CHECK(2.5, UV_INDEX_MODERATE);
    CHECK(5.499999, UV_INDEX_MODERATE);
    CHECK(5.5, UV_INDEX_HIGH);
    CHECK(7.499999, UV_INDEX_HIGH);
    CHECK(7.5, UV_INDEX_VERY_HIGH);
    CHECK(10.499999, UV_INDEX_VERY_HIGH);
    CHECK(10.5, UV_INDEX_EXTREME);
    CHECK(100, UV_INDEX_EXTREME);
    CHECK(-0.001, UV_INDEX_UNKNOWN);
    CHECK(NAN, UV_INDEX_UNKNOWN);
    CHECK(INFINITY, UV_INDEX_UNKNOWN);
    return 0;
}
