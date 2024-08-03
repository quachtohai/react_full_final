import CrudModuleForModal from '@/modules/CrudModule/CrudModuleForModal';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function People({fieldForModals}) {
  const translate = useLanguage();
  const entity = 'DETAILS';
  const searchConfig = {
    displayLabels: ['firstname', 'lastname'],
    searchFields: 'firstname,lastname,email',
  };
  const deleteModalLabels = ['firstname', 'lastname'];

  const Labels = {
    PANEL_TITLE: 'DETAILS',
    DATATABLE_TITLE: translate('people_list'),
    ADD_NEW_ENTITY: translate('add_new_person'),
    ENTITY_NAME: translate('person'),
  };
  const configPage = {
    entity,
    ...Labels,
  };

  const config = {
    ...configPage,
    fields: fieldForModals,
    searchConfig,
    deleteModalLabels,
  };
  return (
    <CrudModuleForModal
      //createForm={<DynamicForm fields={fieldForModals} />}
      updateForm={<DynamicForm fields={fieldForModals} />}
      config={config}
    />
  );
}
