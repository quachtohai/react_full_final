import useLanguage from "@/locale/useLanguage";
import CreateGeneralModule from "@/modules/GeneralModule/CreateGeneralModule";
import Module from "@/components/Module";
export default function GeneralPageCreate({ entity }) {
  const modules = Module({ entityDetail: entity });

  const translate = useLanguage();
  const Labels = modules.labels;

  const configPage = {
    entity,
    ...Labels,
  };
  return <CreateGeneralModule config={configPage} />;
}
