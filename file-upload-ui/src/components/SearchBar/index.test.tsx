import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SearchBar from './index';

describe('SearchBar', () => {

  describe('when value', () => {
    const defaultValue = 'Search documents...';
    let handleSearchPatternChange: jest.Mock<any, any>;
    let inputElement: Element | null;

    beforeEach(() => {
      handleSearchPatternChange = jest.fn();

      const { container } = render(<SearchBar onSearchPatternChange={handleSearchPatternChange} />);
      inputElement = container.querySelector('.SearchBar-input');
    })

    describe(`is '${defaultValue}'`, () => {

      test('should clear value on focus', () => {
        expect(inputElement).toBeInTheDocument();
        expect(inputElement?.getAttribute('value')).toBe(defaultValue);

        inputElement && fireEvent.focus(inputElement);

        expect(inputElement?.getAttribute('value')).toBe('');
      });

    });

    describe('is empty or white space', () => {

      beforeEach(() => {
        inputElement && fireEvent.change(inputElement, { target: { value: '   ' } });
        inputElement && fireEvent.blur(inputElement);
      });

      test(`should reset value to '${defaultValue}' on blur`, () => {
        expect(inputElement?.getAttribute('value')).toBe(defaultValue);
      });

      test(`should trigger onSearchPatternChange on blur`, () => {
        expect(handleSearchPatternChange).toBeCalledTimes(1);
      });

    });

    describe('has value', () => {

      test(`should trigger onSearchPatternChange on blur`, () => {
        inputElement && fireEvent.focus(inputElement, { target: { value: 'Doc 1' } });
        inputElement && fireEvent.change(inputElement, { target: { value: 'Doc 1' } });
        inputElement && fireEvent.blur(inputElement);

        expect(handleSearchPatternChange).toBeCalledTimes(1);
      });

    });
  })

});
