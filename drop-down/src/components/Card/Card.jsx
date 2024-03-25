import React, { useState } from "react";
import "./card.css";
import data from "../../data/data";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function Card() {
  const [titleColors, setTitleColors] = useState({});
  const colors = ["#A54B4A", "#4A71A5", "#4AA561", "#A5A14A"];
  console.log("Title Colors:", titleColors);

  return (
    <div className="cardContainer">
      {data.map((item, index) => {
        const category = Object.keys(item)[0]; // Get the category (e.g., todo, pending, done)
        const tasks = item[category]; // Get the tasks for the category

        // Set color for this category if not already set
        if (!titleColors[category]) {
          setTitleColors((prevColors) => ({
            ...prevColors,
            [category]: colors[index % colors.length], // Get color from array based on index
          }));
        }
        const titleMap = {
          toDo: "To Do",
          pending: "Pending",
          done: "Done",
          even: "Even",
        };

        return (
          <div key={index} className="card">
            <div
              className="header"
              style={{ backgroundColor: titleColors[category] }}
            >
              <div className="title">{titleMap[category]}</div>
            </div>
            <DragDropContext>
              <Droppable droppableId={category} key={category}>
                {(provided) => (
                  <div
                    className="list"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {Object.values(tasks).map((task, index) => (
                      <Draggable
                        key={`${category}-${index}`}
                        draggableId={`${category}-${index}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="listItem"
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            {task}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            ;
          </div>
        );
      })}
    </div>
  );
}
