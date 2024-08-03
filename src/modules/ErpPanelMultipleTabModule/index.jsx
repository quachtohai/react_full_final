import { useLayoutEffect, useState } from 'react';

import DataTable from './DatatableMultipleTab';

import Delete from './DeleteItem';

import { useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';

import { useErpContext } from '@/context/erp';
import { Button } from 'antd';

export default function ErpPanelMultipleTab({ config, extra, master, dataTableDetails, setDataSummary,handleChangeDataSummary }) {
  
  const dispatch = useDispatch();
  const { state } = useErpContext();
  const { deleteModal } = state;
  const [count, setCount] = useState(1);

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
      <Button onClick={()=>handleChangeDataSummary(setDataSummary(10))}>AAAAAAAAAAAAA</Button>
      <DataTable config={config} extra={extra} master = {master} dataTableDetails={dataTableDetails} />      
    </>
  );
}
