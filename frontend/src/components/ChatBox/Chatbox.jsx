/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import Message from '../Message/Message';
import styles from './ChatBox.module.scss';

const cx = classNames.bind(styles);

const ChatBox = ({ friend, onClose }) => {
  const [message, setMessage] = useState(''); // Tin nhắn gửi đi
  const [messages, setMessages] = useState([]); // Chứa các tin nhắn
  const [stompClient, setStompClient] = useState(null); // Chứa stomp client
  const messageEndRef = useRef(null); // Ref để cuộn xuống cuối
  const inputRef = useRef(null); // Ref để focus input
  const currentUser = JSON.parse(localStorage.getItem('user')); // { username, fullName }

  useEffect(() => {
    const socketFactory = () => new SockJS('http://localhost:8080/chat-websocket');
    const client = new Client({
      webSocketFactory: socketFactory,
      reconnectDelay: 5000,
      debug: (str) => console.log('[STOMP]', str),
      onConnect: () => {
        console.log('Connected to WebSocket');
        client.publish({
          destination: '/app/join',
          body: JSON.stringify({ sender: currentUser.fullName }),
        });
        client.subscribe('/topic/messages', (msg) => {
          console.log('Received message:', msg.body);
          const parsedMsg = JSON.parse(msg.body);
          // Lọc tin nhắn phù hợp (CHAT chỉ hiển thị nếu liên quan đến currentUser hoặc friend)
          if (
            parsedMsg.type === 'CHAT' &&
            (parsedMsg.sender === currentUser.fullName ||
              parsedMsg.sender === friend.fullName ||
              parsedMsg.receiver === currentUser.fullName ||
              parsedMsg.receiver === friend.fullName)
          ) {
            setMessages((prevMessages) => [...prevMessages, parsedMsg]);
          } else if (parsedMsg.type === 'JOIN' || parsedMsg.type === 'LEAVE') {
            setMessages((prevMessages) => [...prevMessages, parsedMsg]);
          }
        });
        setStompClient(client);
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
      onWebSocketError: (error) => {
        console.error('WebSocket error:', error);
      },
      onWebSocketClose: () => {
        console.log('WebSocket closed');
      },
    });

    client.activate();

    return () => {
      if (client && client.active) {
        client.deactivate();
        console.log('Disconnected from WebSocket');
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

  // Tự động cuộn xuống tin nhắn mới
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input khi component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className={cx('chatbox')}>
      <div className={cx('header')}>
        <span>{friend.fullName}</span>
        <button onClick={onClose}>✖</button>
      </div>
      <div className={cx('messages')}>
        {messages.map((msg, index) => (
          <div key={index} className={cx('message')}>
            <Message
              sender={msg.sender}
              content={msg.content}
              isOwnMessage={msg.sender === currentUser.fullName}
            />
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <div className={cx('input-area')}>
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          ref={inputRef}
        />
        <button className={cx('send-button')} onClick={sendMessage}>
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatBox;