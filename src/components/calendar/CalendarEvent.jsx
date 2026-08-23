function CalendarEvent({ task }) {

  return (
    <div className={`calendar-event ${task.color}`}>

      <strong>
        {task.title}
      </strong>

      <span>
        {task.workspace}
      </span>

    </div>
  );
}

export default CalendarEvent;