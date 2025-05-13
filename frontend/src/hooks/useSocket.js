import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const useSocket = (onMessageReceived) => {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log('[STOMP]', str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ STOMP connected');
        setConnected(true);
        clientRef.current = client;

        client.subscribe('/topic/messages', (message) => {
          const body = JSON.parse(message.body);
          onMessageReceived(body);
        });
      },
      onDisconnect: () => {
        setConnected(false);
        console.warn('⚠️ STOMP disconnected');
      },
      onStompError: (frame) => {
        console.error('❌ STOMP error:', frame);
      },
    });

    client.activate();

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [onMessageReceived]);

  return { client: clientRef, connected };
};

export default useSocket;
