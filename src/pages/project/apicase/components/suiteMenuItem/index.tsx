import { Dropdown, Input, Menu, message, Modal } from 'antd';
import { EllipsisOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { SuiteInfo } from '@/pages/project/apicase/data';
import { updateApiCaseSuite } from '@/pages/project/apicase/service';
import { useParams } from 'umi';
const { confirm } = Modal;

interface SuiteMenuItemProps {
  suite: SuiteInfo;
  onAfterSuiteUpdate: (id: number, method: 'update' | 'delete') => void;
}

const SuiteMenuItem: React.FC<SuiteMenuItemProps> = props => {
  const [iconDisplay, setIconDisplay] = useState(false);
  const [editable, setEditable] = useState(false);
  const params = useParams<any>();
  const projectId = params.id;
  const inputRef = useRef();

  const menuClickHandler = ({ item, key, keyPath, domEvent }) => {
    domEvent.stopPropagation();
    if (key === 'rename') {
      setEditable(true);
    } else if (key == 'delete') {
      deleteHandler();
    }
  };

  useEffect(() => {
    if (editable === true) {
      // @ts-ignore
      inputRef.current.select();
    }
  }, [editable]);

  const extraMenu = (
    <Menu onClick={menuClickHandler}>
      <Menu.Item key="rename" className={styles.menuItem}>
        <EditOutlined />
        Rename
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" className={styles.menuItem}>
        <DeleteOutlined />
        Delete
      </Menu.Item>
    </Menu>
  );

  const saveHandler = async e => {
    if (e.target.value !== props.suite.title) {
      let resData = await updateApiCaseSuite(
        props.suite.id,
        projectId,
        e.target.value,
        null,
      );
      if (resData.status !== 1) {
        message.warning(resData.error);
        return Promise.reject(resData.error);
      } else {
        message.success('更新成功');
        props.onAfterSuiteUpdate(props.suite.id, 'update');
      }
    }
    setEditable(false);
  };

  const deleteHandler = async () => {
    confirm({
      title: '是否确认删除?',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      maskClosable: true,
      onOk: async () => {
        let resData = await updateApiCaseSuite(
          props.suite.id,
          projectId,
          null,
          1,
        );
        if (resData.status !== 1) {
          message.warning(resData.error);
          return Promise.reject(resData.error);
        } else {
          message.success('删除集合成功');
          props.onAfterSuiteUpdate(props.suite.id, 'delete');
        }
      },
    });
  };

  return (
    <div
      className={styles.main}
      onMouseOver={() => setIconDisplay(true)}
      onMouseLeave={() => setIconDisplay(false)}
    >
      {editable ? (
        <Input
          defaultValue={props.suite.title}
          className={styles.titleInput}
          ref={inputRef}
          onBlur={saveHandler}
          onPressEnter={saveHandler}
        />
      ) : (
        <div className={styles.title}>{props.suite.title}</div>
      )}
      {iconDisplay ? (
        <div className={styles.extra}>
          <Dropdown overlay={extraMenu} trigger={['click']}>
            <EllipsisOutlined
              style={{ fontSize: 22 }}
              onClick={e => e.stopPropagation()}
            />
          </Dropdown>
        </div>
      ) : null}
    </div>
  );
};

export default SuiteMenuItem;
