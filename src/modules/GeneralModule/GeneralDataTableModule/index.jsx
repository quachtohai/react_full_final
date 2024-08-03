import ErpLayout from "../../../layout/ErpLayout";
import ErpPanel from "@/modules/ErpPanelModule";
import useLanguage from "@/locale/useLanguage";
export default function GeneralDataTableModule({ config, detail}) {

  const translate = useLanguage();
  return (
    <ErpLayout>
      <ErpPanel
        config={config} detail = {detail}       
      ></ErpPanel>
    </ErpLayout>
  );
}
