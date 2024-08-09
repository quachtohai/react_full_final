import NotFound from '@/components/NotFound';

import ErpLayout from "../../../layout/ErpLayout";
import UpdateItem from '@/modules/ErpPanelModule/UpdateItem';
import GeneralForm from '@/modules/GeneralModule/Forms/GeneralForm';

import PageLoader from '@/components/PageLoader';

import { erp } from '@/redux/erp/actions';

import { selectReadItem } from '@/redux/erp/selectors';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { settingsAction } from '@/redux/settings/actions';

export default function UpdateGeneralModule({ config, detail }) {
  const dispatch = useDispatch();

  const { id } = useParams();

  useLayoutEffect(() => {
    dispatch(erp.read({ entity: detail || config.entity, id }));
  }, [id]);

  const { result: currentResult, isSuccess, isLoading = true } = useSelector(selectReadItem);
  console.log(currentResult);

  useLayoutEffect(() => {

    if (currentResult) {
      const data = { ...currentResult };
      dispatch(erp.currentAction({ actionType: 'update', data }));
    }
  }, [currentResult]);

  if (isLoading) {
    return (
      <ErpLayout>
        <PageLoader />
      </ErpLayout>
    );
  } else
    return (
      <ErpLayout>
        {isSuccess ? (
          <UpdateItem config={config} UpdateForm={GeneralForm} currentData={currentResult} detail={detail} />
        ) : (
          <NotFound entity={config.entity} />
        )}
      </ErpLayout>
    );
}
