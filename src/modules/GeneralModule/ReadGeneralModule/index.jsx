import NotFound from '@/components/NotFound';

import ErpLayout from "../../../layout/ErpLayout";
import ReadItem from '@/modules/ErpPanelModule/ReadItem';
import GeneralForm from '@/modules/GeneralModule/Forms/GeneralForm';

import PageLoader from '@/components/PageLoader';

import { erp } from '@/redux/erp/actions';

import { selectReadItem } from '@/redux/erp/selectors';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { settingsAction } from '@/redux/settings/actions';

export default function ReadGeneralModule({ config, detail }) {
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
          <ReadItem config={config} ReadForm={GeneralForm} currentData={currentResult} detail={detail} />
        ) : (
          <NotFound entity={config.entity} />
        )}
      </ErpLayout>
    );
}
