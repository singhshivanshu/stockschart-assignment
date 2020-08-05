import React from "react";
import Historic from "./components/Historic";
import Live from "./components/Live";

function Home() {
  return (
    <div style={{display: 'grid', justifyContent: 'center'}}>
      <Historic />
      <Live />
    </div>
  );
}
export default Home;
