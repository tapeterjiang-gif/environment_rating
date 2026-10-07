import XCTest
@testable import EnvironmentRating

final class EnvironmentRatingTests: XCTestCase {
    func testAirQualityWrappers() {
        XCTAssertEqual(AirRating.co2(999), .good)
        XCTAssertEqual(AirRating.co2(1_000), .moderate)
        XCTAssertEqual(AirRating.co2Level(2_001), .high)

        XCTAssertEqual(AirRating.pm25(5), .good)
        XCTAssertEqual(AirRating.pm25(5.1), .fair)
        XCTAssertEqual(AirRating.pm25Level(5.1), .low)
        XCTAssertEqual(AirRating.pm10(55, standard: .epaAQI2026), .fair)
        XCTAssertEqual(AirRating.pm10Level(55, standard: .epaAQI2026), .low)
        XCTAssertEqual(AirRating.formaldehyde(0.1), .moderate)
        XCTAssertEqual(AirRating.formaldehydeLevel(0.04), .low)
        XCTAssertEqual(AirRating.formaldehydeLevel(0.101), .high)

        XCTAssertEqual(
            AirRating.overall(co2: 900,
                              pm25: 16,
                              pm10: 20),
            .moderate
        )
        XCTAssertEqual(AirRating.overall(), .unknown)
        XCTAssertEqual(AirRating.co2(.nan), .unknown)
    }

    func testThermalComfortWrappers() {
        let result = ThermalComfort.evaluate(
            temperature: 25,
            humidity: 50,
            radiantTemperature: 25,
            airSpeed: 0.1
        )
        XCTAssertNotNil(result)
        XCTAssertTrue(result!.pmv.isFinite)
        XCTAssertGreaterThanOrEqual(result!.ppd, 5)

        let cold = ThermalComfort.evaluate(
            temperature: -40,
            humidity: 100,
            radiantTemperature: -40,
            airSpeed: 1,
            met: 0.8,
            clo: 0
        )
        XCTAssertEqual(cold?.pmv, -3)
        XCTAssertEqual(cold?.sensation, .cold)

        let hot = ThermalComfort.evaluate(
            temperature: 80,
            humidity: 100,
            radiantTemperature: 80,
            airSpeed: 0,
            met: 4,
            clo: 2
        )
        XCTAssertEqual(hot?.pmv, 3)
        XCTAssertEqual(hot?.sensation, .hot)

        XCTAssertNil(ThermalComfort.evaluate(
            temperature: .nan,
            humidity: 50,
            radiantTemperature: 25,
            airSpeed: 0.1
        ))
        XCTAssertEqual(ThermalComfort.rateHumidity(40), .suitable)
        XCTAssertEqual(ThermalComfort.rateHumidity(60.1), .humid)
        XCTAssertEqual(ThermalComfort.rateHumidity(55, standard: .epa), .slightlyHumid)
    }

    func testSoundAndLightWrappers() {
        XCTAssertEqual(SoundLightRating.noise(35, scene: .home), .quiet)
        XCTAssertEqual(SoundLightRating.noise(35.1, scene: .home), .noticeable)
        XCTAssertEqual(SoundLightRating.noise(50, scene: .sleep), .loud)
        XCTAssertEqual(SoundLightRating.illuminance(0), .dim)
        XCTAssertEqual(SoundLightRating.illuminance(100), .dailyActivity)
        XCTAssertEqual(SoundLightRating.illuminance(300), .readingAndTasks)
        XCTAssertEqual(SoundLightRating.illuminance(.infinity), .unknown)
    }
}
