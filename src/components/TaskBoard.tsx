import React from 'react';
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import Column from './Column';
import { Task, Status } from '../utils/types';
import { COLUMNS } from '../utils/columns';
import TableView from './TableView';

interface TaskBoardProps {
  tasks: Task[];
  showTable: boolean;
  onTaskMove: (taskId: string, status: Status) => void;
  onInspect: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  showTable,
  onTaskMove,
  onInspect,
  onDelete,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        tolerance: 5,
        delay: 150
      }
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => (t._id || t.id) === active.id);
    if (!activeTask) return;

    const overId = over.id as string;
    const isColumn = COLUMNS.some((c) => c.id === overId);
    let destColumn: Status | null = null;

    if (isColumn) {
      destColumn = overId as Status;
    } else {
      const overTask = tasks.find((t) => (t._id || t.id) === overId);
      destColumn = (overTask?.status || activeTask.status) as Status;
    }

    if (destColumn && activeTask.status !== destColumn) {
      onTaskMove(activeTask._id || activeTask.id, destColumn);
    }
  };

  if (showTable) {
    return (
      <div className="flex-1 overflow-y-auto px-1">
        <TableView
          tasks={tasks}
          onInspect={onInspect}
          onDelete={onDelete}
        />
      </div>
    );
  }

  const byColumn = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter(t => t.status === col.id);
    return acc;
  }, {} as Record<Status, Task[]>);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 flex-1">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex flex-col h-full">
            <Column
              id={col.id}
              title={col.title}
              color={col.color}
              tasks={byColumn[col.id]}
              onInspect={onInspect}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>
      <DragOverlay />
    </DndContext>
  );
};

export default TaskBoard;
