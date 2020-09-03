import React from 'react';
import SearchWidget from './SearchWidget';
import DateWidget from './DateWidget';
import DoctorsWidget from './DoctorsWidget';

const SearchSideBar = () => (
  <div className="left-bar-container">
    <SearchWidget />
    <DateWidget />
    <DoctorsWidget />
  </div>
);

export default SearchSideBar;
