import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { arrayUnion, updateDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from 'uuid';
import { uploadBytesResumable, getDownloadURL, ref } from 'firebase/storage';

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (!text && !img) return; // Don't send if there's no text or image

    const messageData = {
      id: uuid(),
      senderId: currentUser.uid,
      date: Timestamp.now(),
    };

    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Optionally, you can handle progress here
        },
        (error) => {
          console.error("File upload failed: ", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          messageData.img = downloadURL; // Add image URL to messageData
          await sendMessage(messageData);
        }
      );
    } else {
      await sendMessage({ ...messageData, text }); // Send text message
    }

    // Reset input fields
    setText("");
    setImg(null);
  };

  const sendMessage = async (messageData) => {
    try {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion(messageData),
      });
      await updateUserChats(messageData.text || "Image sent");
    } catch (err) {
      console.error("Error updating chat: ", err);
    }
  };

  const updateUserChats = async (text) => {
    try {
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: { text },
        [data.chatId + ".date"]: serverTimestamp(),
      });
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: { text },
        [data.chatId + ".date"]: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error updating userChats: ", err);
    }
  };

  return (
    <div className='input'>
      <input 
        type='text' 
        placeholder='Type Something...' 
        onChange={e => setText(e.target.value)} 
        value={text} 
      />
      <div className="send">
        <img src="image/attach.png" alt="Attach" />
        <input 
          type="file" 
          style={{ display: "none" }} 
          id="file" 
          onChange={e => setImg(e.target.files[0])} 
        />
        <label htmlFor='file'>
          <img src="image/img.png" alt="Upload" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Input;
