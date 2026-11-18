#include "outdoor_index_rating.h"
#include <float.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#define CHECK(s,v,g) do { if(outdoor_index_rate(s,v)!=(g)) { \
 fprintf(stderr,"outdoor index failure at line %d\n",__LINE__);exit(1); } } while(0)
int main(void) {
    const double invalid[] = {-1, NAN, INFINITY, -INFINITY, 0.5, 50.1};
    unsigned int s,i;
    const int boundaries[] = {50,100,150,200,300};
    for(s=0;s<4;s++) for(i=0;i<sizeof(invalid)/sizeof(invalid[0]);i++)
        CHECK((outdoor_index_std_t)s,invalid[i],OUTDOOR_INDEX_UNKNOWN);
    for(s=0;s<2;s++) {
        CHECK((outdoor_index_std_t)s,0,OUTDOOR_INDEX_GRADE_1);
        for(i=0;i<5;i++) {
            CHECK((outdoor_index_std_t)s,boundaries[i],(outdoor_index_grade_t)(i+1));
            CHECK((outdoor_index_std_t)s,boundaries[i]+1,(outdoor_index_grade_t)(i+2));
        }
        CHECK((outdoor_index_std_t)s,500,OUTDOOR_INDEX_GRADE_6);
        CHECK((outdoor_index_std_t)s,501,OUTDOOR_INDEX_UNKNOWN);
        CHECK((outdoor_index_std_t)s,DBL_MAX,OUTDOOR_INDEX_UNKNOWN);
    }
    CHECK((outdoor_index_std_t)2, 1, OUTDOOR_INDEX_UNKNOWN);
    CHECK((outdoor_index_std_t)3, 150, OUTDOOR_INDEX_UNKNOWN);
    CHECK((outdoor_index_std_t)-1,1,OUTDOOR_INDEX_UNKNOWN);
    CHECK((outdoor_index_std_t)99,1,OUTDOOR_INDEX_UNKNOWN);
    return 0;
}
