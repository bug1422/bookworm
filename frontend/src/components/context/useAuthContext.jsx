import { fetchUserInfo, loginUser, logoutUser } from "@/api/user";
import { checkConflictingCart } from "@/lib/cart";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, createContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const queryClient = useQueryClient()
  const FetchCurrentUser = async () => {
    const response = await fetchUserInfo();
    if (response.error) {
      return null;
    } else {
      return response.data;
    }
  };
  const queryKey = "user-info"
  const { data: user, isLoading: userIsLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: () => FetchCurrentUser(),
    enabled: true,
  });
  const isAuthenticated = user !== undefined && user !== null;

  useEffect(()=>{
    if(user != undefined){
      checkConflictingCart(user)
    }
  },[user])


  const signin = async (email, password) => {
    const response = await loginUser(email, password);
    console.log(response)
    if (response.error) {
      throw Error(response.errorMessage);
    }
    queryClient.invalidateQueries(queryKey)
  };

  const signout = async () => {
    const response = await logoutUser();
    if (response.error) {
      throw Error(response.errorMessage);
    }
  };

  
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        userIsLoading,
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
