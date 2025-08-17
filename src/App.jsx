import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import SimulacaoAuto from "./pages/SimulacaoAuto";
import SimulacaoVidaSaude from "./pages/SimulacaoVidaSaude";
import SimulacaoHabitacao from "./pages/SimulacaoHabitacao";
import Produtos from "./pages/Produtos";
import Contato from "./pages/Contato";
import './App.css';

function App() {
  return (
    <Router>
      {/* Navbar sempre visível em todas as páginas */}
      <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center sticky top-0 z-50">
        <NavLink to="/" className="flex items-center gap-2">
          <img src="/logo-empresarial.svg" alt="Logo Ansião Seguros" className="h-8 w-8" />
          <span className="text-2xl font-bold text-blue-900 hover:text-blue-700">Ansião Seguros</span>
        </NavLink>
        <div className="flex gap-6 text-blue-700 font-medium">
          <NavLink to="/" end className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>Home</NavLink>
          <NavLink to="/simulacao-auto" className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>Simulação Auto</NavLink>
          <NavLink to="/simulacao-vida-saude" className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>Simulação Vida/Saúde</NavLink>
          <NavLink to="/simulacao-habitacao" className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>Simulação Habitação</NavLink>
          <NavLink to="/produtos" className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>Produtos</NavLink>
          <NavLink to="/contato" className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>Contato</NavLink>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulacao-auto" element={<SimulacaoAuto />} />
        <Route path="/simulacao-vida-saude" element={<SimulacaoVidaSaude />} />
        <Route path="/simulacao-habitacao" element={<SimulacaoHabitacao />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/contato" element={<Contato />} />
      </Routes>
    </Router>
  );
}

export default App;
