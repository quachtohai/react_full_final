import { useCallback, useEffect } from "react";

import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  RedoOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Dropdown, Table, Button, Input } from "antd";
import { PageHeader } from "@ant-design/pro-layout";

import { useSelector, useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";
import { selectListItems } from "@/redux/crud/selectors";
import useLanguage from "@/locale/useLanguage";
import { dataForTable } from "@/utils/dataStructure";
import { useMoney, useDate } from "@/settings";

import { generate as uniqueId } from "shortid";

import { useCrudContext } from "@/context/crud";
import { selectLangDirection } from "@/redux/translate/selectors";

function AddNewItem({ config, formElements }) {
  const dispatch = useDispatch();
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, modal, readBox, editBox, advancedBox } =
    crudContextAction;
  console.log(formElements.props.fields);
  const handelClick = () => {
    let record = {};
    for (const key of Object.keys(formElements.props.fields)) {
      record[key] = formElements.props.fields[key].value;
    }   

    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: "update", data: record }));
    editBox.open();
    panel.open();
    collapsedBox.open();
  };

  return <DeleteOutlined onClick={handelClick} />;
}
export default function DataTableForModal({ config, formElements }) {
  const handleRead = (record) => {
    dispatch(crud.currentItem({ data: record }));
    panel.open();
    collapsedBox.open();
    readBox.open();
  };
  function handleEdit(record) {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: "update", data: record }));
    editBox.open();
    panel.open();
    collapsedBox.open();
  }
  function handleDelete(record) {
    dispatch(crud.currentAction({ actionType: "delete", data: record }));
    modal.open();
  }

  return (
    <>
      <AddNewItem
        key={`${uniqueId()}`}
        config={config}
        formElements={formElements}
      />
    </>
  );
}
