import React, { useEffect } from 'react';
import Board from '@/pages/project/overview/components/board';
import { connect } from 'umi';
import { getTaskByCondition } from '@/pages/project/overview/service';
import { message } from 'antd';


const Overview = (props) => {
  const projectId = parseInt(props.match.params.id);
  const getData = async () => {
    const res = await getTaskByCondition(projectId);
    if (res.status == 1) {
      props.dispatch({
        type: 'overview/setColumnsList',
        payload: res.data,
      });
    } else {
      message.warning(res.error);
    }
  };

  useEffect(() => {
    getData();
  }, [props.trigger]);

  return (
    <Board projectId={projectId}/>
  );
};

const mapStateToProps = (state) => {
  return {
    dataSource: state.overview.columnsList,
    trigger: state.overview.trigger,
  };
};
export default connect(mapStateToProps)(Overview);
