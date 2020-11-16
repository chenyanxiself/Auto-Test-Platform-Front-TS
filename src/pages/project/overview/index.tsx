import React from 'react'
import { DragDropContext , Draggable, Droppable } from 'react-beautiful-dnd';


export default (props)=>{

  return (
    <DragDropContext
      onDragStart={()=>{}}
      onDragUpdate={()=>{}}
      onDragEnd={()=>{}}
    >
      <Droppable droppableId="board" direction={'horizontal'}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={{display:'flex' }}
            {...provided.droppableProps}
          >
            <Draggable draggableId="draggable-1" index={0}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <h4 style={{backgroundColor:'#EBECF0'}}>My draggable</h4>
                </div>
              )}
            </Draggable>
            <Draggable draggableId="draggable-2" index={1}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <h4>My draggable</h4>
                </div>
              )}
            </Draggable>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
