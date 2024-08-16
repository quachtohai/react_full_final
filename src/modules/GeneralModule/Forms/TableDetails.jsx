import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
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
import store from "@/redux/store";
import calculate from "@/utils/calculate";
import { request } from "@/request";
import ExcelExport from "@/components/ExcelExport";
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  formData,
  save,
  cancel,
  edit,
  deleteRecord,
  dynamicState,
  setDynamicState,
  form,
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
          value: item.split(",")[0],
          label: item.split(",")[1],
        });
      });
    }
  }

  let rules = [];
  if (formData && formData.rule) {
    if (formData.rule[0].includes("require")) {
      rules.push({
        required: true

      });
    } else {
      rules.push({
        required: false,
      });
    }
  }
  const changeInput = (event, value) => {
    console.log(value);
    console.log(event.target);
    let newState = {
      ...dynamicState,
      [event.target.id]: "11111"
    };
    setDynamicState({
      ...newState
    });
    // form.setFieldsValue({
    //  accountName:""
    // })
  };
  //console.log(dynamicState);

  const actions = (
    <span>
      <Typography.Link
        onClick={() => {
          if (title) save(record.key);
        }}
        style={{
          marginRight: 8,
        }}
      >
        Save
      </Typography.Link>
      <Typography.Link
        onClick={() => {
          deleteRecord(record);
        }}
        style={{
          marginLeft: 8,
        }}
      >
        Delete
      </Typography.Link>
    </span>
  );

  return (
    <td {...restProps}>
      {editing ? (
        <>

          <Form.Item name={dataIndex} rules={rules}>
            {formData &&
              formData.description == "string" && formData.fieldName.toLowerCase() != "password"
              && !formData.entitySearch ? (
              <Input
                placeholder={formData.description3}
                onChange={changeInput}
                id={formData.fieldName}

              />
            ) : undefined}
            {formData &&
              formData.description == "string" && formData.fieldName.toLowerCase() == "password"
              && !formData.entitySearch ? (
              <Input.Password
                placeholder={formData.description3}
                onChange={changeInput}
                id={formData.fieldName}

              />
            ) : undefined}

            {formData && formData.entitySearch ? (
              <AutoCompleteAsync
                entity={formData.entitySearch}
                displayLabels={formData.displayLabels.split(",")}
                searchFields={formData.searchFields}
                redirectLabel={formData.redirectLabel}
                withRedirect
                urlToRedirect={formData.urlRedirect}
              />
            ) : undefined}
            {formData && formData.description == "number" ? (
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                onChange={updateQt}
              />
            ) : undefined}
            {formData && formData.description == "date" ? (
              <DatePicker style={{ width: "100%" }} format={dateFormat} />

            )
              : formData && formData.description == "select" ? (
                <Select options={options} onChange={changeSelect}></Select>
              ) : undefined}
            {formData &&
              formData.description == "money" &&
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
            ) : undefined}
            {formData &&
              formData.description == "money" &&
              formData &&
              formData.fieldName.includes("total") ? (
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
            ) : undefined}
            {!formData || !formData.fieldName ? actions : undefined}
          </Form.Item>
        </>
      ) : typeof children[1] == "object" ? (
        children
      ) : formData && formData.entitySearch ? (
        <AutoCompleteAsync
          entity={formData.entitySearch}
          displayLabels={formData.displayLabels.split(",")}
          searchFields={formData.searchFields}
          redirectLabel={formData.redirectLabel}
          withRedirect
          urlToRedirect={formData.urlRedirect}
        />
      ) : formData && formData.description == "number" ? (
        <InputNumber style={{ width: "100%" }} min={0} onChange={updateQt} />
      ) : formData && formData.description == "date" ? (
        <DatePicker style={{ width: "100%" }} format={dateFormat} />
      ) : formData && formData.description == "select" ? (
        <Select options={options}></Select>
      ) : formData &&
        formData.description == "string" &&
        !formData.entitySearch && formData.fieldName.toLowerCase() != "password" ? (
        <Input placeholder={formData.description3} value={children[1]} />
      ) :
        formData &&
          formData.description == "string" &&
          !formData.entitySearch && formData.fieldName.toLowerCase() == "password" ? (
          <Input.Password placeholder={formData.description3} value={children[1]} />
        ) :
          formData &&
            formData.description == "money" &&
            formData &&
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
          ) : formData &&
            formData.description == "money" &&
            formData &&
            formData.fieldName.includes("total") ? (
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
          ) : (
            actions
          )}
    </td>
  );
};

