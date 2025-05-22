/* eslint-disable react/prop-types */
import React from 'react';
import ChatBox from '../ChatBox/Chatbox';
import styles from './ChatContainer.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

/**
 * ChatContainer component quản lý nhiều chat box
 * Xử lý vị trí và đảm bảo chúng không chồng lên nhau
 */
const ChatContainer = ({ activeChats, closeChat }) => {
  // Nếu không có chat đang hoạt động, không hiển thị container
  if (!activeChats || activeChats.length === 0) {
    return null;
  }

  // Tính toán số lượng chat box có thể hiển thị cạnh nhau dựa trên độ rộng màn hình
  const windowWidth = window.innerWidth;
  const chatBoxWidth = 340; // 320px + 20px margin
  const maxVisibleChats = Math.floor(windowWidth / chatBoxWidth);
  
  // Nếu có nhiều chat hơn có thể hiển thị, thêm class để xếp chồng
  const tooManyChats = activeChats.length > maxVisibleChats;

  return (
    <div className={cx('chat-container', { 'stacked-chats': tooManyChats })}>
      {activeChats.map((chat, index) => (
        <ChatBox
          key={chat.id || chat.fullName}
          friend={chat}
          onClose={() => closeChat(chat)}
          position={index}
          totalChats={activeChats.length}
        />
      ))}
    </div>
  );
};

export default ChatContainer;