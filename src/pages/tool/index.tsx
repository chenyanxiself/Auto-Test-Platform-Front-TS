import React, { CSSProperties, useCallback, useState } from 'react';
import { Divider, Input, Radio } from 'antd';
import style from './index.less';
import JsonTool from '@/pages/tool/components/json';
import Base64Tool from '@/pages/tool/components/base64';

const tooleTypeEnums = {
  json: 'Json',
  base64: 'Base64',
  url: 'Url',
};
const Tool = props => {
  const [toolKey, setToolKey] = useState(tooleTypeEnums.json);
  const toolKeyChangeHandler = e => {
    if (e.target.value !== toolKey) {
      setToolKey(e.target.value);
    }
  };

  const leftStyle: CSSProperties = { width: '46%' };
  const rightStyle: CSSProperties = { width: '46%' };

  const renderTool = useCallback(() => {
    switch (toolKey) {
      case tooleTypeEnums.json:
        return <JsonTool leftStyle={leftStyle} rightStyle={rightStyle} />;
      case tooleTypeEnums.base64:
        return <Base64Tool leftStyle={leftStyle} rightStyle={rightStyle} />;
      case tooleTypeEnums.url:
        return <div />;
      default:
        return <div>Not Defined</div>;
    }
  }, [toolKey]);

  return (
    <>
      <div className={style.header}>
        <Radio.Group
          value={toolKey}
          buttonStyle="solid"
          onChange={toolKeyChangeHandler}
          style={{ marginTop: 10, marginLeft: 10 }}
        >
          {Object.keys(tooleTypeEnums).map(key => {
            return (
              <Radio.Button value={tooleTypeEnums[key]} key={key}>
                {tooleTypeEnums[key]}
              </Radio.Button>
            );
          })}
        </Radio.Group>
        <Divider />
      </div>
      <div className={style.body}>{renderTool()}</div>
    </>
  );
};

export default Tool;
