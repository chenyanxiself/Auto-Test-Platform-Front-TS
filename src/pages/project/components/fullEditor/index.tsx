import 'braft-editor/dist/index.css';
import React, { useEffect, useState } from 'react';
import BraftEditor from 'braft-editor';
import { Button, Modal } from 'antd';
import styles from './index.less';
import { ZoomInOutlined } from '@ant-design/icons';

interface FullEditorProps {
  onSave: any;
  value?: any;

  [name: string]: any;
}

const FullEditor: React.FC<FullEditorProps> = props => {
  const [editorValue, setEditorValue] = useState(
    BraftEditor.createEditorState(null),
  );
  const [visible, setVisble] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const controls = props.controls
    ? props.controls
    : ['bold', 'italic', 'underline', 'text-color', 'media'];
  const imageControls = props.imageControls
    ? props.imageControls
    : [
        'float-left', // 设置图片左浮动
        'float-right', // 设置图片右浮动
        'align-left', // 设置图片居左
        'align-center', // 设置图片居中
        'align-right', // 设置图片居右
        {
          // text: <ZoomInOutlined />,
          render: mediaData => {
            const clickHandler = () => {
              setImgUrl(mediaData.url);
              setVisble(true);
            };
            return (
              <ZoomInOutlined
                onClick={clickHandler}
                key={mediaData.url}
                className={styles.icon}
              />
            );
          },
        },
        'remove',
      ];

  useEffect(() => {
    setEditorValue(BraftEditor.createEditorState(props.value));
  }, [props.value]);

  const saveDescriptionHandle = async () => {
    const v = editorValue.toHTML();
    if (v !== props.value) {
      props.onSave(v);
    }
  };

  return (
    <div className={styles.body}>
      <div>
        <BraftEditor
          value={editorValue}
          onChange={editorState => setEditorValue(editorState)}
          controls={controls}
          placeholder="请输入任务描述"
          contentClassName={styles.innerContent}
          className={styles.content}
          imageControls={imageControls}
        />
      </div>
      <div className={styles.bottom}>
        <Button
          onClick={() =>
            setEditorValue(BraftEditor.createEditorState(props.value))
          }
          className={styles.button}
        >
          还原
        </Button>
        <Button
          onClick={saveDescriptionHandle}
          type={'primary'}
          className={styles.button}
        >
          确认
        </Button>
      </div>
      <Modal
        visible={visible}
        onCancel={() => setVisble(false)}
        width={1000}
        title={'查看图片'}
        footer={null}
      >
        <img
          src={imgUrl}
          style={{
            maxWidth: '100%',
          }}
        />
      </Modal>
    </div>
  );
};

export default FullEditor;
