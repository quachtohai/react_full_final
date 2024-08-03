import { useSelector } from 'react-redux';
import { selectAppSettings } from '@/redux/settings/selectors';

const useDate = () => {
  const app_settings = useSelector(selectAppSettings);
  const dateFormat = 'DD/MM/YYYY';
  return {
    dateFormat,
  };
};

export default useDate;
