import { api } from "@/api";
import { fetchUserInfo, loginUser, logoutUser } from "@/api/get/user";
import { useQuery } from "@tanstack/react-query";
import { toastError, toastSuccess } from "../toast";
import { useContext, createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const isAuthenticated = user !== null;

  const getUserInfo = async () => {
    setLoading(true);
    const response = await fetchUserInfo();
    if (response.data) {
      setUser(response.data);
    }
    setLoading(false);
  };
  const signin = async (email, password) => {
    const response = await loginUser(email, password);
    console.log(response)
    if (response.error) {
      throw Error(response.message)
    }
  };
  const signout = async () => {
    const response = await logoutUser(email, password);
    if (response.error) {
      toastError("Signout failed", response.message);
    } else {
      toastSuccess("Signout success");
    }
  };
  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userInfo: user,
        userIsLoading: isLoading,
        signin,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
