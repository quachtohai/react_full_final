import useLanguage from '@/locale/useLanguage';
import ReadGeneralModule from '@/modules/GeneralModule/ReadGeneralModule';
import Module from "@/components/Module";

export default function GeneralPageRead({entity, detail}) {
  const modules = Module({ entityDetail: entity });
  console.log(detail);
  const translate = useLanguage();
  const Labels = modules.labels;

  const configPage = {
    entity,
    ...Labels,
  };
  return <ReadGeneralModule config={configPage} detail = {detail} />;
}
