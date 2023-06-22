import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { SnackbarProvider } from "notistack";

export const App = () => {
  // React query client
  const queryClient = new QueryClient();

  return (
    <div className="App">
      <Provider store={store}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <SnackbarProvider>
              <ReactQueryDevtools initialIsOpen={false} />
              <RouterProvider router={router} />
            </SnackbarProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </Provider>
    </div>
  );
};
