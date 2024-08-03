import { useState, useEffect } from "react";
import { Form, Input, InputNumber, Row, Col } from "antd";

import { DeleteOutlined } from "@ant-design/icons";
import { useMoney, useDate } from "@/settings";
import calculate from "@/utils/calculate";
import { configuration } from "@/redux/configurations/actions";
import { useSelector, useDispatch } from "react-redux";
import AutoCompleteAsync from "@/components/AutoCompleteAsync";
import { DatePicker } from "antd";
import store from "@/redux/store";



export default function ItemRow({ field, remove, current = null }) {
  
  const { dateFormat } = useDate();
  const dispatch = useDispatch();
  const entity = "forms";
  const entityDetails = "Invoice";
  const [formDataDetails, setFormDataDetails] = useState([]);
  const dispatcher = () => {
    dispatch(configuration.list({ entity: entity })).then((data) => {
      let finalResults = [];
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
          description3: formDataTmps.data[i].description3,
        };
        if (
          formDataObject.entityName == entityDetails &&
          formDataObject.type == "2"
        ) {
          finalResults.push(formDataObject);
        }
      }
      setFormDataDetails(finalResults);
    });
  };

  

  useEffect(() => {
    const controller = new AbortController();
    dispatcher();

    return () => {
      controller.abort();
    };
  }, []);
  const [totalState, setTotal] = useState(0);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const money = useMoney();
  const [changeValue, setChangeValue] = useState({});
  const updateQt = (value) => {
    setQuantity(value);
  };
  const updatePrice = (value) => {
    setPrice(value);
  };



  useEffect(() => {
    if (current) {
      const { items, invoice } = current;

      if (invoice) {
        const item = invoice[field.fieldKey];
        if (item) {
          setQuantity(item.quantity);
          setPrice(item.price);
        }
      } else {
        const item = items[field.fieldKey];

        if (item) {
          setQuantity(item.quantity);
          setPrice(item.price);
        }
      }
    }
  }, [current]);

  useEffect(() => {
    const currentTotal = calculate.multiply(price, quantity);
    setTotal(currentTotal);
  }, [price, quantity]);

  let getFormData = function (formData) {
    let options = [];
    if (formData.description == "select") {
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
    if (formData.rule) {
      if (formData.rule[0].includes("require")) {
        rules.push({
          required: true,
        });
      } else {
        rules.push({
          required: false,
        });
      }
      if (formData.rule[0].includes("pattern")) {
        rules.push({
          pattern: /^(?!\s*$)[\s\S]+$/, // Regular expression to allow spaces, alphanumeric, and special characters, but not just spaces
          message: "Must contain alphanumeric or special characters",
        });
      }
    }
    return (
      <Col className="gutter-row" span={formData.span}>
        <Form.Item name={[field.name, formData.fieldName]} rules={rules}>
          {/* {formData.fieldName ? "" : ""} */}
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
              onChange={updatePrice}
              
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
            />
          ) : formData.description == "money" &&
            !formData.fieldName.includes("price") ? (
            <InputNumber
              readOnly
              className="moneyInput"
              value={totalState}
              min={0}
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
              formatter={(value) =>
                money.amountFormatter({
                  amount: value,
                  currency_code: money.currency_code,
                })
              }
            />
          ) : (
            undefined
          )}
        </Form.Item>
      </Col>
    );
  };

  let formDataDetailsTmps = [];
  let fieldForModals = {};
  let dataForModals = {};
  formDataDetails.map((formDataDetail) => {
    fieldForModals[formDataDetail.fieldName] = {
      type: "string",
      required: false,
      value: "123456",
    };
    let resultTmp = getFormData(formDataDetail);
    formDataDetailsTmps.push(resultTmp);
  });

  let results = [
    <Row gutter={[12, 12]} style={{ position: "relative" }}>
      {formDataDetailsTmps}

      <div style={{ position: "absolute", right: "-30px", top: " 5px" }}>
        <DeleteOutlined onClick={() => remove(field.name)} />
      </div>      
      <div></div>
    </Row>,
  ];
  
  return <>{results}</>;
}
