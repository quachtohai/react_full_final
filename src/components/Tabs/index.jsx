import React, { useState } from "react";
import Tab from "./Tab";
import "@/style/tab.css";
import ErpLayout from "../../layout/ErpLayout";
import ErpPanelMultipleTab from "../../modules/ErpPanelMultipleTabModule";
import GeneralPageCreate from "../../pages/GeneralPage/GeneralPageCreate";
const Tabs = ({ tabs, config, children, dataTableDetails }) => {
  const [activeTab, setActiveTab] = useState(1);
  const {dataSummary, setDataSummary} =useState(1);
  const handleChangeDataSummary = (items)=>{    
    setDataSummary(items);
    console.log(dataSummary);
  }

  const handleTabClick = (index) => {
    setActiveTab(index + 1);
  };

  return (
    <div className="tabs-container">
      <div className="tabs">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            onClick={() => handleTabClick(index)}
            isActive={index === activeTab}
            children={children}
          />
        ))}
      </div>
      <div className="tab-content">
        {activeTab == 1 ? (
          <ErpLayout>
            <ErpPanelMultipleTab
              config={config}
              master={1}
              dataTableDetails={dataTableDetails}
              setDataSummary = {setDataSummary}
              handleChangeDataSummary = {handleChangeDataSummary}
            ></ErpPanelMultipleTab>
          </ErpLayout>
        ) : activeTab == 2 ? (
          <ErpLayout>
            <ErpPanelMultipleTab
              config={config}
              master={0}
              dataTableDetails={dataTableDetails}
            ></ErpPanelMultipleTab>
          </ErpLayout>
        ) : (
          <GeneralPageCreate entity="userinfo" />
        )}
      </div>
    </div>
  );
};

export default Tabs;
