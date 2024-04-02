import React, { useRef, useState } from "react";
import "./card.css";
import data from "../../data/data";

export default function Card() {
  const [array, setArray] = useState(data);
  const [showMoreTasks, setShowMoreTasks] = useState({});
  const [dragging, setDragging] = useState(false);

  const dragItem = useRef();
  const dragNode = useRef();

  const handleDragStart = (e, taskName, params) => {
    console.log("hello", params);
    e.dataTransfer.setData("id", taskName);
    //update the info of the dragged task
    dragItem.current = { ...params, task: { name: taskName } };
    //update the dragged item
    dragNode.current = e.target;
    // call handleDragEnd when dragging ends
    dragNode.current.addEventListener("dragend", handleDragEnd);
    setDragging(true);
  };

  const handleDrop = (e, newTitleId) => {
    const taskName = e.dataTransfer.getData("id");
    const taskNumber = parseInt(taskName.replace("task", ""));
    if (newTitleId === "Even" && taskNumber % 2 !== 0) {
      return;
    }

    const updatedData = array.map((titleName) => {
      if (titleName.id === newTitleId) {
        // if the task gets dropped to the same card return
        if (titleName.tasks.find((task) => task.name === taskName)) {
          return titleName;
        }
        // add the task to the new card
        return {
          ...titleName,
          tasks: [...titleName.tasks, { name: taskName }],
        };
      } else {
        // remove the task from the old card
        return {
          ...titleName,
          tasks: titleName.tasks.filter((task) => task.name !== taskName),
        };
      }
    });

    setArray(updatedData);
  };

  //Refresh after drag ends
  const handleDragEnd = () => {
    console.log("bye");
    setDragging(false);
    if (dragNode.current) {
      dragNode.current.removeEventListener("dragend", handleDragEnd);
    }
    dragItem.current = null;
    dragNode.current = null;
  };

  //change the style when dragging
  const getStyles = (params, taskName) => {
    const currentItem = dragItem.current;
    if (currentItem.task.name === taskName) {
      return {
        backgroundColor: "rgb(27, 28, 31, 0.1)",
        border: "none",
        color: "rgb(0, 0, 0, 0.2)",
      };
    }
    return null;
  };

  //check if current task and target task is the same
  const handleDragEnter = (e, taskName, params, taskIndex) => {
    console.log("Entering drag", params);
    // get info about the draggedItem
    const currentItem = dragItem.current;

    const updatedArray = array.map((title) => {
      if (title.id === params.id) {
        const newTasks = [...title.tasks];
        //find the draggedItem index
        const dragItem = newTasks.findIndex(
          (task) => task.name === currentItem.task.name
        );

        // Check if the odd task is being dropped into Even card
        if (
          params.id === "Even" &&
          parseInt(currentItem.task.name.replace("task", "")) % 2 !== 0
        ) {
          return title;
        }

        // remove the dragged task
        if (dragItem !== -1) {
          newTasks.splice(dragItem, 1);
        }
        // Insert the task at the new position
        newTasks.splice(taskIndex, 0, currentItem.task);
        return { ...title, tasks: newTasks };
      }
      return title;
    });

    setArray(updatedArray);
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
        const displayTasks = showMoreTasks[id] ? tasks : tasks.slice(0, 5);

        return (
          <div key={id} className="card">
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
                    onDragStart={(e) =>
                      handleDragStart(e, task.name, { id, task })
                    }
                    onDragEnter={
                      dragging
                        ? (e) => {
                            handleDragEnter(
                              e,
                              task.name,
                              { id, task },
                              taskIndex
                            );
                          }
                        : null
                    }
                    style={
                      dragging ? getStyles({ id, tasks }, task.name) : null
                    }
                  >
                    {task.name}
                  </div>
                  {dragging && dragItem.current.task.name === task.name && (
                    <div className="line"></div>
                  )}
                </div>
              ))}
              {tasks.length > 5 && (
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
