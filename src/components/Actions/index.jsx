import React from "react";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import useLanguage from "@/locale/useLanguage";
import { tagColor } from "@/utils/statusTagColor";
import { useMoney, useDate } from "@/settings";
import { Tag } from "antd";
import { configuration } from "@/redux/configurations/actions";
import { useSelector, useDispatch } from "react-redux";
import AutoCompleteAsync from "@/components/AutoCompleteAsync";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  RedoOutlined,
  PlusOutlined,
  EllipsisOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
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
function Actions({ entityDetail }) {
  const dispatch = useDispatch();
  const entity = "actioninfos";
  const [actionInfoDatas, setActionInfoDatas] = useState([]);
  const [actionInfoItems, setActionInfoItems] = useState({});
  const translate = useLanguage();
  const dispatcher = () => {
    dispatch(configuration.list({ entity: entity })).then((data) => {
      let finalResults = [];
      let actionInfoDataTmps =
        store.getState().crudConfiguration.list.result.items.actionInfos;
      for (var i = 0; i < actionInfoDataTmps.count; i++) {
        let actionInfoDataObject = {
          label: actionInfoDataTmps.data[i].label,
          key: actionInfoDataTmps.data[i].key,
          icon: actionInfoDataTmps.data[i].key.includes("read") ? (
            <EyeOutlined />
          ) : actionInfoDataTmps.data[i].key.includes("edit") ? (
            <EditOutlined />
          ) : actionInfoDataTmps.data[i].key.includes("download") ? (
            <FilePdfOutlined />
          ) : actionInfoDataTmps.data[i].key.includes("delete") ? (
            <DeleteOutlined />
          ) : (
            <PlusOutlined />
          ),
        };
        if (
          actionInfoDataTmps.data[i].type == "1" &&
          actionInfoDataTmps.data[i].moduleCode == entityDetail
        ) {
          finalResults.push(actionInfoDataObject);
        }
      }
      setActionInfoDatas(finalResults);
    });
  };
  useEffect(() => {
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, []);

  return actionInfoDatas;
}

export default Actions;
