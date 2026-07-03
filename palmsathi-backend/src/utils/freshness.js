import dayjs from "dayjs";

/**
 * Models FFA (free fatty acid) buildup as a freshness score from 100 (just cut)
 * down to 0 (badly spoiled). Roughly: stable for the first 12 hours, gradual
 * decay through the 12-36hr safe window, then rapid decay past 36 hours.
 *
 * @param {number} hoursSinceHarvest
 * @returns {number} freshness score 0-100
 */
export function freshnessScore(hoursSinceHarvest) {
  if (hoursSinceHarvest <= 12) return 100;

  if (hoursSinceHarvest <= 36) {
    return Math.max(0, 100 - (hoursSinceHarvest - 12) * 3);
  }

  return Math.max(0, 28 - (hoursSinceHarvest - 36) * 6);
}

/**
 * Convenience wrapper: compute freshness directly from a harvest timestamp.
 */
export function freshnessScoreFromDate(harvestedAt, asOf = new Date()) {
  const hours = dayjs(asOf).diff(dayjs(harvestedAt), "hour", true);
  return freshnessScore(hours);
}

/**
 * Projects what the freshness score WOULD be if a batch arrives at a given
 * future slot time. Used by the matching engine to check whether a candidate
 * slot keeps the batch above the acceptable threshold.
 */
export function projectedFreshnessAtSlot(batch, slotTime) {
  const hours = dayjs(slotTime).diff(dayjs(batch.harvestedAt), "hour", true);
  return freshnessScore(hours);
}

/**
 * Urgency score used to prioritize the matching queue: batches decaying
 * fast AND far from a mill should jump ahead of fresher, closer batches.
 * Weights are tunable via env vars so you can show different behavior live.
 */
export function computeUrgency(batch, travelTimeMinutes, weights) {
  const { decayRateWeight, travelWeight } = weights;
  const currentScore = freshnessScoreFromDate(batch.harvestedAt);
  return (100 - currentScore) * decayRateWeight + travelTimeMinutes * travelWeight;
}
