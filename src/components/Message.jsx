import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Message = ({ message }) => { 
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div 
      className={`message ${message.senderId === currentUser.uid ? "owner" : ""}`} 
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: message.senderId === currentUser.uid ? 'row-reverse' : 'row', // Flip for owner
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: '20px',
        gap: '10px', // Slightly reduce gap to avoid extra spacing
      }}
    >
      {/* User info (image and time) */}
      <div className="messageInfo" style={{ display: 'flex', flexDirection: 'column', color: 'gray', fontWeight: 300, fontSize: '14px' }}>
        <img 
          src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} 
          alt='' 
          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', marginRight: message.senderId === currentUser.uid ? '0' : '10px' }} 
        />
        <span style={{ fontSize: '12px', color: '#888' }}>Just now</span>
      </div>

      {/* Message content (text and image) */}
      <div 
        className="messageContent" 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: message.senderId === currentUser.uid ? 'flex-end' : 'flex-start', // Align the content accordingly
          gap: '10px',
          width: '80%',
        }}
      >
        <p 
          style={{
            backgroundColor: message.senderId === currentUser.uid ? '#11A1D1' : '#DBE0E3', // Conditional background color
            padding: '10px 20px',
            borderRadius: message.senderId === currentUser.uid ? '10px 0px 10px 10px' : '0px 10px 10px 10px', // Border-radius based on sender
            color: message.senderId === currentUser.uid ? '#000' : '#000',
            fontWeight: 500,
            fontSize: '16px',
            maxWidth: 'max-content',
            margin: 0,
          }}
        >
          {message.text}
        </p>

        {message.img && (
          <img 
            src={message.img} 
            alt='' 
            style={{
              width: '50%', // Restrict image size
              maxHeight: '200px',
              borderRadius: '10px',
              objectFit: 'cover',
              marginTop: '10px',
            }} 
          />
        )}
      </div>
    </div>
  );
};

export default Message;
