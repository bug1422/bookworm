import { api, getDataResponse, getErrorReponse } from "..";

export const loginUser = async (email, password) => {
  try {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    const response = await api.post("/users/login", formData, {
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
    const response = await api.get("/users/logout");
    return getDataResponse(response);
  } catch (error) {
    return getErrorReponse(error);
  }
};

export const fetchUserInfo = async () => {
  try {
    const response = await api.get("/users/me");
    return getDataResponse(response);
  } catch (error) {
    return getErrorReponse(error);
  }
};
