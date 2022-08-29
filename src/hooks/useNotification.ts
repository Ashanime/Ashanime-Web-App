import { useAppDispatch } from "../redux/store";
import { notificationMessage } from "../redux/notification-slice";

export const useNotification = () => {
  const dispatch = useAppDispatch();

  const notificationHandler = (
    message: string,
    title: string,
    show: boolean
  ) => {
    dispatch(notificationMessage({ message, title, show }));
  };

  return {
    notificationHandler,
  };
};
