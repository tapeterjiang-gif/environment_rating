#include "sound_light_rating.h"
#include <math.h>
#include <float.h>
#include <stdio.h>
#include <stdlib.h>
#define CHECK(x) do { if (!(x)) { fprintf(stderr,"line %d: %s\n",__LINE__,#x); exit(1); } } while(0)
static void test_illuminance(void)
{
    const double lux_per_fc = 10.763910416709722;
    const struct {
        double boundary;
        illuminance_level_t below, at;
    } edges[] = {
        {5 * lux_per_fc, ILLUMINANCE_LOW_LIGHT, ILLUMINANCE_AMBIENT},
        {10 * lux_per_fc, ILLUMINANCE_AMBIENT, ILLUMINANCE_DAILY_ACTIVITY},
        {20 * lux_per_fc, ILLUMINANCE_DAILY_ACTIVITY, ILLUMINANCE_READING},
        {30 * lux_per_fc, ILLUMINANCE_READING, ILLUMINANCE_FOCUSED_ACTIVITY},
        {50 * lux_per_fc, ILLUMINANCE_FOCUSED_ACTIVITY, ILLUMINANCE_DETAIL_WORK}
    };
    size_t i;
    for (i=0;i<sizeof(edges)/sizeof(edges[0]);++i) {
        CHECK(illuminance_rate(nextafter(edges[i].boundary,-INFINITY))==edges[i].below);
        CHECK(illuminance_rate(edges[i].boundary)==edges[i].at);
        CHECK(illuminance_rate(nextafter(edges[i].boundary,INFINITY))==edges[i].at);
    }
    CHECK(illuminance_rate(0)==ILLUMINANCE_LOW_LIGHT);
    CHECK(illuminance_rate(-0.0)==ILLUMINANCE_LOW_LIGHT);
    CHECK(illuminance_rate(nextafter(0,INFINITY))==ILLUMINANCE_LOW_LIGHT);
    CHECK(illuminance_rate(nextafter(0,-INFINITY))==ILLUMINANCE_UNKNOWN);
    CHECK(illuminance_rate(-1)==ILLUMINANCE_UNKNOWN);
    CHECK(illuminance_rate(NAN)==ILLUMINANCE_UNKNOWN);
    CHECK(illuminance_rate(INFINITY)==ILLUMINANCE_UNKNOWN);
    CHECK(illuminance_rate(-INFINITY)==ILLUMINANCE_UNKNOWN);
    CHECK(illuminance_rate(DBL_MAX)==ILLUMINANCE_DETAIL_WORK);
    CHECK(illuminance_rate(250)==ILLUMINANCE_READING);
    CHECK(illuminance_rate(125)==ILLUMINANCE_DAILY_ACTIVITY);
}

int main(void)
{
    int scene, i;
    double bad[] = {NAN, INFINITY, -INFINITY, -201, 201};
    for (scene=NOISE_HOME; scene<=NOISE_SLEEP; ++scene) {
        double base=scene==NOISE_SLEEP ? 30:35;
        for(i=0;i<3;++i) {
            double edge=base+10*i;
            CHECK(noise_rate((noise_scene_t)scene,edge)==(noise_level_t)(NOISE_QUIET+i));
            CHECK(noise_rate((noise_scene_t)scene,nextafter(edge,-INFINITY))==(noise_level_t)(NOISE_QUIET+i));
            CHECK(noise_rate((noise_scene_t)scene,nextafter(edge,INFINITY))==(noise_level_t)(NOISE_QUIET+i+1));
        }
        for(i=0;i<5;++i) CHECK(noise_rate((noise_scene_t)scene,bad[i])==NOISE_UNKNOWN);
    }
    CHECK(noise_rate((noise_scene_t)-1,30)==NOISE_UNKNOWN);
    CHECK(noise_rate((noise_scene_t)2,30)==NOISE_UNKNOWN);
    CHECK(noise_rate(NOISE_SLEEP,-10)==NOISE_QUIET);
    CHECK(noise_rate(NOISE_HOME,-200)==NOISE_QUIET);
    CHECK(noise_rate(NOISE_HOME,200)==NOISE_VERY_LOUD);
    CHECK(noise_rate(NOISE_HOME,nextafter(-200,-INFINITY))==NOISE_UNKNOWN);
    CHECK(noise_rate(NOISE_HOME,nextafter(200,INFINITY))==NOISE_UNKNOWN);
    /* Calls are independent, including scene changes and invalid readings. */
    for (i=0;i<10;++i) {
        CHECK(noise_rate(NOISE_HOME,35)==NOISE_QUIET);
        CHECK(noise_rate(NOISE_SLEEP,35)==NOISE_NOTICEABLE);
        CHECK(noise_rate(NOISE_SLEEP,NAN)==NOISE_UNKNOWN);
        CHECK(noise_rate(NOISE_SLEEP,30)==NOISE_QUIET);
    }
    test_illuminance();
    puts("Sound/light tests passed");
    return 0;
}
