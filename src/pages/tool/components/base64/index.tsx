import React, { CSSProperties, useState } from 'react';
import { Button, Input, Space } from 'antd';
import styles from './index.less';

interface Base64ToolProps {
  leftStyle: CSSProperties;
  rightStyle: CSSProperties;
}

const base64Encode = commonContent => {
  return Buffer.from(commonContent).toString('base64');
};

const base64Decode = base64Content => {
  let commonContent = base64Content.replace(/\s/g, '+');
  return Buffer.from(commonContent, 'base64').toString();
};

const Base64Tool: React.FC<Base64ToolProps> = props => {
  const [value, setValue] = useState();
  const ref = React.useRef();
  const encodeHandler = () => {
    // @ts-ignore
    setValue(base64Encode(ref?.current?.state?.value));
  };
  const decodeHandler = () => {
    // @ts-ignore
    setValue(base64Decode(ref?.current?.state?.value));
  };
  return (
    <>
      <Input.TextArea
        style={{ ...props.leftStyle, resize: 'none', height: '100%' }}
        ref={ref}
      />
      <Space direction={'vertical'}>
        <Button type={'primary'} onClick={encodeHandler}>
          Encode
        </Button>
        <Button type={'primary'} onClick={decodeHandler}>
          Decode
        </Button>
      </Space>
      <div style={{ ...props.rightStyle }} className={styles.div}>
        {value}
      </div>
    </>
  );
};
export default Base64Tool;
