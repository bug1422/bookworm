import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import RouteContext from "./route";

const queryClient = new QueryClient()
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouteContext />
      </QueryClientProvider>
    </>
  );
}

export default App;
