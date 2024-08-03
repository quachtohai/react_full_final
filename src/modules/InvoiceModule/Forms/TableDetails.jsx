import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Table,
  InputNumber,
  Typography,
} from "antd";
import dayjs from "dayjs";
import useLanguage from "@/locale/useLanguage";
import { tagColor } from "@/utils/statusTagColor";
import { useMoney, useDate } from "@/settings";
import { Tag } from "antd";
import { configuration } from "@/redux/configurations/actions";
import { useSelector, useDispatch } from "react-redux";
import AutoCompleteAsync from "@/components/AutoCompleteAsync";
import { DatePicker } from "antd";
import FormItem from "antd/es/form/FormItem";
import store from "@/redux/store";
import calculate from "@/utils/calculate";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  formData,
  ...restProps
}) => {
  const money = useMoney();
  const [price, setPrice] = useState(5);
  const [quantity, setQuantity] = useState(1);
  const [totalState, setTotal] = useState(0);

  const updateQt = (value) => {
   
    setQuantity(value);
    
    const currentTotal = calculate.multiply(price, quantity);
    setTotal(currentTotal);   
  };
  const updatePrice = (value) => {
    setPrice(value);
    const currentTotal = calculate.multiply(price, quantity);
    setTotal(currentTotal);    
  };
  let options = [];
  if (formData && formData.description == "select") {
    if (formData.description == "select") {
      formData.description2.split(";").map((item) => {
        options.push({
          //value: item.split(",")[0],
          value: "drap",
          label: item.split(",")[1],
        });
      });
    }
  }

  let rules = [];
  if (formData && formData.rule) {
    if (formData.rule[0].includes("require")) {
      rules.push({
        required: true,
      });
    } else {
      rules.push({
        required: false,
      });
    }
  }

  return (
    <td {...restProps}>
      {editing ? (
        <>
          {" "}
          <Form.Item name={dataIndex} rules={rules}>
            {formData.entitySearch ? (
              <AutoCompleteAsync
                entity={formData.entitySearch}
                displayLabels={formData.displayLabels.split(",")}
                searchFields={formData.searchFields}
                redirectLabel={formData.redireactLabel}
                withRedirect
                urlToRedirect={formData.urlToRedirect}
              />
            ) : formData.description == "number" ? (
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                onChange={updateQt}
              />
            ) : formData.description == "date" ? (
              <DatePicker style={{ width: "100%" }} format={dateFormat} />
            ) : formData.description == "select" ? (
              <Select options={options}></Select>
            ) : formData.description == "string" && !formData.entitySearch ? (
              <Input placeholder={formData.description3} />
            ) : formData.description == "money" &&
              formData.fieldName.includes("price") ? (
              <InputNumber
                className="moneyInput"
                controls={false}
                addonAfter={
                  money.currency_position === "after"
                    ? money.currency_symbol
                    : undefined
                }
                addonBefore={
                  money.currency_position === "before"
                    ? money.currency_symbol
                    : undefined
                }
                onChange={updatePrice}
              />
            ) : (
              <InputNumber
                readOnly
                className="moneyInput"
                min={0}
                controls={false}
                value={totalState}
                addonAfter={
                  money.currency_position === "after"
                    ? money.currency_symbol
                    : undefined
                }
                addonBefore={
                  money.currency_position === "before"
                    ? money.currency_symbol
                    : undefined

                }
                formatter={(value) =>
                  money.amountFormatter({
                    amount: value,
                    currency_code: money.currency_code,
                  })
                }
              />
              
            )}
          </Form.Item>
        </>
      ) : (
        children
      )}
    </td>
  );
};

function FormData() {
  const dispatch = useDispatch();
  const entity = "forms";
  const entityDetails = "Invoice";
  const [formDatas, setFormDatas] = useState([]);
  const [titles, setTitles] = useState([]);
  const translate = useLanguage();
  const [initialData, setIninitalData] = useState({});
  const dispatcher = () => {
    dispatch(configuration.list({ entity: entity })).then((data) => {
      let finalResults = [];
      let titleResults = [];
      let initialDataTmp = {};
      let formDataTmps =
        store.getState().crudConfiguration.list.result.items.forms;
      for (var i = 0; i < formDataTmps.count; i++) {
        let formDataObject = {
          formCode: formDataTmps.data[i].formCode,
          moduleCode: formDataTmps.data[i].moduleCode,
          span: formDataTmps.data[i].span,
          entitySearch: formDataTmps.data[i].entitySearch,
          displayLabels: formDataTmps.data[i].displayLabels,
          searchFields: formDataTmps.data[i].searchFields,
          redireactLabel: formDataTmps.data[i].redireactLabel,
          fieldName: formDataTmps.data[i].fieldName,
          label: formDataTmps.data[i].label,
          description: formDataTmps.data[i].description,
          description2: formDataTmps.data[i].description2,
          rule: formDataTmps.data[i].rule,
          entityName: formDataTmps.data[i].entityName,
          type: formDataTmps.data[i].type,
          typeDetail: formDataTmps.data[i].typeDetail,
          Id: formDataTmps.data[i].id,
        };
        let titleTmp = {
          title: formDataTmps.data[i].label,
          dataIndex: formDataTmps.data[i].fieldName,
          formData: formDataTmps.data[i],
          editable: true,
        };

        
        if (
          formDataObject.entityName == entityDetails &&
          formDataObject.type == "2"
        ) {
          finalResults.push(formDataObject);
          titleResults.push(titleTmp);
          initialDataTmp[formDataTmps.data[i].fieldName] = "";
        }
      }
      setFormDatas(finalResults);
      setTitles(titleResults);
      setIninitalData(initialDataTmp);
    });
  };

  const { dateFormat } = useDate();
  useEffect(() => {
    const controller = new AbortController();
    dispatcher();

    return () => {
      controller.abort();
    };
  }, []);

  return { formDatas, titles, initialData };
}
const TableDetails = ({ itemsData,handleChangeData }) => {
  const [count, setCount] = useState(1);
  let formDatas = FormData();

  formDatas.initialData.count = count;
  formDatas.initialData.key = count;
  console.log(formDatas.initialData);

  const [data, setData] = useState([formDatas.initialData]);

  const handleAdd = () => {
    setCount(count + 1);
    console.log(count);
    formDatas.initialData.count = count;
    formDatas.initialData.key = count;
    setData([...data, formDatas.initialData]);
  };
  
  const [form] = Form.useForm();

  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    console.log(record.key);
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      

      const row = await form.validateFields();
      const newData = [...data];
      console.log(newData);
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
      console.log(newData);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
    
  };
  console.log(data);
  useEffect(() => {
    handleChangeData(data);
  }, [data]);
  const columns = [
    ...formDatas.titles,
    {
      title: "operation",
      dataIndex: "operation",
      formData: undefined,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        formData: col.formData,
      }),
    };
  });
  return (
    <>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Add a row
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
          // scroll={{
          //   x: 1500,
          //   y: 200,
          // }}
        />
      </Form>
    </>
  );
};
export default TableDetails;
