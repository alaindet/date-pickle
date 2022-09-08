import { DatePickle } from './date-pickle';

const pickle = new DatePickle();

pickle.view.onClose(() => console.log('closed'));

pickle.view.onChange(view => {
  console.log('view changed', view.to);
  // pickle.view.picker.onItemsChange(items => console.log('items', items));
});

pickle.view.next(); // Date => Month
pickle.view.next(); // Month => Year
pickle.view.next(); // Year => Month
pickle.view.next(); // Month => Year

pickle.view.prev(); // Year => Month
pickle.view.prev(); // Month => Date
pickle.view.prev(); // Date => close
