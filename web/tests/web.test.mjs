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
  PollenStandard,
  PollenType,
  PollenRating,
  UVIndexRating,
  ThermalSensation,
  createEnvironmentRating,
  materialIcon
} from "../dist/index.js";

const rating = await createEnvironmentRating();

test("UV index follows WHO five exposure categories", () => {
  assert.equal(rating.uvIndex.rate(0), UVIndexRating.low);
  assert.equal(rating.uvIndex.rate(2.49), UVIndexRating.low);
  assert.equal(rating.uvIndex.rate(2.5), UVIndexRating.moderate);
  assert.equal(rating.uvIndex.rate(5.5), UVIndexRating.high);
  assert.equal(rating.uvIndex.rate(7.5), UVIndexRating.veryHigh);
  assert.equal(rating.uvIndex.rate(10.5), UVIndexRating.extreme);
  assert.equal(rating.uvIndex.rate(-1), UVIndexRating.unknown);
  assert.equal(rating.uvIndex.rate(Number.NaN), UVIndexRating.unknown);
});

test("pollen uses daily taxon-specific C thresholds", () => {
  assert.equal(rating.pollen.rate(0, PollenType.total, PollenStandard.nab), PollenRating.absent);
  assert.equal(rating.pollen.rate(20, PollenType.total, PollenStandard.nab), PollenRating.unknown);
  assert.equal(rating.pollen.rate(20, PollenType.grass, PollenStandard.nab), PollenRating.high);
  assert.equal(rating.pollen.rate(20, PollenType.grass, PollenStandard.meteoswiss), PollenRating.moderate);
  assert.equal(rating.pollen.rate(70, PollenType.birch, PollenStandard.meteoswiss), PollenRating.high);
  assert.equal(rating.pollen.rate(70, PollenType.birch, PollenStandard.nab), PollenRating.unknown);
  assert.equal(rating.pollen.rate(0, PollenType.tree, PollenStandard.meteoswiss), PollenRating.unknown);
  assert.equal(rating.pollen.rate(-1, PollenType.grass, PollenStandard.nab), PollenRating.unknown);
});

