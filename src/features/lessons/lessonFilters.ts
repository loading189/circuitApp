import type { ComponentDefinition } from '@/features/components/componentTypes';

export type LessonLibraryMode = 'full' | 'lesson' | 'required';

interface LessonFilterInput {
  libraryMode: LessonLibraryMode;
  requiredComponents: string[];
  optionalComponents: string[];
}

const toSet = (values: string[]) => new Set(values);

export const filterComponentsForLesson = (components: ComponentDefinition[], input: LessonFilterInput): ComponentDefinition[] => {
  if (input.libraryMode === 'full') {
    return components;
  }

  const required = toSet(input.requiredComponents);
  const optional = toSet(input.optionalComponents);

  return components.filter((component) => {
    if (input.libraryMode === 'required') {
      return required.has(component.type);
    }
    return required.has(component.type) || optional.has(component.type);
  });
};

export const getLessonComponentStatus = (
  componentType: string,
  requiredComponents: string[],
  optionalComponents: string[],
): 'required' | 'optional' | 'not-in-lesson' => {
  if (requiredComponents.includes(componentType)) {
    return 'required';
  }
  if (optionalComponents.includes(componentType)) {
    return 'optional';
  }
  return 'not-in-lesson';
};
