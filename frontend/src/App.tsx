import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
//import Employees from './pages/Employees';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        {/* <Route path="/employees" element={<Employees />} /> */}
      </Routes>
    </BrowserRouter>
  );
}