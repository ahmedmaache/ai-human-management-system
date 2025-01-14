import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css'; // Import the CSS file

function App() {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://<your-vm-ip>:8000');
        setSocket(newSocket);

        newSocket.on('message', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <div className="app-container"> {/* Apply the CSS class */}
            <h1>Industrial Monitoring Dashboard</h1>
            <div className="message-container">
                {messages.map((message, index) => (
                    <div key={index} className="message">{message}</div>
                ))}
            </div>
        </div>
    );
}


export default App;