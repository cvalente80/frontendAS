import React from "react";
import { Link } from "react-router-dom";

export default function ProdutoMultirriscosEmpresarial() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center py-12 px-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-0 overflow-hidden">
        {/* Header visual com imagem e título */}
  <div className="relative h-56 md:h-80 w-full flex items-center justify-center bg-blue-900">
          <img src="https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&w=800&q=60" alt="Seguro Multirriscos Empresarial" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="relative z-10 text-center w-full">
            <h1 className="text-2xl md:text-5xl leading-tight font-extrabold text-white drop-shadow mb-2">Seguro Multirriscos Empresarial</h1>
            <p className="text-sm md:text-lg text-blue-100 font-medium mb-4">Proteja o património da sua empresa contra imprevistos e garanta a continuidade do seu negócio</p>
            <Link to="/contato" className="inline-block px-8 py-3 bg-blue-400 text-white font-bold rounded-full shadow-lg hover:bg-blue-300 transition">Fale com um consultor</Link>
          </div>
        </div>
        {/* Conteúdo principal */}
        <div className="p-8 space-y-10">
          {/* O que é */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="14" rx="2" stroke="#2563eb" strokeWidth="2"/><path d="M16 3v4M8 3v4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="14" r="3" stroke="#2563eb" strokeWidth="2"/></svg>
              O que é o Seguro Multirriscos Empresarial?
            </h2>
            <p className="text-gray-700 mb-4">
              O Seguro Multirriscos Empresarial foi desenvolvido para proteger edifícios, equipamentos, mercadorias e outros bens essenciais ao funcionamento da sua empresa, garantindo apoio em situações de sinistro e minimizando prejuízos.
            </p>
          </section>
          {/* Para quem se destina */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
              Para quem é indicado?
            </h2>
            <ul className="list-disc pl-6 text-blue-900 text-lg space-y-2">
              <li>Empresas de todos os setores e dimensões</li>
              <li>Comércios, indústrias e serviços</li>
              <li>Proprietários de edifícios comerciais</li>
            </ul>
          </section>
          {/* Coberturas principais */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="2"/><path d="M8 12l2 2 4-4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
              Coberturas principais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Incêndio, Inundação e Fenómenos Naturais</h3>
                <p className="text-gray-700">Proteção contra danos causados por fogo, água, tempestades e outros eventos naturais.</p>
              </div>
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Roubo e Furto</h3>
                <p className="text-gray-700">Cobertura para bens e mercadorias em caso de roubo ou furto nas instalações.</p>
              </div>
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Responsabilidade Civil</h3>
                <p className="text-gray-700">Proteção contra danos causados a terceiros no exercício da atividade empresarial.</p>
              </div>
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Assistência 24h</h3>
                <p className="text-gray-700">Serviços de emergência como chaveiro, eletricista e canalizador para situações imprevistas.</p>
              </div>
            </div>
          </section>
          {/* Vantagens */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
              Vantagens do seguro
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">🔒</span>
                <span>Tranquilidade para gerir o seu negócio</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">⚡</span>
                <span>Assistência rápida em situações de emergência</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">💡</span>
                <span>Planos flexíveis e adaptáveis à realidade da empresa</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">🏢</span>
                <span>Cobertura para edifícios, equipamentos e mercadorias</span>
              </div>
            </div>
          </section>
          {/* Como contratar */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
              Como contratar?
            </h2>
            <ol className="list-decimal pl-6 text-blue-900 text-lg space-y-2">
              <li>Solicite uma proposta personalizada para a sua empresa.</li>
              <li>Escolha as coberturas e capitais que melhor se adaptam ao seu negócio.</li>
              <li>Finalize a contratação com o apoio de um consultor especializado.</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
