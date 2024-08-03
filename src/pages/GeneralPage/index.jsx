import GeneralDataTableModule from "@/modules/GeneralModule/GeneralDataTableModule";
import Module from "@/components/Module";
export default function GeneralPage({entity, detail}) {
  const modules = Module({entityDetail:entity});
  const dataTableColumns = modules.dataTableColumns;
  const searchConfig = modules.searchConfig;
  const Labels = modules.labels;
  const deleteModalLabels = modules.deleteModalLabels;
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
    return <GeneralDataTableModule config={config} detail = {detail} />;
  }
    
}
