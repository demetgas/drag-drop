import React from "react";
import Task from "../Task/Task";
import "./card.css";
export default function Card(props) {
  return (
    <div>
      <div className="card">
        <Task />
      </div>
    </div>
  );
}
