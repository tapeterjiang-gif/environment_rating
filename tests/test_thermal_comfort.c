#include "thermal_comfort.h"
#include <float.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>

static unsigned checks;
#define CHECK(x) do { ++checks; if (!(x)) { \
    fprintf(stderr, "line %d: %s\n", __LINE__, #x); exit(EXIT_FAILURE); \
} } while (0)

static void test_humidity(void)
{
    const struct {
        thermal_humidity_std_t standard;
        double low, high;
    } cases[] = {
        {THERMAL_HUMIDITY_EPA, 30, 50},
        {THERMAL_HUMIDITY_UBA, 40, 60}
    };
    const double invalid[] = {NAN, INFINITY, -INFINITY, -1, 101,
                              nextafter(0, -INFINITY), nextafter(100, INFINITY)};
    size_t i, j;
    for (i = 0; i < sizeof(cases)/sizeof(cases[0]); ++i) {
        thermal_humidity_std_t standard = cases[i].standard;
        double low = cases[i].low, high = cases[i].high;
        CHECK(thermal_rate_humidity(standard, 0) == THERMAL_HUMIDITY_DRY);
        CHECK(thermal_rate_humidity(standard, 100) == THERMAL_HUMIDITY_HUMID);
        CHECK(thermal_rate_humidity(standard, nextafter(low, -INFINITY)) == THERMAL_HUMIDITY_DRY);
        CHECK(thermal_rate_humidity(standard, low) == THERMAL_HUMIDITY_SUITABLE);
        CHECK(thermal_rate_humidity(standard, nextafter(low, INFINITY)) == THERMAL_HUMIDITY_SUITABLE);
        CHECK(thermal_rate_humidity(standard, nextafter(high, -INFINITY)) == THERMAL_HUMIDITY_SUITABLE);
        CHECK(thermal_rate_humidity(standard, high) == THERMAL_HUMIDITY_SUITABLE);
        CHECK(thermal_rate_humidity(standard, nextafter(high, INFINITY)) ==
              (standard == THERMAL_HUMIDITY_EPA ? THERMAL_HUMIDITY_SLIGHTLY_HUMID : THERMAL_HUMIDITY_HUMID));
        for (j = 0; j < sizeof(invalid)/sizeof(invalid[0]); ++j)
            CHECK(thermal_rate_humidity(standard, invalid[j]) == THERMAL_HUMIDITY_UNKNOWN);
    }
    CHECK(thermal_rate_humidity(THERMAL_HUMIDITY_EPA, nextafter(60, -INFINITY)) == THERMAL_HUMIDITY_SLIGHTLY_HUMID);
    CHECK(thermal_rate_humidity(THERMAL_HUMIDITY_EPA, 60) == THERMAL_HUMIDITY_HUMID);
    CHECK(thermal_rate_humidity(THERMAL_HUMIDITY_EPA, nextafter(60, INFINITY)) == THERMAL_HUMIDITY_HUMID);
    CHECK(thermal_rate_humidity((thermal_humidity_std_t)-1, 50) == THERMAL_HUMIDITY_UNKNOWN);
    CHECK(thermal_rate_humidity((thermal_humidity_std_t)2, 50) == THERMAL_HUMIDITY_UNKNOWN);
    CHECK(thermal_rate_humidity((thermal_humidity_std_t)999, 50) == THERMAL_HUMIDITY_UNKNOWN);
    /* Switching references on identical samples must not retain state. */
    for (i = 0; i < 3; ++i) {
        CHECK(thermal_rate_humidity(THERMAL_HUMIDITY_EPA, 55) == THERMAL_HUMIDITY_SLIGHTLY_HUMID);
        CHECK(thermal_rate_humidity(THERMAL_HUMIDITY_UBA, 55) == THERMAL_HUMIDITY_SUITABLE);
        CHECK(thermal_rate_humidity(THERMAL_HUMIDITY_UBA, 75) == THERMAL_HUMIDITY_HUMID);
    }
}

