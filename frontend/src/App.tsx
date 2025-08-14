import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import ResetPassword from './pages/RestPassword';
import UsersList from './pages/UsersList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/users" element={<UsersList />} />
        {/* Uncomment the line below when Employees page is implemented */}
        {/* <Route path="/employees" element={<Employees />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;