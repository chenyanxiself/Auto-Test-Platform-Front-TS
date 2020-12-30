import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { Input } from 'antd';
import styles from './index.less';

interface ClickSpanProps {
  value: string | undefined
  onSave: (e: any) => any
  style?: CSSProperties
}

const ClickSpan: React.FC<ClickSpanProps> = (props) => {
  const [isClick, setIsClick] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (isClick) {
      // @ts-ignore
      inputRef.current.focus();
    }
  }, [isClick]);

  const saveHandle = (e) => {
    if (e.target.value !== props.value) {
      props.onSave(e);
    }
    setIsClick(false);
  };

  if (isClick) {
    return (
      <Input
        className={styles.title}
        defaultValue={props.value}
        onBlur={saveHandle}
        onPressEnter={saveHandle}
        ref={inputRef}
        style={props.style}
      />
    );
  } else {
    return (
      <div
        className={styles.title}
        onClick={() => setIsClick(true)}
        style={{ ...props.style, cursor: 'pointer' }}
      >
          {props.value}
        </div>
    );
  }
};

export default ClickSpan;
