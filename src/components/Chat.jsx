import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import Messages from "./Messages";
import Input from "./Input";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="Chat">
      <div className="chatinfo">
        <div style={{ display: "flex", alignItems: "center" }}>
          {data.user?.photoURL && (
            <img
              src={data.user.photoURL}
              alt="Profile"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: "10px",
              }}
            />
          )}
          <span
            style={{
              fontWeight: "700",
              fontSize: "25px",
              fontFamily: "'Times New Roman', Times, serif",
              textAlign: "left",
            }}
          >
            {data.user?.displayName || "Select a chat"}
          </span>
        </div>

        <div className="chaticons">
          <img src="/image/cam.png" alt="Camera" />
          <img src="/image/add.png" alt="Add" />
          <img src="/image/more.png" alt="More" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
