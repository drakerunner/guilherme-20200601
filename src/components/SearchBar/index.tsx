import React, { useState } from 'react';
import './style.css';

const defaultValue = "Search documents...";

export default function ({ onSearchPatternChange }: { onSearchPatternChange?: (pattern: string) => void }) {

  const inputRef = React.createRef<HTMLInputElement>();
  const [searchPattern, setSearchPattern] = useState(defaultValue);

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    if (e.target.value === defaultValue) {
      setSearchPattern('');
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (!value || !value.trim() || value === defaultValue) {
      setSearchPattern(defaultValue);
    }

    onSearchPatternChange && onSearchPatternChange(value.trim());
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    setSearchPattern(value);
  }

  return (<div className='SearchBar'>
    <input
      className='SearchBar-input'
      ref={inputRef}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      value={searchPattern} />
  </div>);
}
