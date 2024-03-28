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
    dragItem.current = { ...params, task: { name: taskName } };
    dragNode.current = e.target;
    dragNode.current.addEventListener("dragend", handleDragEnd);
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const getStyles = (params, taskName) => {
    const currentItem = dragItem.current;
    if (currentItem && currentItem.task && currentItem.task.name === taskName) {
      return {
        backgroundColor: "rgb(192, 196, 209)",
        color: "transparent",
      };
    }
    return null;
  };

  const handleDragEnter = (e, taskName, params) => {
    console.log("Entering drag", params);
    if (e.target !== dragNode.current) {
      console.log("Target is not the same");
    }
  };

  const handleDragEnd = () => {
    console.log("bye");
    setDragging(false);
    if (dragNode.current) {
      dragNode.current.removeEventListener("dragend", handleDragEnd);
    }
    dragItem.current = null;
    dragNode.current = null;
  };
  const handleDrop = (e, newTitleId) => {
    const taskId = e.dataTransfer.getData("id");
    const taskNumber = parseInt(taskId.replace("task", ""));
    if (newTitleId === "Even" && taskNumber % 2 !== 0) {
      return;
    }

    const updatedData = array.map((titleName) => {
      if (titleName.id === newTitleId) {
        // if the task gets dropped to the same card return
        if (titleName.tasks.find((task) => task.name === taskId)) {
          return titleName;
        }
        // add the task to the new card
        return {
          ...titleName,
          tasks: [...titleName.tasks, { name: taskId }],
        };
      } else {
        // remove the task from the old card
        return {
          ...titleName,
          tasks: titleName.tasks.filter((task) => task.name !== taskId),
        };
      }
    });

    setArray(updatedData);
  };

  //when on clicked if setshowmoretasks is true make it false, if false make it true
  const toggleShowMoreTasks = (titleNameId) => {
    setShowMoreTasks((prevState) => ({
      ...prevState,
      [titleNameId]: !prevState[titleNameId],
    }));
  };

  return (
    <div className="cardContainer">
      {array.map((arrayItem, index, backgroundColor) => {
        const id = arrayItem.id;
        const tasks = arrayItem.tasks;
        const color = arrayItem.backgroundColor;

        // if showmoretasks is true display all tasks, if false display only 5
        const displayTasks = showMoreTasks[id] ? tasks : tasks.slice(0, 5);

        return (
          <div key={index} className="card">
            <div className="header" style={{ backgroundColor: color }}>
              <div className="title">{id}</div>
            </div>
            <div
              className="list"
              onDrop={(e) => handleDrop(e, id)}
              onDragOver={(e) => e.preventDefault()}
            >
              {displayTasks.map((task, taskIndex) => (
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
                          handleDragEnter(e, task.name, { id, task });
                        }
                      : null
                  }
                  style={dragging ? getStyles({ id, tasks }, task.name) : null}
                >
                  {task.name}
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
