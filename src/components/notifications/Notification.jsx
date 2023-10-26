import {useSelector} from 'react-redux';
import NotificationLayout from './cards/NotificationLayout';
import Template01 from './cards/Template01';
import Template02 from './cards/Template02';
import Template03 from './cards/Template03';
import Template04 from './cards/Template04';
import TemplateUnknown from './cards/TemplateUnknown';

export default function Notification({notification}) {
  const notificationData = notification.notificationData;
  const myLastRead = useSelector(state => state.sendbird.feedChannel.myLastRead);
  const templateVariables = notificationData.templateVariables;
  const isUnread = myLastRead < notification.createdAt;

  const InnerNotification = () => {
    if (notificationData.templateKey === 'template-01') {
      return <Template01 variables={templateVariables} />;
    }
    if (notificationData.templateKey === 'template-02') {
      return <Template02 variables={templateVariables} />;
    }
    if (notificationData.templateKey === 'template-03') {
      return <Template03 variables={templateVariables} />;
    }
    if (notificationData.templateKey === 'template-04') {
      return <Template04 variables={templateVariables} />;
    }

    return <TemplateUnknown />;
  };

  return (
    <NotificationLayout isUnread={isUnread} createdAt={notification.createdAt} label={notificationData.label}>
      {InnerNotification()}
    </NotificationLayout>
  );
}
