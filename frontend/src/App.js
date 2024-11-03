import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContentListing from './pages/contentListing';
import CreateEditContent from './pages/createEditContent';
import DetailContent from './pages/detailContent';
import Login from './pages/login';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';



function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/content-listing" element={<ProtectedRoute> <ContentListing/> </ProtectedRoute> } />
        <Route path="/content/new" element={<ProtectedRoute> <CreateEditContent/> </ProtectedRoute> } />
        <Route path="/content/edit/:id" element={<ProtectedRoute> <CreateEditContent/> </ProtectedRoute> } />
        <Route path="/content/:id" element={<ProtectedRoute> <DetailContent/> </ProtectedRoute>}   />

    
       
      </Routes>
    </Router>
  );
}

export default App;
