import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { api, SOCKET_URL } from '../api';
import { initials } from '../utils/format';

export function Chat({ user, target, navigate, notify }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [peer, setPeer] = useState(null);

  const currentUserId = user._id || user.id;
  const conversationId = [String(currentUserId), String(target)]
    .sort()
    .join(':');

  useEffect(() => {
    if (!target) return;

    let socket;

    api(`/chat/${target}`)
      .then((data) => {
        setPeer(data.peer);
        setMessages(data.messages);
      })
      .catch((error) => notify(error.message, 'error'));

    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    socket.emit('join', conversationId);

    socket.on('message', (message) => {
      setMessages((current) => [...current, message]);
    });

    return () => {
      socket?.disconnect();
    };
  }, [target]);

  const sendMessage = () => {
    const cleanText = text.trim();

    if (!cleanText) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    socket.emit(
      'sendMessage',
      {
        conversationId,
        receiver: target,
        sender: currentUserId,
        text: cleanText,
      },
      (message) => {
        setMessages((current) => {
          const exists = current.some((item) => item._id === message._id);
          return exists ? current : [...current, message];
        });

        socket.disconnect();
      }
    );

    setText('');
  };

  return (
    <section className="page">
      <div className="container chat-wrap">
        <button className="back-btn" onClick={() => navigate('dashboard')}>
          ← Dashboard
        </button>

        <div className="chat-shell">
          <div className="chat-head">
            <div className="avatar">{initials(peer?.name)}</div>
            <div>
              <b>{peer?.name || 'Conversation'}</b>
              <small>{peer?.email || 'RoomMate Pro member'}</small>
            </div>
          </div>

          <div className="messages">
            {messages.length ? (
              messages.map((message) => {
                const mine =
                  String(message.sender) === String(currentUserId);

                return (
                  <div
                    className={`message ${mine ? 'mine' : ''}`}
                    key={message._id || `${message.createdAt}-${message.text}`}
                  >
                    <span>{message.text}</span>
                    <small>
                      {new Date(
                        message.createdAt || Date.now()
                      ).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </small>
                  </div>
                );
              })
            ) : (
              <div className="chat-empty">
                Start the conversation with a friendly introduction.
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') sendMessage();
              }}
              placeholder="Write a message…"
            />
            <button className="btn primary" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
