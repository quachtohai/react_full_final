import useLanguage from '@/locale/useLanguage';
import UpdateGeneralModule from '@/modules/GeneralModule/UpdateGeneralModule';
import Module from "@/components/Module";

export default function GeneralPageUpdate({entity, detail}) {
  const modules = Module({ entityDetail: entity });
  console.log(detail);
  const translate = useLanguage();
  const Labels = modules.labels;

  const configPage = {
    entity,
    ...Labels,
  };
  return <UpdateGeneralModule config={configPage} detail = {detail} />;
}
