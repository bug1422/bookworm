import { api } from "..";

export const fetchSearchOption = async () => {
  try {
    const response = await api.options("/search-option");
    return response.data?.detail;
  } catch (error) {
    console.log(error);
    return [];
  }
};