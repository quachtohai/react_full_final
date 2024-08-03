import dayjs from "dayjs";
import { Tag } from "antd";
import useLanguage from "@/locale/useLanguage";
import { tagColor } from "@/utils/statusTagColor";

import { useMoney, useDate } from "@/settings";
import OrderDataTableModule from "@/modules/OrderModule/OrderDataTableModule";

export default function Order() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const entity = "order";
  const { moneyFormatter } = useMoney();

  const searchConfig = {
    entity: "client",
    displayLabels: ["name"],
    searchFields: "name",
  };
  const deleteModalLabels = ["number", "client.name"];
  const dataTableColumns = [
    {
      title: translate("Number"),
      dataIndex: "number",
    },
    {
      title: "Order Customer",
      dataIndex: ["name"],
    },
    {
      title: translate("Date"),
      dataIndex: "date",
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: translate("expired Date"),
      dataIndex: "date",
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },

    {
      title: "Approve quantity",
      dataIndex: "approvedQuantity",
    },

    {
      title: translate("Status"),
      dataIndex: "status",
      render: (status) => {
        let tagStatus = tagColor(status);

        return (
          <Tag color={tagStatus.color}>
            {status && translate(tagStatus.label)}
          </Tag>
        );
      },
    },
  ];

  const Labels = {
    PANEL_TITLE: translate("order"),
    DATATABLE_TITLE: translate("order_list"),
    ADD_NEW_ENTITY: translate("add_new_order"),
    ENTITY_NAME: translate("order"),
    RECORD_ENTITY: translate("record_payment"),
  };
  const dataTableDetails = [
    {
      title: "Name",
      dataIndex: "name",
      editable: false,
    },

    {
      title: "Date",
      dataIndex: "date",
      editable: false,
    },
    {
      title: "Status",
      dataIndex: "status",
      editable: true,
    },
    {
      title: "ItemId",
      dataIndex: "itemId",
      editable: false,
    },
    {
      title: "ItemName",
      dataIndex: "itemName",
      editable: false,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      editable: false,
    },
    {
      title: "ApprovedQuantity",
      dataIndex: "approvedQuantity",
      editable: true,
    },
  ];

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };

  return (
    <OrderDataTableModule config={config} dataTableDetails={dataTableDetails} />
  );
}
