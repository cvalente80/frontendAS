import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import SimulacaoAuto from "./pages/SimulacaoAuto";
import Produtos from "./pages/Produtos";
import Contato from "./pages/Contato";
import './App.css';

function App() {
  return (
    <Router>
      <nav className="bg-blue-800 p-4 flex gap-6 text-white">
        <Link to="/">Home</Link>
        <Link to="/simulacao-auto">Simulação Auto</Link>
        <Link to="/produtos">Produtos</Link>
        <Link to="/contato">Contato</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulacao-auto" element={<SimulacaoAuto />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/contato" element={<Contato />} />
      </Routes>
    </Router>
  );
}

export default App;
