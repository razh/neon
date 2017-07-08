// @flow

import type { Geometry } from './geom';
import type { Material } from './material';
import type { Mesh } from './mesh';

type Entity<T: Object> = T & {
  components: Component[],
};

interface Component {
  parent?: Entity<*>,
  update(): void,
}

import { mesh_create } from './mesh';

export function entity_create(): Entity<Object> {
  return {
    components: [],
  };
}

export function mesh_entity_create(geometry: Geometry, material: Material): Entity<Mesh> {
  return Object.assign(
    {},
    mesh_create(geometry, material),
    {
      components: [],
    }
  );
}

export function entity_add(entity: Entity<*>, ...components: Component[]) {
  components.map(component => {
    if (entity_has(entity, component)) {
      return;
    }

    component.parent = entity;
    entity.components.push(component);
  });
}

export function entity_has(entity: Entity<*>, component: Component) {
  return entity.components.includes(component);
}

export function entity_remove(entity: Entity<*>, ...components: Component[]) {
  components.map(component => {
    var index = entity.components.indexOf(component);

    if (index >= 0) {
      entity.components
        .splice(index, 1)
        .map(component => (component.parent = undefined));
    }
  });
}

export function entity_update(entity: Entity<*>, ...args: *[]) {
  entity.components.map(component => component.update(...args));
}

export function is_entity(object: Object): boolean {
  return !!object.components;
}
