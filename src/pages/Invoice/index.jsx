import InvoiceDataTableModule from "@/modules/InvoiceModule/InvoiceDataTableModule";
import Module from "@/components/Module";
export default function Invoice() {
  const modules = Module({entityDetail:"invoice"});
  const dataTableColumns = modules.dataTableColumns;
  const searchConfig = modules.searchConfig;
  const Labels = modules.labels;
  const deleteModalLabels = modules.deleteModalLabels;
  const entity = "invoice";
  let configPage = {};
  if (Labels != undefined) {
    configPage = {
      entity,
      ...Labels,
    };
  }
  let config = {};
  if (searchConfig != undefined && searchConfig.entity !=undefined) {
    config = {
      ...configPage,
      dataTableColumns,
      searchConfig,
      deleteModalLabels,
    };
  }  
  if(config.searchConfig!=undefined && searchConfig.entity !=undefined){
    return <InvoiceDataTableModule config={config} />;
  }

    
}
