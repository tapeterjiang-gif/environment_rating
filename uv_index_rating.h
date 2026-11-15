#ifndef UV_INDEX_RATING_H
#define UV_INDEX_RATING_H

#ifdef __cplusplus
extern "C" {
#endif

/* Global Solar UV Index exposure categories. UNKNOWN is not a category.
 * WHO/WMO/UNEP/ICNIRP, Global Solar UV Index: A Practical Guide (2002):
 * https://iris.who.int/bitstream/handle/10665/42459/9241590076.pdf
 */
typedef enum {
    UV_INDEX_UNKNOWN = 0,
    UV_INDEX_LOW,
    UV_INDEX_MODERATE,
    UV_INDEX_HIGH,
    UV_INDEX_VERY_HIGH,
    UV_INDEX_EXTREME
} uv_index_rating_t;

/* Input: measured or forecast Global Solar UV Index, dimensionless.
 * The WHO reporting convention rounds a UVI value to the nearest integer;
 * this function compares the original nonnegative value with half-integer
 * boundaries. Exact half values round upward (product tie rule):
 * [0,2.5) Low, [2.5,5.5) Moderate, [5.5,7.5) High,
 * [7.5,10.5) Very High, [10.5,+infinity) Extreme.
 * Negative, NaN and infinite inputs return UNKNOWN. The caller supplies a
 * valid Global Solar UVI; lux or unweighted UV irradiance is not convertible
 * by this function. It does not calculate daily maxima or averaging windows.
 * This rating is separate from air quality, illuminance and Matter ratings.
 */
uv_index_rating_t uv_index_rate(double uvi);

#ifdef __cplusplus
}
#endif
#endif /* UV_INDEX_RATING_H */
