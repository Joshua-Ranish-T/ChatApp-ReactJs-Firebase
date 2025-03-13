import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(false);

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    // Validate input fields
    if (!displayName || !email || !password) {
      toast.warning("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      toast.warning("Password should be at least 6 characters.");
      return;
    }

    if (!file) {
      toast.warning("Please upload an avatar.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, and PNG files are allowed.");
      return;
    }

    try {
      // Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Upload avatar
      const storageRef = ref(storage, `avatars/${res.user.uid}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Upload error:", error);
          setErr("Failed to upload avatar. Please try again.");
          toast.error("Failed to upload avatar.");
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          try {
            // Update user profile and Firestore
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "userChats", res.user.uid), {});

            toast.success("Registration successful!");
            navigate("/");
          } catch (firestoreError) {
            console.error("Firestore error:", firestoreError);
            setErr("Failed to save user data. Please try again.");
            toast.error("Failed to save user data.");
          }
        }
      );
    } catch (authError) {
      console.error("Auth error:", authError);

      if (authError.code === "auth/email-already-in-use") {
        setErr("Email is already in use.");
        toast.error("Email is already in use.");
      } else if (authError.code === "auth/weak-password") {
        setErr("Password should be at least 6 characters.");
        toast.warning("Password should be at least 6 characters.");
      } else {
        setErr("Registration failed. Please try again.");
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <ToastContainer />
        <h1 className="logo">Create Account</h1>
        <p>Register your account below</p>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" aria-label="Enter your name" />
          <input
            type="email"
            placeholder="Email"
            aria-label="Enter your email"
          />
          <input
            type="password"
            placeholder="Password"
            aria-label="Enter your password"
          />
          <input type="file" style={{ display: "none" }} id="file1" />
          <label htmlFor="file1">
            <img src="image/add.png" alt="Upload avatar" />
            <span>Add an Avatar</span>
          </label>
          <button type="submit">Sign Up</button>
          {err && <span style={{ color: "red" }}>{err}</span>}
        </form>
        <p className="ppp">
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "whitesmoke",
              fontWeight: "700",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
