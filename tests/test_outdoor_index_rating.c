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
    for(i=1;i<=6;i++) CHECK(OUTDOOR_INDEX_EEA_2024,i,(outdoor_index_grade_t)i);
    CHECK(OUTDOOR_INDEX_EEA_2024,0,OUTDOOR_INDEX_UNKNOWN);
    CHECK(OUTDOOR_INDEX_EEA_2024,7,OUTDOOR_INDEX_UNKNOWN);
    CHECK(OUTDOOR_INDEX_EEA_2024,DBL_MAX,OUTDOOR_INDEX_UNKNOWN);
    CHECK(OUTDOOR_INDEX_NEA_PSI,0,OUTDOOR_INDEX_GRADE_1);
    CHECK(OUTDOOR_INDEX_NEA_PSI,50,OUTDOOR_INDEX_GRADE_1);
    CHECK(OUTDOOR_INDEX_NEA_PSI,51,OUTDOOR_INDEX_GRADE_2);
    CHECK(OUTDOOR_INDEX_NEA_PSI,100,OUTDOOR_INDEX_GRADE_2);
    CHECK(OUTDOOR_INDEX_NEA_PSI,101,OUTDOOR_INDEX_GRADE_3);
    CHECK(OUTDOOR_INDEX_NEA_PSI,200,OUTDOOR_INDEX_GRADE_3);
    CHECK(OUTDOOR_INDEX_NEA_PSI,201,OUTDOOR_INDEX_GRADE_4);
    CHECK(OUTDOOR_INDEX_NEA_PSI,300,OUTDOOR_INDEX_GRADE_4);
    CHECK(OUTDOOR_INDEX_NEA_PSI,301,OUTDOOR_INDEX_GRADE_5);
    CHECK(OUTDOOR_INDEX_NEA_PSI,501,OUTDOOR_INDEX_GRADE_5);
    CHECK((outdoor_index_std_t)-1,1,OUTDOOR_INDEX_UNKNOWN);
    CHECK((outdoor_index_std_t)99,1,OUTDOOR_INDEX_UNKNOWN);
    return 0;
}
