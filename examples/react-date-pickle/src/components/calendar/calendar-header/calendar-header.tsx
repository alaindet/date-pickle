import './calendar-header.css';

export type CalendarHeaderProps = {
  title: string;
  onPrevious: () => void;
  onNext: () => void;
};

export function CalendarHeader({
  title,
  onPrevious,
  onNext,
}: CalendarHeaderProps) {
  return (
    <div className="calendar-header">
      <button
        type="button"
        onClick={onPrevious}
        title="Go to previous month"
      >
        <i className="icon icon--arrow-left"></i>
      </button>

      <span className="calendar-title">{title}</span>

      <button
        type="button"
        onClick={onNext}
        title="Go to next month"
      >
        <i className="icon icon--arrow-right"></i>
      </button>
    </div>
  );
}
