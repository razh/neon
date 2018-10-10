// @flow

import type { Object3D } from './object3d';

type Controls = {
  object: Object3D,
  sensitivity: number,
  enabled: boolean,
  onMouseMove(MouseEvent): void,
};

import { clamp } from './math.js';
import { quat_create, quat_multiply, quat_setFromEuler } from './quat.js';
import { vec3_create } from './vec3.js';

var pitchQuat = quat_create();
var yawQuat = quat_create();

export var controls_create = (object: Object3D): Controls => {
  var pitchEuler = vec3_create();
  var yawEuler = vec3_create();

  var controls = {
    object,
    sensitivity: 0.002,
    enabled: false,
    onMouseMove(event: MouseEvent) {
      if (!controls.enabled) {
        return;
      }

      var { movementX, movementY } = event;

      var pitch = -movementY * controls.sensitivity;
      var yaw = -movementX * controls.sensitivity;

      pitchEuler.x += pitch;
      yawEuler.y += yaw;

      pitchEuler.x = clamp(pitchEuler.x, -Math.PI / 2, Math.PI / 2);

      quat_setFromEuler(pitchQuat, pitchEuler);
      quat_setFromEuler(yawQuat, yawEuler);

      quat_multiply(yawQuat, pitchQuat);
      Object.assign(object.quaternion, yawQuat);
    },
  };

  document.addEventListener('mousemove', controls.onMouseMove);

  return controls;
};

export var controls_dispose = (controls: Controls) => {
  document.removeEventListener('mousemove', controls.onMouseMove);
};
