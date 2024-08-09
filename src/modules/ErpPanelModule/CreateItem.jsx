import { useState, useEffect } from "react";

import { Button, Tag, Form, Divider } from "antd";
import { PageHeader } from "@ant-design/pro-layout";

import { useSelector, useDispatch } from "react-redux";

import useLanguage from "@/locale/useLanguage";

import { settingsAction } from "@/redux/settings/actions";
import { erp } from "@/redux/erp/actions";
import { selectCreatedItem } from "@/redux/erp/selectors";

import calculate from "@/utils/calculate";
import { generate as uniqueId } from "shortid";
import dayjs from "dayjs";

import Loading from "@/components/Loading";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import { selectLangDirection } from "@/redux/translate/selectors";

function SaveForm({ form }) {
  const translate = useLanguage();
  const handelClick = () => {
    form.submit();
  };

  return (
    <Button onClick={handelClick} type="primary" icon={<PlusOutlined />}>
      {translate("Save")}
    </Button>
  );
}

export default function CreateItem({ config, CreateForm, dataSummary }) {
 
  const translate = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(settingsAction.list({ entity: "setting" }));
  }, []);
  let { entity } = config;

  const { isLoading, isSuccess, result } = useSelector(selectCreatedItem);
  const [form] = Form.useForm();

  const [subTotal, setSubTotal] = useState(0);
  const [offerSubTotal, setOfferSubTotal] = useState(0);
  if (dataSummary && dataSummary.length > 0) {
    dataSummary.map(datafirst => {
      Object.keys(datafirst).map((key) => {
        let value = datafirst[key]
        form.setFieldsValue({
          [key]: value
        })
      })

    })
  }
  const handleChangeValues = (changedValues, values) => {
    console.log(changedValues, values);
    form.setFieldsValue({
      fullName: (values.firstName + " " || "") + (values.lastName || "")
    })
    const items = values["items"];
    let subTotal = 0;
    let subOfferTotal = 0;


    if (items) {
      items.map((item) => {
        if (item) {
          if (item.offerPrice && item.quantity) {
            let offerTotal = calculate.multiply(
              item["quantity"],
              item["offerPrice"]
            );
            subOfferTotal = calculate.add(subOfferTotal, offerTotal);
          }
          if (item.quantity && item.price) {
            let total = calculate.multiply(item["quantity"], item["price"]);
            //sub total
            subTotal = calculate.add(subTotal, total);
          }
        }
      });
      setSubTotal(subTotal);
      setOfferSubTotal(subOfferTotal);
    }
  };
  const [itemsData, setItemsData] = useState([]);

  const handleChangeData = (items) => {
    setItemsData(items);
    console.log(items);
  };

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      dispatch(erp.resetAction({ actionType: "create" }));
      setSubTotal(0);
      setOfferSubTotal(0);
      navigate(`/${entity.toLowerCase()}/read/${result._id}`);
    }
    return () => { };
  }, [isSuccess]);

  const onSubmit = (fieldsValue) => {
    let dataToUpdate = { ...fieldsValue };
    const options = { timeZone: 'Asia/Ho_Chi_Minh' };

    if (fieldsValue.birthDate) {
      dataToUpdate.birthDate = dayjs(fieldsValue.birthDate).format('YYYY-MM-DDTHH:mm:ss.SSSZ').toLocaleString('en-US', options);

    }
    console.log("🚀 ~ onSubmit ~ fieldsValue:", fieldsValue);

    console.log(itemsData);
    let finalData = {};
    finalData[entity] = dataToUpdate;

    let entityDetail = entity + "details";
    finalData[entity][entityDetail] = itemsData;

    console.log(fieldsValue);
    console.log(finalData);

    // if (fieldsValue) {
    //   if (fieldsValue.items) {
    //     let newList = [...fieldsValue.items];
    //     newList.map((item) => {
    //       item.total = calculate.multiply(item.quantity, item.price);
    //     });
    //     fieldsValue = {
    //       ...fieldsValue,
    //       items: newList,
    //     };
    //   }
    // }
    dispatch(erp.create({ entity, jsonData: finalData }));
  };
  const langDirection = useSelector(selectLangDirection);
  return (
    <>
      <PageHeader
        onBack={() => {
          navigate(`/${entity.toLowerCase()}`);
        }}
        backIcon={
          langDirection === "rtl" ? (
            <ArrowRightOutlined />
          ) : (
            <ArrowLeftOutlined />
          )
        }
        title={translate("New")}
        ghost={false}
        tags={<Tag>{translate("Draft")}</Tag>}
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => navigate(`/${entity.toLowerCase()}`)}
            icon={<CloseCircleOutlined />}
          >
            {translate("Cancel")}
          </Button>,
          <SaveForm form={form} key={`${uniqueId()}`} />,
        ]}
        style={{
          padding: "20px 0px",
        }}
      ></PageHeader>
      <Divider dashed />
      <Loading isLoading={isLoading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          onValuesChange={handleChangeValues}
        >
          <CreateForm
            subTotal={subTotal}
            offerTotal={offerSubTotal}
            itemsData={itemsData}
            handleChangeData={handleChangeData}
            entityDetail={entity}
            readOnly = {false}
            dataSummary = {dataSummary}
          />
        </Form>
      </Loading>
    </>
  );
}
