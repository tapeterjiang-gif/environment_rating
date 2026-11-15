#include "environment_text.h"
#include "air_quality_rating.h"
#include "thermal_comfort.h"
#include "sound_light_rating.h"
#include "pollen_rating.h"
#include "uv_index_rating.h"
#include <assert.h>
#include <stddef.h>
#include <string.h>

int main(void)
{
    const char *name = env_text_get("zh-Hans", "env_co2_name");
    assert(name && strcmp(name, "CO₂") == 0);
    assert(strcmp(env_text_get("zh_TW", "env_humidity_name"), "相對濕度") == 0);
    assert(strcmp(env_text_get("ja-JP", "env_humidity_name"), "相対湿度") == 0);
    assert(strcmp(env_text_get(NULL, "env_humidity_name"), "Relative humidity") == 0);
    assert(strcmp(env_text_get("fr", "env_humidity_name"), "Relative humidity") == 0);
    assert(strcmp(env_text_get("zh_CN", "env_humidity_name"), "相对湿度") == 0);
    assert(strcmp(env_text_rating_id("co2", AIR_MODERATE), "moderate") == 0);
    assert(strcmp(env_text_rating_id("co2", AIR_FAIR), "unknown") == 0);
    assert(strcmp(env_text_rating_id("pm25", AIR_EXTREMELY_POOR), "extremely_poor") == 0);
    assert(strcmp(env_text_rating_id("pmv", THERMAL_SLIGHTLY_WARM), "slightly_warm") == 0);
    assert(strcmp(env_text_rating_id("humidity", THERMAL_HUMIDITY_HUMID), "humid") == 0);
    assert(strcmp(env_text_rating_id("noise", NOISE_VERY_LOUD), "very_loud") == 0);
    assert(strcmp(env_text_rating_id("illuminance", ILLUMINANCE_READING), "reading") == 0);
    assert(strcmp(env_text_rating_id("pollen", POLLEN_ABSENT), "absent") == 0);
    assert(strcmp(env_text_rating_id("uv_index", UV_INDEX_EXTREME), "extreme") == 0);
    assert(strcmp(env_text_get_rating("en", "co2", AIR_MODERATE, "label"), "Ventilate") == 0);
    assert(strcmp(env_text_get_rating("en", "co2", -99, "label"), "Unknown") == 0);
    assert(strcmp(env_text_get_rating("en", "pollen", POLLEN_ABSENT, "label"), "Not detected") == 0);
    assert(env_text_get_rating("en", "tvoc", 1, "label") == NULL);
    assert(env_text_get_rating("en", "temperature", 1, "label") == NULL);
    assert(env_text_get_rating("en", "co2", AIR_GOOD, "invalid") == NULL);
    assert(env_text_get_rating("en", NULL, AIR_GOOD, "label") == NULL);
    assert(env_text_get_rating("en", "co2", AIR_GOOD, NULL) == NULL);
    assert(env_text_get("en", "no_such_key") == NULL);
    assert(env_text_get("en", NULL) == NULL);
    assert(name == env_text_get("zh-Hans", "env_co2_name"));
    return 0;
}
