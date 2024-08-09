import { useLayoutEffect, useState } from 'react';
import DataTable from './DatatableMultipleTab';
import { useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import { useErpContext } from '@/context/erp';

export default function ErpPanelMultipleTab({ config, extra, master, dataTableDetails, dataSummary, handleChangeDataSummary }) {
  
  const dispatch = useDispatch();
  const { state } = useErpContext();

  const dispatcher = () => {
    dispatch(erp.resetState());
  };

  useLayoutEffect(() => {
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      <DataTable config={config} extra={extra}
        master={master} dataTableDetails={dataTableDetails} dataSummary={dataSummary}
        handleChangeDataSummary={handleChangeDataSummary} />
    </>
  );
}
