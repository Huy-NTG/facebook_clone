/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import Message from '../Message/Message';
import styles from './ChatBox.module.scss';

const cx = classNames.bind(styles);

// This component is the individual chat box
const ChatBox = ({ friend, onClose, position, totalChats }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);
  const currentUser = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    console.log('Đang cố gắng kết nối đến WebSocket...', currentUser?.avatarUrl);
    const socketFactory = () => new SockJS('http://localhost:8080/ws', null, {
      withCredentials: true,
    });
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      debug: (str) => console.log('[STOMP]', str),
      onConnect: () => {
        console.log('✅ Kết nối WebSocket thành công!');
        client.publish({
          destination: '/app/join',
          body: currentUser.fullName,
        });
        client.subscribe('/topic/messages', (msg) => {
          const parsedMsg = JSON.parse(msg.body);
          console.log('📩 Nhận tin nhắn:', parsedMsg);
          parsedMsg.timestamp = parsedMsg.timestamp || new Date().toISOString();
          if (
            parsedMsg.type === 'CHAT' &&
            (parsedMsg.sender === currentUser.fullName || parsedMsg.receiver === currentUser.fullName)
          ) {
            setMessages((prev) => [...prev, parsedMsg]);
          } else if (parsedMsg.type === 'JOIN' || parsedMsg.type === 'LEAVE') {
            setMessages((prev) => [...prev, parsedMsg]);
          }
        });
        setStompClient(client);
      },
      onStompError: (frame) => console.error('❌ Lỗi STOMP:', frame),
      onWebSocketError: (error) => console.error('❌ Lỗi WebSocket:', error),
      onWebSocketClose: () =>
        console.warn('⚠️ WebSocket đã đóng. Mất kết nối hoặc server không phản hồi.'),
    });
    client.activate();
    return () => {
      if (client && client.active) {
        client.deactivate();
        console.log('👋 Ngắt kết nối WebSocket');
      }
    };
  }, [currentUser.fullName]);

  const sendMessage = () => {
    if (stompClient && stompClient.active && message.trim() !== '') {
      const chatMessage = {
        sender: currentUser.fullName,
        receiver: friend.fullName,
        content: message,
        type: 'CHAT',
        timestamp: new Date().toISOString(),
      };
      console.log('Sending message:', chatMessage);
      stompClient.publish({
        destination: '/app/sendMessage',
        body: JSON.stringify(chatMessage),
      });
      setMessage('');
      inputRef.current?.focus();
    } else {
      console.error('Cannot send message: STOMP client not connected or empty message');
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const getAvatarUrl = (sender) => {
    if (sender === currentUser.fullName) {
      return currentUser.avatarUrl
        ? `http://localhost:8080/uploads/${currentUser.avatarUrl}`
        : 'http://localhost:8080/uploads/user_1.png';
    } else if (sender === friend.fullName) {
      return friend.avatarUrl
        ? `http://localhost:8080/uploads/${friend.avatarUrl}`
        : 'http://localhost:8080/uploads/user_1.png';
    }
    return 'http://localhost:8080/uploads/user_1.png';
  };

  // Calculate the position based on the index
  const chatboxStyle = {
    right: `${(position * 340) + 20}px` // 320px width + 20px spacing
  };

  // If we have more than 3 chats, adjust the z-index to ensure proper stacking
  const zIndex = 1000 - position;

  return (
    <div 
      className={cx('chatbox', { minimized: isMinimized })}
      style={chatboxStyle}
      data-position={position}
      data-total-chats={totalChats}
    >
      <div className={cx('header')} onClick={() => setIsMinimized(!isMinimized)}>
        <div className={cx('header-content')}>
          <div className={cx('avatar')} style={{ backgroundImage: `url(${getAvatarUrl(friend.fullName)})` }}></div>
          <span>{friend.fullName}</span>
        </div>
        <div className={cx('header-buttons')}>
          <button
            className={cx('minimize-btn')}
            aria-label={isMinimized ? 'Maximize chat' : 'Minimize chat'}
          >
            {isMinimized ? '↗' : '─'}
          </button>
          <button
            className={cx('close-btn')}
            onClick={onClose}
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>
      </div>
      {!isMinimized && (
        <>
          <div className={cx('messages')}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cx('message', {
                  own: msg.sender === currentUser.fullName,
                  other: msg.sender !== currentUser.fullName && msg.type === 'CHAT',
                  system: msg.type === 'JOIN' || msg.type === 'LEAVE',
                })}
              >
                <Message
                  sender={msg.sender}
                  content={msg.content}
                  timestamp={msg.timestamp}
                  isOwnMessage={msg.sender === currentUser.fullName}
                  avatarUrl={msg.type === 'CHAT' ? getAvatarUrl(msg.sender) : null}
                  isSystemMessage={msg.type === 'JOIN' || msg.type === 'LEAVE'}
                />
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
          <div className={cx('input-area')}>
            <input
              type="text"
              placeholder="Aa"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              ref={inputRef}
              aria-label="Type a message"
            />
            <button
              className={cx('send-button')}
              onClick={sendMessage}
              disabled={!message.trim()}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M2.01 21L23 12 2.01 3v7l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBox;