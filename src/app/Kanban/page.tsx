/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

type Task = { id: string; content: string };
type Column = { id: string; title: string; tasks: Task[] };

const initialData: Column[] = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      { id: "task-1", content: "Learn Next.js" },
      { id: "task-2", content: "Set up Tailwind" },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [{ id: "task-3", content: "Build Kanban Board" }],
  },
  {
    id: "completed",
    title: "Completed",
    tasks: [{ id: "task-4", content: "Learn TypeScript" }],
  },
];

type DragItem = {
  type: "TASK";
  taskId: string;
  fromColumnId: string;
  index: number;
};

const TaskCard: React.FC<{
  task: Task;
  index: number;
  columnId: string;
  moveTask: (
    fromColumnId: string,
    toColumnId: string,
    fromIndex: number,
    toIndex: number
  ) => void;
}> = ({ task, index, columnId, moveTask }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { type: "TASK", taskId: task.id, fromColumnId: columnId, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "TASK",
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (
        item.taskId === task.id &&
        item.fromColumnId === columnId &&
        item.index === index
      ) {
        return;
      }
      if (item.fromColumnId === columnId) {
        moveTask(columnId, columnId, item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100 p-4 mb-4 rounded-lg shadow-md cursor-grab select-none
        border border-gray-300 dark:border-gray-700
        transition-shadow duration-300
        hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-400
        ${isDragging ? "opacity-60" : "opacity-100"}`}
      style={{ userSelect: "none" }}
    >
      {task.content}
    </div>
  );
};

const ColumnComponent: React.FC<{
  column: Column;
  moveTask: (
    fromColumnId: string,
    toColumnId: string,
    fromIndex: number,
    toIndex: number
  ) => void;
  addTaskToColumn: (task: Task, toColumnId: string, toIndex: number) => void;
}> = ({ column, moveTask, addTaskToColumn }) => {
  const [, drop] = useDrop({
    accept: "TASK",
    drop: (item: DragItem, monitor: any) => {
      if (item.fromColumnId !== column.id) {
        addTaskToColumn(item as any, column.id, column.tasks.length);
      }
    },
  });

  return (
    <div
      ref={drop}
      className="bg-white dark:bg-black rounded-xl p-6 shadow-lg min-h-[250px] flex flex-col
        border border-gray-300 dark:border-gray-700
        transition-colors duration-300 hover:border-blue-500 dark:hover:border-blue-400"
    >
      <h2 className="text-xl font-bold mb-5 text-center text-gray-900 dark:text-gray-100">
        {column.title}
      </h2>
      <div className="flex-grow">
        {column.tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            columnId={column.id}
            moveTask={moveTask}
          />
        ))}
      </div>
    </div>
  );
};

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(initialData);
  const { theme, setTheme } = useTheme();

  const moveTask = useCallback(
    (
      fromColumnId: string,
      toColumnId: string,
      fromIndex: number,
      toIndex: number
    ) => {
      setColumns((prevColumns) => {
        const newColumns = [...prevColumns];

        const fromColIndex = newColumns.findIndex((c) => c.id === fromColumnId);
        const toColIndex = newColumns.findIndex((c) => c.id === toColumnId);

        if (fromColIndex === -1 || toColIndex === -1) return prevColumns;

        const fromCol = newColumns[fromColIndex];
        const toCol = newColumns[toColIndex];

        const fromTasks = [...fromCol.tasks];
        const toTasks =
          fromColumnId === toColumnId ? fromTasks : [...toCol.tasks];

        const [movedTask] = fromTasks.splice(fromIndex, 1);
        toTasks.splice(toIndex, 0, movedTask);

        newColumns[fromColIndex] = { ...fromCol, tasks: fromTasks };
        newColumns[toColIndex] = { ...toCol, tasks: toTasks };

        return newColumns;
      });
    },
    []
  );

  const addTaskToColumn = useCallback(
    (item: DragItem, toColumnId: string, toIndex: number) => {
      setColumns((prevColumns) => {
        const newColumns = [...prevColumns];

        const fromColIndex = newColumns.findIndex(
          (c) => c.id === item.fromColumnId
        );
        const toColIndex = newColumns.findIndex((c) => c.id === toColumnId);

        if (fromColIndex === -1 || toColIndex === -1) return prevColumns;

        const fromCol = newColumns[fromColIndex];
        const toCol = newColumns[toColIndex];

        if (item.fromColumnId === toColumnId) {
          return prevColumns;
        }

        const fromTasks = [...fromCol.tasks];
        const toTasks = [...toCol.tasks];

        const taskIndex = fromTasks.findIndex((t) => t.id === item.taskId);
        if (taskIndex === -1) return prevColumns;

        const [movedTask] = fromTasks.splice(taskIndex, 1);
        toTasks.splice(toIndex, 0, movedTask);

        newColumns[fromColIndex] = { ...fromCol, tasks: fromTasks };
        newColumns[toColIndex] = { ...toCol, tasks: toTasks };

        return newColumns;
      });
    },
    []
  );

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        
        <div
          className="min-h-screen bg-white dark:bg-black transition-colors duration-500 p-6"
          style={{
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          }}
        >
          <header className="flex justify-center mb-12 mt-10 max-w-5xl mx-auto">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
              Ticket Viesta
            </h1>
          </header>

          {/* Search + Buttons row */}
          <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-2 sm:px-4 mb-8 gap-4">
            {/* Search bar */}
            <input
              type="text"
              placeholder="Search tasks..."
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-1/3 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Buttons */}
            <div className="flex space-x-4">
              <Button
                // onClick={createTask}
                className="px-5 py-2 bg-muted text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                aria-label="Create Task"
              >
                Create
              </Button>
              <Button
                // onClick={deleteAllTasks}
                className="px-5 py-2 bg-muted text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
                aria-label="Delete All Tasks"
              >
                Delete All
              </Button>
            </div>
          </div>

          <main className="grid gap-6 md:grid-cols-3 max-w-7xl mx-auto px-2 sm:px-4">
            {columns.map((column) => (
              <ColumnComponent
                key={column.id}
                column={column}
                moveTask={moveTask}
                addTaskToColumn={addTaskToColumn}
              />
            ))}
          </main>
        </div>
      </DndProvider>
    </>
  );
};

export default KanbanBoard;
