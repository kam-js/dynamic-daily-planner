"use client";
import AddTask from "@/components/AddTask";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { useState } from "react";

export default function Home() {
  const tasks: string[] = ["test", "test2"];
  const [taskList, setTaskList] = useState(tasks);
  return (
    <>
      <TaskList tasks={taskList} />
    </>
  );
}
