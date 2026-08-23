import { mockCalendarEvents as events } from "../../data/mock/calendarEvents";
const weekdays = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];


/*
  Temporary calendar data.

  urgency:
  red    = latest / urgent
  yellow = medium
  green  = later
*/


function CalendarGrid({ currentDate }) {

  const year = currentDate.getFullYear();

  const month = currentDate.getMonth();


  /* =========================================
     CALCULATE FIRST DAY
     ========================================= */

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();


  /*
    JavaScript:
    Sunday = 0
    Monday = 1
    Tuesday = 2
    ...
    Saturday = 6

    Convert to Monday-first.
  */

  const mondayFirstOffset =
    firstDay === 0
      ? 6
      : firstDay - 1;


  /* =========================================
     DAYS IN MONTH
     ========================================= */

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();


  const daysInPreviousMonth = new Date(
    year,
    month,
    0
  ).getDate();


  /* =========================================
     TOTAL CALENDAR CELLS
     ========================================= */

  const totalCells =
    Math.ceil(
      (mondayFirstOffset + daysInMonth) / 7
    ) * 7;


  const calendarDays = [];


  /* =========================================
     CREATE CALENDAR DAYS
     ========================================= */

  for (let i = 0; i < totalCells; i++) {

    const dayNumber =
      i - mondayFirstOffset + 1;


    // Previous month

    if (dayNumber < 1) {

      const previousMonthDay =
        daysInPreviousMonth + dayNumber;

      calendarDays.push({
        day: previousMonthDay,

        currentMonth: false,

        date: new Date(
          year,
          month - 1,
          previousMonthDay
        ),
      });

    }


    // Current month

    else if (dayNumber <= daysInMonth) {

      calendarDays.push({
        day: dayNumber,

        currentMonth: true,

        date: new Date(
          year,
          month,
          dayNumber
        ),
      });

    }


    // Next month

    else {

      const nextMonthDay =
        dayNumber - daysInMonth;

      calendarDays.push({
        day: nextMonthDay,

        currentMonth: false,

        date: new Date(
          year,
          month + 1,
          nextMonthDay
        ),
      });

    }
  }


  /* =========================================
     DATE KEY
     ========================================= */

  const formatDateKey = (date) => {

    const dateYear =
      date.getFullYear();

    const dateMonth =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const dateDay =
      String(
        date.getDate()
      ).padStart(2, "0");

    return `${dateYear}-${dateMonth}-${dateDay}`;
  };


  /* =========================================
     FULL DATE FOR POPUP
     ========================================= */

  const formatFullDate = (date) => {

    return date.toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
  };


  /* =========================================
     RENDER
     ========================================= */

  return (
    <div className="calendar-container">

      {/* WEEKDAY HEADER */}

      <div className="calendar-weekdays">

        {weekdays.map((day) => (

          <div key={day}>
            {day}
          </div>

        ))}

      </div>


      {/* CALENDAR GRID */}

      <div className="calendar-grid">

        {calendarDays.map(
          (calendarDay, index) => {

            const dateKey =
              formatDateKey(
                calendarDay.date
              );


            const event =
              events[dateKey];


            return (

              <div
                key={index}
                className={`calendar-cell ${
                  calendarDay.currentMonth
                    ? ""
                    : "outside-month"
                } ${
                  event
                    ? `has-event ${event.urgency}`
                    : ""
                }`}
              >

                {/* DATE */}

                <div className="calendar-date">

                  {calendarDay.day}

                </div>


                {/* POPUP */}

                {event && (

                  <div className="calendar-tooltip">

                    <div className="tooltip-title">
                      {event.title}
                    </div>


                    <div className="tooltip-workspace">
                      {event.workspace}
                    </div>


                    <div className="tooltip-divider" />


                    <div className="tooltip-date">
                      Deadline:{" "}
                      {formatFullDate(
                        calendarDay.date
                      )}
                    </div>


                    <div
                      className={`tooltip-status ${event.urgency}`}
                    >

                      {event.urgency === "red" &&
                        "Urgent deadline"}

                      {event.urgency === "yellow" &&
                        "Upcoming deadline"}

                      {event.urgency === "green" &&
                        "Later deadline"}

                    </div>

                  </div>

                )}

              </div>

            );

          }
        )}

      </div>

    </div>
  );
}


export default CalendarGrid;