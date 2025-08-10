/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useCallback, useMemo } from "react";
import { DndProvider, useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
  onEditClick: (columnId: string, task: Task) => void;
  onDeleteClick: (columnId: string, taskId: string) => void;
}> = ({ task, index, columnId, moveTask, onEditClick, onDeleteClick }) => {
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
      <div className="flex justify-between items-center">
        <span>{task.content}</span>
        <div className="flex space-x-2">
          <Button
            onClick={() => onEditClick(columnId, task)}
            variant="ghost"
            size="sm"
            aria-label="Edit Task"
          >
            ✏️
          </Button>
          <Button
            onClick={() => onDeleteClick(columnId, task.id)}
            variant="ghost"
            size="sm"
            aria-label="Delete Task"
          >
            🗑️
          </Button>
        </div>
      </div>
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
  addTaskToColumn: (
    item: DragItem,
    toColumnId: string,
    toIndex: number
  ) => void;
  onEditClick: (columnId: string, task: Task) => void;
  onDeleteClick: (columnId: string, taskId: string) => void;
  filteredTasks: Task[];
}> = ({
  column,
  moveTask,
  addTaskToColumn,
  onEditClick,
  onDeleteClick,
  filteredTasks,
}) => {
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
      <div className="flex-grow overflow-auto">
        {filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No tasks found.
          </p>
        ) : (
          filteredTasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              columnId={column.id}
              moveTask={moveTask}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog states for create/edit/delete
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // New task content for create dialog
  const [newTaskContent, setNewTaskContent] = useState("");

  // Task being edited
  const [editTask, setEditTask] = useState<{
    columnId: string;
    task: Task;
  } | null>(null);
  const [editTaskContent, setEditTaskContent] = useState("");

  // Task being deleted
  const [deleteTask, setDeleteTask] = useState<{
    columnId: string;
    taskId: string;
  } | null>(null);

  const { theme, setTheme } = useTheme();

  // Move task - same as before
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

  // Add task to column - same as before
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

  // Open create dialog
  const openCreateDialog = () => {
    setNewTaskContent("");
    setCreateOpen(true);
  };

  // Confirm create
  const handleCreateTask = () => {
    if (newTaskContent.trim() === "") {
      alert("Please enter a task content.");
      return;
    }
    const newTask: Task = {
      id: `task-${Date.now()}`,
      content: newTaskContent.trim(),
    };
    setColumns((prev) =>
      prev.map((col) =>
        col.id === "todo" ? { ...col, tasks: [newTask, ...col.tasks] } : col
      )
    );
    setCreateOpen(false);
  };

  // Open edit dialog
  const openEditDialog = (columnId: string, task: Task) => {
    setEditTask({ columnId, task });
    setEditTaskContent(task.content);
    setEditOpen(true);
  };

  // Confirm edit
  const handleEditTask = () => {
    if (!editTask) return;
    if (editTaskContent.trim() === "") {
      alert("Task content cannot be empty!");
      return;
    }
    setColumns((prev) =>
      prev.map((col) =>
        col.id === editTask.columnId
          ? {
              ...col,
              tasks: col.tasks.map((task) =>
                task.id === editTask.task.id
                  ? { ...task, content: editTaskContent.trim() }
                  : task
              ),
            }
          : col
      )
    );
    setEditOpen(false);
    setEditTask(null);
  };

  // Open delete dialog
  const openDeleteDialog = (columnId: string, taskId: string) => {
    setDeleteTask({ columnId, taskId });
    setDeleteOpen(true);
  };

  // Confirm delete task
  const handleDeleteTask = () => {
    if (!deleteTask) return;
    setColumns((prev) =>
      prev.map((col) =>
        col.id === deleteTask.columnId
          ? {
              ...col,
              tasks: col.tasks.filter((task) => task.id !== deleteTask.taskId),
            }
          : col
      )
    );
    setDeleteOpen(false);
    setDeleteTask(null);
  };

  // Delete all tasks dialog
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);

  const handleDeleteAllTasks = () => {
    setColumns((prev) => prev.map((col) => ({ ...col, tasks: [] })));
    setDeleteAllOpen(false);
  };

  // Filter tasks for search
  const filteredColumns = useMemo(() => {
    if (!searchTerm.trim()) return columns;

    const lower = searchTerm.toLowerCase();

    return columns.map((col) => ({
      ...col,
      tasks: col.tasks.filter((task) =>
        task.content.toLowerCase().includes(lower)
      ),
    }));
  }, [columns, searchTerm]);

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
              Task Viesta
            </h1>
          </header>

          {/* Search + Buttons row */}
          <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-2 sm:px-4 mb-8 gap-4">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-1/3 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex space-x-4">
              <Button onClick={openCreateDialog} aria-label="Create Task">
                Create Task
              </Button>
              <Button
                onClick={() => setDeleteAllOpen(true)}
                variant="destructive"
                aria-label="Delete All Tasks"
              >
                Delete All
              </Button>
            </div>
          </div>

          <main className="grid gap-6 md:grid-cols-3 max-w-7xl mx-auto px-2 sm:px-4">
            {filteredColumns.map((column) => (
              <ColumnComponent
                key={column.id}
                column={column}
                moveTask={moveTask}
                addTaskToColumn={addTaskToColumn}
                onEditClick={openEditDialog}
                onDeleteClick={openDeleteDialog}
                filteredTasks={column.tasks}
              />
            ))}
          </main>
        </div>
      </DndProvider>

      {/* Create Task Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Enter content for the new task
            </DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateTask();
            }}
            className="mt-2"
            placeholder="Task content"
          />
          <DialogFooter className="space-x-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateTask}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Edit the content of the task</DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            value={editTaskContent}
            onChange={(e: any) => setEditTaskContent(e.target.value)}
            onKeyDown={(e: any) => {
              if (e.key === "Enter") handleEditTask();
            }}
            className="mt-2"
            placeholder="Task content"
          />
          <DialogFooter className="space-x-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditTask}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Task Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="space-x-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteTask}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete All Tasks Dialog */}
      <Dialog open={deleteAllOpen} onOpenChange={setDeleteAllOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete All Tasks</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete ALL tasks from all columns? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="space-x-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteAllTasks}>
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KanbanBoard;
