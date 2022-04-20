import React from 'react';
import './App.css';
import Welcome from './components/Welcome';
import ChooseWord from "./components/ChooseWord";
import DrawWord from "./components/DrawWord";
import WaitingPage from "./components/WaitingPage";
import GuessWord from "./components/GuessWord"
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
     <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/choose-word" element={<ChooseWord />} />
      <Route path="/draw-word" element={<DrawWord />} />
      <Route path="/wait" element={<WaitingPage />} />
      <Route path="/guess-word" element={<GuessWord />} />
    </Routes>
    </BrowserRouter>
   
  );
}

export default App;
