#include "pollen_rating.h"
#include <math.h>
#include <stdio.h>
#include <stdlib.h>

#define CHECK(std, type, value, expected) do { \
    pollen_rating_t actual = pollen_rate((std), (type), (value)); \
    if (actual != (expected)) { \
        fprintf(stderr, "line %d: expected %d, got %d\n", \
                __LINE__, (int)(expected), (int)actual); \
        exit(EXIT_FAILURE); \
    } \
} while (0)

int main(void)
{
    static const struct {
        pollen_type_t type;
        double moderate;
        double high;
        double very_high;
    } swiss[] = {
        {POLLEN_HAZEL, 11, 70, 250},
        {POLLEN_ALDER, 11, 70, 250},
        {POLLEN_ASH, 11, 100, 350},
        {POLLEN_BIRCH, 11, 70, 300},
        {POLLEN_HORNBEAM, 11, 70, 250},
        {POLLEN_PLANE, 50, 100, 400},
        {POLLEN_OAK, 50, 130, 400},
        {POLLEN_BEECH, 50, 130, 400},
        {POLLEN_CHESTNUT, 100, 200, 700},
        {POLLEN_GRASS, 20, 50, 150},
        {POLLEN_SORREL, 15, 25, 60},
        {POLLEN_PLANTAIN, 15, 25, 60},
        {POLLEN_MUGWORT, 6, 15, 50},
        {POLLEN_RAGWEED, 6, 11, 40}
    };
    unsigned int i;
    for (i = 0; i < sizeof(swiss) / sizeof(swiss[0]); ++i) {
        const double boundaries[] = {swiss[i].moderate, swiss[i].high, swiss[i].very_high};
        unsigned int j;
        for (j = 0; j < 3; ++j) {
            CHECK(POLLEN_STD_METEOSWISS, swiss[i].type,
                  nextafter(boundaries[j], -INFINITY), (pollen_rating_t)(j + 2));
            CHECK(POLLEN_STD_METEOSWISS, swiss[i].type,
                  nextafter(boundaries[j], INFINITY), (pollen_rating_t)(j + 3));
        }
        CHECK(POLLEN_STD_METEOSWISS, swiss[i].type, 0, POLLEN_ABSENT);
        CHECK(POLLEN_STD_METEOSWISS, swiss[i].type,
              swiss[i].moderate - 0.5, POLLEN_LOW);
        CHECK(POLLEN_STD_METEOSWISS, swiss[i].type,
              swiss[i].moderate, POLLEN_MODERATE);
        CHECK(POLLEN_STD_METEOSWISS, swiss[i].type,
              swiss[i].high, POLLEN_HIGH);
        CHECK(POLLEN_STD_METEOSWISS, swiss[i].type,
              swiss[i].very_high, POLLEN_VERY_HIGH);
    }
    CHECK(POLLEN_STD_NAB, POLLEN_TREE, 0, POLLEN_ABSENT);
    CHECK(POLLEN_STD_NAB, POLLEN_TREE, 14.999, POLLEN_LOW);
    CHECK(POLLEN_STD_NAB, POLLEN_TREE, 15, POLLEN_MODERATE);
    CHECK(POLLEN_STD_NAB, POLLEN_TREE, 90, POLLEN_HIGH);
    CHECK(POLLEN_STD_NAB, POLLEN_TREE, 1500, POLLEN_VERY_HIGH);
    CHECK(POLLEN_STD_NAB, POLLEN_GRASS, 4.999, POLLEN_LOW);
    CHECK(POLLEN_STD_NAB, POLLEN_GRASS, 5, POLLEN_MODERATE);
    CHECK(POLLEN_STD_NAB, POLLEN_GRASS, 20, POLLEN_HIGH);
    CHECK(POLLEN_STD_NAB, POLLEN_GRASS, 200, POLLEN_VERY_HIGH);
    CHECK(POLLEN_STD_NAB, POLLEN_WEED, 10, POLLEN_MODERATE);
    CHECK(POLLEN_STD_NAB, POLLEN_WEED, 50, POLLEN_HIGH);
    CHECK(POLLEN_STD_NAB, POLLEN_WEED, 500, POLLEN_VERY_HIGH);
    CHECK(POLLEN_STD_METEOSWISS, POLLEN_BIRCH, 0.1, POLLEN_LOW);
    CHECK(POLLEN_STD_METEOSWISS, POLLEN_BIRCH, 10.5, POLLEN_LOW);
    CHECK(POLLEN_STD_METEOSWISS, POLLEN_BIRCH, 11, POLLEN_MODERATE);
    CHECK(POLLEN_STD_METEOSWISS, POLLEN_BIRCH, 70, POLLEN_HIGH);
    CHECK(POLLEN_STD_METEOSWISS, POLLEN_BIRCH, 300, POLLEN_VERY_HIGH);
    CHECK(POLLEN_STD_METEOSWISS, POLLEN_GRASS, 20, POLLEN_MODERATE);
    CHECK(POLLEN_STD_METEOSWISS, POLLEN_GRASS, 50, POLLEN_HIGH);
    CHECK(POLLEN_STD_METEOSWISS, POLLEN_GRASS, 150, POLLEN_VERY_HIGH);
    CHECK(POLLEN_STD_METEOSWISS, POLLEN_RAGWEED, 6, POLLEN_MODERATE);
    CHECK(POLLEN_STD_METEOSWISS, POLLEN_RAGWEED, 11, POLLEN_HIGH);
    CHECK(POLLEN_STD_METEOSWISS, POLLEN_RAGWEED, 40, POLLEN_VERY_HIGH);
    CHECK(POLLEN_STD_METEOSWISS, POLLEN_TOTAL, 0, POLLEN_ABSENT);
    CHECK(POLLEN_STD_METEOSWISS, POLLEN_TOTAL, 1, POLLEN_UNKNOWN);
    CHECK(POLLEN_STD_NAB, POLLEN_BIRCH, 0, POLLEN_UNKNOWN);
    CHECK(POLLEN_STD_METEOSWISS, POLLEN_TREE, 0, POLLEN_UNKNOWN);
    CHECK(POLLEN_STD_NAB, POLLEN_TYPE_UNKNOWN, 0, POLLEN_UNKNOWN);
    CHECK(POLLEN_STD_NAB, POLLEN_GRASS, NAN, POLLEN_UNKNOWN);
    CHECK(POLLEN_STD_NAB, POLLEN_GRASS, INFINITY, POLLEN_UNKNOWN);
    CHECK(POLLEN_STD_NAB, POLLEN_GRASS, -1, POLLEN_UNKNOWN);
    CHECK((pollen_std_t)99, POLLEN_GRASS, 1, POLLEN_UNKNOWN);
    CHECK(POLLEN_STD_NAB, (pollen_type_t)99, 1, POLLEN_UNKNOWN);
    return 0;
}
