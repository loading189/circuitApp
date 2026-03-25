import {
  COMPONENT_DEFINITIONS,
  COMPONENT_CATEGORIES,
  type ComponentCategory,
  type ComponentDefinition,
  type ComponentType,
  type SimulationSupportTier,
} from './componentTypes';

const definitionMap: Record<ComponentType, ComponentDefinition> = COMPONENT_DEFINITIONS.reduce(
  (accumulator, definition) => ({ ...accumulator, [definition.type]: definition }),
  {} as Record<ComponentType, ComponentDefinition>,
);

export const componentRegistry = {
  all: COMPONENT_DEFINITIONS,
  categories: COMPONENT_CATEGORIES,
  getByType: (type: ComponentType): ComponentDefinition => definitionMap[type],
  byCategory: (category: ComponentCategory): ComponentDefinition[] => COMPONENT_DEFINITIONS.filter((definition) => definition.category === category),
  bySupport: (support: SimulationSupportTier): ComponentDefinition[] =>
    COMPONENT_DEFINITIONS.filter((definition) => definition.simulationSupport === support),
};
