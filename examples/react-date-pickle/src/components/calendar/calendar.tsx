import { useDatePicker } from './use-date-picker';
import { CalendarHeader } from './calendar-header/calendar-header';
import './calendar.css';

export type CalendarProps = {
  cursor: Date;
};

export function Calendar({
  cursor,
}: CalendarProps) {

  const { datePicker, items, weekdays, title } = useDatePicker({ cursor });

  return (
    <div className="calendar">

      <CalendarHeader
        title={title}
        onPrevious={() => datePicker.prev()}
        onNext={() => datePicker.next()}
      />

      <div className="calendar-weekdays">
        {weekdays.map(w => (
          <div className="calendar-weekday" key={w}>{w}</div>
        ))}
      </div>

      <div className="calendar-items">
        {items.map(item => (
          <div className="calendar-item" key={item.id}>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
