import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import CandleStick from "./CandleStick";
import Card from "react-bootstrap/Card";

function Live() {
  const [currentdata, setCurrentData] = useState([]);
  const socket = io("http://kaboom.rksv.net/watch");

  function getParsedData(d) {
    const dataArray = d.split(",");
    console.log(dataArray);
    const date = parseInt(dataArray[0]);
    const open = parseFloat(dataArray[1]);
    const high = parseFloat(dataArray[2]);
    const low = parseFloat(dataArray[3]);
    const close = parseFloat(dataArray[4]);
    const volume = parseFloat(dataArray[5]);
    return Object.assign({}, { date, open, high, low, close, volume });
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket connected");
    });

    socket.on("ping", () => {});

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    socket.on("pong", (data) => {
      console.log(data, " number of ms elapsed since ping packet.");
    });

    socket.subscribeData = () => {
      socket.emit("sub", { state: true });

      socket.on("data", (data, callback) => {
        setCurrentData((currentdata) => [...currentdata, getParsedData(data)]);
        const Acknowledgement = 1;
        callback(Acknowledgement);
      });

      socket.on("error", (err) => {
        console.log(err);
      });
    };

    socket.unSubscribeData = () => {
      socket.emit("unsub", { state: false });
    };

    socket.subscribeData();
  }, []);

  return (
    <div style={{ marginTop: "100px", marginBottom: "50px" }}>
      <Card style={{ width: "100%" }} className="conatiner-card">
        <Card.Header>Live Data</Card.Header>
        <Card.Body style={{ justifyContent: "center" }}>
          <CandleStick data={currentdata} interval="second" latest={50} />
        </Card.Body>
      </Card>
    </div>
  );
}
export default Live;
