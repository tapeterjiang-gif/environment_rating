#include "thermal_comfort.h"

#include <math.h>

#if defined(__FAST_MATH__) || (defined(__FINITE_MATH_ONLY__) && __FINITE_MATH_ONLY__ > 0)
#error "thermal_comfort requires finite-math-only and fast-math to be disabled"
#endif

static int in_range(double value, double low, double high)
{
    return isfinite(value) && value >= low && value <= high;
}

static double fourth(double value)
{
    double square = value * value;
    return square * square;
}

/* Dry heat loss per unit body area, W/m2. The 273 offset and constants
 * follow the conventional ISO/Fanger numerical formulation.
 */
static double dry_loss(double clothing_temperature, double air,
                       double radiant, double forced, double area)
{
    double natural = 2.38 * pow(fabs(clothing_temperature - air), 0.25);
    double convection = fmax(forced, natural);
    double radiation = 3.96 *
        (fourth((clothing_temperature + 273.0) / 100.0) -
         fourth((radiant + 273.0) / 100.0));
    return area * (radiation + convection * (clothing_temperature - air));
}

double thermal_pmv(double temperature, double humidity,
                   double radiant_temperature, double air_speed,
                   double met, double clo)
{
    double vapour, metabolism, insulation, area, forced, skin;
    double low, high, clothing, dry, losses, pmv;
    int iteration;
    if (!in_range(temperature, 10, 30) || !in_range(humidity, 0, 100) ||
        !in_range(radiant_temperature, 10, 40) || !in_range(air_speed, 0, 1) ||
        !in_range(met, 0.8, 4) || !in_range(clo, 0, 2)) {
        return NAN;
    }
    vapour = humidity * 10.0 * exp(16.6536 - 4030.183 / (temperature + 235.0));
    if (!in_range(vapour, 0, 2700)) return NAN;
    metabolism = 58.15 * met;
    insulation = 0.155 * clo;
    area = insulation <= 0.078 ? 1.0 + 1.29 * insulation :
                               1.05 + 0.645 * insulation;
    forced = 12.1 * sqrt(air_speed);
    skin = 35.7 - 0.028 * metabolism;

    /* Solve Tcl + Icl * dry_loss(Tcl) = skin by bounded bisection.
     * At the low endpoint all dry heat exchange is nonpositive and Tcl <=
     * skin; at the high endpoint both signs reverse, bracketing a root.
     */
    low = fmin(skin, fmin(temperature, radiant_temperature));
    high = fmax(skin, fmax(temperature, radiant_temperature));
    for (iteration = 0; iteration < 100 && high - low > 1e-7; ++iteration) {
        double balance;
        clothing = (low + high) * 0.5;
        balance = clothing + insulation * dry_loss(clothing, temperature,
                    radiant_temperature, forced, area) - skin;
        if (balance > 0) high = clothing;
        else low = clothing;
    }
    if (high - low > 1e-7) return NAN;
    clothing = (low + high) * 0.5;
    dry = dry_loss(clothing, temperature, radiant_temperature, forced, area);
    losses = 0.00305 * (5733.0 - 6.99 * metabolism - vapour) +
             0.42 * fmax(metabolism - 58.15, 0) +
             0.000017 * metabolism * (5867.0 - vapour) +
             0.0014 * metabolism * (34.0 - temperature) + dry;
    pmv = (0.303 * exp(-0.036 * metabolism) + 0.028) * (metabolism - losses);
    if (!isfinite(pmv)) return NAN;
    return fmax(-3.0, fmin(3.0, pmv));
}

double thermal_ppd(double pmv)
{
    if (!in_range(pmv, -3, 3)) return NAN;
    return 100.0 - 95.0 * exp(-0.03353 * fourth(pmv) - 0.2179 * pmv * pmv);
}

thermal_sensation_t thermal_rate(double pmv)
{
    if (!in_range(pmv, -3, 3)) return THERMAL_UNKNOWN;
    if (pmv < -2.5) return THERMAL_COLD;
    if (pmv < -1.5) return THERMAL_COOL;
    if (pmv < -0.5) return THERMAL_SLIGHTLY_COOL;
    if (pmv <= 0.5) return THERMAL_NEUTRAL;
    if (pmv <= 1.5) return THERMAL_SLIGHTLY_WARM;
    if (pmv <= 2.5) return THERMAL_WARM;
    return THERMAL_HOT;
}

thermal_humidity_t thermal_rate_humidity(thermal_humidity_std_t standard,
                                         double humidity)
{
    double low, high;
    if (!in_range(humidity, 0, 100)) return THERMAL_HUMIDITY_UNKNOWN;
    switch (standard) {
    case THERMAL_HUMIDITY_EPA:
        if (humidity < 30) return THERMAL_HUMIDITY_DRY;
        if (humidity <= 50) return THERMAL_HUMIDITY_SUITABLE;
        if (humidity < 60) return THERMAL_HUMIDITY_SLIGHTLY_HUMID;
        return THERMAL_HUMIDITY_HUMID;
    case THERMAL_HUMIDITY_UBA:
        low = 40;
        high = 60;
        break;
    default:
        return THERMAL_HUMIDITY_UNKNOWN;
    }
    if (humidity < low) return THERMAL_HUMIDITY_DRY;
    if (humidity <= high) return THERMAL_HUMIDITY_SUITABLE;
    return THERMAL_HUMIDITY_HUMID;
}
