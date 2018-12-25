/**
 * @typedef {import('./geom').Geometry} Geometry
 * @typedef {import('./vec3').Vector3} Vector3
 */

/**
 * @typedef DirectGeometry
 * @property {Vector3[]} vertices
 * @property {Vector3[]} colors
 */

/**
 * @param {Geometry} geom
 * @return {DirectGeometry}
 */
export var directGeom_fromGeom = geom => {
  /** @type {Vector3[]} */
  var vertices = [];
  /** @type {Vector3[]} */
  var colors = [];

  geom.faces.map(face => {
    vertices.push(
      geom.vertices[face.a],
      geom.vertices[face.b],
      geom.vertices[face.c],
    );

    var { vertexColors } = face;
    if (vertexColors.length === 3) {
      colors.push(...vertexColors);
    } else {
      var { color } = face;
      colors.push(color, color, color);
    }
  });

  return {
    vertices,
    colors,
  };
};
