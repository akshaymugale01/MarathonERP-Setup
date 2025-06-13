import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import Layout from './layouts/Layout';
import { adminRoutes } from './routes/adminRoutes';

function App() {
  // Define full route tree with Layout and children
  const routes = [
    {
      path: '/',
      element: <Layout />,
      children: adminRoutes, // ✅ admin routes go inside Layout's children
    }
  ];
  
  const routing = useRoutes(routes);

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
        {routing}
      </Suspense>
    </div>
  );
}

export default App;
