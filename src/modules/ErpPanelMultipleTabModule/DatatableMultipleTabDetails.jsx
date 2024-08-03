import React from "react";

import { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, Input, Popconfirm, Table } from "antd";

const EditableContext = React.createContext(null);
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
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
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
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
const DatatableMultipleTabDetails = ({ columnsData, detailsData }) => {
  const sums = [
    ...detailsData.reduce(
      (map, item) => {
        const { itemId: key, quantity, approvedQuantity } = item;
        const prev = map.get(key);
        
        if(prev) {
          prev.quantity += quantity
          prev.approvedQuantity +=approvedQuantity
        } else {
          map.set(key, Object.assign({}, item))
        }
        
        return map
      },
      new Map()
    ).values()
  ]
  
  const [dataSource, setDataSource] = useState(detailsData); 
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };
  const handleSummary = () => {
    setDataSource(sums);
  };
  const handleDetails = () => {
    setDataSource(detailsData);
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  columnsData.editable = true;
  const columns = columnsData.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Button
            onClick={handleSummary}
            type="primary"
            style={{
              marginBottom: 16,
            }}
          >
            View Summary
          </Button>
        </div>
        <div>
          <Button
            onClick={handleDetails}
            type="primary"
            style={{
              marginBottom: 16,
            }}
          >
            View Details
          </Button>
        </div>
        <div>
          <Button
            onClick={handleSave}
            type="primary"
            style={{
              marginBottom: 16,
            }}
          >
            Create product line
          </Button>
        </div>
      </div>
      <Table
        scroll={{
          x: 1500,
        }}
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
};

export default DatatableMultipleTabDetails;
