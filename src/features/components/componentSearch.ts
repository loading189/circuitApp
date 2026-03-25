import type { ComponentDefinition, SimulationSupportTier } from './componentTypes';

interface ComponentSearchFilters {
  query: string;
  category: string;
  supportTier: 'all' | SimulationSupportTier;
  beginnerOnly: boolean;
}

const tokenize = (value: string): string[] =>
  value
    .toLowerCase()
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

export const searchComponents = (definitions: ComponentDefinition[], filters: ComponentSearchFilters): ComponentDefinition[] => {
  const queryTokens = tokenize(filters.query);

  return definitions.filter((definition) => {
    if (filters.category !== 'all' && definition.category !== filters.category) {
      return false;
    }

    if (filters.supportTier !== 'all' && definition.simulationSupport !== filters.supportTier) {
      return false;
    }

    if (filters.beginnerOnly && definition.learning.level !== 'beginner') {
      return false;
    }

    if (!queryTokens.length) {
      return true;
    }

    const haystack = [
      definition.displayName,
      definition.shortName,
      definition.description,
      definition.category,
      definition.subcategory,
      ...definition.aliases,
      ...definition.searchTags,
      ...definition.learning.commonUses,
      ...definition.tutorVocabulary,
    ]
      .join(' ')
      .toLowerCase();

    return queryTokens.every((token) => haystack.includes(token));
  });
};
