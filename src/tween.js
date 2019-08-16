/**
 * @typedef {import('./easings').Easing} Easing
 */

/**
 * @typedef Tween
 * @property {number} delay
 * @property {number} duration
 * @property {Easing} ease
 */

import { ease_linear } from './easings.js';

/**
 * @param {Object} options
 * @param {number=} options.delay
 * @param {number=} options.duration
 * @param {Easing=} options.ease
 * @return {Tween}
 */
export var tween_create = (options = {}) => {
  var { delay = 0, duration = 0, ease = ease_linear } = options;

  return {
    duration,
    delay,
    ease,
  };
};
