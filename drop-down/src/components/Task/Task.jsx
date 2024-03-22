import React from "react";
import "./task.css";
import data from "../../data/data";

export default function Task(props) {
  return (
    <div className="cardContainer">
      {data.map((item, index) => {
        const category = Object.keys(item)[0]; // Get the category (e.g., todo, pending, done)
        const tasks = item[category]; // Get the tasks for the category

        return (
          <div key={index} className="card">
            <div className="header">
              <div className="title">{category}</div>
            </div>
            <div className="list">
              {Object.values(tasks).map((task, index) => (
                <div key={index} className="listItem">
                  {task}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
