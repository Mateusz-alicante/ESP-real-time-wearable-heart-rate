"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";

import BoardConnect from "./Components/BaordConnect/BoardConnect";
import BoardLoader from "./Components/BaordConnect/Loader";

import Home from "./Components/Home/Home";

export default function MainPage() {
  const [boardReady, setBoardReady] = useState(false);
  const [connected, setConnected] = useState(false);
  const [emergency, setEmergency] = useState(false);

  const [data, setData] = useState([]);

  useEffect(() => {
    registerDevice();
  }, []);

  const registerDevice = () => {
    const ws = new WebSocket("ws://192.168.39.73:8080");
    //const ws = new WebSocket("ws://localhost:8080");

    console.log("registering client....");

    ws.onopen = (event) => {
      ws.send("register: client");
    };

    ws.onmessage = (message) => {
      console.log("received message: %s", message.data);
      if (message.data == "board ready") {
        setBoardReady(true);
      }

      if (message.data.slice(0, 6) == "data: ") {
        console.log(message);
        setData((data) => {
          if (data.length > 50) {
            data.shift();
          }

          return data.concat({
            time: new Date().getTime(),
            rate: parseInt(message.data.slice(6)),
          });
        });
      }

      if (message.data == "emergency") {
        console.log("emergency!");
        setEmergency(true);
      }
    };
  };

  return (
    <main>
      <div className={styles.centerContainer}>
        {connected ? (
          <Home data={data} emergency={emergency} />
        ) : (
          <>
            <h1>Connect to a device</h1>
            {boardReady ? (
              <BoardConnect setConnected={setConnected} />
            ) : (
              <BoardLoader />
            )}
          </>
        )}
      </div>
    </main>
  );
}