int main(void)
{
    const double bad[] = {NAN, INFINITY, -INFINITY, DBL_MAX, -DBL_MAX};
    const double bounds[6][2] = {{10,30},{0,100},{10,40},{0,1},{0.8,4},{0,2}};
    const double inputs[] = {25,50,25,0.1,1.1,0.5};
    size_t i, j;
    /* CBE reference heat-balance iteration, external work=0, convergence
     * tightened to 1e-12 to compare the equations independently of solver.
     * Input columns: air, RH, radiant, relative speed, met, clo, expected PMV.
     */
    const double reference[][7] = {
        {25,50,25,0.1,1.1,0.5,-0.13360297247942393},
        {20,40,20,0.1,1.2,1,-0.38929079314205384},
        {27,50,27,0.3,1.2,0.5,0.3533602080928166},
        {23,40,20,0.2,1.1,1,-0.40033515084834337},
        {28,30,30,0.5,1.4,0.3,0.5448722291778105},
        {28,20,28,0,1,0,-0.7219924808209149}
    };
    for(i=0;i<sizeof(reference)/sizeof(reference[0]);++i) {
        const double *a=reference[i];
        CHECK(fabs(thermal_pmv(a[0],a[1],a[2],a[3],a[4],a[5])-a[6])<1e-6);
    }
    /* Published CBE pythermalcomfort pmv_ppd_iso examples (rounded PMV).
     * https://pythermalcomfort.readthedocs.io/en/latest/documentation/models.html
     */
    CHECK(fabs(thermal_pmv(25,50,25,0.1,1.4,0.5)-0.41) < 0.01);
    CHECK(fabs(thermal_pmv(22,50,25,0.1,1.4,0.5)) < 0.01);
    CHECK(thermal_ppd(0) == 5);
    CHECK(fabs(thermal_ppd(0.5)-10.22502455) < 1e-7);
    CHECK(fabs(thermal_ppd(1)-26.11965008) < 1e-7);
    CHECK(fabs(thermal_ppd(2)-76.761813) < 1e-5);
    CHECK(fabs(thermal_ppd(3)-99.11587172) < 1e-7);
    for (i=0; i<sizeof(bad)/sizeof(bad[0]); ++i) {
        CHECK(isnan(thermal_ppd(bad[i])));
        CHECK(thermal_rate(bad[i]) == THERMAL_UNKNOWN);
        for (j=0; j<6; ++j) {
            double a[6]; size_t k;
            for (k=0;k<6;++k) a[k]=inputs[k];
            a[j]=bad[i];
            CHECK(isnan(thermal_pmv(a[0],a[1],a[2],a[3],a[4],a[5])));
        }
    }
    for (j=0;j<6;++j) {
        double a[6]; size_t k;
        for(k=0;k<6;++k)a[k]=inputs[k];
        a[j]=nextafter(bounds[j][0],-INFINITY);
        CHECK(isnan(thermal_pmv(a[0],a[1],a[2],a[3],a[4],a[5])));
        a[j]=nextafter(bounds[j][1],INFINITY);
        CHECK(isnan(thermal_pmv(a[0],a[1],a[2],a[3],a[4],a[5])));
    }
    CHECK(isnan(thermal_pmv(30,100,30,0.1,1.1,0.5))); /* vapour > 2700 Pa */
    CHECK(thermal_pmv(10,50,10,1,0.8,0) == -3); /* Saturated scale endpoint. */
    CHECK(thermal_pmv(30,0,40,0,4,2) == 3);      /* Saturated scale endpoint. */
    CHECK(isnan(thermal_ppd(nextafter(3,INFINITY))));
    CHECK(isnan(thermal_ppd(nextafter(-3,-INFINITY))));
    CHECK(thermal_rate(-3) == THERMAL_COLD);
    CHECK(thermal_rate(nextafter(-3,-INFINITY)) == THERMAL_UNKNOWN);
    CHECK(thermal_rate(nextafter(-2.5,-INFINITY)) == THERMAL_COLD);
    CHECK(thermal_rate(-2.5) == THERMAL_COOL);
    CHECK(thermal_rate(nextafter(-1.5,-INFINITY)) == THERMAL_COOL);
    CHECK(thermal_rate(-1.5) == THERMAL_SLIGHTLY_COOL);
    CHECK(thermal_rate(nextafter(-0.5,-INFINITY)) == THERMAL_SLIGHTLY_COOL);
    CHECK(thermal_rate(-0.5) == THERMAL_NEUTRAL);
    CHECK(thermal_rate(0.5) == THERMAL_NEUTRAL);
    CHECK(thermal_rate(nextafter(0.5,INFINITY)) == THERMAL_SLIGHTLY_WARM);
    CHECK(thermal_rate(1.5) == THERMAL_SLIGHTLY_WARM);
    CHECK(thermal_rate(nextafter(1.5,INFINITY)) == THERMAL_WARM);
    CHECK(thermal_rate(2.5) == THERMAL_WARM);
    CHECK(thermal_rate(nextafter(2.5,INFINITY)) == THERMAL_HOT);
    CHECK(thermal_rate(3) == THERMAL_HOT);
    CHECK(thermal_rate(nextafter(3,INFINITY)) == THERMAL_UNKNOWN);
    for(i=0;i<=300;++i) {
        double p=i/100.0;
        CHECK(thermal_ppd(p)==thermal_ppd(-p));
        CHECK(thermal_ppd(p)>=5 && thermal_ppd(p)<=100);
        if(i)CHECK(thermal_ppd(p)>thermal_ppd(p-0.01));
    }
    test_humidity();
    printf("Passed %u thermal checks\n", checks);
    return EXIT_SUCCESS;
}
