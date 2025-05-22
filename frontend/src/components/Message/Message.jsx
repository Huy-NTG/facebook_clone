/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import classNames from 'classnames/bind';
import styles from './Message.module.scss';

const cx = classNames.bind(styles);

const Message = ({ sender, content, timestamp, isOwnMessage, avatarUrl, isSystemMessage }) => {
  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={cx('message', { own: isOwnMessage, system: isSystemMessage })}>
      {!isOwnMessage && !isSystemMessage && avatarUrl && (
        <div className={cx('avatar')} style={{ backgroundImage: `url(${avatarUrl})` }}></div>
      )}
      <div className={cx('message-content')}>
        {!isOwnMessage && !isSystemMessage && <span className={cx('sender')}>{sender}</span>}
        <p>{content}</p>
        {timestamp && !isSystemMessage && (
          <span className={cx('timestamp')}>
            {formatTimestamp(timestamp)}
          </span>
        )}
      </div>
    </div>
  );
};

export default Message;