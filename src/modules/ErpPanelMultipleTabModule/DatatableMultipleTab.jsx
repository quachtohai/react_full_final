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
import { Dropdown, Table, Button, Space, Switch } from "antd";
import { PageHeader } from "@ant-design/pro-layout";

import AutoCompleteAsync from "@/components/AutoCompleteAsync";
import { useSelector, useDispatch } from "react-redux";
import useLanguage from "@/locale/useLanguage";
import { erpMultipleTab } from "@/redux/erpmultipletab/actions";
import { selectListItems } from "@/redux/erpmultipletab/selectors";
import { useErpContext } from "@/context/erp";
import { generate as uniqueId } from "shortid";
import { useNavigate } from "react-router-dom";

import { selectLangDirection } from "@/redux/translate/selectors";
import DatatableMultipleTabDetails from "./DatatableMultipleTabDetails";

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

export default function DataTableMultipleTab({ config, extra = [], master, dataTableDetails, dataSummary, handleChangeDataSummary }) {
  const translate = useLanguage();
  let { entity, dataTableColumns, disableAdd = false, searchConfig } = config;

  const [checkStrictly, setCheckStrictly] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSourceDetails, setDataSourceDetails] = useState([]);

  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    dataSummary = [{
      userInfoCode: "USER001",
      firstName: "QUACHTOHAIFIRSTNAME",
      lastName: "QUACHTOHAILASTNAME",
      accountCode: "USERINFOCODE001",
      accountName: "USERINFONAME001",
      password: "123456",
      facultyDetaiL: "SALE"
    },
    {
      userInfoCode: "USER002",
      firstName: "QUACHTOHAIFIRSTNAME",
      lastName: "QUACHTOHAILASTNAME",
      accountCode: "USERINFOCODE002",
      accountName: "USERINFONAME002",
      password: "456789",
      facultyDetaiL: "ACCOUNT"
    }
    ]
    handleChangeDataSummary(dataSummary);
    setSelectedRowKeys(newSelectedRowKeys);
    let rowTmps = newSelectedRows.filter((x) => x.children == undefined);
    let dataSourceTmpClone = dataSource.map(data => Object.assign({}, data));
    let dataSourceTmp = [];
    let dataSourceTmp2 = [];
    for (var i = 0; i < dataSource.length; i++) {
      dataSourceTmp[i] = dataSourceTmpClone[i]
      dataSourceTmp[i].masterId = dataSourceTmp[i].key
      delete dataSourceTmp[i].children
      delete dataSourceTmp[i].key
      dataSourceTmp2.push(dataSourceTmp[i])
      console.log(dataSourceTmp2);
    }

    rowTmps = rowTmps.map((rowTmp) => ({
      ...rowTmp,
      ...dataSourceTmp2.filter((x) => x.masterId == rowTmp.masterId)[0],
    }));
    console.log(rowTmps);
    setDataSourceDetails(rowTmps);
  };
  //console.log(dataSourceDetails);
  const { DATATABLE_TITLE } = config;

  const { result: listResult, isLoading: listIsLoading } =
    useSelector(selectListItems);

  const { pagination, items: dataSource } = listResult;

  const { erpContextAction } = useErpContext();
  const { modal } = erpContextAction;

  const items = [
    {
      label: translate("Show"),
      key: "read",
      icon: <EyeOutlined />,
    },
  ];

  const navigate = useNavigate();

  const handleRead = (record) => {
    dispatch(erp.currentItem({ data: record }));
    navigate(`/${entity}/read/${record._id}`);
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
                default:
                  break;
              }
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
      pageIndex: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    };

    dispatch(erpMultipleTab.listWithDetails({ entity, options }));
  };

  const dispatcher = () => {
    dispatch(erpMultipleTab.listWithDetails({ entity }));
  };

  useEffect(() => {
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, []);

  const filterTable = (value) => {
    const options = { equal: value, filter: searchConfig?.entity };
    dispatch(erpMultipleTab.listWithDetails({ entity, options }));
  };
  const langDirection = useSelector(selectLangDirection);

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        onSelect: (changeableRowKeys, changeableRows) => {
          setSelectedRowKeys(newSelectedRowKeys);

        },
      },
    ],
  };

  return (
    <>
      {master == 1 ? (
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

              !disableAdd && (
                <AddNewItem config={config} key={`${uniqueId()}`} />
              ),
            ]}
            style={{
              padding: "20px 0px",
              direction: langDirection,
            }}
          ></PageHeader>
          <Space
            align="center"
            style={{
              marginBottom: 16,
            }}
          >
            CheckStrictly:{" "}
            <Switch checked={checkStrictly} onChange={setCheckStrictly} />
          </Space>
          <Table
            columns={dataTableColumns}
            //rowKey={(item) => item.key}
            rowSelection={{
              ...rowSelection,
              checkStrictly,
            }}
            dataSource={dataSource}
            pagination={pagination}
            loading={listIsLoading}
            onChange={handelDataTableLoad}
            scroll={{ x: true }}
          />
        </>
      ) : (
        <div>
          <DatatableMultipleTabDetails
            columnsData={dataTableDetails}
            detailsData={dataSourceDetails}
          />
        </div>
      )}
    </>
  );
}
