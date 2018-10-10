// @flow

type Tween = {
  delay: number,
  duration: number,
  ease: number => number,
};

import { ease_linear } from './easings.js';

export var tween_create = (options: Object = {}): Tween => {
  var { duration = 0, delay = 0, ease = ease_linear } = options;

  return {
    duration,
    delay,
    ease,
  };
};
