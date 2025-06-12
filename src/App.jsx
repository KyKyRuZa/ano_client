import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Project from './pages/Project';
import Programs from './pages/Programs';
import StaffPage from './pages/Staff';
import Admin from './pages/Admin';
import AdminLayout from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:id" element={<Project />} />
            <Route path="/program/:id" element={<Programs />} />
            <Route path="/personal/" element={<StaffPage/>}></Route> 
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/*" element={<AdminLayout />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
