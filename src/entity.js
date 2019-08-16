/**
 * @typedef Component
 * @property {Entity=} parent
 * @property {Function} update
 */

/**
 * @typedef Entity
 * @property {Component[]} components
 */

/**
 * @template T
 * @param {T} options
 * @return {Component}
 */
export var component_create = options => {
  return {
    parent: undefined,
    update() {},
    ...options,
  };
};

/**
 * @template T
 * @param {T} object
 * @return {Entity}
 */
export var entity_create = object => {
  return {
    ...object,
    components: [],
  };
};

/**
 * @param {Entity} entity
 * @param {Component[]} components
 */
export var entity_add = (entity, ...components) => {
  components.map(component => {
    if (entity_has(entity, component)) {
      return;
    }

    component.parent = entity;
    entity.components.push(component);
  });
};

/**
 * @param {Entity} entity
 * @param {Component} component
 * @return {boolean}
 */
export var entity_has = (entity, component) => {
  return entity.components.includes(component);
};

/**
 * @param {Entity} entity
 * @param {Component[]} components
 */
export var entity_remove = (entity, ...components) => {
  components.map(component => {
    var index = entity.components.indexOf(component);

    if (index >= 0) {
      entity.components
        .splice(index, 1)
        .map(component => (component.parent = undefined));
    }
  });
};

/**
 * @param {Entity} entity
 * @param {Array} args
 */
export var entity_update = (entity, ...args) => {
  entity.components.map(component => component.update(...args));
};

/**
 * @param {Object} object
 * @return {boolean}
 */
export var is_entity = object => {
  return !!object.components;
};
