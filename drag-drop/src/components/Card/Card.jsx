import React, { useRef, useState } from "react";
import "./card.css";
import data from "../../data/data";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Card() {
  const [array, setArray] = useState(data);
  const [showMoreTasks, setShowMoreTasks] = useState({});
  const [dragging, setDragging] = useState(false);
  const [dragOverCard, setDragOverCard] = useState(null); // State to track the card being dragged over

  const dragItem = useRef();
  const dragNode = useRef();

  const handleDragStart = (e, taskName, cardId) => {
    console.log("hello", cardId);
    e.dataTransfer.setData("id", taskName);
    //update the info of the dragged task
    dragItem.current = { cardId, task: { name: taskName } };
    dragNode.current = e.target;
    // call handleDragEnd when dragging ends
    dragNode.current.addEventListener("dragend", handleDragEnd);
    setDragging(true);
  };

  //Refresh after drag ends
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
    if (!canDropOnCard(cardId, taskName)) {
      return;
    }
    const updatedData = array.map((card) => {
      if (card.id === cardId) {
        // if the task gets dropped to the same card return
        if (card.tasks.find((task) => task.name === taskName)) {
          return card;
        }
        // add the task to the new card
        return {
          ...card,
          tasks: [...card.tasks, { name: taskName }],
        };
      } else {
        // remove the task from the old card
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

    // get info about the draggedItem
    const currentItem = dragItem.current;

    const updatedArray = array.map((card) => {
      if (card.id === params.id) {
        const newTasks = [...card.tasks];
        //find the draggedItem index
        const dragItem = newTasks.findIndex(
          (task) => task.name === currentItem.task.name
        );

        if (!canDropOnCard(params.id, currentItem.task.name)) {
          return card;
        }

        if (dragItem !== -1) {
          newTasks.splice(dragItem, 1);
        }
        newTasks.splice(taskIndex, 0, currentItem.task);
        return { ...card, tasks: newTasks };
      }
      return card;
    });

    setArray(updatedArray);
  };

  const canDropOnCard = (cardId, taskName) => {
    if (cardId === "Even" && parseInt(taskName.replace("task", "")) % 2 !== 0) {
      return false;
    }
    return true;
  };

  //change the task style when dragging
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
  //change the card style when dragging
  const styleCard = (id) => {
    if (id === dragOverCard) {
      const draggedItem = dragItem.current;
      if (canDropOnCard(id, draggedItem.task.name)) {
        return {
          border: "2px solid white",
        };
      }
    }
    return null;
  };
  //when on clicked if setshowmoretasks is true make it false, if false make it true
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

        // if showmoretasks is true display all tasks, if false display only 5
        const displayTasks = showMoreTasks[id] ? tasks : tasks.slice(0, 6);

        return (
          <div
            key={id}
            className="card"
            style={dragging ? styleCard(id) : null}
          >
            <div className="header" style={{ backgroundColor: color }}>
              <div className="title">{id}</div>
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
                    className="listItem"
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
