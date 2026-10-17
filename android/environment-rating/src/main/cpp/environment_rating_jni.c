#include <jni.h>
#include <stdint.h>

#include "air_quality_rating.h"
#include "environment_color.h"
#include "sound_light_rating.h"
#include "thermal_comfort.h"

#define JNI_METHOD(name) \
    Java_com_qingping_environmentrating_NativeBridge_##name

static jintArray make_colors(JNIEnv *env, const env_rgb_t *colors,
                             jsize count)
{
    jint values[4];
    jintArray result;
    jsize i;

    if (count < 0 || count > 4) return NULL;
    for (i = 0; i < count; ++i) {
        if (colors[i] == ENV_RGB_INVALID) return NULL;
        values[i] = (jint)colors[i];
    }
    result = (*env)->NewIntArray(env, count);
    if (result == NULL) return NULL;
    (*env)->SetIntArrayRegion(env, result, 0, count, values);
    return (*env)->ExceptionCheck(env) ? NULL : result;
}

JNIEXPORT jint JNICALL JNI_METHOD(airRateCo2)(JNIEnv *env, jobject object,
                                               jdouble value)
{
    (void)env;
    (void)object;
    return (jint)air_rate_co2((double)value);
}

JNIEXPORT jint JNICALL JNI_METHOD(airRatePm25)(JNIEnv *env, jobject object,
                                                jint standard, jdouble value)
{
    (void)env;
    (void)object;
    return (jint)air_rate_pm25((air_pm_std_t)standard, (double)value);
}

JNIEXPORT jint JNICALL JNI_METHOD(airRatePm10)(JNIEnv *env, jobject object,
                                                jint standard, jdouble value)
{
    (void)env;
    (void)object;
    return (jint)air_rate_pm10((air_pm_std_t)standard, (double)value);
}

JNIEXPORT jint JNICALL JNI_METHOD(airRateHcho)(JNIEnv *env, jobject object,
                                                jint standard, jdouble value)
{
    (void)env;
    (void)object;
    return (jint)air_rate_hcho((air_hcho_std_t)standard, (double)value);
}

JNIEXPORT jint JNICALL JNI_METHOD(airRateAll)(
    JNIEnv *env, jobject object, jint pm_standard, jint hcho_standard,
    jdouble co2, jdouble pm25, jdouble pm10, jdouble hcho, jint valid_mask)
{
    (void)env;
    (void)object;
    return (jint)air_rate_all((air_pm_std_t)pm_standard,
                              (air_hcho_std_t)hcho_standard,
                              (double)co2, (double)pm25, (double)pm10,
                              (double)hcho, (air_param_mask_t)valid_mask);
}

JNIEXPORT jint JNICALL JNI_METHOD(airLevelCo2)(JNIEnv *env, jobject object,
                                                jdouble value)
{
    (void)env;
    (void)object;
    return (jint)air_level_co2((double)value);
}

JNIEXPORT jint JNICALL JNI_METHOD(airLevelPm25)(JNIEnv *env, jobject object,
                                                 jint standard, jdouble value)
{
    (void)env;
    (void)object;
    return (jint)air_level_pm25((air_pm_std_t)standard, (double)value);
}

JNIEXPORT jint JNICALL JNI_METHOD(airLevelPm10)(JNIEnv *env, jobject object,
                                                 jint standard, jdouble value)
{
    (void)env;
    (void)object;
    return (jint)air_level_pm10((air_pm_std_t)standard, (double)value);
}

JNIEXPORT jint JNICALL JNI_METHOD(airLevelHcho)(JNIEnv *env, jobject object,
                                                 jint standard, jdouble value)
{
    (void)env;
    (void)object;
    return (jint)air_level_hcho((air_hcho_std_t)standard, (double)value);
}

