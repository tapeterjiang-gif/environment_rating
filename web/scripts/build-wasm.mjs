import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const webDirectory = resolve(scriptDirectory, "..");
const projectDirectory = resolve(webDirectory, "..");
const outputDirectory = join(webDirectory, "dist");
const temporaryDirectory = join(webDirectory, ".wasm-build");
const outputFile = join(temporaryDirectory, "environment-rating-wasm.mjs");
const iconSourceDirectory = join(projectDirectory, "assets", "icons", "material");
const iconOutputDirectory = join(outputDirectory, "icons");
const compiler = process.env.EMCC || "emcc";
const iconFiles = [
  "device_thermostat.svg",
  "humidity_percentage.svg",
  "co2.svg",
  "blur_on.svg",
  "science.svg",
  "speed.svg",
  "graphic_eq.svg",
  "light_mode.svg",
  "LICENSE"
];

const exportedFunctions = [
  "_air_level_co2",
  "_air_level_pm25",
  "_air_level_pm10",
  "_air_level_hcho",
  "_air_rate_co2",
  "_air_rate_pm25",
  "_air_rate_pm10",
  "_air_rate_hcho",
  "_air_rate_all",
  "_thermal_rate_humidity",
  "_thermal_pmv",
  "_thermal_ppd",
  "_thermal_rate",
  "_noise_rate",
  "_illuminance_rate",
  "_env_color_parameter",
  "_env_color_air",
  "_env_color_thermal",
  "_env_color_humidity",
  "_env_color_noise",
  "_env_color_illuminance"
];

mkdirSync(outputDirectory, { recursive: true });
rmSync(iconOutputDirectory, { recursive: true, force: true });
mkdirSync(iconOutputDirectory, { recursive: true });
for (const file of iconFiles) {
  copyFileSync(join(iconSourceDirectory, file), join(iconOutputDirectory, file));
}
rmSync(temporaryDirectory, { recursive: true, force: true });
mkdirSync(temporaryDirectory, { recursive: true });

const args = [
  join(projectDirectory, "air_quality_rating.c"),
  join(projectDirectory, "thermal_comfort.c"),
  join(projectDirectory, "sound_light_rating.c"),
  join(projectDirectory, "environment_color.c"),
  "-O3",
  "-flto",
  "-std=c99",
  "-sSTRICT=1",
  "-sWASM=1",
  "-sMODULARIZE=1",
  "-sEXPORT_ES6=1",
  "-sENVIRONMENT=web,worker,node",
  "-sFILESYSTEM=0",
  "-sALLOW_MEMORY_GROWTH=0",
  "-sASSERTIONS=0",
  `-sEXPORTED_FUNCTIONS=${JSON.stringify(exportedFunctions)}`,
  "-sEXPORTED_RUNTIME_METHODS=[]",
  "-sINCOMING_MODULE_JS_API=['locateFile','wasmBinary']",
  "-o",
  outputFile
];

const result = spawnSync(compiler, args, {
  cwd: projectDirectory,
  stdio: "inherit"
});

if (result.error) {
  rmSync(temporaryDirectory, { recursive: true, force: true });
  console.error(`Unable to run ${compiler}: ${result.error.message}`);
  console.error("Install Emscripten or set EMCC to the emcc executable.");
  process.exit(1);
}

if (result.status !== 0) {
  rmSync(temporaryDirectory, { recursive: true, force: true });
  process.exit(result.status ?? 1);
}

copyFileSync(outputFile, join(outputDirectory, "environment-rating-wasm.mjs"));
copyFileSync(
  join(temporaryDirectory, "environment-rating-wasm.wasm"),
  join(outputDirectory, "environment-rating-wasm.wasm")
);
rmSync(temporaryDirectory, { recursive: true, force: true });
