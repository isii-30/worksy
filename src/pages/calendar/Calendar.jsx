import { useState } from "react";

import CalendarHeader from "../../components/calendar/CalendarHeader";
import CalendarGrid from "../../components/calendar/CalendarGrid";


import "./Calendar.css";


function Calendar() {

  const [currentDate, setCurrentDate] =
    useState(new Date(2026, 7, 1));


  return (

    <div className="calendar-page">

      {/* SIDEBAR */}



      {/* CALENDAR CONTENT */}

      <main className="calendar-main">

        <CalendarHeader
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />

        <CalendarGrid
          currentDate={currentDate}
        />

      </main>

    </div>

  );
}


export default Calendar;