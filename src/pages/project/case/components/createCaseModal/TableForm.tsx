import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Form } from 'antd';
import './tableForm.less';
// @ts-ignore
const EditableContext = React.createContext<any>();

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: string;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell: React.FC<EditableCellProps> = ({
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
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async e => {
    try {
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
          autoSize={{ maxRows: 4, minRows: 2 }}
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const TableForm = (props) => {
  const columns = [
    {
      title: '编号',
      dataIndex: 'key',
      width: '10%',
      ellipsis: true,
    },
    {
      title: '步骤描述',
      dataIndex: 'step',
      width: '35%',
      ellipsis: true,
      editable: true,
    },
    {
      title: '预期结果',
      dataIndex: 'exception',
      width: '35%',
      ellipsis: true,
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) =>
        record.exception !== null || record.step !== null ? (
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
  const handleDelete = key => {
    const dataSource = props.value.reduce((pre, cur) => {
      if (cur.key !== key) {
        if (cur.key > key) {
          cur.key = cur.key - 1;
        }
        pre.push(cur);
      }
      return pre;
    }, []);
    props.onChange(
      dataSource,
    );
  };

  const handleSave = row => {
    const newData = [...props.value];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    if ((row.step !== null || row.exception !== null) && index === (newData.length - 1)) {
      newData.push({ key: props.value.length + 1, step: null, exception: null });
    }
    props.onChange(newData);
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
        handleSave,
      }),
    };
  });
  return (
    <Table
      tableLayout={'fixed'}
      size='small'
      components={components}
      rowClassName={() => 'editable-row'}
      bordered
      dataSource={props.value}
      columns={columnsRe}
      pagination={false}
    />
  );
};

export default TableForm

