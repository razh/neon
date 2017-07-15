// @flow

export var ease_linear = (t: number) => t;

export var easing_cubic_inout = (t: number) => {
  if ((t *= 2) < 1) {
    return 0.5 * t * t * t;
  }

  return 0.5 * ((t -= 2) * t * t + 2);
};
