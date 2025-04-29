import { api, getErrorReponse, getDataResponse } from "..";

export const fetchSearchOption = async () => {
  try {
    const response = await api.options("/search-option");
    return getDataResponse(response)
  } catch (error) {
    return getErrorReponse(error)
  }
};