import React from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import styles from './index.less';
import Columns from '@/pages/project/overview/components/columns';
import { ColumnsInfo } from '../../data';
import { connect, Dispatch } from 'umi';
import {updateListSort} from '@/pages/project/overview/service';

interface BoardProps {
  dataSource: ColumnsInfo[]
  projectId: number
  dispatch: Dispatch
}

const Board: React.FC<BoardProps> = (props) => {
  const dragEndHandler = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    console.log(result);
    const newList = [...props.dataSource];
    if (result.type == 'LIST') {
      const [deleteTask] = newList.find(item => item.title == source.droppableId).taskList.splice(source.index, 1);
      newList.find(item => item.title == destination.droppableId).taskList.splice(destination.index, 0, deleteTask);
    } else {
      const startId = newList[source.index].id
      const endId = newList[destination.index].id
      const res = await updateListSort(props.projectId,startId,endId)
      if (res.status !==1){
        return
      }
      const [deleteList] = newList.splice(source.index, 1);
      newList.splice(destination.index, 0, deleteList);
    }
    props.dispatch({
      type: 'overview/setColumnsList',
      payload: newList,
    });
  };

  const renderChildren = () => {
    return props.dataSource.map((item, index) => {
      return <Columns
        columns={item}
        index={index}
        key={item.id}
        projectId={props.projectId}
      />;
    });
  };

  return (
    <DragDropContext
      onDragEnd={dragEndHandler}
    >
      <Droppable droppableId="board" direction={'horizontal'} type={'BOARD'}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            className={styles.board}
            {...provided.droppableProps}
          >
            {renderChildren()}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const mapStateToProps = (state) => {
  return {
    dataSource: state.overview.columnsList,
  };
};

export default connect(mapStateToProps)(Board);
