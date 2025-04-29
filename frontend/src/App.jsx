import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import RouteContext from "./route";
import { Toaster } from "./components/ui/sonner";

const queryClient = new QueryClient()
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouteContext />
      </QueryClientProvider>
      <Toaster/>
    </>
  );
}

export default App;
