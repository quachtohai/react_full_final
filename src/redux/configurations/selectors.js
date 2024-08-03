import { createSelector } from 'reselect';

const selectConfig = (state) => state.config;

export const selectCurrentItem = createSelector([selectConfig], (config) => config.current);

export const selectListItems = createSelector([selectConfig], (config) => config.list);
export const selectItemById = (itemId) =>
  createSelector(selectListItems, (list) => list.result.items.find((item) => item._id === itemId));

export const selectCreatedItem = createSelector([selectConfig], (config) => config.create);

export const selectUpdatedItem = createSelector([selectConfig], (config) => config.update);

export const selectReadItem = createSelector([selectConfig], (config) => config.read);

export const selectDeletedItem = createSelector([selectConfig], (config) => config.delete);

export const selectSearchedItems = createSelector([selectConfig], (config) => config.search);
