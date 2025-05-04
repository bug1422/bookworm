import { fetchUserInfo, loginUser, logoutUser } from "@/api/user";
import { checkConflictingCart, getValidatedCart } from "@/lib/cart";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, createContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const FetchCurrentUser = async () => {
    const response = await fetchUserInfo();
    if (response.error) {
      return null;
    } else {
      return response.data;
    }
  };
  const queryKey = "user-info";
  const { data: user, isLoading: userIsLoading, 
    refetch: refetchUser,
  } = useQuery({
    queryKey: [queryKey],
    queryFn: () => FetchCurrentUser(),
    enabled: true,
    staleTime: 0,
  });
  const FetchCart = async () => {
    const validationResponse = await getValidatedCart(user);
    if (validationResponse.data === undefined) {
      toastError("validate cart failed", validationResponse.erroMessage);
      return null;
    } else {
      return validationResponse.data;
    }
  };

  const {
    data: cart,
    isLoading: cartIsLoading,
    refetch: refetchCart,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: () => FetchCart(),
    staleTime: 0,
  });
  const isAuthenticated = user !== undefined && user !== null;
  useEffect(() => {
    if (user !== null && user !== undefined) {
      checkConflictingCart(user);
    }
    refetchCart().then((v)=>{return v})
  }, [user]);

  const signin = async (email, password) => {
    const response = await loginUser(email, password);
    if (response.error) {
      throw Error(response.errorMessage);
    }
    await refetchUser()
  };

  const signout = async () => {
    const response = await logoutUser();
    if (response.error) {
      throw Error(response.errorMessage);
    }
    await refetchUser()
    queryClient.removeQueries({ queryKey: ["cart"] });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        cart,
        userIsLoading,
        cartIsLoading,
        refetchCart,
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
