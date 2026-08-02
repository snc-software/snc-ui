import { describe, expect, it } from 'vitest';

import { isOptionItem, isOptionsArray, isOptionsCollection, isOptionsGroup } from './optionChecker';

import type { OptionItem, OptionsCollection, OptionsGroup } from './OptionsList.types';

const optionItem: OptionItem = { id: 'one', title: 'One' };
const optionsGroup: OptionsGroup = { title: 'Group', childOptions: optionItem };
const optionsArray = [optionItem, optionsGroup];
const optionsCollection: OptionsCollection = { groupA: optionItem };

describe('optionChecker', () => {
  describe('isOptionItem', () => {
    it('identifies an OptionItem', () => {
      expect(isOptionItem(optionItem)).toBe(true);
    });

    it('rejects an OptionsGroup, an array, and an OptionsCollection', () => {
      expect(isOptionItem(optionsGroup)).toBe(false);
      expect(isOptionItem(optionsArray)).toBe(false);
      expect(isOptionItem(optionsCollection)).toBe(false);
    });
  });

  describe('isOptionsGroup', () => {
    it('identifies an OptionsGroup', () => {
      expect(isOptionsGroup(optionsGroup)).toBe(true);
    });

    it('rejects an OptionItem, an array, and an OptionsCollection', () => {
      expect(isOptionsGroup(optionItem)).toBe(false);
      expect(isOptionsGroup(optionsArray)).toBe(false);
      expect(isOptionsGroup(optionsCollection)).toBe(false);
    });
  });

  describe('isOptionsArray', () => {
    it('identifies an array of Options', () => {
      expect(isOptionsArray(optionsArray)).toBe(true);
    });

    it('rejects an OptionItem, an OptionsGroup, and an OptionsCollection', () => {
      expect(isOptionsArray(optionItem)).toBe(false);
      expect(isOptionsArray(optionsGroup)).toBe(false);
      expect(isOptionsArray(optionsCollection)).toBe(false);
    });
  });

  describe('isOptionsCollection', () => {
    it('identifies an OptionsCollection', () => {
      expect(isOptionsCollection(optionsCollection)).toBe(true);
    });

    it('rejects an OptionItem, an OptionsGroup, and an array', () => {
      expect(isOptionsCollection(optionItem)).toBe(false);
      expect(isOptionsCollection(optionsGroup)).toBe(false);
      expect(isOptionsCollection(optionsArray)).toBe(false);
    });
  });
});
