import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import RequestArgs from './RequestArgs';


interface RequestArgsModalProps {
  value: any
  onChange: (value: any) => void
}

const RequestArgsModal: React.FC<Partial<RequestArgsModalProps>> = ({ value, onChange }) => {
  const [visible, setVisible] = useState(false);
  const ref = React.useRef(null);
  const okHandler = () => {
    var changedValue = ref.current.getDataSource();
    if (onChange) {
      onChange(changedValue);
    }
    setVisible(false);
  };
  const getRequestArgs = () => {
    var initeValue;
    if (value) {
      initeValue = Object.keys(value).map((item, index) => {
          return {
            key: index,
            arg: item,
            value: value[item],
          };
        },
      );
    } else {
      initeValue = [];
    }
    initeValue.push({ key: initeValue.length, arg: null, value: null });
    return initeValue;
  };
  const hasValue = value && Object.keys(value).length !== 0;
  return (
    <div>
      <Button
        icon={hasValue ? <EditOutlined /> : <PlusOutlined />}
        shape='circle'
        onClick={() => setVisible(true)}
        type={hasValue ? 'primary' : null}
      />
      <Modal
        onCancel={() => setVisible(false)}
        visible={visible}
        onOk={okHandler}
        destroyOnClose={true}
        title={'编辑请求'}
        width={800}
        maskClosable={false}
      >
        <RequestArgs value={getRequestArgs()} ref={ref} />
      </Modal>
    </div>
  );
};

export default RequestArgsModal;