JNIEXPORT jdouble JNICALL JNI_METHOD(thermalPmv)(
    JNIEnv *env, jobject object, jdouble temperature, jdouble humidity,
    jdouble radiant_temperature, jdouble air_speed, jdouble met, jdouble clo)
{
    (void)env;
    (void)object;
    return (jdouble)thermal_pmv((double)temperature, (double)humidity,
                                (double)radiant_temperature,
                                (double)air_speed, (double)met, (double)clo);
}

JNIEXPORT jdouble JNICALL JNI_METHOD(thermalPpd)(JNIEnv *env, jobject object,
                                                  jdouble pmv)
{
    (void)env;
    (void)object;
    return (jdouble)thermal_ppd((double)pmv);
}

JNIEXPORT jint JNICALL JNI_METHOD(thermalRate)(JNIEnv *env, jobject object,
                                                jdouble pmv)
{
    (void)env;
    (void)object;
    return (jint)thermal_rate((double)pmv);
}

JNIEXPORT jint JNICALL JNI_METHOD(humidityRate)(JNIEnv *env, jobject object,
                                                 jint standard, jdouble value)
{
    (void)env;
    (void)object;
    return (jint)thermal_rate_humidity((thermal_humidity_std_t)standard,
                                       (double)value);
}

JNIEXPORT jint JNICALL JNI_METHOD(noiseRate)(JNIEnv *env, jobject object,
                                              jint scene, jdouble value)
{
    (void)env;
    (void)object;
    return (jint)noise_rate((noise_scene_t)scene, (double)value);
}

JNIEXPORT jint JNICALL JNI_METHOD(illuminanceRate)(JNIEnv *env, jobject object,
                                                    jdouble value)
{
    (void)env;
    (void)object;
    return (jint)illuminance_rate((double)value);
}

JNIEXPORT jintArray JNICALL JNI_METHOD(parameterColors)(JNIEnv *env,
                                                         jobject object,
                                                         jint parameter)
{
    env_rgb_t colors[] = {
        env_color_parameter((env_parameter_t)parameter, ENV_COLOR_PRIMARY),
        env_color_parameter((env_parameter_t)parameter, ENV_COLOR_BACKGROUND)
    };
    (void)object;
    return make_colors(env, colors, 2);
}

JNIEXPORT jintArray JNICALL JNI_METHOD(airColors)(JNIEnv *env, jobject object,
                                                   jint parameter,
                                                   jint quality)
{
    env_rgb_t colors[] = {
        env_color_air((env_parameter_t)parameter, (air_quality_t)quality,
                      ENV_COLOR_PRIMARY),
        env_color_air((env_parameter_t)parameter, (air_quality_t)quality,
                      ENV_COLOR_BACKGROUND),
        env_color_air((env_parameter_t)parameter, (air_quality_t)quality,
                      ENV_COLOR_GRAPHIC),
        env_color_air((env_parameter_t)parameter, (air_quality_t)quality,
                      ENV_COLOR_TEXT)
    };
    (void)object;
    return make_colors(env, colors, 4);
}

#define STATE_COLORS_JNI(jni_name, type, function) \
    JNIEXPORT jintArray JNICALL JNI_METHOD(jni_name)( \
        JNIEnv *env, jobject object, jint value) \
    { \
        env_rgb_t colors[] = { \
            function((type)value, ENV_COLOR_PRIMARY), \
            function((type)value, ENV_COLOR_BACKGROUND), \
            function((type)value, ENV_COLOR_GRAPHIC), \
            function((type)value, ENV_COLOR_TEXT) \
        }; \
        (void)object; \
        return make_colors(env, colors, 4); \
    }

STATE_COLORS_JNI(thermalColors, thermal_sensation_t, env_color_thermal)
STATE_COLORS_JNI(humidityColors, thermal_humidity_t, env_color_humidity)
STATE_COLORS_JNI(noiseColors, noise_level_t, env_color_noise)
STATE_COLORS_JNI(illuminanceColors, illuminance_level_t, env_color_illuminance)

#undef STATE_COLORS_JNI
#undef JNI_METHOD
