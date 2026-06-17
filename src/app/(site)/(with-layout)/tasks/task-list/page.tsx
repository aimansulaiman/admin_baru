import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TaskHeader from "@/components/Tasks/TaskHeader";
import TaskList from "@/components/Tasks/TaskList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Task List Page",
};
const TaskListPage = async () => {
  return (
    <div className="mx-auto max-w-5xl">
      <Breadcrumb pageName="Task List" />

      <TaskHeader />
      <TaskList />
    </div>
  );
};

export default TaskListPage;
