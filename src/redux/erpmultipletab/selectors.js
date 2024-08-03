import { createSelector } from 'reselect';

const selectErpMultipleTab = (state) => state.erpMultipleTab;

export const selectCurrentItem = createSelector([selectErpMultipleTab], (erp) => erp.current);

export const selectListItems = createSelector([selectErpMultipleTab], (erp) => erp.list);
export const selectItemById = (itemId) =>
  createSelector(selectListItems, (list) => list.result.items.find((item) => item._id === itemId));

export const selectCreatedItem = createSelector([selectErpMultipleTab], (erp) => erp.create);

export const selectUpdatedItem = createSelector([selectErpMultipleTab], (erp) => erp.update);

export const selectRecordPaymentItem = createSelector([selectErpMultipleTab], (erp) => erp.recordPayment);

export const selectReadItem = createSelector([selectErpMultipleTab], (erp) => erp.read);

export const selectDeletedItem = createSelector([selectErpMultipleTab], (erp) => erp.delete);

export const selectSearchedItems = createSelector([selectErpMultipleTab], (erp) => erp.search);
export const selectMailItem = createSelector([selectErpMultipleTab], (erp) => erp.mail);
