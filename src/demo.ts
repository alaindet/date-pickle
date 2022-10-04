console.log('Date Pickle Demo');

interface DateTimeParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

function getDiff(timeZone: string, dateRef?: Date): number {
  const ref = dateRef ?? new Date();

  const utcParts = getUtcDateParts(ref);
  const offsetParts = getOffsetDateParts(ref, timeZone);

  const { year: Y, month: M, day: D, hour: H, minute: I } = utcParts;
  const { year: y, month: m, day: d, hour: h, minute: i } = offsetParts;

  // Same date?
  if (Y === y && M === m && D === d) {
    const utcMins = 60 * H + I;
    const offsetMins = 60 * h + i;
    return utcMins - offsetMins;
  }

  // Offset is behind one day
  if (Y > y || M > m || D > d) {
    const utcMins = 60 * (H + 24) + I;
    const offsetMins = 60 * h + i;
    return utcMins - offsetMins;
  }

  // Offset is ahead one day
  const utcMins = 60 * H + I;
  const offsetMins = 60 * (h + 24) + i;
  return utcMins - offsetMins;
}

function getOffsetDateParts(d: Date, timeZone: string): DateTimeParts {
  const fmt = Intl.DateTimeFormat('en', {
    hourCycle: 'h24',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone,
  });

  const result: Partial<DateTimeParts> = {};
  const parts = fmt.formatToParts(d);

  for (const { type, value } of parts) {
    if (type === 'literal') continue;
    const key = type as keyof DateTimeParts;
    result[key] = parseInt(value);
  }

  return result as DateTimeParts;
}

function getUtcDateParts(d: Date): DateTimeParts {
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
  };
}

console.log(
  getDiff('America/Los_Angeles'), // -8?
  getDiff('Asia/Kolkata') // -8?
);

// const d = new Date('2022-10-01T00:00:00Z');

// const BASE_OPTIONS: Intl.DateTimeFormatOptions = {
//   hourCycle: 'h24',
//   month: '2-digit',
//   day: '2-digit',
//   hour: '2-digit',
//   minute: '2-digit',
// };

// const gmtFmt = Intl.DateTimeFormat('en', {
//   ...BASE_OPTIONS,
//   timeZone: 'Europe/London',
// });

// const usFmt = Intl.DateTimeFormat('en', {
//   ...BASE_OPTIONS,
//   timeZone: 'America/Los_Angeles',
// });

// console.log(
//   'ISO', d.toISOString(),
//   'GMT', gmtFmt.formatToParts(d),
//   'LA', usFmt.formatToParts(d),
// );

export {};
