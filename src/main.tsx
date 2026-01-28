import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

//import BrowserRouter dari react router
import { BrowserRouter } from 'react-router';

//import QueryClient dan QueryClientProvider dari react-query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

//init QueryClient
const queryClient = new QueryClient()

//import AuthProvider
import { AuthProvider } from './context/auth/AuthProvider';

//import ModalProvider
import { ModalProvider } from './context/modal/ModalProvider';

//import ModalContainer
import { ModalContainer } from './components/shared/modal/ModalContainer.tsx';
import { ToastProvider } from './context/toast/ToastProvider.tsx';
import { ToastContainer } from './components/shared/toast/ToastContainer.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ModalProvider>
            <ToastProvider>
              <App />
              <ModalContainer />
              <ToastContainer />
            </ToastProvider>
          </ModalProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
