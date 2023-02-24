import './app.css';
import { Calendar } from './components/calendar/calendar';

export function App() {
  return (
    <div className="App">
      <Calendar
        cursor={new Date()}
      />
    </div>
  );
}