function FormData(entityDetail) {
  const dispatch = useDispatch();
  const entity = "forms";

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
          recordEntityname: formDataTmps.data[i].recordEntityname,
        };
        let titleTmp = {
          title: formDataTmps.data[i].label,
          dataIndex: formDataTmps.data[i].fieldName,
          formData: formDataTmps.data[i],
          editable: true,
        };

        if (
          formDataObject.entityName.toLowerCase() ==
          entityDetail.toLowerCase() &&
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

  useEffect(() => {
    const controller = new AbortController();
    dispatcher();

    return () => {
      controller.abort();
    };
  }, []);

  return { formDatas, titles, initialData };
}
const asyncSearch = async (entitylist) => {
  return await request.list({ entity: entitylist });
};
const TableDetails = ({
  itemsData,
  handleChangeData,
  entityDetail,
  currentData,
  readOnly,
  dataSummary
}) => {
  let formDatas = FormData(entityDetail);
  console.log(dataSummary);
  let initialItemsData = [];
  if (currentData && currentData.length > 0) {
    currentData.map((currentData) =>
      initialItemsData.push({ ...currentData, key: currentData.id, count: 1 })
    );
  }
  const [dynamicState, setDynamicState] = useState({});
  const [data, setData] = useState(
    currentData && currentData.length > 0
      ? initialItemsData : dataSummary && dataSummary.length > 0 ? dataSummary
        : [formDatas.initialData]
  );
  formDatas.initialData.count = 1;
  formDatas.initialData.key = 1;
  const getMasterData = async () => {
    let returnData = [];
    if (formDatas.formDatas && formDatas.formDatas.length > 0) {
      await asyncSearch(formDatas.formDatas[0].recordEntityname).then(
        (dataTmp) => {
          returnData = dataTmp[formDatas.formDatas[0].recordEntityname].data;
        }
      );
    }
    return returnData;
  };

  const handleAdd = () => {
    let maxKey = 0;
    if (data) {
      maxKey = Math.max(...data.map((dt) => dt.count));
    }
    let countTmp = maxKey + 1 > 1 ? maxKey + 1 : 0;

    formDatas.initialData.count = countTmp;
    formDatas.initialData.key = countTmp;

    let dataUpdate = {
      ...formDatas.initialData,
      key: formDatas.initialData.key,
      count: formDatas.initialData.count,
    };
    //console.log(formDatas.initialData);
    setData([...data, dataUpdate]);
  };
  const handleGetData = () => {
    getMasterData().then((datas) => {
      let dataWithKeys = [];
      datas.map((data) => {
        dataWithKeys.push({ ...data, key: data.id, count: 1 });
        setEditingKey("");
      });
      setData(dataWithKeys);
    });
  };

  const [form] = Form.useForm();

  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
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
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const deleteRecord = async (record) => {
    const newData = [...data.filter((x) => x.key != record.key)];

    if (newData && newData.length >= 1) {
      setData(newData);
      setEditingKey("");
    }
  };

  useEffect(() => {
    if (Object.keys(data[0]).length == 2) {
      edit(data[0]);
    }
    //setData(dynamicState);

    handleChangeData(data);
  }, [data]);
  const columns = [
    ...formDatas.titles,
    {
      title: "Action",
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
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== "" || readOnly}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        formData: col.formData,
        save: save,
        cancel: cancel,
        edit: edit,
        deleteRecord: deleteRecord,
        dynamicState: dynamicState,
        setDynamicState: setDynamicState,
        form: form
      }),
    };
  });
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
          }}
          disabled={readOnly ? true : false}
        >
          Add a row
        </Button>
        <ExcelExport data={data} fileName={entityDetail} />

        <Button
          onClick={handleGetData}
          type="primary"
          style={{
            marginBottom: 16,
          }}
          disabled={readOnly ? true : false}
        >
          Get Data
        </Button>
      </div>
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
          scroll={{
            x: 1000,
            y: 400,
          }}
        />
      </Form>
    </>
  );
};
export default TableDetails;
