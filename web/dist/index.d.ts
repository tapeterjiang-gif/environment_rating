export declare const AirQuality: {
    readonly unknown: "unknown";
    readonly good: "good";
    readonly fair: "fair";
    readonly moderate: "moderate";
    readonly poor: "poor";
    readonly veryPoor: "very-poor";
    readonly extremelyPoor: "extremely-poor";
};
export type AirQuality = typeof AirQuality[keyof typeof AirQuality];
export declare const ConcentrationLevel: {
    readonly unknown: "unknown";
    readonly low: "low";
    readonly medium: "medium";
    readonly high: "high";
    readonly critical: "critical";
};
export type ConcentrationLevel = typeof ConcentrationLevel[keyof typeof ConcentrationLevel];
export declare const PollenStandard: {
    readonly nab: "nab";
    readonly meteoswiss: "meteoswiss";
};
export type PollenStandard = typeof PollenStandard[keyof typeof PollenStandard];
export declare const PollenType: {
    readonly unknown: "unknown";
    readonly total: "total";
    readonly tree: "tree";
    readonly grass: "grass";
    readonly weed: "weed";
    readonly hazel: "hazel";
    readonly alder: "alder";
    readonly ash: "ash";
    readonly birch: "birch";
    readonly hornbeam: "hornbeam";
    readonly plane: "plane";
    readonly oak: "oak";
    readonly beech: "beech";
    readonly chestnut: "chestnut";
    readonly sorrel: "sorrel";
    readonly plantain: "plantain";
    readonly mugwort: "mugwort";
    readonly ragweed: "ragweed";
};
export type PollenType = typeof PollenType[keyof typeof PollenType];
export declare const PollenRating: {
    readonly unknown: "unknown";
    readonly absent: "absent";
    readonly low: "low";
    readonly moderate: "moderate";
    readonly high: "high";
    readonly veryHigh: "very-high";
};
export type PollenRating = typeof PollenRating[keyof typeof PollenRating];
export declare const UVIndexRating: {
    readonly unknown: "unknown";
    readonly low: "low";
    readonly moderate: "moderate";
    readonly high: "high";
    readonly veryHigh: "very-high";
    readonly extreme: "extreme";
};
export type UVIndexRating = typeof UVIndexRating[keyof typeof UVIndexRating];
/** Native published schemes; keep NEA's PSI name in the UI. */
export declare const OutdoorIndexStandard: {
    readonly hj6332026: "hj-633-2026";
    readonly epaAQI2026: "epa-aqi-2026";
    readonly eea2024: "eea-2024";
    readonly neaPSI: "nea-psi";
};
export type OutdoorIndexStandard = typeof OutdoorIndexStandard[keyof typeof OutdoorIndexStandard];
/** Ordinal in the selected scheme. NEA has only five grades. */
export declare const OutdoorIndexGrade: {
    readonly unknown: "unknown";
    readonly grade1: "grade-1";
    readonly grade2: "grade-2";
    readonly grade3: "grade-3";
    readonly grade4: "grade-4";
    readonly grade5: "grade-5";
    readonly grade6: "grade-6";
};
export type OutdoorIndexGrade = typeof OutdoorIndexGrade[keyof typeof OutdoorIndexGrade];
export interface OutdoorIndexApi {
    /** External integer AQI 0..500, nonnegative integer PSI, or EEA grade 1..6.
     * No concentration conversion or averaging. Invalid input returns unknown.
     * EEA numbers encode native grades only; they are not numeric AQI values. */
    rate(value: number, standard: OutdoorIndexStandard): OutdoorIndexGrade;
}
export declare const PMStandard: {
    readonly eeaAQI2024: "eea-aqi-2024";
    readonly hj6332026: "hj-633-2026";
    readonly epaAQI2026: "epa-aqi-2026";
};
export type PMStandard = typeof PMStandard[keyof typeof PMStandard];
export declare const FormaldehydeStandard: {
    readonly who2010: "who-2010";
    readonly gbt188832022: "gbt-18883-2022";
    readonly oehha2008: "oehha-2008";
};
export type FormaldehydeStandard = typeof FormaldehydeStandard[keyof typeof FormaldehydeStandard];
export declare const ThermalSensation: {
    readonly unknown: "unknown";
    readonly cold: "cold";
    readonly cool: "cool";
    readonly slightlyCool: "slightly-cool";
    readonly neutral: "neutral";
    readonly slightlyWarm: "slightly-warm";
    readonly warm: "warm";
    readonly hot: "hot";
};
export type ThermalSensation = typeof ThermalSensation[keyof typeof ThermalSensation];
export declare const HumidityStandard: {
    readonly epa: "epa";
    readonly uba: "uba";
};
export type HumidityStandard = typeof HumidityStandard[keyof typeof HumidityStandard];
export declare const HumidityRating: {
    readonly unknown: "unknown";
    readonly dry: "dry";
    readonly suitable: "suitable";
    readonly slightlyHumid: "slightly-humid";
    readonly humid: "humid";
};
export type HumidityRating = typeof HumidityRating[keyof typeof HumidityRating];
export declare const NoiseScene: {
    readonly home: "home";
    readonly sleep: "sleep";
};
export type NoiseScene = typeof NoiseScene[keyof typeof NoiseScene];
export declare const NoiseRating: {
    readonly unknown: "unknown";
    readonly quiet: "quiet";
    readonly noticeable: "noticeable";
    readonly loud: "loud";
    readonly veryLoud: "very-loud";
};
export type NoiseRating = typeof NoiseRating[keyof typeof NoiseRating];
export declare const IlluminanceRating: {
    readonly unknown: "unknown";
    readonly lowLight: "low-light";
    readonly ambient: "ambient";
    readonly dailyActivity: "daily-activity";
    readonly reading: "reading";
    readonly focusedActivity: "focused-activity";
    readonly detailWork: "detail-work";
};
export type IlluminanceRating = typeof IlluminanceRating[keyof typeof IlluminanceRating];
export declare const EnvironmentParameter: {
    readonly temperature: "temperature";
    readonly humidity: "humidity";
    readonly co2: "co2";
    readonly pm25: "pm25";
    readonly pm10: "pm10";
    readonly formaldehyde: "formaldehyde";
    readonly tvoc: "tvoc";
    readonly noise: "noise";
    readonly illuminance: "illuminance";
    readonly o3: "o3";
    readonly co: "co";
    readonly so2: "so2";
    readonly no2: "no2";
    readonly pollen: "pollen";
    readonly uvIndex: "uv-index";
};
export type EnvironmentParameter = typeof EnvironmentParameter[keyof typeof EnvironmentParameter];
export interface MaterialIcon {
    readonly name: string;
    readonly svgUrl: string;
}
/** Material Symbols Rounded icon used by Web and other non-Apple UIs. */
export declare function materialIcon(parameter: EnvironmentParameter): MaterialIcon | null;
export type AirColorParameter = typeof EnvironmentParameter.co2 | typeof EnvironmentParameter.pm25 | typeof EnvironmentParameter.pm10 | typeof EnvironmentParameter.formaldehyde | typeof EnvironmentParameter.o3 | typeof EnvironmentParameter.co | typeof EnvironmentParameter.so2 | typeof EnvironmentParameter.no2;
export interface CreateEnvironmentRatingOptions {
    /** Override the location of environment-rating-wasm.wasm, for example on a CDN. */
    wasmUrl?: string | URL;
    /** Supply preloaded Wasm bytes instead of fetching a URL. */
    wasmBinary?: ArrayBuffer | Uint8Array;
}
export interface AirOverallInput {
    pmStandard?: PMStandard;
    formaldehydeStandard?: FormaldehydeStandard;
    co2?: number | null;
    pm25?: number | null;
    pm10?: number | null;
    formaldehyde?: number | null;
}
export interface ThermalInput {
    temperature: number;
    humidity: number;
    radiantTemperature: number;
    airSpeed: number;
    met?: number;
    clo?: number;
}
export interface ThermalResult {
    pmv: number;
    ppd: number;
    sensation: ThermalSensation;
}
export interface AirRatingApi {
    co2(ppm: number): AirQuality;
    pm25(concentration: number, standard?: PMStandard): AirQuality;
    pm10(concentration: number, standard?: PMStandard): AirQuality;
    formaldehyde(concentration: number, standard?: FormaldehydeStandard): AirQuality;
    /** Outdoor O₃, hourly μg/m³. */
    o3Eea(oneHour: number): AirQuality;
    /** Outdoor O₃, HJ real-time hourly μg/m³. */
    o3Hj(oneHour: number): AirQuality;
    /** Outdoor O₃, EPA ppm; one-hour value is optional. */
    o3Epa(eightHour: number, oneHour?: number): AirQuality;
    /** Outdoor CO, HJ real-time hourly mg/m³. */
    coHj(oneHour: number): AirQuality;
    /** Outdoor CO, EPA eight-hour ppm. */
    coEpa(eightHour: number): AirQuality;
    /** Outdoor SO₂, EEA hourly μg/m³. */
    so2Eea(oneHour: number): AirQuality;
    /** Outdoor SO₂, HJ real-time hourly μg/m³; capped at Poor. */
    so2HjHourly(oneHour: number): AirQuality;
    /** Outdoor SO₂, HJ daily 24-hour μg/m³. */
    so2HjDaily(twentyFourHour: number): AirQuality;
    /** Outdoor SO₂, EPA ppb; both averaging windows are required. */
    so2Epa(oneHour: number, twentyFourHour: number): AirQuality;
    /** Outdoor NO2, hourly μg/m³. */
    no2Eea(oneHour: number): AirQuality;
    /** Outdoor NO2, HJ real-time hourly μg/m³. */
    no2HjHourly(oneHour: number): AirQuality;
    /** Outdoor NO2, HJ daily 24-hour μg/m³. */
    no2HjDaily(twentyFourHour: number): AirQuality;
    /** Outdoor NO2, EPA hourly ppb; daily reports use the daily maximum hour. */
    no2Epa(oneHour: number): AirQuality;
    overall(input?: AirOverallInput): AirQuality;
    co2Level(ppm: number): ConcentrationLevel;
    pm25Level(concentration: number, standard?: PMStandard): ConcentrationLevel;
    pm10Level(concentration: number, standard?: PMStandard): ConcentrationLevel;
    formaldehydeLevel(concentration: number, standard?: FormaldehydeStandard): ConcentrationLevel;
    o3EeaLevel(oneHour: number): ConcentrationLevel;
    o3HjLevel(oneHour: number): ConcentrationLevel;
    o3EpaLevel(eightHour: number, oneHour?: number): ConcentrationLevel;
    coHjLevel(oneHour: number): ConcentrationLevel;
    coEpaLevel(eightHour: number): ConcentrationLevel;
}
export interface ThermalComfortApi {
    evaluate(input: ThermalInput): ThermalResult | null;
    rateHumidity(humidity: number, standard?: HumidityStandard): HumidityRating;
}
export interface SoundLightRatingApi {
    noise(decibels: number, scene: NoiseScene): NoiseRating;
    illuminance(lux: number): IlluminanceRating;
}
export interface PollenRatingApi {
    /** Daily mean grains/m³; standard and measured taxon/group must match. */
    rate(concentration: number, type: PollenType, standard: PollenStandard): PollenRating;
}
export interface UVIndexRatingApi {
    /** Global Solar UVI, rounded to the nearest integer for WHO categories. */
    rate(uvi: number): UVIndexRating;
}
export interface ParameterColors {
    readonly primary: string;
    readonly background: string;
}
export interface StateColors {
    readonly primary: string;
    readonly background: string;
    readonly graphic: string;
    readonly text: string;
}
export interface EnvironmentColorsApi {
    parameter(parameter: EnvironmentParameter): ParameterColors | null;
    air(parameter: AirColorParameter, quality: AirQuality): StateColors | null;
    /** Product palette for the selected external index scheme and native ordinal. */
    index(standard: OutdoorIndexStandard, grade: OutdoorIndexGrade): StateColors | null;
    thermal(sensation: ThermalSensation): StateColors | null;
    humidity(rating: HumidityRating): StateColors | null;
    noise(rating: NoiseRating): StateColors | null;
    illuminance(rating: IlluminanceRating): StateColors | null;
}
export interface EnvironmentRating {
    readonly air: AirRatingApi;
    readonly thermal: ThermalComfortApi;
    readonly soundLight: SoundLightRatingApi;
    readonly pollen: PollenRatingApi;
    readonly uvIndex: UVIndexRatingApi;
    readonly outdoorIndex: OutdoorIndexApi;
    readonly colors: EnvironmentColorsApi;
}
/** Initialize the Wasm module once, then reuse the returned stateless API. */
export declare function createEnvironmentRating(options?: CreateEnvironmentRatingOptions): Promise<EnvironmentRating>;
//# sourceMappingURL=index.d.ts.map