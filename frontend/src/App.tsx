import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import ResetPassword from './pages/RestPassword';
import UsersList from './pages/ListUsers';
import CreateUser from './pages/CreateUser';
import EditUser from './pages/EditUser';
//import Employees from './pages/Employees';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/create" element={<CreateUser />} />
        <Route path="/users/edit/:id" element={<EditUser />} />
        {/* Uncomment the line below when Employees page is implemented */}
        {/* <Route path="/employees" element={<Employees />} /> */}
      </Routes>
    </BrowserRouter>
  );
}