import React from "react";
import { useState, useEffect } from "react";
import useLanguage from "@/locale/useLanguage";
import { tagColor } from "@/utils/statusTagColor";
import { useMoney, useDate } from "@/settings";
import { configuration } from "@/redux/configurations/actions";
import { useSelector, useDispatch } from "react-redux";
import AutoCompleteAsync from "@/components/AutoCompleteAsync";
import { DatePicker } from "antd";
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
import store from "@/redux/store";
function FormData({ entityDetail, readOnly }) {

  const dispatch = useDispatch();
  const entity = "forms";
  const [formDatas, setFormDatas] = useState([]);
  const translate = useLanguage();
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
        };
        if (
          formDataObject.entityName.toLowerCase() == entityDetail.toLowerCase() &&
          formDataObject.type == "1"
        ) {
          finalResults.push(formDataObject);
        }
      }
      setFormDatas(finalResults);
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

  return (
    <>
      <Row gutter={[12, 0]} >
        {formDatas.map((formData) => {
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
          }

          return (
            <>
              <Col className="gutter-row" span={formData.span}>
                <Form.Item
                  name={formData.fieldName}
                  label={formData.label}
                  rules={rules}
                  disabled={readOnly ? true : false}
                >
                  {formData.entitySearch ? (
                    <AutoCompleteAsync
                      entity={formData.entitySearch}
                      displayLabels={formData.displayLabels.split(",")}
                      searchFields={formData.searchFields}
                      redirectLabel={formData.redirectLabel}
                      withRedirect
                      urlToRedirect={formData.urlRedirect}
                    />
                  ) : (
                    undefined
                  )}
                  {formData.description == "number" ? (
                    <InputNumber style={{ width: "100%" }} min={1} disabled={readOnly ? true : false}
                    />
                  ) : (
                    undefined
                  )}
                  {formData.description == "date" ? (

                    <DatePicker style={{ width: "100%" }} format={dateFormat} disabled={readOnly ? true : false}/>

                  ) : (
                    undefined
                  )}
                  {formData.description == "select" ? (
                    <Select options={[
                      { value: 'draft', label: translate('Draft') },
                      { value: 'pending', label: translate('Pending') },
                      { value: 'sent', label: translate('Sent') },
                    ]} disabled={readOnly ? true : false}
                      style={readOnly ? { width: '100%', background: "rgba(153, 154, 159, 0.5)" } : undefined} >

                    </Select>
                  ) : (
                    undefined
                  )}
                  {formData.description == "string" && formData.fieldName.toLowerCase() != "password" &&
                    !formData.entitySearch ? (
                    <Input disabled={readOnly ? true : false}
                      style={readOnly ? { width: '100%', background: "rgba(153, 154, 159, 0.5)" } : undefined} />
                  ) : (
                    undefined
                  )}
                  {formData.description == "string" && formData.fieldName.toLowerCase() == "password" &&
                    !formData.entitySearch ? (
                    <InputPassword disabled={readOnly ? true : false}
                      style={readOnly ? { width: '100%', background: "rgba(153, 154, 159, 0.5)" } : undefined} />
                  ) : (
                    undefined
                  )}
                </Form.Item>
              </Col>
            </>
          );
        })}
      </Row>
    </>
  );
}

export default FormData;
