import React from 'react';
import './App.scss';
import HeaderLine from './components/HeaderLine';
import ScheduleTable from './components/tableComponents/ScheduleTable';
import SearchSideBar from './components/sidebarComponents/SearchSideBar';
import moment from 'moment';

moment.locale('ru');

function App() {
  return (
    <div className="App">
      <HeaderLine />
      <SearchSideBar />
      <ScheduleTable />
    </div>
  );
}

export default App;
