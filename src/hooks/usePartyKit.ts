import { useEffect, useRef, useState } from 'react';

interface PartyKitMessage {
  type: string;
  [key: string]: unknown;
}

interface UsePartyKitOptions {
  room: string;
  enabled?: boolean;
  onMessage?: (message: PartyKitMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

// Get a stable client id per tab
function getClientId(): string {
  const key = 'games_cid';
  let cid = localStorage.getItem(key);
  if (!cid) {
    cid = Math.random().toString(36).substring(2, 10);
    localStorage.setItem(key, cid);
  }
  return cid;
}

export const usePartyKit = ({
  room,
  enabled = true,
  onMessage,
  onOpen,
  onClose,
  onError
}: UsePartyKitOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const hasShownServerWarning = useRef(false);
  const connectionAttempted = useRef(false);
  const sendQueueRef = useRef<PartyKitMessage[]>([]);

  const flushQueue = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      for (const msg of sendQueueRef.current) {
        wsRef.current.send(JSON.stringify(msg));
      }
      sendQueueRef.current = [];
    }
  };

  const connect = () => {
    if (!enabled) return;
    if (
      wsRef.current?.readyState === WebSocket.OPEN ||
      wsRef.current?.readyState === WebSocket.CONNECTING ||
      !room ||
      connectionAttempted.current
    ) {
      return;
    }

    connectionAttempted.current = true;
    setIsConnecting(true);

    const cid = getClientId();
    const base = import.meta.env.DEV
      ? `ws://localhost:1999/tic_tac_toe/${room}`
      : `wss://${import.meta.env.VITE_PARTYKIT_HOST || 'games-partykit.msanigar.partykit.dev'}/parties/tic_tac_toe/${room}`;
    const wsUrl = `${base}?cid=${encodeURIComponent(cid)}`;
    
    console.log('🔌 Connecting to:', wsUrl);
    console.log('🌍 Environment:', import.meta.env.MODE);
    console.log('🏠 PartyKit Host:', import.meta.env.VITE_PARTYKIT_HOST);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      setIsConnecting(false);
      hasShownServerWarning.current = false;
      onOpen?.();
      flushQueue();
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        onMessage?.(message);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.onclose = (event) => {
      console.log('🔌 WebSocket closed:', event.code, event.reason);
      setIsConnected(false);
      setIsConnecting(false);
      connectionAttempted.current = false;
      onClose?.();

      if (import.meta.env.DEV && !hasShownServerWarning.current) {
        console.log('🌐 Local WS server not running. Start it with: npm run dev:server or npm run dev:full');
        hasShownServerWarning.current = true;
      }
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      setIsConnected(false);
      setIsConnecting(false);
      connectionAttempted.current = false;
      onError?.(error);
    };

    wsRef.current = ws;
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    connectionAttempted.current = false;
  };

  const send = (message: PartyKitMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      // queue until connected
      sendQueueRef.current.push(message);
      if (import.meta.env.DEV) {
        console.log('📡 Queued message:', message.type);
      }
    }
  };

  useEffect(() => {
    if (room && enabled && !connectionAttempted.current) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [room, enabled]);

  return {
    isConnected,
    isConnecting,
    send,
    connect,
    disconnect,
  };
}; 