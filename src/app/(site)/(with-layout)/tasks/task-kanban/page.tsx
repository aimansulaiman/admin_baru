import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TaskHeader from "@/components/Tasks/TaskHeader";
import TaskKanban from "@/components/Tasks/TaskKanban";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Task Kanban Page",
};

export default async function Page() {
  return (
    <div className="mx-auto max-w-5xl">
      <Breadcrumb pageName="Task Kanban" />

      <TaskHeader />
      <TaskKanban />
    </div>
  );
}
