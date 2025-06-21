import React, { useState } from "react";
import Auth from "./components/Auth";
import Tweets from "./components/Tweets";

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>LafOlsun</h1>
      <Auth onUserChange={setUser} />
      {user && <Tweets />}
    </div>
  );
}
