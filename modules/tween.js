// @flow

type Tween = {
  delay: number,
  duration: number,
  ease: Function,
};

export const ease_linear = (t: number) => t;

export function tween_create(options: Object = {}): Tween {
  var {
    duration = 0,
    delay = 0,
    ease = ease_linear,
  } = options;

  return {
    duration,
    delay,
    ease,
  };
}
