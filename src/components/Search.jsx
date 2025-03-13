import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    if (!username) {
      setErr(true);
      return;
    }

    setErr(false);
    setLoading(true);

    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setErr(true);
        setUser(null);
      } else {
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setErr(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), {
          messages: [],
          users: [currentUser.uid, user.uid],
        });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        // Update the selected user's userChats
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      setUser(null);
      setUsername("");
    }
  };

  return (
    <div className="search">
      <div className="searchform">
        <input
          type="text"
          placeholder="Find a user"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKey}
        />
      </div>

      {err && (
        <span
          style={{
            color: "red",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          User not found!
        </span>
      )}
      {loading && (
        <span
          style={{
            color: "gray",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          Loading...
        </span>
      )}

      {user && (
        <div className="userchat" onClick={handleSelect}>
          <img
            src={user?.photoURL || "default-avatar.png"}
            alt={user?.displayName || "User Avatar"}
          />
          <div className="userchatinfo">
            <span>{user?.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
