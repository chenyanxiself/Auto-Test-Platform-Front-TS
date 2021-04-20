import React, { CSSProperties, useState } from 'react';
import { Button, Input } from 'antd';
import ReactJson from 'react-json-view';
import styles from './index.less';
import { getJsonDataFromStr } from '@/utils/common';

interface JsonToolProps {
  leftStyle: CSSProperties;
  rightStyle: CSSProperties;
}

const JsonTool: React.FC<JsonToolProps> = props => {
  const [value, setValue] = useState();
  const ref = React.useRef();
  const clickHandler = () => {
    // @ts-ignore
    setValue(ref?.current?.state?.value);
  };
  return (
    <>
      <Input.TextArea
        style={{ ...props.leftStyle, resize: 'none', height: '100%' }}
        ref={ref}
      />
      <Button type={'primary'} onClick={clickHandler}>
        Format
      </Button>
      <div style={{ ...props.rightStyle }} className={styles.div}>
        <ReactJson
          src={getJsonDataFromStr(value)}
          name={false}
          iconStyle={'square'}
          displayDataTypes={false}
          displayObjectSize={false}
          enableClipboard={false}
          shouldCollapse={false}
        />
      </div>
    </>
  );
};
export default JsonTool;
