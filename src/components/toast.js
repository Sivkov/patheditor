import { toast } from 'react-toastify';
import i18next from 'i18next'; // Импортируем напрямую

export const showToast = ({
  type = 'info',
  message = '',
  position = 'bottom-right',
  autoClose = 3000,
  hideProgressBar = false,
  closeOnClick = true,
  pauseOnHover = true,
  draggable = true,
  theme = 'dark',
}) => {
  toast(i18next.t(message), {
    type,
    position,
    autoClose,
    hideProgressBar,
    closeOnClick,
    pauseOnHover,
    draggable,
    theme,
  });
};
