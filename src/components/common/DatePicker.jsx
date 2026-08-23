import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import './DatePicker.css';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const GRID_CELLS = 42; // 6 rows x 7 days, fixed so the popover never resizes month to month

function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseISODate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDisplay(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

export default function DatePicker({ value, onChange, onBlur, maxDate, id }) {
  const selected = parseISODate(value);
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(selected || new Date());
  const [openDirection, setOpenDirection] = useState('down');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        onBlur?.();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onBlur]);

  const toggleCalendar = () => {
    if (!isOpen) {
      if (selected) setViewDate(selected);

      // Direction is decided once, right when the popover opens — it does
      // NOT get recalculated while browsing months with the arrows, so as
      // long as the popover's size stays fixed (see cells padding below),
      // its position won't move while you click through months.
      const triggerRect = wrapperRef.current?.getBoundingClientRect();
      const POPOVER_HEIGHT_ESTIMATE = 400;
      const spaceBelow = triggerRect ? window.innerHeight - triggerRect.bottom : 0;
      setOpenDirection(spaceBelow < POPOVER_HEIGHT_ESTIMATE ? 'up' : 'down');
    }
    setIsOpen((prev) => !prev);
  };

  const changeMonth = (offset) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const handleSelectDay = (day) => {
    const picked = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    if (maxDate && picked > maxDate) return;
    onChange(toISODate(picked));
    setIsOpen(false);
    onBlur?.();
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Always pad to exactly 42 cells (6 full rows), regardless of how many
  // rows this specific month actually needs. This is what keeps the
  // popover's height identical for every month — October (5 rows worth
  // of dates) gets the same total height as August (6 rows worth).
  const leadingBlanks = firstDayOfMonth;
  const trailingBlanks = GRID_CELLS - leadingBlanks - daysInMonth;

  const cells = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ...Array(trailingBlanks).fill(null),
  ];

  const isSelected = (day) =>
    selected && selected.getFullYear() === year && selected.getMonth() === month && selected.getDate() === day;

  const isToday = (day) => {
    const now = new Date();
    return now.getFullYear() === year && now.getMonth() === month && now.getDate() === day;
  };

  const isDisabled = (day) => maxDate && new Date(year, month, day) > maxDate;

  const currentYear = new Date().getFullYear();
  const earliestYear = currentYear - 100;
  const latestYear = maxDate ? maxDate.getFullYear() : currentYear;
  const yearOptions = Array.from(
    { length: latestYear - earliestYear + 1 },
    (_, i) => latestYear - i
  );

  const handleMonthSelect = (e) => {
    setViewDate(new Date(year, Number(e.target.value), 1));
  };

  const handleYearSelect = (e) => {
    setViewDate(new Date(Number(e.target.value), month, 1));
  };

  return (
    <div className="datepicker" ref={wrapperRef}>
      <button type="button" id={id} className="datepicker__trigger" onClick={toggleCalendar}>
        <span className={selected ? '' : 'datepicker__placeholder'}>
          {selected ? formatDisplay(selected) : 'Select a date'}
        </span>
        <CalendarIcon size={16} />
      </button>

      {isOpen && (
        <div className={`datepicker__popover datepicker__popover--${openDirection}`}>
          <div className="datepicker__header">
            <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month">
              <ChevronLeft size={16} />
            </button>

            <div className="datepicker__header-selects">
              <select value={month} onChange={handleMonthSelect} aria-label="Month">
                {MONTH_NAMES.map((name, i) => (
                  <option key={name} value={i}>{name}</option>
                ))}
              </select>
              <select value={year} onChange={handleYearSelect} aria-label="Year">
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button type="button" onClick={() => changeMonth(1)} aria-label="Next month">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="datepicker__weekdays">
            {WEEKDAYS.map((w, i) => (
              <span key={`${w}-${i}`}>{w}</span>
            ))}
          </div>

          <div className="datepicker__grid">
            {cells.map((day, i) =>
              day === null ? (
                <span key={`empty-${i}`} className="datepicker__day-empty" />
              ) : (
                <button
                  type="button"
                  key={day}
                  disabled={isDisabled(day)}
                  className={`datepicker__day${isSelected(day) ? ' datepicker__day--selected' : ''}${isToday(day) ? ' datepicker__day--today' : ''}`}
                  onClick={() => handleSelectDay(day)}
                >
                  {day}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}