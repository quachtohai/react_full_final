import ErpLayout from "../../../layout/ErpLayout";
import ErpPanel from "@/modules/ErpPanelModule";
import useLanguage from "@/locale/useLanguage";
export default function InvoiceDataTableModule({ config }) {
  const translate = useLanguage();
  return (
    <ErpLayout>
      <ErpPanel
        config={config}       
      ></ErpPanel>
    </ErpLayout>
  );
}
