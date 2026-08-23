import { useState } from "react";


function CalendarHeader({ currentDate, setCurrentDate }) {
  const [isOpen, setIsOpen] = useState(false);


  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];


  const selectedMonth = currentDate.getMonth();
  const selectedYear = currentDate.getFullYear();


  const handleMonthSelect = (monthIndex) => {
    setCurrentDate(
      new Date(selectedYear, monthIndex, 1)
    );

    setIsOpen(false);
  };


  return (
    <div className="calendar-header">

      {/* Left side */}
      <div>

        <h1>
          Calendar
        </h1>

        <p>
          View and manage your schedule and task deadlines
        </p>

      </div>


      {/* Month dropdown */}
      <div className="month-dropdown">

        <button
          type="button"
          className="month-dropdown-button"
          onClick={() => setIsOpen(!isOpen)}
        >

          <span>
            {months[selectedMonth]} {selectedYear}
          </span>

          <span
            className={`month-chevron ${
              isOpen ? "open" : ""
            }`}
          >
            ˅
          </span>

        </button>


        {isOpen && (

          <div className="month-dropdown-menu">

            {months.map((month, index) => (

              <button
                type="button"
                key={month}
                className={`month-option ${
                  selectedMonth === index
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handleMonthSelect(index)
                }
              >

                <span>
                  {month} {selectedYear}
                </span>

                {selectedMonth === index && (

                  <span className="month-check">
                    ✓
                  </span>

                )}

              </button>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}


export default CalendarHeader;