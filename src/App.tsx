
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Import components
import Header from "./components/Header";
import Index from "./pages/Index";
import Validator from "./pages/Validator";
import Worker from "./pages/Worker";
import Buyer from "./pages/Buyer";
import Calculator from "./pages/Calculator";
import NotFound from "./pages/NotFound";
import Converter from "./pages/Converter";

// Import contexts
import { WalletProvider } from "./contexts/WalletContext";

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/validator" element={<Validator />} />
            <Route path="/worker" element={<Worker />} />
            <Route path="/buyer" element={<Buyer />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/converter" element={<Converter />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;
