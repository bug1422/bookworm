import { api, getErrorReponse, getDataResponse } from '.';

const routePath = '/options';

export const fetchSearchOption = async () => {
  try {
    const response = await api.options(routePath + '/search');
    return getDataResponse(response);
  } catch (error) {
    return getErrorReponse(error);
  }
};

export const fetchMoneyOption = async () => {
  try {
    const response = await api.options(routePath + '/money');
    return getDataResponse(response);
  } catch (error) {
    return getErrorReponse(error);
  }
};
