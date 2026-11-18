// swift-tools-version: 5.9

import PackageDescription

let package = Package(
    name: "EnvironmentRating",
    platforms: [
        .iOS("26.0"),
        .macOS(.v10_15)
    ],
    products: [
        .library(name: "EnvironmentRating", targets: ["EnvironmentRating"]),
        .library(name: "CEnvironmentRating", targets: ["CEnvironmentRating"])
    ],
    targets: [
        .target(
            name: "CEnvironmentRating",
            path: ".",
            sources: [
                "c/air_quality_rating.c",
                "c/thermal_comfort.c",
                "c/sound_light_rating.c",
                "c/environment_color.c"
            ],
            publicHeadersPath: "apple/include"
        ),
        .target(
            name: "EnvironmentRating",
            dependencies: ["CEnvironmentRating"],
            path: "apple/Sources/EnvironmentRating"
        ),
        .testTarget(
            name: "EnvironmentRatingTests",
            dependencies: ["EnvironmentRating"],
            path: "apple/Tests/EnvironmentRatingTests"
        )
    ],
    cLanguageStandard: .c99
)
