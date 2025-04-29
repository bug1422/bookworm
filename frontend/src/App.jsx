import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import RouteContext from "./route";
import { Toaster } from "./components/ui/sonner";
import { AuthContextProvider } from "./components/context/useAuthContext";

const queryClient = new QueryClient();
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <RouteContext />
        </AuthContextProvider>
      </QueryClientProvider>
      <Toaster />
    </>
  );
}

export default App;