test("Material icons expose packaged SVG assets", async () => {
  const temperature = materialIcon(EnvironmentParameter.temperature);
  assert.equal(temperature?.name, "device_thermostat");
  assert.match(await readFile(new URL(temperature.svgUrl), "utf8"), /^<svg/);
  const co2 = materialIcon(EnvironmentParameter.co2);
  assert.equal(co2?.name, "air");
  assert.match(await readFile(new URL(co2.svgUrl), "utf8"), /^<svg/);
  assert.equal(materialIcon(EnvironmentParameter.pm25)?.name, "blur_on");
  assert.equal(materialIcon(EnvironmentParameter.pm10)?.svgUrl,
               materialIcon(EnvironmentParameter.pm25)?.svgUrl);
  for (const [parameter, name] of [
    [EnvironmentParameter.o3, "dehaze"],
    [EnvironmentParameter.co, "detector_smoke"],
    [EnvironmentParameter.so2, "foggy"],
    [EnvironmentParameter.pollen, "local_florist"],
    [EnvironmentParameter.uvIndex, "flare"]
  ]) {
    const icon = materialIcon(parameter);
    assert.equal(icon?.name, name);
    assert.match(await readFile(new URL(icon.svgUrl), "utf8"), /^<svg/);
  }
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

test("outdoor ozone follows each source's time basis", () => {
  assert.equal(rating.air.o3Eea(60), AirQuality.good);
  assert.equal(rating.air.o3Eea(61), AirQuality.fair);
  assert.equal(rating.air.o3Hj(160.5), AirQuality.good);
  assert.equal(rating.air.o3Hj(160.51), AirQuality.fair);
  assert.equal(rating.air.o3Epa(0.055), AirQuality.fair);
  assert.equal(rating.air.o3Epa(0.05, 0.405), AirQuality.extremelyPoor);
  assert.equal(rating.air.o3Epa(0.201), AirQuality.unknown);
  assert.equal(rating.air.o3EpaLevel(0.09), ConcentrationLevel.high);
});

test("outdoor carbon monoxide uses hourly HJ and eight-hour EPA bands", () => {
  assert.equal(rating.air.coHj(5.05), AirQuality.good);
  assert.equal(rating.air.coHj(5.051), AirQuality.fair);
  assert.equal(rating.air.coHj(90.051), AirQuality.extremelyPoor);
  assert.equal(rating.air.coEpa(4.499), AirQuality.good);
  assert.equal(rating.air.coEpa(4.5), AirQuality.fair);
  assert.equal(rating.air.coEpa(30.5), AirQuality.extremelyPoor);
  assert.equal(rating.air.coHjLevel(35.1), ConcentrationLevel.high);
  assert.equal(rating.air.coEpaLevel(30.5), ConcentrationLevel.critical);
  assert.equal(rating.air.coHj(Number.NaN), AirQuality.unknown);
  assert.equal(rating.air.coEpa(-1), AirQuality.unknown);
});

test("outdoor sulfur dioxide preserves each standard's time basis", () => {
  assert.equal(rating.air.so2Eea(20), AirQuality.good);
  assert.equal(rating.air.so2Eea(20.1), AirQuality.fair);
  assert.equal(rating.air.so2Eea(276), AirQuality.extremelyPoor);
  assert.equal(rating.air.so2HjHourly(150.5), AirQuality.good);
  assert.equal(rating.air.so2HjHourly(150.51), AirQuality.fair);
  assert.equal(rating.air.so2HjHourly(10000), AirQuality.poor);
  assert.equal(rating.air.so2HjDaily(475.5), AirQuality.poor);
  assert.equal(rating.air.so2HjDaily(1600.51), AirQuality.extremelyPoor);
  assert.equal(rating.air.so2Epa(305, 304.9), AirQuality.poor);
  assert.equal(rating.air.so2Epa(35, 305), AirQuality.veryPoor);
  assert.equal(rating.air.so2Epa(35, 605), AirQuality.extremelyPoor);
  assert.equal(rating.air.so2Epa(35, Number.NaN), AirQuality.unknown);
  assert.equal(rating.air.so2Epa(35), AirQuality.unknown);
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
  assert.deepEqual(rating.colors.parameter(EnvironmentParameter.o3), { primary: "#3A6EAA", background: "#E8F1FB" });
  assert.deepEqual(rating.colors.parameter(EnvironmentParameter.co), { primary: "#56616D", background: "#EDF0F3" });
  assert.deepEqual(rating.colors.parameter(EnvironmentParameter.so2), { primary: "#9A6B0A", background: "#FAF1D8" });
  assert.deepEqual(rating.colors.parameter(EnvironmentParameter.pollen), { primary: "#3E8B5B", background: "#E5F4E7" });
  assert.deepEqual(rating.colors.parameter(EnvironmentParameter.uvIndex), { primary: "#6853BE", background: "#EEEAFB" });
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
    rating.colors.air(EnvironmentParameter.pm25, AirQuality.moderate)
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

// Explicit malformed optional values must not be interpreted as missing samples.
test("ozone optional hourly input distinguishes missing from invalid runtime values", () => {
  for (const invalid of [null, "0.405", {}, false, -1, Infinity, -Infinity]) {
    assert.equal(rating.air.o3Epa(0.05, invalid), AirQuality.unknown);
    assert.equal(rating.air.o3EpaLevel(0.05, invalid), ConcentrationLevel.unknown);
  }
  for (const missing of [undefined, NaN]) {
    assert.equal(rating.air.o3Epa(0.05, missing), AirQuality.good);
  }
});

test("outdoor APIs reject invalid required measurements", () => {
  const methods = ["o3Eea", "o3Hj", "coHj", "coEpa", "so2Eea", "so2HjHourly", "so2HjDaily"];
  for (const invalid of [null, undefined, "10", {}, false, -1, NaN, Infinity, -Infinity]) {
    for (const method of methods) assert.equal(rating.air[method](invalid), AirQuality.unknown);
    assert.equal(rating.air.o3Epa(invalid), AirQuality.unknown);
    assert.equal(rating.air.so2Epa(invalid, 0), AirQuality.unknown);
    assert.equal(rating.air.so2Epa(0, invalid), AirQuality.unknown);
    assert.equal(rating.uvIndex.rate(invalid), UVIndexRating.unknown);
    assert.equal(rating.pollen.rate(invalid, PollenType.grass, PollenStandard.nab), PollenRating.unknown);
  }
  for (const invalid of [undefined, null, "invalid", -1, 99]) {
    assert.equal(rating.pollen.rate(0, invalid, PollenStandard.nab), PollenRating.unknown);
    assert.equal(rating.pollen.rate(0, PollenType.grass, invalid), PollenRating.unknown);
  }
});

test("outdoor gas boundary transitions preserve all six grades", () => {
  const grades = [AirQuality.good, AirQuality.fair, AirQuality.moderate, AirQuality.poor, AirQuality.veryPoor, AirQuality.extremelyPoor];
  for (const [method, boundaries, upperInclusive] of [
    ["o3Eea", [60,100,120,160,180], true],
    ["o3Hj", [160.5,200.5,300.5,400.5,800.5], true],
    ["coHj", [5.05,10.05,35.05,60.05,90.05], true],
    ["coEpa", [4.5,9.5,12.5,15.5,30.5], false],
    ["so2Eea", [20,40,125,190,275], true]
  ]) {
    boundaries.forEach((value, i) => {
      assert.equal(rating.air[method](value - 1e-8), grades[i]);
      assert.equal(rating.air[method](value), grades[upperInclusive ? i : i+1]);
      assert.equal(rating.air[method](value + 1e-8), grades[i+1]);
    });
  }
});

test("external indices support only HJ and EPA AQI", async () => {
  const {OutdoorIndexStandard:S,OutdoorIndexGrade:G}=await import('../dist/index.js');
  for (const standard of Object.values(S)) {
    for (const [value,grade] of [[0,G.grade1],[50,G.grade1],[51,G.grade2],[100,G.grade2],[101,G.grade3],[150,G.grade3],[151,G.grade4],[200,G.grade4],[201,G.grade5],[300,G.grade5],[301,G.grade6],[500,G.grade6],[501,G.unknown]]) {
      assert.equal(rating.outdoorIndex.rate(value,standard),grade);
    }
    for (const value of [undefined,null,'50',{},false,-1,NaN,Infinity,-Infinity,50.5]) {
      assert.equal(rating.outdoorIndex.rate(value,standard),G.unknown);
    }
  }
  for (const removed of ['eea-2024','nea-psi']) {
    assert.equal(rating.outdoorIndex.rate(50,removed),G.unknown);
    assert.equal(rating.colors.index(removed,G.grade1),null);
  }
  assert.deepEqual(Object.keys(S),['hj6332026','epaAQI2026']);
  assert.equal(rating.outdoorIndex.rate(50,'invalid'),G.unknown);
});

test("NO2 uses native hourly/daily units and invalid-input rules",()=>{
  const grades=[AirQuality.good,AirQuality.fair,AirQuality.moderate,AirQuality.poor,AirQuality.veryPoor,AirQuality.extremelyPoor];
  for (const [method,bounds] of [['no2Eea',[10,25,60,100,150]],['no2HjHourly',[100.5,200.5,700.5,1200.5,2340.5]],['no2HjDaily',[40.5,80.5,180.5,280.5,565.5]],['no2Epa',[54,101,361,650,1250]]]) {
    bounds.forEach((b,i)=>{
      assert.equal(rating.air[method](b-1e-8),grades[i]);
      assert.equal(rating.air[method](b+1e-8),grades[i+1]);
    });
    assert.equal(rating.air[method](0),AirQuality.good);
    for(const invalid of [null,undefined,'10',false,{},NaN,Infinity,-Infinity,-1]) assert.equal(rating.air[method](invalid),AirQuality.unknown);
  }
  assert.equal(rating.air.no2HjDaily(565.5),AirQuality.extremelyPoor);
  assert.equal(rating.air.no2HjHourly(100.5),AirQuality.good);
  assert.equal(rating.air.no2Epa(54),AirQuality.fair);
});

test("NO2 identity, icons and all rating color roles are available", async()=>{
  assert.deepEqual(rating.colors.parameter(EnvironmentParameter.no2),{primary:'#B4533C',background:'#F8EAE5'});
  const icon=materialIcon(EnvironmentParameter.no2);
  assert.equal(icon.name,'directions_car');
  assert.match(await readFile(new URL(icon.svgUrl),'utf8'),/^<svg/);
  for(const parameter of [EnvironmentParameter.no2,EnvironmentParameter.o3,EnvironmentParameter.co,EnvironmentParameter.so2]) {
    for(const quality of Object.values(AirQuality)) assert.deepEqual(rating.colors.air(parameter,quality),rating.colors.air(EnvironmentParameter.pm25,quality));
  }
  assert.equal(rating.colors.air(EnvironmentParameter.no2,'invalid'),null);
});

test("external index colors follow scheme meanings rather than ordinal equality",async()=>{
  const {OutdoorIndexStandard:S,OutdoorIndexGrade:G}=await import('../dist/index.js');
  const grades=[G.grade1,G.grade2,G.grade3,G.grade4,G.grade5,G.grade6];
  const native=[AirQuality.good,AirQuality.moderate,AirQuality.poor,AirQuality.veryPoor,AirQuality.extremelyPoor];
  grades.forEach((g,i)=>{
    assert.deepEqual(rating.colors.index(S.hj6332026,g),rating.colors.index(S.epaAQI2026,g));
    if(i<5)assert.deepEqual(rating.colors.index(S.epaAQI2026,g),rating.colors.air(EnvironmentParameter.pm25,native[i]));
  });
  const maroon={primary:'#9F1239',background:'#FFE4E6',graphic:'#FB7185',text:'#881337'};
  assert.deepEqual(rating.colors.index(S.epaAQI2026,G.grade6),maroon);
  for(const s of Object.values(S)) {
    assert.deepEqual(rating.colors.index(s,G.unknown),rating.colors.air(EnvironmentParameter.pm25,AirQuality.unknown));
    assert.equal(rating.colors.index(s,'invalid'),null);
  }
  assert.equal(rating.colors.index('invalid',G.unknown),null);
});
