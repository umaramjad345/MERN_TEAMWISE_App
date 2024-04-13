import React from "react";
import TaskCard from "./TaskCard";

const BoardView = ({ tasks, user }) => {
  return (
    <div className="w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10">
      {tasks?.map(
        (task, index) =>
          (task?.team?.some((member) => member._id === user._id) ||
            user.isAdmin) && <TaskCard task={task} key={index} />
      )}
    </div>
  );
};

export default BoardView;
