import React from 'react';
import { useSocket } from '../../context/SocketContext';
import './SocketStatus.css';

const SocketStatus = () => {
  const { isConnected } = useSocket();

  return (
    <div className={`socket-status ${isConnected ? 'connected' : 'disconnected'}`}>
      <div className="socket-indicator">
        <span className={`socket-dot ${isConnected ? 'online' : 'offline'}`}></span>
        <span className="socket-text">
          {isConnected ? 'Notifications actives' : 'Hors ligne'}
        </span>
      </div>
    </div>
  );
};

export default SocketStatus; 