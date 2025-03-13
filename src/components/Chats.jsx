import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, "userChats", currentUser.uid),
        (doc) => {
          setChats(doc.data() || {}); // Default to an empty object
          setLoading(false); // Set loading to false when data is received
        },
        (error) => {
          console.error("Error fetching chats: ", error);
          setLoading(false); // Set loading to false even on error
        }
      );

      return () => {
        unsub();
      };
    };

    if (currentUser?.uid) {
      getChats();
    }
  }, [currentUser?.uid]);

  const handleSelect = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  return (
    <div className="chats">
      {loading ? ( // Display loading state
        <p>Loading chats...</p>
      ) : (
        chats &&
        Object.entries(chats)
          .sort((a, b) => b[1].date?.toMillis() - a[1].date?.toMillis())
          .map(([chatId, chatData]) => (
            <div
              className="userchat"
              key={chatId}
              onClick={() => handleSelect(chatData.userInfo)}
            >
              {chatData.userInfo.photoURL ? ( // Ensure photoURL exists
                <img src={chatData.userInfo.photoURL} alt="User" />
              ) : (
                <img src="default-avatar.png" alt="Default User" /> // Fallback for missing photo
              )}
              <div className="userchatinfo">
                <span>{chatData.userInfo.displayName}</span>
                <p>{chatData.lastMessage?.text || "No messages yet"}</p>
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default Chats;
