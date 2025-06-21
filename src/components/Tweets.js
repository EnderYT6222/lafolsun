import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

export default function Tweets() {
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState("");

  useEffect(() => {
    const q = query(collection(db, "tweets"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tweetsArr = [];
      querySnapshot.forEach((doc) =>
        tweetsArr.push({ id: doc.id, ...doc.data() })
      );
      setTweets(tweetsArr);
    });
    return () => unsubscribe();
  }, []);

  const sendTweet = async () => {
    if (!auth.currentUser) {
      alert("Önce giriş yap!");
      return;
    }
    if (newTweet.trim() === "") return;

    await addDoc(collection(db, "tweets"), {
      userId: auth.currentUser.uid,
      content: newTweet,
      timestamp: serverTimestamp(),
      likes: 0,
      retweets: 0,
    });
    setNewTweet("");
  };

  return (
    <div>
      <textarea
        rows={3}
        placeholder="Lafını buraya yaz..."
        value={newTweet}
        onChange={(e) => setNewTweet(e.target.value)}
      ></textarea>
      <br />
      <button onClick={sendTweet}>Gönder</button>

      <hr />
      {tweets.length === 0 && <p>Henüz tweet yok.</p>}
      {tweets.map((tweet) => (
        <div key={tweet.id} style={{ borderBottom: "1px solid #ccc", margin: "10px 0" }}>
          <p>{tweet.content}</p>
          <small>
            {new Date(tweet.timestamp?.seconds * 1000).toLocaleString() || "Zaman yok"}
          </small>
        </div>
      ))}
    </div>
  );
}
