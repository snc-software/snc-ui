import type { OptionItem, Options, OptionsCollection, OptionsGroup } from './OptionsList.types';

export const isOptionItem = (option: Options): option is OptionItem => {
  return typeof option === 'object' && option !== null && 'id' in option && !('childOptions' in option);
};

export const isOptionsGroup = (option: Options): option is OptionsGroup => {
  return typeof option === 'object' && option !== null && 'childOptions' in option;
};

export const isOptionsArray = (option: Options): option is Options[] => {
  return Array.isArray(option);
};

export const isOptionsCollection = (option: Options): option is OptionsCollection => {
  return (
    typeof option === 'object' &&
    option !== null &&
    !('id' in option) &&
    !('childOptions' in option) &&
    !Array.isArray(option)
  );
};
