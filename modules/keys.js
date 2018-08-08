// @flow

export var keys_create = () => {
  var keys = {};

  document.addEventListener(
    'keydown',
    (event: KeyboardEvent) => (keys[event.code] = true),
  );
  document.addEventListener(
    'keyup',
    (event: KeyboardEvent) => (keys[event.code] = false),
  );

  return keys;
};
