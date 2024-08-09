import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';

import useLanguage from '@/locale/useLanguage';
import Module from "@/components/Module";
import { configuration } from "@/redux/configurations/actions";
import { useSelector, useDispatch } from "react-redux";
import store from "@/redux/store";
import { useState, useEffect } from 'react';


export default function GeneralMasterPage({ entity }) {
  const dispatch = useDispatch();
  const entityForms = "forms";
  const [formDatas, setFormDatas] = useState({});
  const [fields, setFields] = useState({});

  const dispatcher = () => {
    dispatch(configuration.list({ entity: entityForms })).then((data) => {

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
          redirectLabel: formDataTmps.data[i].redirectLabel,
          urlRedirect: formDataTmps.data[i].urlRedirect,
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
          formDataObject.entityName.toLowerCase() == entity.toLowerCase() &&
          formDataObject.type == "3"
        ) {

          let fieldTmp = {
          }
          if (formDataObject.description == "search") {
            fieldTmp = {
              type: 'search',
              renderAsTag: true,
              label: formDataObject.label,
              entity: formDataObject.entitySearch,
              redirectLabel: formDataObject.redirectLabel,
              withRedirect: true,
              urlToRedirect:formDataObject.urlRedirect,
              displayLabels: [formDataObject.displayLabels],
              searchFields: formDataObject.searchFields,
              dataIndex: ['mainContact', 'firstname'],
              require: formDataObject.rule[0].includes("require") ? true : false
            }
          }
          if (formDataObject.description == "string") {
            fieldTmp = {
              type: "string",
              require: formDataObject.rule[0].includes("require") ? true : false
            }
          }
          if (formDataObject.description == "phone") {
            fieldTmp = {
              type: "phone",
              require: formDataObject.rule[0].includes("require") ? true : false
            }
          }

          if (formDataObject.description == "country") {
            fieldTmp = {
              type: "country",
              require: formDataObject.rule[0].includes("require") ? true : false
            }
          }

          if (formDataObject.description == "email") {
            fieldTmp = {
              type: "email",
              require: formDataObject.rule[0].includes("require") ? true : false
            }
          }
          if (formDataObject.description == "website") {
            fieldTmp = {
              type: "url",
              require: formDataObject.rule[0].includes("require") ? true : false
            }
          }


          finalResults[formDataObject.fieldName] = fieldTmp;
          

        }
      }
      setFields({ ...finalResults });
    });
  };
  console.log(fields);
  useEffect(() => {
    const controller = new AbortController();
    dispatcher();

    return () => {
      controller.abort();
    };
  }, []);


  const modules = Module({ entityDetail: entity });
  const translate = useLanguage();

  const dataTableColumns = modules.dataTableColumns;
  const searchConfig = modules.searchConfig;
  const Labels = modules.labels;
  const deleteModalLabels = modules.deleteModalLabels;
  console.log(searchConfig);
  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
  };
  return (
    <CrudModule
      createForm={<DynamicForm fields={fields} />}
      updateForm={<DynamicForm fields={fields} />}
      config={config}
    />
  );
}
