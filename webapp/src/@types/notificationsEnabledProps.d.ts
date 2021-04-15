import { NotificationMessage } from "../components/misc/Notifications";

export interface NotificationsEnabledProps {
  setNotification: (notification: NotificationMessage) => void;
}
