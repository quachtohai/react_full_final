import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Divider,
  Row,
  Col,
} from "antd";

import { PlusOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import AutoCompleteAsync from "@/components/AutoCompleteAsync";
import ItemRow from "@/components/FormDetails";
//import ItemRow from '@/modules/ErpPanelModule/ItemRow';
import MoneyInputFormItem from "@/components/MoneyInputFormItem";
import { selectFinanceSettings } from "@/redux/settings/selectors";
import { useDate } from "@/settings";
import useLanguage from "@/locale/useLanguage";
import calculate from "@/utils/calculate";
import { useSelector } from "react-redux";
import SelectAsync from "@/components/SelectAsync";
import FormData from "@/components/Form";
import TableDetails from "./TableDetails";

export default function InvoiceForm({ subTotal = 0, current = null, itemsData,
  handleChangeData }) {
  const { last_invoice_number } = useSelector(selectFinanceSettings);

  if (last_invoice_number === undefined) {
    return <></>;
  }

  return <LoadInvoiceForm subTotal={subTotal} current={current} itemsData ={itemsData} handleChangeData = {handleChangeData} />;
}

function LoadInvoiceForm({ subTotal = 0, current = null, itemsData, handleChangeData }) {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const { last_invoice_number } = useSelector(selectFinanceSettings);
  const [total, setTotal] = useState(undefined);
  const [taxRate, setTaxRate] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [currentYear, setCurrentYear] = useState(() =>
    new Date().getFullYear()
  );
  const [lastNumber, setLastNumber] = useState(() => last_invoice_number + 1);
  const [number, setNumber] = useState(100);
  const handelTaxChange = (value) => {
    setTaxRate(value / 100);
  };

  useEffect(() => {
    if (current) {
      const { taxRate = 0, year, number } = current;
      setTaxRate(taxRate / 100);
      setCurrentYear(year);
      setLastNumber(number);
    }
  }, [current]);
  useEffect(() => {
    const currentTotal = calculate.add(
      calculate.multiply(subTotal, taxRate),
      subTotal
    );
    console.log(currentTotal);
    setTaxTotal(Number.parseFloat(calculate.multiply(subTotal, taxRate)));
    setTotal(Number.parseFloat(currentTotal));
  }, [subTotal, taxRate]);

  const addField = useRef(false);

  
  const onChangeNumber = (number) => {
    setNumber(number);
    console.log("PARENT" + number);
  };

  return (
    <>
      <FormData />
      <Divider dashed />
      {/* <Row gutter={[12, 12]} style={{ position: "relative" }}>
        <Col className="gutter-row" span={5}>
          <p>{translate("Item")}</p>
        </Col>
        <Col className="gutter-row" span={7}>
          <p>{translate("Description")}</p>
        </Col>
        <Col className="gutter-row" span={3}>
          <p>{translate("Quantity")}</p>{" "}
        </Col>
        <Col className="gutter-row" span={4}>
          <p>{translate("Price")}</p>
        </Col>
        <Col className="gutter-row" span={5}>
          <p>{translate("Total")}</p>
        </Col>
      </Row>
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <ItemRow
                key={field.key}
                remove={remove}
                field={field}
                current={current}
              ></ItemRow>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                ref={addField}
              >
                {translate("Add field")}
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List> */}
      <TableDetails number={number} onChangeNumber={onChangeNumber} itemsData ={itemsData} handleChangeData = {handleChangeData}  />
      <Divider dashed />
      <div style={{ position: "relative", width: " 100%", float: "right" }}>
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={5}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                block
              >
                {translate("Save")}
              </Button>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4} offset={10}>
            <p
              style={{
                paddingLeft: "12px",
                paddingTop: "5px",
                margin: 0,
                textAlign: "right",
              }}
            >
              {translate("Sub Total")} :
            </p>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={subTotal} />
          </Col>
        </Row>
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={4} offset={15}>
            <Form.Item
              name="taxRate"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <SelectAsync
                value={taxRate}
                onChange={handelTaxChange}
                entity={"taxes"}
                outputValue={"taxValue"}
                displayLabels={["taxName"]}
                withRedirect={true}
                urlToRedirect="/taxes"
                redirectLabel={translate("Add New Tax")}
                placeholder={translate("Select Tax Value")}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={taxTotal} />
          </Col>
        </Row>
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={4} offset={15}>
            <p
              style={{
                paddingLeft: "12px",
                paddingTop: "5px",
                margin: 0,
                textAlign: "right",
              }}
            >
              {translate("Total")} :
            </p>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={total} />
          </Col>
        </Row>
      </div>
    </>
  );
}
