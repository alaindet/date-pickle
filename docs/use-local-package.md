# Date Pickle

## Use it locally

1. Clone and build the package
```
git clone https://github.com/alaindet/date-pickle
cd date-pickle
npm install
npm run build
npm pack # Generates date-pickle-<VERSION>.tgz
```

2. Move to your project
```
npm install <PATH_TO_DATE_PICKLE_TGZ_FILE>
```

3. Use `date-pickle` in your project
```ts
import { DatePickle } from 'date-pickle';

const dp = new DatePickle();
console.log(dp.datePicker.items); // Prints all days in current month
console.log(dp.monthPicker.items); // Prints all months of current year
```

## Create package to another location

This creates `../libs/date-pickle-<VERSION>.tgz`

```
npm pack --pack-destination ../libs/date-pickle.tgz
```
