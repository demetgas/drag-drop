import React, { useRef, useState } from "react";
import "./card.css";
import data from "../../data/data";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Card() {
  const [array, setArray] = useState(data);
  const [showMoreTasks, setShowMoreTasks] = useState({});
  const [dragging, setDragging] = useState(false);
  const [dragOverCard, setDragOverCard] = useState(null);

  const dragItem = useRef();
  const dragNode = useRef();

  const handleDragStart = (e, taskName, cardId) => {
    console.log("hello", cardId);
    e.dataTransfer.setData("id", taskName);
    dragItem.current = { cardId, task: { name: taskName } };
    dragNode.current = e.target;
    dragNode.current.addEventListener("dragend", handleDragEnd);
    setDragging(true);
  };

  const handleDragEnd = () => {
    console.log("bye");
    setDragging(false);
    setDragOverCard(null);
    if (dragNode.current) {
      dragNode.current.removeEventListener("dragend", handleDragEnd);
    }
    dragItem.current = null;
    dragNode.current = null;
  };

  const handleDrop = (e, cardId) => {
    const taskName = e.dataTransfer.getData("id");
    if (!checkEven(cardId, taskName)) {
      return;
    }
    const updatedData = array.map((card) => {
      if (card.id === cardId) {
        if (card.tasks.find((task) => task.name === taskName)) {
          return card;
        }
        return {
          ...card,
          tasks: [...card.tasks, { name: taskName }],
        };
      } else {
        return {
          ...card,
          tasks: card.tasks.filter((task) => task.name !== taskName),
        };
      }
    });

    setArray(updatedData);
  };

  const handleDragEnter = (params, taskIndex) => {
    console.log("Entering drag", params);
    setDragOverCard(params.id);

    const currentItem = dragItem.current;
    if (!checkEven(params.id, currentItem.task.name)) {
      return;
    }

    const updatedArray = array.map((card) => {
      if (card.id === params.id) {
        const newTasks = [...card.tasks];
        const dragItemIndex = newTasks.findIndex(
          (task) => task.name === currentItem.task.name
        );

        if (dragItemIndex !== -1) {
          newTasks.splice(dragItemIndex, 1);
        }

        newTasks.splice(taskIndex, 0, currentItem.task);
        return { ...card, tasks: newTasks };
      } else {
        return {
          ...card,
          tasks: card.tasks.filter(
            (task) => task.name !== currentItem.task.name
          ),
        };
      }
    });
    setArray(updatedArray);
  };

  const checkEven = (cardId, taskName) => {
    if (cardId === "Even" && parseInt(taskName.replace("task", "")) % 2 !== 0) {
      return false;
    }
    return true;
  };

  const styleTask = (taskName) => {
    const currentItem = dragItem.current;
    if (currentItem.task.name === taskName) {
      return {
        backgroundColor: "rgb(27, 28, 31, 0.1)",
        border: "none",
        color: "rgb(0, 0, 0, 0.2)",
        cursor: "pointer",
      };
    }
    return null;
  };
  const styleCard = (id) => {
    if (id === dragOverCard) {
      const draggedItem = dragItem.current;
      if (checkEven(id, draggedItem.task.name)) {
        return {
          border: "2px solid white",
        };
      }
    }
    return null;
  };
  const toggleShowMoreTasks = (id) => {
    setShowMoreTasks((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <div className="cardContainer">
      {array.map((arrayItem) => {
        const id = arrayItem.id;
        const tasks = arrayItem.tasks;
        const color = arrayItem.backgroundColor;

        const displayTasks = showMoreTasks[id] ? tasks : tasks.slice(0, 6);

        return (
          <div
            key={id}
            className="card"
            style={dragging ? styleCard(id) : null}
          >
            <div className="header" style={{ backgroundColor: color }}>
              <div className="title">
                {id}
              </div>
        {tasks.length > 0 ? 
        <div class="title">({ tasks.length} tasks)</div> : null}
            </div>
            <div
              className="list"
              onDrop={(e) => handleDrop(e, id)}
              onDragOver={(e) => e.preventDefault()}
            >
              {displayTasks.map((task, taskIndex) => (
                <div className="items" key={taskIndex}>
                  <div
                    key={taskIndex}
                    className={`listItem ${dragging ? "dragging" : ""}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.name, id)}
                    onDragEnter={
                      dragging
                        ? (e) => {
                            handleDragEnter({ id, task }, taskIndex);
                          }
                        : null
                    }
                    style={dragging ? styleTask(task.name) : null}
                  >
                    <FontAwesomeIcon className="icon" icon={faGripVertical} />
                    {task.name}
                  </div>
                </div>
              ))}
              {tasks.length > 6 && (
                <button className="btn" onClick={() => toggleShowMoreTasks(id)}>
                  {showMoreTasks[id] ? "Show Less" : "Load More"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
