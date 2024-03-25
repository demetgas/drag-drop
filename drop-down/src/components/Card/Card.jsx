import React from "react";
import Task from "../Task/Task";
import "./card.css";
import { DragDropContext } from "react-beautiful-dnd";
export default function Card(props) {
  return (
    <div className="container">
      <div className="card">
        <DragDropContext>
          <Task />
        </DragDropContext>
      </div>
    </div>
  );
}
