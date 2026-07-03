import dayjs from "dayjs";

/**
 * Returns the typical number of days between harvest rounds for a plot,
 * based on palm age and season. This is a lookup/interpolation, not a
 * live sensor reading - good enough to drive scheduling for a demo,
 * and easy to swap for a real agronomic model later.
 *
 * @param {number} plotAgeYears
 * @param {"monsoon"|"dry"|"normal"} season
 * @returns {number} number of days until the next harvest round
 */
export function averageCycleDays(plotAgeYears, season = "normal") {
  let baseDays;
  if (plotAgeYears < 4) {
    baseDays = 18; // young palm - smaller, slower bunches
  } else if (plotAgeYears < 10) {
    baseDays = 14; // maturing - steady cycle
  } else {
    baseDays = 10; // mature - frequent harvest rounds
  }

  const seasonAdjustment = season === "monsoon" ? 2 : 0;
  return baseDays + seasonAdjustment;
}

/**
 * Predicts the ripeness window for a plot.
 * @param {Date|null} lastHarvestDate - null if plot has never been harvested
 * @param {number} plotAgeYears
 * @param {string} season
 * @returns {{ expectedDate: Date, windowStart: Date, windowEnd: Date }}
 */
export function predictRipenessWindow(lastHarvestDate, plotAgeYears, season = "normal") {
  const anchor = lastHarvestDate ? dayjs(lastHarvestDate) : dayjs(); // if never harvested, start counting from today
  const cycleDays = averageCycleDays(plotAgeYears, season);

  const expectedDate = anchor.add(cycleDays, "day");
  const windowStart = expectedDate.subtract(1, "day");
  const windowEnd = expectedDate.add(2, "day"); // a little more slack on the back end - over-ripening risk

  return {
    expectedDate: expectedDate.toDate(),
    windowStart: windowStart.toDate(),
    windowEnd: windowEnd.toDate(),
    cycleDaysUsed: cycleDays,
  };
}
