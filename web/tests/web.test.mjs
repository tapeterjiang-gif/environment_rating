import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  AirQuality,
  ConcentrationLevel,
  EnvironmentParameter,
  FormaldehydeStandard,
  HumidityRating,
  HumidityStandard,
  IlluminanceRating,
  NoiseRating,
  NoiseScene,
  PMStandard,
  ThermalSensation,
  createEnvironmentRating,
  materialIcon
} from "../dist/index.js";

const rating = await createEnvironmentRating();

test("Material icons expose packaged SVG assets", async () => {
  const temperature = materialIcon(EnvironmentParameter.temperature);
  assert.equal(temperature?.name, "device_thermostat");
  assert.match(await readFile(new URL(temperature.svgUrl), "utf8"), /^<svg/);
  assert.equal(materialIcon(EnvironmentParameter.pm25)?.name, "air");
  assert.equal(materialIcon(EnvironmentParameter.pm10)?.svgUrl,
               materialIcon(EnvironmentParameter.pm25)?.svgUrl);
  assert.equal(materialIcon("invalid-parameter"), null);
});

test("air quality uses the C rules and defaults", () => {
  assert.equal(rating.air.co2(999), AirQuality.good);
  assert.equal(rating.air.co2(1000), AirQuality.moderate);
  assert.equal(rating.air.co2(2000), AirQuality.moderate);
  assert.equal(rating.air.co2(2000.0001), AirQuality.poor);
  assert.equal(rating.air.co2(Number.NaN), AirQuality.unknown);

  assert.equal(rating.air.pm25(5), AirQuality.good);
  assert.equal(rating.air.pm25(5.0001), AirQuality.fair);
  assert.equal(
    rating.air.pm25(9.09, PMStandard.epaAQI2026),
    AirQuality.good
  );
  assert.equal(
    rating.air.formaldehyde(0.1, FormaldehydeStandard.who2010),
    AirQuality.moderate
  );
  assert.equal(rating.air.pm25(0, "invalid-standard"), AirQuality.unknown);

  const grades = [
    AirQuality.good,
    AirQuality.fair,
    AirQuality.moderate,
    AirQuality.poor,
    AirQuality.veryPoor,
    AirQuality.extremelyPoor
  ];
  const levels = [
    ConcentrationLevel.low,
    ConcentrationLevel.low,
    ConcentrationLevel.medium,
    ConcentrationLevel.high,
    ConcentrationLevel.high,
    ConcentrationLevel.critical
  ];
  [0, 10, 20, 60, 100, 150].forEach((value, index) => {
    assert.equal(rating.air.pm25(value), grades[index]);
    assert.equal(rating.air.pm25Level(value), levels[index]);
  });
  assert.equal(rating.air.pm25(40, PMStandard.hj6332026), AirQuality.fair);
  assert.equal(rating.air.pm25(10, PMStandard.epaAQI2026), AirQuality.fair);
  assert.equal(
    rating.air.formaldehyde(0.09, FormaldehydeStandard.gbt188832022),
    AirQuality.poor
  );
  assert.equal(
    rating.air.formaldehyde(0.03, FormaldehydeStandard.oehha2008),
    AirQuality.moderate
  );
});

test("air quality handles missing values and LevelValue", () => {
  assert.equal(rating.air.overall(), AirQuality.unknown);
  assert.equal(
    rating.air.overall({ co2: 900, pm25: 60, formaldehyde: null }),
    AirQuality.poor
  );
  assert.equal(
    rating.air.overall({ co2: 1500, pm25: Number.NaN }),
    AirQuality.moderate
  );
  assert.equal(rating.air.co2Level(1000), ConcentrationLevel.medium);
  assert.equal(rating.air.pm25Level(10), ConcentrationLevel.low);
  assert.equal(rating.air.pm25Level(150), ConcentrationLevel.critical);
});

