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

const ChatBox = ({ friend, onClose }) => {
  const [message, setMessage] = useState(''); // Tin nhắn gửi đi
  const [messages, setMessages] = useState([]); // Chứa các tin nhắn
  const [stompClient, setStompClient] = useState(null); // Chứa stomp client
  const messageEndRef = useRef(null); // Ref để cuộn xuống cuối
  const inputRef = useRef(null); // Ref để focus input
  const currentUser = JSON.parse(sessionStorage.getItem('user')); // { username, fullName }

  // useEffect(() => {
  //   console.log('Đang cố gắng kết nối đến WebSocket...');
    
  //   const socketFactory = () => new SockJS('http://localhost:8080/ws');
  //   const client = new Client({
  //     webSocketFactory: socketFactory,
  //     reconnectDelay: 5000,
  //     debug: (str) => console.log('[STOMP]', str),
  //     onConnect: () => {
  //       console.log('✅ Kết nối WebSocket thành công!');
  //       client.publish({
  //         destination: '/app/join',
  //         body: JSON.stringify({ sender: currentUser.fullName }),
  //       });
  //       client.subscribe('/topic/messages', (msg) => {
  //         console.log('📩 Nhận tin nhắn:', msg.body);
  //         const parsedMsg = JSON.parse(msg.body);
  //         if (
  //           parsedMsg.type === 'CHAT' &&
  //           (parsedMsg.sender === currentUser.fullName ||
  //             parsedMsg.sender === friend.fullName ||
  //             parsedMsg.receiver === currentUser.fullName ||
  //             parsedMsg.receiver === friend.fullName)
  //         ) {
  //           setMessages((prevMessages) => [...prevMessages, parsedMsg]);
  //         } else if (parsedMsg.type === 'JOIN' || parsedMsg.type === 'LEAVE') {
  //           setMessages((prevMessages) => [...prevMessages, parsedMsg]);
  //         }
  //       });
  //       setStompClient(client);
  //     },
  //     onStompError: (frame) => {
  //       console.error('❌ Lỗi STOMP:', frame);
  //     },
  //     onWebSocketError: (error) => {
  //       console.error('❌ Lỗi WebSocket:', error);
  //     },
  //     onWebSocketClose: () => {
  //       console.warn('⚠️ WebSocket đã đóng. Mất kết nối hoặc server không phản hồi.');
  //     },
  //   });
  
  //   client.activate();
  
  //   return () => {
  //     if (client && client.active) {
  //       client.deactivate();
  //       console.log('👋 Ngắt kết nối WebSocket');
  //     }
  //   };
  // }, [currentUser.fullName]);
  useEffect(() => {
    console.log('Đang cố gắng kết nối đến WebSocket...');
  
    const socketFactory = () => new SockJS('http://localhost:8080/ws', null, {
      withCredentials: true
    }); // kết nối thất bại
    
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws', // kết nối thành công
      // webSocketFactory: socketFactory,
      reconnectDelay: 5000,
      debug: (str) => console.log('[STOMP]', str),
      onConnect: () => {
        console.log('✅ Kết nối WebSocket thành công!');
        
        // Gửi sự kiện tham gia (JOIN)
        client.publish({
          destination: '/app/join',
          body: currentUser.fullName, // hoặc JSON.stringify nếu bên backend nhận object
        });
  
        // Đăng ký lắng nghe kênh /topic/messages
        client.subscribe('/topic/messages', (msg) => {
          const parsedMsg = JSON.parse(msg.body);
          console.log('📩 Nhận tin nhắn:', parsedMsg);
        
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
      onStompError: (frame) => {
        console.error('❌ Lỗi STOMP:', frame);
      },
      onWebSocketError: (error) => {
        console.error('❌ Lỗi WebSocket:', error);
      },
      onWebSocketClose: () => {
        console.warn('⚠️ WebSocket đã đóng. Mất kết nối hoặc server không phản hồi.');
      },
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
        imaStringe: `/uploads/${currentUser.avatarUrl}`, // thêm dòng này
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

  //Tự động cuộn xuống tin nhắn mới
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  //Focus input khi component mount
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
              imaStringe={msg.imaStringe}
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