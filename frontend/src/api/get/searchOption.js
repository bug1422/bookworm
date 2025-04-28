import { api } from "..";

export const fetchSearchOption = async () => {
  try {
    const response = await api.options("/search-option");
    return {
      data: response.data?.detail 
    }
  } catch (error) {
    return {
      error: error
    }
  }
};