import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { useCrudContext } from '@/context/crud';
import { selectCreatedItem } from '@/redux/crud/selectors';

import useLanguage from '@/locale/useLanguage';

import { Button, Form } from 'antd';
import Loading from '@/components/Loading';
import dayjs from 'dayjs';
export default function CreateForm({ config, formElements, withUpload = false }) {
  let { entity } = config;
  const dispatch = useDispatch();
  const { isLoading, isSuccess } = useSelector(selectCreatedItem);
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, readBox } = crudContextAction;
  const [form] = Form.useForm();
  const translate = useLanguage();
  const handleChangeValues = (changedValues, values) => {
    console.log(form.getFieldValue("productId"));
    console.log(form.getFieldsInstance);
    if (changedValues.totalQuantity || changedValues.ngQuantity1 || changedValues.ngQuantity2) {
      form.setFieldsValue({
        goodsQuantity: (values.totalQuantity || 0) - (values.ngQuantity1 || 0) - (values.ngQuantity2 || 0)

      })


    }
    if (changedValues.goodsQuantity || changedValues.qcQuantity || changedValues.qcQuantity == 0) {
      form.setFieldsValue({
        incomeQuantity: (values.goodsQuantity || 0) - (values.qcQuantity || 0)

      })
    }
  }
  const onSubmit = (fieldsValue) => {
    // Manually trim values before submission

    if (fieldsValue.file && withUpload) {
      fieldsValue.file = fieldsValue.file[0].originFileObj;
    }
    let dataToUpdate = { ...fieldsValue };
    const options = { timeZone: 'Asia/Ho_Chi_Minh' };

    if (fieldsValue.birthDate || fieldsValue.date) {
      dataToUpdate.birthDate = dayjs(fieldsValue.birthDate).format('YYYY-MM-DDTHH:mm:ss.SSSZ').toLocaleString('en-US', options);
      dataToUpdate.date = dayjs(fieldsValue.date).format('YYYY-MM-DDTHH:mm:ss.SSSZ').toLocaleString('en-US', options);

    }


    let finalData = {};
    finalData[entity] = dataToUpdate;

    dispatch(crud.create({ entity, jsonData: finalData, withUpload }));
  };

  useEffect(() => {
    if (isSuccess) {

      readBox.open();
      collapsedBox.open();
      panel.open();
      form.resetFields();
      dispatch(crud.resetAction({ actionType: 'create' }));
      dispatch(crud.list({ entity }));
    }
  }, [isSuccess]);

  return (
    <Loading isLoading={isLoading}>
      <Form form={form} layout="vertical"
        onValuesChange={handleChangeValues}
        onFinish={onSubmit}>
        {formElements}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {translate('Submit')}
          </Button>
        </Form.Item>
      </Form>
    </Loading>
  );
}
