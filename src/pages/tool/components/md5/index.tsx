import React, { CSSProperties, useState } from 'react';
import { Button, Input, Space } from 'antd';
import styles from './index.less';
import md5 from 'md5';

interface Md5ToolProps {
  leftStyle: CSSProperties;
  rightStyle: CSSProperties;
}

const Md5Tool: React.FC<Md5ToolProps> = props => {
  const [value, setValue] = useState();
  const ref = React.useRef();

  const decodeHandler = () => {
    // @ts-ignore
    setValue(md5(ref?.current?.state?.value));
  };

  return (
    <>
      <Input.TextArea
        style={{ ...props.leftStyle, resize: 'none', height: '100%' }}
        ref={ref}
      />
      <Button type={'primary'} onClick={decodeHandler}>
        Encode
      </Button>
      <div style={{ ...props.rightStyle }} className={styles.div}>
        {value}
      </div>
    </>
  );
};
export default Md5Tool;
