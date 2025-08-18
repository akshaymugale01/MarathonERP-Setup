import { Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Layout from "./layouts/Layout";
import ModalLayout from "./layouts/ModalLayout";
import { adminRoutes } from "./routes/adminRoutes";
import { Toaster } from "react-hot-toast";
import { generalRoute } from "./routes/generalRoutes";
import { materialRoute } from "./routes/purchaseRoutes";
import LoginForm from "./pages/auth/LoginForm";
import { engineeringRoute } from "./routes/engineeringRoute";

function App() {
  // Define full route tree with Layout and children
  const routes = [
    {
      path: "/",
      element: <Navigate to="/login" replace />,
    },
    {
      path: "/login",
      element: <LoginForm />,
    },
    {
      path: "/setup",
      element: <Layout />,
      children: [...adminRoutes, ...generalRoute, ...materialRoute],
    },
    {
      path: "/engineering",
      element: <ModalLayout />,
      children: [...engineeringRoute],
    },
  ];

  const routing = useRoutes(routes);

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
        <Toaster position="top-right" />
        {routing}
      </Suspense>
    </div>
  );
}

export default App;
