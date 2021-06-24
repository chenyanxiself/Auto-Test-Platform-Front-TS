import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Table, Input, Button, Form } from 'antd';
import './requestArgs.less';

// @ts-ignore
const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      // @ts-ignore
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    // @ts-ignore
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async e => {
    try {
      // @ts-ignore
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
      >
        <Input.TextArea
          style={{ resize: 'none' }}
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
          height: 32,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

interface EditableTableProps {
  value: any;
  onChange: (value: any) => void;
}

const EditableTable: React.FC<Partial<EditableTableProps>> = props => {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    setDataSource(processArgs(props.value));
  }, [props.value]);

  const processArgs = value => {
    var initeValue;
    if (value) {
      initeValue = Object.keys(value).map((item, index) => {
        return {
          key: index,
          arg: item,
          value: value[item],
        };
      });
    } else {
      initeValue = [];
    }
    initeValue.push({ key: initeValue.length, arg: null, value: null });
    return initeValue;
  };

  const columns = [
    {
      title: 'Key',
      dataIndex: 'arg',
      width: '40%',
      ellipsis: true,
      editable: true,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      width: '40%',
      ellipsis: true,
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) =>
        record.arg !== null || record.value !== null ? (
          <Button
            onClick={() => handleDelete(record.key)}
            type={'primary'}
            ghost={true}
            danger={true}
            size={'small'}
          >
            Delete
          </Button>
        ) : null,
    },
  ];

  const getDataSource = newData => {
    const returnData = newData.reduce((pre, cur) => {
      if (cur.arg || cur.value) {
        // @ts-ignore
        pre[[cur.arg]] = cur.value;
      }
      return pre;
    }, {});

    if (Object.keys(returnData).length === 0) {
      return undefined;
    }
    return returnData;
  };

  const handleDelete = key => {
    const newData = dataSource.reduce((pre, cur) => {
      if (cur.key !== key) {
        if (cur.key > key) {
          cur.key = cur.key - 1;
        }
        pre.push(cur);
      }
      return pre;
    }, []);
    props.onChange(getDataSource(newData));
  };

  const handleSave = row => {
    const newData = [...dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    if (
      (row.arg !== null || row.value !== null) &&
      index === newData.length - 1
    ) {
      newData.push({ key: dataSource.length + 1, arg: null, value: null });
    }
    console.log(newData);
    props.onChange(getDataSource(newData));
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columnsRe = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  return (
    <Table
      tableLayout={'fixed'}
      size="small"
      components={components}
      rowClassName={() => 'editable-row'}
      bordered
      dataSource={dataSource}
      columns={columnsRe}
      pagination={false}
      scroll={{ y: 260 }}
    />
  );
};

export default EditableTable;
