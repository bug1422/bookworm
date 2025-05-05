import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import RouteContext from './route';
import { Toaster } from './components/ui/sonner';
import { AuthContextProvider } from './components/context/useAuthContext';
import { OptionsProvider } from './components/context/useOptionsContext';

const queryClient = new QueryClient();
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <OptionsProvider>
          <AuthContextProvider>
            <RouteContext />
          </AuthContextProvider>
        </OptionsProvider>
      </QueryClientProvider>
      <Toaster />
    </>
  );
}

export default App;
