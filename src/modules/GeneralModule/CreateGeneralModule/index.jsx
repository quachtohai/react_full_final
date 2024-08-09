import ErpLayout from "../../../layout/ErpLayout";
import CreateItem from '@/modules/ErpPanelModule/CreateItem';
import GeneralForm from '@/modules/GeneralModule/Forms/GeneralForm';

export default function CreateGeneralModule({ config, dataSummary }) {
  return (
    <ErpLayout>
      <CreateItem config={config} CreateForm={GeneralForm} dataSummary = {dataSummary} /> 
    </ErpLayout>
  );
}
