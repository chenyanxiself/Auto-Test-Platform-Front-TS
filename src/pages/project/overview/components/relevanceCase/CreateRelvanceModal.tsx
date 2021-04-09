import React from 'react';
import { Button, List, Modal } from 'antd';

interface CreateRelvanceModalProps {
  visible: boolean;
  cancelHandler: () => void;
  finishHandler: (value: any) => void;
}

const CreateRelvanceModal: React.FC<CreateRelvanceModalProps> = props => {
  return (
    <Modal
      visible={props.visible}
      onCancel={props.cancelHandler}
      onOk={props.finishHandler}
    ></Modal>
  );
};

export default CreateRelvanceModal;
