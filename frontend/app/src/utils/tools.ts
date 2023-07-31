import moment from 'moment';

export const formatDate = (date: Date) => {
  return moment(date).format('D/MM/Y (HH:mm)') + 'hs';
};

export const formatTitleCase = (text: string) => {
  if (text) return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  return '';
};
