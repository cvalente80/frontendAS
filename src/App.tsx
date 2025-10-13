import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import SimulacaoAuto from "./pages/SimulacaoAuto";
import SimulacaoVida from "./pages/SimulacaoVida";
import SimulacaoSaude from "./pages/SimulacaoSaude";
import SimulacaoHabitacao from "./pages/SimulacaoHabitacao";
import Produtos from "./pages/Produtos";
import Contato from "./pages/Contato";
import ProdutoAuto from "./pages/ProdutoAuto";
import ProdutoVida from "./pages/ProdutoVida";
import ProdutoSaude from "./pages/ProdutoSaude";
import ProdutoHabitacao from "./pages/ProdutoHabitacao";
import ProdutoFrota from "./pages/ProdutoFrota";
import ProdutoAcidentesTrabalho from "./pages/ProdutoAcidentesTrabalho";
import ProdutoResponsabilidadeCivilProfissional from "./pages/ProdutoResponsabilidadeCivilProfissional";
import SimulacaoResponsabilidadeCivilProfissional from "./pages/SimulacaoResponsabilidadeCivilProfissional";
import ProdutoMultirriscosEmpresarial from "./pages/ProdutoMultirriscosEmpresarial";
import ProdutoCondominio from "./pages/ProdutoCondominio";
import SimulacaoCondominio from "./pages/SimulacaoCondominio";
import PoliticaRGPD from "./pages/PoliticaRGPD";
import './App.css';
// Removed invalid import: ./pages/inicio (file does not exist). Use Home for "/inicio" route.


function App(): React.ReactElement {

  return (
    <>
      {/* Marca de água da vila de Ansião no body */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.12,
        background: `url('${import.meta.env.BASE_URL}imagens/image.png') center center / cover no-repeat`
      }} />
      {/* Navbar sempre visível em todas as páginas */}
      <nav className="bg-white py-4 px-8 flex justify-between items-center sticky top-0 z-50">
        <NavLink to="/" className="flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}logo-empresarial.svg`} alt="Logo Ansião Seguros" className="h-12 w-12" />
          <span className="text-3xl font-bold text-blue-900 hover:text-blue-700">Ansião Seguros</span>
        </NavLink>
        <div className="flex gap-6 text-blue-700 font-medium">
          <NavLink to="/" end className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>Início</NavLink>
          <NavLink to="/simulacao-auto" className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>Simulação Auto</NavLink>
          <NavLink to="/simulacao-vida" className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>Simulação Vida</NavLink>
          <NavLink to="/simulacao-saude" className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>Simulação Saúde</NavLink>
          <NavLink to="/simulacao-habitacao" className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>Simulação Habitação</NavLink>
          <NavLink to="/produtos" className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>Produtos</NavLink>
          <NavLink to="/contato" className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>Contato</NavLink>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inicio" element={<Home />} />
        <Route path="/simulacao-auto" element={<SimulacaoAuto />} />
        <Route path="/simulacao-vida" element={<SimulacaoVida />} />
        <Route path="/simulacao-saude" element={<SimulacaoSaude />} />
        <Route path="/simulacao-habitacao" element={<SimulacaoHabitacao />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/produto-auto" element={<ProdutoAuto />} />
        <Route path="/produto-vida" element={<ProdutoVida />} />
        <Route path="/produto-saude" element={<ProdutoSaude />} />
        <Route path="/produto-habitacao" element={<ProdutoHabitacao />} />
        <Route path="/produto-frota" element={<ProdutoFrota />} />
        <Route path="/produto-acidentes-trabalho" element={<ProdutoAcidentesTrabalho />} />
        <Route path="/produto-responsabilidade-civil-profissional" element={<ProdutoResponsabilidadeCivilProfissional />} />
  <Route path="/simulacao-rc-profissional" element={<SimulacaoResponsabilidadeCivilProfissional />} />
        <Route path="/produto-multirriscos-empresarial" element={<ProdutoMultirriscosEmpresarial />} />
  <Route path="/produto-condominio" element={<ProdutoCondominio />} />
  <Route path="/simulacao-condominio" element={<SimulacaoCondominio />} />
        <Route path="/politica-rgpd" element={<PoliticaRGPD />} />
      </Routes>
      {/* Footer com link para RGPD */}
      <footer className="bg-blue-900 text-blue-100 py-6 mt-12 text-center w-full">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-2">
          <span className="text-sm">© {new Date().getFullYear()} Ansião Seguros. Todos os direitos reservados.</span>
          <div className="flex gap-4 items-center">
            <NavLink to="/contato" className="text-blue-200 underline hover:text-white text-sm">Contato</NavLink>
            <span className="hidden md:inline-block">|</span>
            <NavLink to="/politica-rgpd" className="text-blue-200 underline hover:text-white text-sm">Política de Privacidade &amp; RGPD</NavLink>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
