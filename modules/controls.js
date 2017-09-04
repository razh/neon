// @flow

import type { Object3D } from './object3d';

type Controls = {
  object: Object3D,
  turnRate: number,
  sensitivity: number,
  enabled: boolean,
  onMouseMove(MouseEvent): void,
};

import {
  quat_create,
  quat_copy,
  quat_set,
  quat_normalize,
  quat_multiply,
} from './quat';

var pitchQuat = quat_create();
var yawQuat = quat_create();

export var controls_create = (object: Object3D): Controls => {
  var controls = {
    object,
    turnRate: Math.PI / 4,
    sensitivity: 0.002,
    enabled: false,

    onMouseMove(event: MouseEvent) {
      if (!controls.enabled) {
        return;
      }

      var { movementX, movementY } = event;

      var pitch = -movementY * controls.sensitivity;
      var yaw = -movementX * controls.sensitivity;

      quat_normalize(quat_set(pitchQuat, pitch, 0, 0, 1));
      quat_normalize(quat_set(yawQuat, 0, yaw, 0, 1));

      // pitch * object * yaw
      quat_multiply(object.quaternion, pitchQuat);
      quat_multiply(yawQuat, object.quaternion);
      quat_copy(object.quaternion, yawQuat);
    },
  };

  document.addEventListener('mousemove', controls.onMouseMove);

  return controls;
};

export var controls_dispose = (controls: Controls) => {
  document.removeEventListener('mousemove', controls.onMouseMove);
};
