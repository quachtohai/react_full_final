import Tabs from "@/components/Tabs";
export default function OrderDataTableModule({ config, dataTableDetails }) {
  const tabData = [
    { label: config?.entity.toUpperCase() },
    { label: "DETAILS" },
    { label: "SUMMARY" },
  ];
  
  return (
    <>
      <div className="App">
        <Tabs
          tabs={tabData}
          config={config}
          dataTableDetails={dataTableDetails}
        ></Tabs>
      </div>
    </>
  );
}
