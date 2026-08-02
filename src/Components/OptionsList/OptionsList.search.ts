import { isOptionItem, isOptionsArray, isOptionsCollection, isOptionsGroup } from './optionChecker';

import type {
  OptionItem,
  Options,
  OptionsCollection,
  OptionsGroup,
  SearchOptions,
  SearchTermMatchOption,
} from './OptionsList.types';

const matches = (
  property: string,
  searchTerm: string,
  searchTermMatchOption: SearchTermMatchOption | undefined,
): boolean => {
  const term = searchTerm.toLowerCase();

  switch (searchTermMatchOption) {
    case 'exact-match':
      return property.toLowerCase() === term;
    case 'partial-match':
      return property.toLowerCase().includes(term);
    default:
      return false;
  }
};

const searchOptionItem = (
  optionItem: OptionItem,
  searchTerm: string,
  searchOptions: SearchOptions,
): OptionItem | undefined => {
  if (matches(optionItem.id, searchTerm, searchOptions.id)) {
    return optionItem;
  }

  if (matches(optionItem.title, searchTerm, searchOptions.title)) {
    return optionItem;
  }

  return undefined;
};

const searchOptionsGroup = (
  optionsGroup: OptionsGroup,
  searchTerm: string,
  searchOptions: SearchOptions,
): Options | undefined => {
  const groupTitleMatches = matches(optionsGroup.title, searchTerm, searchOptions.title);

  if (groupTitleMatches) {
    return optionsGroup;
  }

  const childOptions = search(optionsGroup.childOptions, searchTerm, searchOptions);

  if (!childOptions) {
    return undefined;
  }

  if (isOptionItem(childOptions) && searchOptions.flattenWhenSingleChild) {
    return childOptions;
  }

  return {
    ...optionsGroup,
    childOptions,
  };
};

const searchOptionsArray = (
  options: Options[],
  searchTerm: string,
  searchOptions: SearchOptions,
): Options | undefined => {
  const matchingOptions: Options[] = [];

  options.forEach((option) => {
    const matchingOption = search(option, searchTerm, searchOptions);

    if (matchingOption !== undefined) {
      matchingOptions.push(matchingOption);
    }
  });

  if (!matchingOptions.length) {
    return undefined;
  }

  if (matchingOptions.length === 1 && searchOptions.flattenWhenSingleChild) {
    return matchingOptions[0];
  }

  return matchingOptions;
};

const searchOptionsCollection = (
  optionsCollection: OptionsCollection,
  searchTerm: string,
  searchOptions: SearchOptions,
): Options | undefined => {
  const matchingGroupedOptions: OptionsCollection = {};

  Object.entries(optionsCollection).forEach(([key, value]) => {
    const matchingOptions = search(value, searchTerm, searchOptions);

    if (matchingOptions !== undefined) {
      matchingGroupedOptions[key] = matchingOptions;
    }
  });

  const length = Object.keys(matchingGroupedOptions).length;

  if (!length) {
    return undefined;
  }

  if (!searchOptions.flattenWhenSingleChild || length > 1) {
    return matchingGroupedOptions;
  }

  const value = Object.values(matchingGroupedOptions)[0];

  if (isOptionItem(value) && searchOptions.flattenWhenSingleChild) {
    return value;
  }

  return matchingGroupedOptions;
};

export const search = (
  options: Options,
  searchTerm: string | undefined,
  searchOptions: SearchOptions = { title: 'partial-match' },
): Options | undefined => {
  if (!searchTerm) {
    return options;
  }

  if (isOptionsArray(options)) {
    return searchOptionsArray(options, searchTerm, searchOptions);
  }

  if (isOptionItem(options)) {
    return searchOptionItem(options, searchTerm, searchOptions);
  }

  if (isOptionsGroup(options)) {
    return searchOptionsGroup(options, searchTerm, searchOptions);
  }

  if (isOptionsCollection(options)) {
    return searchOptionsCollection(options, searchTerm, searchOptions);
  }

  return undefined;
};

export default search;
