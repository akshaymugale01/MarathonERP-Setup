import { Routes, Route } from "react-router-dom";
import ServiceIndentList from "./ServiceIndentList";
import ServiceIndentForm from "./ServiceIndentForm";

export default function ServiceIndentRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ServiceIndentList />} />
      <Route path="/create" element={<ServiceIndentForm />} />
      <Route path="/:id/edit" element={<ServiceIndentForm />} />
      <Route path="/:id/view" element={<ServiceIndentForm />} />
    </Routes>
  );
}
