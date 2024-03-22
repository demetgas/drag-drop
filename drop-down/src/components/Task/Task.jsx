import React from "react";
import "./task.css";

export default function Task(props) {
  return (
    <div>
      <div className="card">
        <div className="header">
          <div className="title">Title</div>
        </div>
        <div className="list">
          <div className="listItem">Task1</div>
          <div className="listItem">Task2</div>
          <div className="listItem">Task3</div>
          <div className="listItem">Task4</div>{" "}
        </div>
      </div>
    </div>
  );
}
