cmake_minimum_required(VERSION 3.22.1)
project(environment_rating_android LANGUAGES C)

set(ENVIRONMENT_RATING_ROOT "${CMAKE_CURRENT_LIST_DIR}/../../../../..")

add_library(environment_rating SHARED
    environment_rating_jni.c
    "${ENVIRONMENT_RATING_ROOT}/air_quality_rating.c"
    "${ENVIRONMENT_RATING_ROOT}/thermal_comfort.c"
    "${ENVIRONMENT_RATING_ROOT}/sound_light_rating.c"
    "${ENVIRONMENT_RATING_ROOT}/environment_color.c"
)

target_include_directories(environment_rating PRIVATE
    "${ENVIRONMENT_RATING_ROOT}"
)
target_compile_features(environment_rating PRIVATE c_std_99)
target_compile_options(environment_rating PRIVATE
    -Wall
    -Wextra
    -Werror
    -fno-fast-math
    -fno-finite-math-only
)

find_library(MATH_LIBRARY m REQUIRED)
target_link_libraries(environment_rating PRIVATE "${MATH_LIBRARY}")
