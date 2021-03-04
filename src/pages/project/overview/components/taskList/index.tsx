import { Droppable } from 'react-beautiful-dnd';
import { TaskInfo } from '@/pages/project/overview/data';
import React from 'react';
import Task from '@/pages/project/overview/components/task';

interface ListProps {
  taskList: TaskInfo[];
  title: string;
  projectId: number;
  listId: number;
}
const List: React.FC<ListProps> = props => {
  return (
    <Droppable droppableId={props.title} type={'LIST'}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            backgroundColor: snapshot.isDraggingOver
              ? 'rgba(5,122,255,.1)'
              : null,
            border: snapshot.isDraggingOver ? '2px dashed #057AFF' : null,
            borderRadius: 5,
            overflowY: 'auto',
            overflowAnchor: 'none',
            maxHeight: 600,
            minHeight: 300,
          }}
        >
          {props.taskList.map((item, index) => {
            return (
              <Task
                index={index}
                task={item}
                key={item.id}
                projectId={props.projectId}
                listId={props.listId}
              />
            );
          })}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default List;
