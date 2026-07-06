/**
 * Yield estimator for oil palm FFB output and payout calculation.
 * Based on NMEO-OP price-linked formula.
 */

/**
 * Base FFB yield per palm per harvest round by age bracket (in kg).
 * Oil palm yield increases with age, peaks around 9-13 years,
 * then slowly stabilizes.
 */
function baseYieldPerPalm(ageInYears) {
    if (ageInYears < 4) return 8;   // immature, small bunches
    if (ageInYears < 7) return 18;  // early bearing
    if (ageInYears < 10) return 28; // peak early
    if (ageInYears < 15) return 35; // peak mature
    return 30;                      // older palms, slight decline
}

/**
 * Season multiplier — monsoon brings better yield due to moisture,
 * dry season slightly reduces it.
 */
function seasonMultiplier(season) {
    if (season === "monsoon") return 1.1;
    if (season === "dry") return 0.9;
    return 1.0;
}

/**
 * Main estimator function.
 * @param {Object} plot - { palmCount, ageInYears }
 * @param {Object} mill - { todayOfferedPricePerKg, govtMinPricePerKg }
 * @param {string} season
 */
export function estimateYieldAndPayout(plot, mill, season = "normal") {
    const yieldPerPalm = baseYieldPerPalm(plot.ageInYears) * seasonMultiplier(season);
    const totalFFBkg = Math.round(yieldPerPalm * plot.palmCount);

    const millPayout = Math.round(totalFFBkg * mill.todayOfferedPricePerKg);
    const govtGuarantee = Math.round(totalFFBkg * mill.govtMinPricePerKg);
    const difference = millPayout - govtGuarantee;

    // VGF (Viability Gap Funding) — govt tops up if mill pays less than minimum
    const vgfTopUp = difference < 0 ? Math.abs(difference) : 0;
    const totalExpectedPayout = millPayout + vgfTopUp;

    return {
        season,
        palmCount: plot.palmCount,
        ageInYears: plot.ageInYears,
        yieldPerPalmKg: Math.round(yieldPerPalm * 10) / 10,
        totalFFBkg,
        millPricePerKg: mill.todayOfferedPricePerKg,
        govtMinPricePerKg: mill.govtMinPricePerKg,
        millPayout,
        govtGuarantee,
        vgfTopUp,
        totalExpectedPayout,
        isMillAboveMin: mill.todayOfferedPricePerKg >= mill.govtMinPricePerKg,
    };
}