/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import classNames from 'classnames/bind';
import styles from './Message.module.scss';

const cx = classNames.bind(styles);

const Message = ({ sender, content, isOwnMessage }) => {
  return (
    <div className={cx('message', { own: isOwnMessage })}>
      <span>{sender}</span>
      <p>{content}</p>
    </div>
  );
};

export default Message;