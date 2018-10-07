interface Document {
  readonly pointerLockElement: Element;
}

interface Element {
  requestPointerLock(): void;
}
