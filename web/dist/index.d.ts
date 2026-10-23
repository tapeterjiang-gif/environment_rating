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
};
export type EnvironmentParameter = typeof EnvironmentParameter[keyof typeof EnvironmentParameter];
export interface MaterialIcon {
    readonly name: string;
    readonly svgUrl: string;
}
/** Material Symbols Rounded icon used by Web and other non-Apple UIs. */
export declare function materialIcon(parameter: EnvironmentParameter): MaterialIcon | null;
export type AirColorParameter = typeof EnvironmentParameter.co2 | typeof EnvironmentParameter.pm25 | typeof EnvironmentParameter.pm10 | typeof EnvironmentParameter.formaldehyde;
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
    overall(input?: AirOverallInput): AirQuality;
    co2Level(ppm: number): ConcentrationLevel;
    pm25Level(concentration: number, standard?: PMStandard): ConcentrationLevel;
    pm10Level(concentration: number, standard?: PMStandard): ConcentrationLevel;
    formaldehydeLevel(concentration: number, standard?: FormaldehydeStandard): ConcentrationLevel;
}
export interface ThermalComfortApi {
    evaluate(input: ThermalInput): ThermalResult | null;
    rateHumidity(humidity: number, standard?: HumidityStandard): HumidityRating;
}
export interface SoundLightRatingApi {
    noise(decibels: number, scene: NoiseScene): NoiseRating;
    illuminance(lux: number): IlluminanceRating;
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
    thermal(sensation: ThermalSensation): StateColors | null;
    humidity(rating: HumidityRating): StateColors | null;
    noise(rating: NoiseRating): StateColors | null;
    illuminance(rating: IlluminanceRating): StateColors | null;
}
export interface EnvironmentRating {
    readonly air: AirRatingApi;
    readonly thermal: ThermalComfortApi;
    readonly soundLight: SoundLightRatingApi;
    readonly colors: EnvironmentColorsApi;
}
/** Initialize the Wasm module once, then reuse the returned stateless API. */
export declare function createEnvironmentRating(options?: CreateEnvironmentRatingOptions): Promise<EnvironmentRating>;
//# sourceMappingURL=index.d.ts.map