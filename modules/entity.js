// @flow

export type Entity = {
  components: Component[],
};

interface Component {
  parent?: Entity;
  update(): void;
}

export var entity_create = <T: Object>(object: T): T & Entity => {
  return {
    ...object,
    components: [],
  };
};

export var entity_add = (entity: Entity, ...components: Component[]) => {
  components.map(component => {
    if (entity_has(entity, component)) {
      return;
    }

    component.parent = entity;
    entity.components.push(component);
  });
};

export var entity_has = (entity: Entity, component: Component) => {
  return entity.components.includes(component);
};

export var entity_remove = (entity: Entity, ...components: Component[]) => {
  components.map(component => {
    var index = entity.components.indexOf(component);

    if (index >= 0) {
      entity.components
        .splice(index, 1)
        .map(component => (component.parent = undefined));
    }
  });
};

export var entity_update = (entity: Entity, ...args: *[]) => {
  entity.components.map(component => component.update(...args));
};

export var is_entity = (object: Object): boolean => {
  return !!object.components;
};
