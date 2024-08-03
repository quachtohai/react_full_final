import React from "react";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import useLanguage from "@/locale/useLanguage";
import { tagColor } from "@/utils/statusTagColor";
import { useMoney, useDate } from "@/settings";
import { Tag } from "antd";
import { configuration } from "@/redux/configurations/actions";
import { useSelector, useDispatch } from "react-redux";
import store from "@/redux/store";
function Module({ entityDetail }) {
  const dispatch = useDispatch();
  const entity = "modules";
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const { moneyFormatter } = useMoney();
  const [dataTableColumns, setDataTableColumns] = useState([]);
  const [searchConfig, setSearchConfig] = useState({});
  const [labels, setLabels] = useState({});
  const deleteModalLabels = ["number", "client.name"];

  const dispatcher = () => {
    dispatch(configuration.list({ entity: entity })).then((data) => {
      let modules =
        store.getState().crudConfiguration.list.result.items.modules;

      let dataTableColumn = {};
      let searchConfigTmp = {
        entity: modules.data[0].entitySearch,
        displayLabels: modules.data[0].displayLabels.split(","),
        searchFields: modules.data[0].searchFields,
      };
      
      let dataTableColumnTmps = [];
      for (var i = 0; i < modules.count; i++) {
        dataTableColumn = {
          entity: modules.data[i].entityName,
          title: modules.data[i].title,
          dataIndex: modules.data[i].dataIndex.split(","),
          onCell:
            modules.data[i].description === "money"
              ? () => {
                  return {
                    style: {
                      textAlign: "right",
                      whiteSpace: "nowrap",
                      direction: "ltr",
                    },
                  };
                }
              : "",
          render:
            modules.data[i].description === "date"
              ? (date) => {
                  return dayjs(date).format(dateFormat);
                }
              : modules.data[i].description === "money"
                ? (total, record) => {
                    return moneyFormatter({
                      amount: total,
                      currency_code: record.currency,
                    });
                  }
                : modules.data[i].description === "status"
                  ? (status) => {
                      let tagStatus = tagColor(status);

                      return (
                        <Tag color={tagStatus.color}>
                          {status && translate(tagStatus.label)}
                        </Tag>
                      );
                    }
                  : "",
        };
        if (dataTableColumn.entity.toLowerCase() == entityDetail)
          dataTableColumnTmps.push(dataTableColumn);
      }

      setDataTableColumns(dataTableColumnTmps);
      setSearchConfig(searchConfigTmp);
      setLabels({
        PANEL_TITLE: modules.data[0].entity,
        DATATABLE_TITLE: modules.data[0].name,
        ADD_NEW_ENTITY: modules.data[0].addNewEntity,
        ENTITY_NAME: modules.data[0].entityName,
        RECORD_ENTITY: modules.data[0].recordEntityname,
      });
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    dispatcher();

    return () => {
      controller.abort();
    };
  }, []);

  return { dataTableColumns, searchConfig, labels, deleteModalLabels };
}

export default Module;
