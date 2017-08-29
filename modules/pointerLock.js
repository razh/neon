// @flow

export var pointerLock_create = (controls: { enabled: boolean }, element: Element) => {
  var hasPointerLock = 'pointerLockElement' in document;

  if (!hasPointerLock) {
    controls.enabled = true;
    return;
  }

  var onPointerLockChange = () => {
    controls.enabled = element === (document: any).pointerLockElement;
  };

  document.addEventListener('pointerlockchange', onPointerLockChange);
  document.addEventListener('click', () => element.requestPointerLock());
};
