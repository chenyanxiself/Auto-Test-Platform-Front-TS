import React from 'react';
import {
  DragDropContext,
  Droppable,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd';
import styles from './index.less';
import Columns from '@/pages/project/overview/components/columns';
import { ColumnsInfo } from '../../data';
import { connect, Dispatch } from 'umi';
import {
  updateListSort,
  updateTaskSort,
} from '@/pages/project/overview/service';
import { message } from 'antd';

interface BoardProps {
  dataSource: ColumnsInfo[];
  projectId: number;
  dispatch: Dispatch;
}

const Board: React.FC<BoardProps> = props => {
  const dragEndHandler = async (result: DropResult) => {
    console.log(result);
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

    const newList = Array.from(props.dataSource);
    let res;
    if (result.type === 'LIST') {
      const startList = newList.find(item => item.title == source.droppableId);
      const endList = newList.find(
        item => item.title == destination.droppableId,
      );
      const startListId = startList.id;
      const endListId = endList.id;
      const [deleteTask] = startList.taskList.splice(source.index, 1);
      let afterId;
      if (endList.taskList.length == 0) {
        afterId = null;
      } else if (destination.index == endList.taskList.length) {
        afterId = null;
      } else {
        afterId = endList.taskList[destination.index].id;
      }
      let beforeId;
      if (endList.taskList.length == 0) {
        beforeId = null;
      } else if (destination.index == 0) {
        beforeId = null;
      } else {
        beforeId = endList.taskList[destination.index - 1].id;
      }
      endList.taskList.splice(destination.index, 0, deleteTask);
      props.dispatch({
        type: 'overview/setColumnsList',
        payload: newList,
      });
      res = await updateTaskSort(
        props.projectId,
        startListId,
        endListId,
        deleteTask.id,
        beforeId,
        afterId,
      );
    } else {
      const [deleteList] = newList.splice(source.index, 1);
      newList.splice(destination.index, 0, deleteList);
      props.dispatch({
        type: 'overview/setColumnsList',
        payload: newList,
      });
      // res = await updateListSort(props.projectId, source.index, destination.index);
    }
    if (res.status !== 1) {
      message.warning(res.error);
    }
  };

  const renderChildren = () => {
    return props.dataSource.map((item, index) => {
      return (
        <Columns
          column={item}
          index={index}
          key={item.id}
          projectId={props.projectId}
        />
      );
    });
  };

  return (
    <DragDropContext onDragEnd={dragEndHandler}>
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

const mapStateToProps = state => {
  return {
    dataSource: state.overview.columnsList,
  };
};

export default connect(mapStateToProps)(Board);
