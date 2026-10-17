# Environment Rating for Android

Android AAR 使用 NDK/CMake 编译项目根目录的 C99 源码，通过薄 JNI 层提供 Kotlin 和 Java API。评级阈值与颜色值不在 Android 层复制，因此与 ESP32、Linux、iOS 和 Web 保持一致。

## 使用

将 `:environment-rating` 模块加入 Android 工程，或使用构建生成的 AAR：

```sh
cd android
./gradlew :environment-rating:assembleRelease
```

AAR 位于 `environment-rating/build/outputs/aar/`。最低版本为 Android 5.0（API 21），包含 `arm64-v8a`、`armeabi-v7a` 和 `x86_64`。

```kotlin
import com.qingping.environmentrating.*

val quality = AirRating.pm25(18.0)
val level = AirRating.pm25Level(18.0)

val comfort = ThermalComfort.evaluate(
    temperature = 25.0,
    humidity = 50.0,
    radiantTemperature = 25.0,
    airSpeed = 0.1
)

val colors = EnvironmentColors.air(EnvironmentParameter.PM25, quality)
val androidColor = colors?.graphic?.argb
val cssHex = colors?.graphic?.hex
```

`RgbColor.rgb` 为 `0x00RRGGBB`，`argb` 为可传给 Android View 或 Jetpack Compose 的不透明 `0xFFRRGGBB`，`hex` 为大写 `#RRGGBB`。库本身不依赖 View、Compose 或 Material。

空气质量的默认标准、输入单位、无效值规则和颜色限制与根目录 [README](../README.md) 及 [环境指标颜色说明](../COLOR_STANDARD.md) 一致。不支持的颜色组合返回 `null`。

## 构建与测试

构建需要 JDK 17、Android SDK 35、NDK `27.2.12479018` 和 CMake `3.22.1`。Gradle 会通过 Android SDK 使用固定版本的 NDK 和 CMake。

```sh
cd android
./gradlew :environment-rating:testDebugUnitTest
./gradlew :environment-rating:assembleRelease
./gradlew :environment-rating:connectedDebugAndroidTest
```

最后一项需要已启动的 Android 设备或模拟器。原生代码使用 C99 编译，并显式关闭 fast-math 与 finite-math-only。
