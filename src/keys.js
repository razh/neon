export var keys_create = () => {
  /** @type {Object.<string, boolean>} */
  var keys = {};

  document.addEventListener('keydown', event => (keys[event.code] = true));
  document.addEventListener('keyup', event => (keys[event.code] = false));

  return keys;
};
