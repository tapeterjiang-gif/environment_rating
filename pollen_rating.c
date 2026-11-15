#include "pollen_rating.h"

#include <math.h>

typedef struct {
    pollen_type_t type;
    double moderate;
    double high;
    double very_high;
} pollen_bands_t;

static const pollen_bands_t nab_bands[] = {
    {POLLEN_TREE, 15, 90, 1500},
    {POLLEN_GRASS, 5, 20, 200},
    {POLLEN_WEED, 10, 50, 500}
};

static const pollen_bands_t meteoswiss_bands[] = {
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

pollen_rating_t pollen_rate(pollen_std_t standard,
                            pollen_type_t type,
                            double concentration)
{
    const pollen_bands_t *bands;
    unsigned int count;
    unsigned int i;

    if (!isfinite(concentration) || concentration < 0 ||
        (standard != POLLEN_STD_NAB && standard != POLLEN_STD_METEOSWISS) ||
        type <= POLLEN_TYPE_UNKNOWN || type > POLLEN_RAGWEED) {
        return POLLEN_UNKNOWN;
    }
    if (type == POLLEN_TOTAL) {
        return concentration == 0 ? POLLEN_ABSENT : POLLEN_UNKNOWN;
    }
    if (standard == POLLEN_STD_NAB) {
        bands = nab_bands;
        count = (unsigned int)(sizeof(nab_bands) / sizeof(nab_bands[0]));
    } else {
        bands = meteoswiss_bands;
        count = (unsigned int)(sizeof(meteoswiss_bands) /
                               sizeof(meteoswiss_bands[0]));
    }
    for (i = 0; i < count; ++i) {
        if (bands[i].type == type) {
            if (concentration == 0) return POLLEN_ABSENT;
            if (concentration < bands[i].moderate) return POLLEN_LOW;
            if (concentration < bands[i].high) return POLLEN_MODERATE;
            if (concentration < bands[i].very_high) return POLLEN_HIGH;
            return POLLEN_VERY_HIGH;
        }
    }
    return POLLEN_UNKNOWN;
}
