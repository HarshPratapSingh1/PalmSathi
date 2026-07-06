/**
 * Pure advisory engine - no DB, no API calls.
 * Takes plot age, soil type, and live weather and returns
 * specific fertilizer + irrigation recommendations.
 */

function getGrowthStage(ageInYears) {
    if (ageInYears < 4) return "immature";
    if (ageInYears < 10) return "young_bearing";
    return "mature_bearing";
}

const FERTILIZER_SCHEDULE = {
    immature: {
        nitrogen: "2 kg urea per palm every 3 months",
        phosphorus: "1 kg SSP per palm every 6 months",
        potassium: "0.5 kg MOP per palm every 3 months",
        magnesium: "0.5 kg kieserite per palm every 6 months",
        note: "Focus on root establishment. Avoid over-fertilizing — young palms are salt-sensitive.",
    },
    young_bearing: {
        nitrogen: "3 kg urea per palm every 3 months",
        phosphorus: "1.5 kg SSP per palm every 6 months",
        potassium: "2 kg MOP per palm every 3 months",
        magnesium: "1 kg kieserite per palm every 6 months",
        note: "Balanced NPK critical during first bearing years to build bunch weight.",
    },
    mature_bearing: {
        nitrogen: "2.5 kg urea per palm every 3 months",
        phosphorus: "1 kg SSP per palm every 6 months",
        potassium: "3.5 kg MOP per palm every 3 months",
        magnesium: "1.5 kg kieserite per palm every 6 months",
        note: "Potassium is the yield driver for mature palms. Prioritize MOP application.",
    },
};

function getIrrigationAdvice(stage, weather, soilType) {
    const isRaining = weather.rainMm > 2;
    const isHot = weather.tempC > 35;
    const isDry = weather.humidity < 50;

    if (isRaining) {
        return {
            action: "Skip irrigation today",
            reason: `Current rainfall (${weather.rainMm.toFixed(1)} mm/hr) is sufficient.`,
            nextCheck: "Re-assess in 2 days",
        };
    }

    const baseLitresPerPalm = {
        immature: 25,
        young_bearing: 40,
        mature_bearing: 60,
    }[stage];

    const soilMultiplier = soilType === "sandy" ? 1.3 : soilType === "clay" ? 0.8 : 1.0;
    const heatMultiplier = isHot ? 1.2 : 1.0;
    const litres = Math.round(baseLitresPerPalm * soilMultiplier * heatMultiplier);

    return {
        action: `Irrigate with ${litres} litres per palm`,
        reason: isHot && isDry
            ? `High temperature (${weather.tempC}°C) and low humidity (${weather.humidity}%) — increased water demand.`
            : isDry
                ? `Low humidity (${weather.humidity}%) detected — moderate irrigation needed.`
                : "Normal conditions — maintain standard irrigation schedule.",
        frequency: stage === "immature" ? "Every 2 days" : "Every 3-4 days",
    };
}

export function generateAdvisory(plot, weather) {
    const stage = getGrowthStage(plot.ageInYears);
    const fertilizer = FERTILIZER_SCHEDULE[stage];
    const irrigation = getIrrigationAdvice(stage, weather, plot.soilType);

    const alerts = [];
    if (weather.tempC > 38) alerts.push("🌡 Extreme heat alert — consider shade netting for young palms.");
    if (weather.humidity > 85) alerts.push("💧 High humidity — watch for Ganoderma and bud rot. Inspect palms this week.");
    if (weather.rainMm > 10) alerts.push("🌧 Heavy rainfall — check drainage to prevent waterlogging around palm base.");

    return {
        stage,
        stageLabel: {
            immature: "Immature (0-3 years)",
            young_bearing: "Young Bearing (4-9 years)",
            mature_bearing: "Mature Bearing (10+ years)",
        }[stage],
        weather,
        fertilizer,
        irrigation,
        alerts,
        generatedAt: new Date(),
    };
}