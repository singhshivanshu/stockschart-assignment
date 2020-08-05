import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import CandleStick from "./CandleStick";
import Card from "react-bootstrap/Card";
import {getParsedData} from '../utils/utils'

function Live() {
  const [currentdata, setCurrentData] = useState([]);
  
  const socket = io("https://kaboom.rksv.net/watch");

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
      <Card style={{ width: "100%" }} className="container-card">
        <Card.Header>Live Data</Card.Header>
        <Card.Body style={{ justifyContent: "center" }}>
          <CandleStick data={currentdata} interval="second" latest={50} />
        </Card.Body>
      </Card>
    </div>
  );
}
export default Live;
