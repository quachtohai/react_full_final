import { useState, useEffect } from "react";
import { Form, Divider } from "antd";
import dayjs from "dayjs";
import { Button, Tag } from "antd";
import { PageHeader } from "@ant-design/pro-layout";

import { useSelector, useDispatch } from "react-redux";
import useLanguage from "@/locale/useLanguage";
import { erp } from "@/redux/erp/actions";

import calculate from "@/utils/calculate";
import { generate as uniqueId } from "shortid";
import { selectUpdatedItem } from "@/redux/erp/selectors";
import Loading from "@/components/Loading";
import { tagColor } from "@/utils/statusTagColor";

import { CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

import { selectReadItem } from "@/redux/erp/selectors";
import { settingsAction } from "@/redux/settings/actions";



export default function ReadItem({
  config,
  ReadForm,
  currentData,
  detail,
}) {
  const translate = useLanguage();
  let { entity } = config;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, isLoading, isSuccess } = useSelector(selectUpdatedItem);
  const [form] = Form.useForm();
  const [subTotal, setSubTotal] = useState(0);
  const [currentErp, setCurrentErp] = useState(current);
  const { id } = useParams();

  const handleValuesChange = (changedValues, values) => {};
  const [itemsData, setItemsData] = useState([]);
  const handleChangeData = (items) => {
    console.log(items);
    setItemsData(items);
  };

  const onSubmit = (fieldsValue) => {
    console.log(itemsData);   
    
    let finalData = {};
    finalData[entity] = fieldsValue;
    finalData[entity].id = id;
    let entityDetail = entity + "details";
    if (detail) entityDetail = detail +'s';
    let itemDataFinal = [];
    itemsData.map((itemData) => {
      itemDataFinal.push({ ...itemData, userInfoId: id });
    });
    console.log(itemDataFinal);
    finalData[entity][entityDetail] = itemDataFinal;
    dispatch(erp.update({ entity: detail || entity, id, jsonData: finalData }));
  };

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      setSubTotal(0);
      dispatch(erp.resetAction({ actionType: "update" }));
      navigate(`/${entity.toLowerCase()}/read/${id}`);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (current) {
      setCurrentErp(current);
      let formData = { ...current };
      if (formData.date) {
        formData.date = dayjs(formData.date);
      }
      if (formData.expiredDate) {
        formData.expiredDate = dayjs(formData.expiredDate);
      }
      if (formData.birthDate) {
        formData.birthDate = dayjs(formData.birthDate);
      }
      if (!formData.taxRate) {
        formData.taxRate = 0;
      }

      const { subTotal } = formData;

      form.resetFields();
      form.setFieldsValue(formData);
      setSubTotal(subTotal);
    }
  }, [current]);

  return (
    <>
      <PageHeader
        onBack={() => {
          navigate(`/${entity.toLowerCase()}`);
        }}
        title={translate("Read")}
        ghost={false}
        tags={[
          <Tag color={tagColor(currentErp && currentErp.status)?.color} key="status">
            {currentErp && currentErp.status && translate(currentErp.status)}
          </Tag>,
          currentErp && currentErp.paymentStatus && (
            <Tag
              color={tagColor(currentErp &&currentErp.paymentStatus)?.color}
              key="paymentStatus"
            >
              {currentErp && currentErp.paymentStatus && translate(currentErp.paymentStatus)}
            </Tag>
          ),
        ]}
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              navigate(`/${entity.toLowerCase()}`);
            }}
            icon={<CloseCircleOutlined />}
          >
            {translate("Close")}
          </Button>,
          <Button type="primary" icon={<PlusOutlined />}>Print</Button>,
          <Button type="primary" icon={<PlusOutlined />}>View</Button>
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
          onValuesChange={handleValuesChange}
        >
          <ReadForm
            subTotal={subTotal}
            current={current}
            itemsData={currentData.userInfoDetails}
            handleChangeData={handleChangeData}
            entityDetail={entity}
            currentData={currentData.userInfoDetails}
            detail={detail}
            readOnly ={true}
          />
        </Form>
      </Loading>
    </>
  );
}
