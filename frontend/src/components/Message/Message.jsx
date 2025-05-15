/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import classNames from 'classnames/bind';
import styles from './Message.module.scss';

const cx = classNames.bind(styles);

const Message = ({ sender, content, isOwnMessage, imaStringe  }) => {
  return (
    <div className={cx('message', { own: isOwnMessage })}>
      <img
      src={`http://localhost:8080${imaStringe}`}
      alt="avatar"
      className={cx('avatar')}
    />

      <span>{sender}</span>
      <p>{content}</p>
    </div>
  );
};

export default Message;