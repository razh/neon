// @flow

export type Color = {
  r: number,
  g: number,
  b: number,
};

export function color_create(r: ?number, g: ?number, b: ?number) {
  return {
    r: r || 0,
    g: g || 0,
    b: b || 0,
  };
}
