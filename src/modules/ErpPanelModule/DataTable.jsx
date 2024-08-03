import { useEffect, useState } from "react";
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
import { Dropdown, Table, Button } from "antd";
import { PageHeader } from "@ant-design/pro-layout";

import AutoCompleteAsync from "@/components/AutoCompleteAsync";
import { useSelector, useDispatch } from "react-redux";
import useLanguage from "@/locale/useLanguage";
import { erp } from "@/redux/erp/actions";
import { selectListItems } from "@/redux/erp/selectors";
import { useErpContext } from "@/context/erp";
import { generate as uniqueId } from "shortid";
import { useNavigate } from "react-router-dom";
import { useMoney, useDate } from "@/settings";
import { DOWNLOAD_BASE_URL } from "@/config/serverApiConfig";
import { selectLangDirection } from "@/redux/translate/selectors";
import Actions from "@/components/Actions";
import { DatePicker } from "antd";

function AddNewItem({ config }) {
  const navigate = useNavigate();
  const { ADD_NEW_ENTITY, entity } = config;

  const handleClick = () => {
    navigate(`/${entity.toLowerCase()}/create`);
  };

  return (
    <Button onClick={handleClick} type="primary" icon={<PlusOutlined />}>
      {ADD_NEW_ENTITY}
    </Button>
  );
}

export default function DataTable({ config, extra = [], detail }) {
  const translate = useLanguage();
  let { entity, dataTableColumns, disableAdd = false, searchConfig } = config;
  const actions = Actions({ entityDetail: detail || entity });

  const { DATATABLE_TITLE } = config;

  const { result: listResult, isLoading: listIsLoading } =
    useSelector(selectListItems);

  const { pagination, items: dataSource } = listResult;

  const { erpContextAction } = useErpContext();
  const { modal } = erpContextAction;
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const items = actions;

  const navigate = useNavigate();

  const handleRead = (record) => {
    dispatch(erp.currentItem({ data: record }));
    navigate(`/${detail || entity}/read/${record.id}`);
  };
  const handleEdit = (record) => {
    const data = { ...record };
    dispatch(erp.currentAction({ actionType: "update", data }));
    navigate(`/${detail || entity}/update/${record.id}`);
  };
  const handleDownload = (record) => {
    window.open(
      `${DOWNLOAD_BASE_URL}${entity}/${entity}-${record.id}.pdf`,
      "_blank"
    );
  };

  const handleDelete = (record) => {
    dispatch(erp.currentAction({ actionType: "delete", data: record }));
    modal.open();
  };

  const handleRecordPayment = (record) => {
    dispatch(erp.currentItem({ data: record }));
    navigate(`/invoice/pay/${record.id}`);
  };

  dataTableColumns = [
    ...dataTableColumns,
    {
      title: "",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => {
              switch (key) {
                case "read":
                  handleRead(record);
                  break;
                case "edit":
                  handleEdit(record);
                  break;
                case "download":
                  handleDownload(record);
                  break;
                case "delete":
                  handleDelete(record);
                  break;
                case "recordPayment":
                  handleRecordPayment(record);
                  break;
                default:
                  break;
              }
              // else if (key === '2')handleCloseTask
            },
          }}
          trigger={["click"]}
        >
          <EllipsisOutlined
            style={{ cursor: "pointer", fontSize: "24px" }}
            onClick={(e) => e.preventDefault()}
          />
        </Dropdown>
      ),
    },
  ];

  const dispatch = useDispatch();

  const handelDataTableLoad = (pagination) => {
    const options = {
      page: pagination.current || 1,
      items: pagination.pageSize || 10,
    };
    const optionsDate = {
      fromDate: fromDate,
      toDate: toDate,
    };

    dispatch(erp.list({ entity, options,optionsDate }));
  };

  const dispatcher = () => {
    dispatch(erp.list({ entity }));
  };

  useEffect(() => {
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, []);

  const filterTable = (value) => {
    console.log(value);
    console.log(fromDate, toDate);
    const options = { equal: value, filter: searchConfig?.entity };
    const optionsDate = {
      fromDate: fromDate,
      toDate: toDate,
    };
    dispatch(erp.list({ entity, options, optionsDate }));
  };
  const handleDatePickerChange = (date, dateString, id) => {
    console.log(date, dateString, id);
  };
  const langDirection = useSelector(selectLangDirection);

  return (
    <>
      <PageHeader
        title={DATATABLE_TITLE}
        ghost={true}
        onBack={() => window.history.back()}
        backIcon={
          langDirection === "rtl" ? (
            <ArrowRightOutlined />
          ) : (
            <ArrowLeftOutlined />
          )
        }
        extra={[
          <DatePicker
            style={{ width: "100%" }}
            format={"YYYY-MM-DD"}
            placeholder="from date"
            onChange={(date, dateString) => {
              handleDatePickerChange(date, dateString, "fromDate");
              setFromDate(dateString);
            }}
          />,
          <DatePicker
            style={{ width: "100%" }}
            format={"YYYY-MM-DD"}
            placeholder="to date"
            onChange={(date, dateString) => {
              handleDatePickerChange(date, dateString, "fromDate");
              setToDate(dateString);
            }}
          />,

          <AutoCompleteAsync
            key={`${uniqueId()}`}
            entity={searchConfig?.entity}
            displayLabels={["name"]}
            searchFields={"name"}
            onChange={filterTable}
          />,
          <Button
            onClick={handelDataTableLoad}
            key={`${uniqueId()}`}
            icon={<RedoOutlined />}
          >
            {translate("Refresh")}
          </Button>,

          !disableAdd && <AddNewItem config={config} key={`${uniqueId()}`} />,
        ]}
        style={{
          padding: "20px 0px",
          direction: langDirection,
        }}
      ></PageHeader>

      <Table
        columns={dataTableColumns}
        rowKey={(item) => item.id}
        dataSource={dataSource}
        pagination={pagination}
        loading={listIsLoading}
        onChange={handelDataTableLoad}
        scroll={{ x: true }}
      />
    </>
  );
}
