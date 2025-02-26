import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import ResearchPage from "./pages/ResearchPage/ResearchPage";

const App = () => {
  const [currentPage, setCurrentPage] = useState('');
  return (
    <div className="app">
        <BrowserRouter>
          <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <h1 className="ui huge center aligned header" id="heading">
            Symbiotic Intelligence Research Group SIRG
          </h1>
          <br /><br />
          <Routes>
            <Route path="/" element={<Home setCurrentPage={setCurrentPage} />} />
            <Route path="/research/:id" element={<ResearchPage setCurrentPage={setCurrentPage} />} />
          </Routes>
        </BrowserRouter>
    </div>
  );
};

export default App;
