import { Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Layout from "./layouts/Layout";
import { adminRoutes } from "./routes/adminRoutes";
import { Toaster } from "react-hot-toast";
import { generalRoute } from "./routes/generalRoutes";
import { materialRoute } from "./routes/purchaseRoutes";
import LoginForm from "./pages/auth/LoginForm";

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
