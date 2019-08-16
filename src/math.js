/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
export var clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};
