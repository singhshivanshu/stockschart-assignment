import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import CandleStick from "./CandleStick";
import Card from "react-bootstrap/Card";

function Historic() {
  const [data, setData] = useState([]);

  const fetchData = () => {
    axios({
      method: "get",
      url: "http://kaboom.rksv.net/api/historical",
      responseType: "json",
    })
      .then((data) => setData(data.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  function getParsedData(d) {
    const dataArray = d.split(",");
    const date = parseInt(dataArray[0]);
    const open = parseFloat(dataArray[1]);
    const high = parseFloat(dataArray[2]);
    const low = parseFloat(dataArray[3]);
    const close = parseFloat(dataArray[4]);
    const volume = parseFloat(dataArray[5]);
    return Object.assign({}, { date, open, high, low, close, volume });
  }
  let newData =
    data &&
    data
      .map((d) => getParsedData(d))
      .sort((a, b) => {
        return moment.utc(a.date).diff(moment.utc(b.date));
      })
      .map((value) => {
        const date = new Date(value.date);
        const updatedValue = Object.assign({}, value);
        updatedValue.date = date;
        return updatedValue;
      });

  return (
    <div style={{ marginTop: "100px"}}>
      <Card style={{ width: '100%' }} className= "container-card">
        <Card.Header>Historical Data</Card.Header>
        <Card.Body>
          <CandleStick data={newData} interval="day" width={900} />
        </Card.Body>
      </Card>
    </div>
  );
}

export default Historic;
