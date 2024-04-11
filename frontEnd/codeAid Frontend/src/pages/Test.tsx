import { useEffect } from 'react';
import io from 'socket.io-client';

const MyComponent = () => {
  useEffect(() => {
    // Connect to Socket.IO server
    const socket = io('http://localhost:3000');

    // Listen for 'connect' event
    socket.on('connect', () => {
      console.log('Connected to server!');
    });

    // Listen for 'disconnect' event
    socket.on('disconnect', () => {
      console.log('Disconnected from server!');
    });

    // Clean up: disconnect socket when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div>
      <h1>Socket.IO Client with React</h1>
    </div>
  );
};

export default MyComponent;
