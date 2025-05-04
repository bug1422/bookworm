import { api, getDataResponse, getErrorReponse } from ".";

const routePath = "/users"

export const loginUser = async (email, password) => {
  try {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    const response = await api.post(routePath+"/login", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      skipRefresh: true
    });
    return getDataResponse(response);
  } catch (error) {
    return getErrorReponse(error);
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.get(routePath+"/logout", {
      skipRefresh: true,
      withCredentials: true
    });
    return getDataResponse(response);
  } catch (error) {
    return getErrorReponse(error);
  }
};

export const fetchUserInfo = async () => {
  try {
    const response = await api.get(routePath+"/me");
    return getDataResponse(response);
  } catch (error) {
    return getErrorReponse(error);
  }
};
