import {useSelector} from 'react-redux';
import NotificationLayout from './cards/NotificationLayout';
import Template01 from './cards/Template01';
import Template02 from './cards/Template02';
import Template03 from './cards/Template03';
import Template04 from './cards/Template04';
import TemplateUnknown from './cards/TemplateUnknown';

export default function Notification({notification}) {
  const notificationData = notification.notificationData;
  const isUnread = notification.messageStatus !== 'READ';

  console.log(notification);

  const InnerNotification = () => {
    if (notificationData.templateKey === 'template-01') {
      return <Template01 notification={notification} />;
    }
    if (notificationData.templateKey === 'template-02') {
      return <Template02 notification={notification} />;
    }
    if (notificationData.templateKey === 'template-03') {
      return <Template03 notification={notification} />;
    }
    if (notificationData.templateKey === 'template-04') {
      return <Template04 notification={notification} />;
    }

    return <TemplateUnknown />;
  };

  return (
    <NotificationLayout isUnread={isUnread} createdAt={notification.createdAt} label={notificationData.label}>
      {InnerNotification()}
    </NotificationLayout>
  );
}
