import React, { useState, useEffect } from "react";
import { auth, provider } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export default function Auth({ onUserChange }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      onUserChange(currentUser);
    });
    return () => unsubscribe();
  }, [onUserChange]);

  const handleEmailLogin = async () => {
    setError("");
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (user)
    return (
      <div>
        <p>Hoşgeldin, {user.email}</p>
        <button onClick={handleLogout}>Çıkış Yap</button>
      </div>
    );

  return (
    <div>
      <h3>{isRegister ? "Kayıt Ol" : "Giriş Yap"}</h3>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleEmailLogin}>
        {isRegister ? "Kayıt Ol" : "Giriş Yap"}
      </button>
      <button onClick={handleGoogleLogin}>Google ile Giriş</button>
      <p
        style={{ cursor: "pointer", color: "blue" }}
        onClick={() => setIsRegister(!isRegister)}
      >
        {isRegister ? "Zaten hesabın var mı? Giriş yap" : "Hesap oluştur"}
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
