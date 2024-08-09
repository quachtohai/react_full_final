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

export default function GeneralForm({
  subTotal = 0,
  current = null,
  itemsData,
  handleChangeData,
  entityDetail,
  currentData,
  detail,
  readOnly,
  dataSummary
}) {
  

  return (
    <LoadGeneralForm
      subTotal={subTotal}
      current={current}
      itemsData={itemsData}
      handleChangeData={handleChangeData}
      entityDetail={entityDetail}
      currentData={currentData}
      detail={detail}
      readOnly={readOnly}
      dataSummary = {dataSummary}
    />
  );
}

function LoadGeneralForm({
  subTotal = 0,
  current = null,
  itemsData,
  handleChangeData,
  entityDetail,
  currentData,
  detail,
  readOnly,
  dataSummary
}) {
  const translate = useLanguage();

  const [total, setTotal] = useState(undefined);
  const [taxRate, setTaxRate] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [currentYear, setCurrentYear] = useState(() =>
    new Date().getFullYear()
  );
  const [number, setNumber] = useState(100);

  useEffect(() => {
    if (current) {
      const { taxRate = 0, year, number } = current;
      setTaxRate(taxRate / 100);
      setCurrentYear(year);
    }
  }, [current]);
  useEffect(() => {
    const currentTotal = calculate.add(
      calculate.multiply(subTotal, taxRate),
      subTotal
    );

    setTaxTotal(Number.parseFloat(calculate.multiply(subTotal, taxRate)));
    setTotal(Number.parseFloat(currentTotal));
  }, [subTotal, taxRate]);
  return (
    <>
      <FormData entityDetail={entityDetail} readOnly={readOnly} />
      <Divider dashed />
      <TableDetails
        number={number}
        itemsData={itemsData}
        handleChangeData={handleChangeData}
        entityDetail={detail || entityDetail}
        currentData={currentData}
        readOnly={readOnly}
        dataSummary = {dataSummary}
      />
      <Divider dashed />
    </>
  );
}
