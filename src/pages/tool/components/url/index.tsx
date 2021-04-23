import React, { CSSProperties, useState } from 'react';
import { Button, Descriptions, Input, Radio, Space } from 'antd';
import styles from './index.less';

interface UrlToolProps {
  leftStyle: CSSProperties;
  rightStyle: CSSProperties;
}

const parserKeyEnums = {
  base: 'Base',
  params: 'Params',
};

const UrlTool: React.FC<UrlToolProps> = props => {
  const [decodeUrl, setDecodeUrl] = useState('');
  const [parserKey, setParserKey] = useState(parserKeyEnums.base);
  const ref = React.useRef();
  const clickHandler = () => {
    // @ts-ignore
    const value = ref?.current?.state?.value;
    const u = decodeURIComponent(value ? value : '');

    setDecodeUrl(
      u.startsWith('http://') || u.startsWith('https://') ? u : 'http://' + u,
    );
  };

  const parserKeyChangeHandler = e => {
    setParserKey(e.target.value);
  };

  const extra = (
    <Radio.Group
      value={parserKey}
      buttonStyle="solid"
      onChange={parserKeyChangeHandler}
    >
      {Object.keys(parserKeyEnums).map(key => {
        return (
          <Radio.Button value={parserKeyEnums[key]} key={key}>
            {parserKeyEnums[key]}
          </Radio.Button>
        );
      })}
    </Radio.Group>
  );

  const renderDescriptionItems = () => {
    let url;
    try {
      url = new URL(decodeUrl);
    } catch (e) {
      url = null;
    }
    if (parserKey === parserKeyEnums.base) {
      return (
        <>
          <Descriptions.Item label="Method" span={4}>
            {url ? url.protocol : null}
          </Descriptions.Item>
          <Descriptions.Item label="Host" span={4}>
            {url ? url.host : null}
          </Descriptions.Item>
          <Descriptions.Item label="Port" span={4}>
            {url ? url.port : null}
          </Descriptions.Item>
          <Descriptions.Item label="Path" span={4}>
            {url ? url.pathname : null}
          </Descriptions.Item>
        </>
      );
    } else if (parserKey === parserKeyEnums.params) {
      let searchParams;
      if (url) {
        searchParams = new URLSearchParams(url.search);
      } else {
        searchParams = null;
      }
      let DesList = [];
      if (searchParams) {
        let index = 0;
        searchParams.forEach((v, k) => {
          DesList.push(
            <Descriptions.Item label={k} span={3} key={index}>
              {v}
            </Descriptions.Item>,
          );
        });
        index += 1;
      }
      return <>{DesList}</>;
    }
  };

  return (
    <>
      <Input.TextArea
        style={{ ...props.leftStyle, resize: 'none', height: '100%' }}
        ref={ref}
      />
      <Button type={'primary'} onClick={clickHandler}>
        Decode
      </Button>
      <div
        style={{
          ...props.rightStyle,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div className={styles.div} style={{ height: '30%' }}>
          {decodeUrl}
        </div>
        <div className={styles.div} style={{ height: '65%' }}>
          <Descriptions
            layout="horizontal"
            extra={extra}
            bordered
            size={'small'}
          >
            {renderDescriptionItems()}
          </Descriptions>
        </div>
      </div>
    </>
  );
};
export default UrlTool;
