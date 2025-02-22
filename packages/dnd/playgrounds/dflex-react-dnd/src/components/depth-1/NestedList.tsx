import React from "react";

import s from "../Demo.module.css";
import DnDComponent from "../DnDComponent";

const NestedList = () => {
  const tasksWork = {
    category: "Work",
    id: "nested-work",
    depth: 1,
    todo: [
      { id: "nested-mtg-1", task: "Boring mtg", depth: 0 },
      { id: "nested-mtg-2", task: "Another boring mtg", depth: 0 },
    ],
  };

  const taskLife = {
    category: "Life",
    id: "nested-life",
    depth: 1,
    todo: [
      { id: "nested-gym", task: "Hit the gym", depth: 0 },
      { id: "nested-netflix", task: "Finish eps 120", depth: 0 },
    ],
  };

  return (
    <div className={s.root}>
      <div className={`${s.todo} ${s.nested}`}>
        <DnDComponent
          Component="div"
          id={tasksWork.id}
          depth={1}
          className={s.todo}
        >
          <p>{tasksWork.category}</p>
          <ul>
            {tasksWork.todo.map(({ task, id }) => (
              <DnDComponent id={id} key={id}>
                {task}
              </DnDComponent>
            ))}
          </ul>
        </DnDComponent>
        <DnDComponent
          Component="div"
          id={taskLife.id}
          depth={1}
          className={s.todo}
        >
          <p>{taskLife.category}</p>
          <ul>
            {taskLife.todo.map(({ task, id }) => (
              <DnDComponent id={id} key={id}>
                {task}
              </DnDComponent>
            ))}
          </ul>
        </DnDComponent>
      </div>
    </div>
  );
};

export default NestedList;