test("thermal comfort exposes PMV, PPD, sensation, and humidity", () => {
  const result = rating.thermal.evaluate({
    temperature: 25,
    humidity: 50,
    radiantTemperature: 25,
    airSpeed: 0.1,
    met: 1.1,
    clo: 0.5
  });
  assert.notEqual(result, null);
  assert.ok(Math.abs(result.pmv - (-0.13360297247942393)) < 1e-6);
  assert.equal(result.sensation, ThermalSensation.neutral);
  assert.ok(result.ppd >= 5);
  assert.equal(
    rating.thermal.rateHumidity(55, HumidityStandard.uba),
    HumidityRating.suitable
  );
  assert.equal(
    rating.thermal.rateHumidity(55, HumidityStandard.epa),
    HumidityRating.slightlyHumid
  );
  assert.equal(
    rating.thermal.rateHumidity(50, "invalid-standard"),
    HumidityRating.unknown
  );
  assert.equal(
    rating.thermal.evaluate({
      temperature: 100,
      humidity: 50,
      radiantTemperature: 25,
      airSpeed: 0.1
    }),
    null
  );
  assert.equal(
    rating.thermal.evaluate({
      temperature: -40,
      humidity: 50,
      radiantTemperature: -40,
      airSpeed: 0.1
    })?.sensation,
    ThermalSensation.cold
  );
  assert.equal(
    rating.thermal.evaluate({
      temperature: 80,
      humidity: 50,
      radiantTemperature: 80,
      airSpeed: 0.1
    })?.sensation,
    ThermalSensation.hot
  );
});

test("sound and light ratings use the same boundaries as C", () => {
  assert.equal(rating.soundLight.noise(35, NoiseScene.home), NoiseRating.quiet);
  assert.equal(
    rating.soundLight.noise(35.0001, NoiseScene.home),
    NoiseRating.noticeable
  );
  assert.equal(
    rating.soundLight.noise(35, NoiseScene.sleep),
    NoiseRating.noticeable
  );
  assert.equal(rating.soundLight.illuminance(0), IlluminanceRating.lowLight);
  assert.equal(
    rating.soundLight.illuminance(540),
    IlluminanceRating.detailWork
  );
  assert.equal(
    rating.soundLight.illuminance(-1),
    IlluminanceRating.unknown
  );
  assert.equal(
    rating.soundLight.noise(35, "invalid-scene"),
    NoiseRating.unknown
  );

  [
    [35, NoiseRating.quiet],
    [40, NoiseRating.noticeable],
    [50, NoiseRating.loud],
    [60, NoiseRating.veryLoud]
  ].forEach(([value, expected]) => {
    assert.equal(rating.soundLight.noise(value, NoiseScene.home), expected);
  });
  [
    [0, IlluminanceRating.lowLight],
    [54, IlluminanceRating.ambient],
    [108, IlluminanceRating.dailyActivity],
    [216, IlluminanceRating.reading],
    [324, IlluminanceRating.focusedActivity],
    [540, IlluminanceRating.detailWork]
  ].forEach(([value, expected]) => {
    assert.equal(rating.soundLight.illuminance(value), expected);
  });

  const luxPerFootcandle = 10.763910416709722;
  [
    [5, IlluminanceRating.lowLight, IlluminanceRating.ambient],
    [10, IlluminanceRating.ambient, IlluminanceRating.dailyActivity],
    [20, IlluminanceRating.dailyActivity, IlluminanceRating.reading],
    [30, IlluminanceRating.reading, IlluminanceRating.focusedActivity],
    [50, IlluminanceRating.focusedActivity, IlluminanceRating.detailWork]
  ].forEach(([footcandles, below, at]) => {
    const boundary = footcandles * luxPerFootcandle;
    assert.equal(rating.soundLight.illuminance(boundary - 1e-9), below);
    assert.equal(rating.soundLight.illuminance(boundary), at);
  });
});

test("colors expose parameter and rating palettes from C", () => {
  assert.deepEqual(rating.colors.parameter(EnvironmentParameter.temperature), {
    primary: "#F97316",
    background: "#FFEDD5"
  });
  assert.deepEqual(
    rating.colors.air(EnvironmentParameter.pm25, AirQuality.fair),
    {
      primary: "#65A30D",
      background: "#ECFCCB",
      graphic: "#A3E635",
      text: "#365314"
    }
  );
  assert.deepEqual(
    rating.colors.air(EnvironmentParameter.co2, AirQuality.moderate),
    rating.colors.air(EnvironmentParameter.pm25, AirQuality.fair)
  );
  assert.equal(
    rating.colors.air(EnvironmentParameter.co2, AirQuality.fair),
    null
  );
  assert.equal(rating.colors.parameter("invalid-parameter"), null);
  assert.equal(rating.colors.thermal(ThermalSensation.cold)?.primary, "#1D4ED8");
  assert.equal(rating.colors.humidity(HumidityRating.dry)?.text, "#78350F");
  assert.equal(rating.colors.noise(NoiseRating.loud)?.graphic, "#FB923C");
  assert.equal(
    rating.colors.illuminance(IlluminanceRating.reading)?.background,
    "#CCFBF1"
  );
});

test("multiple instances remain independent", async () => {
  const second = await createEnvironmentRating();
  assert.equal(second.air.co2(2500), AirQuality.poor);
  assert.equal(rating.air.co2(500), AirQuality.good);
});
