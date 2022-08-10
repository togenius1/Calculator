import moment from 'moment';

export function getFormattedDate(date: string) {
  // return date.toISOString().slice(0, 10);
  return date.slice(0, 10);
}

export function getDateMinusDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
  // return moment().subtract(date, days);
}

// a and b are javascript Date objects
export function dateDiffInDays(endDate: Date, startDate: Date) {
  const st_date = moment(startDate);
  const end_date = moment(endDate);

  const duration = st_date.diff(end_date, 'days');

  // console.log('from Date: ' + duration);

  return duration;
}
