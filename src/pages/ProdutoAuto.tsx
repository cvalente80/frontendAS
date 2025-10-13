import React from "react";
import { Link } from "react-router-dom";

export default function ProdutoAuto() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center py-12 px-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-0 overflow-hidden">
        {/* Header visual com imagem e título */}
  <div className="relative h-56 md:h-80 w-full flex items-center justify-center bg-blue-900">
          <img src={`${import.meta.env.BASE_URL}imagens/nosso-produtos-car.jpg`} alt="Seguro Auto" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="relative z-10 text-center w-full">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow mb-2">Seguro Automóvel</h1>
            <p className="text-base md:text-lg text-blue-100 font-medium mb-4">Proteja o seu veículo com as melhores coberturas do mercado</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Link to="/simulacao-auto" className="inline-block px-8 py-3 bg-yellow-400 text-blue-900 font-bold rounded-full shadow-lg hover:bg-yellow-300 transition">Simular Seguro Auto</Link>
                      <Link to="/contato" className="inline-block px-8 py-3 bg-blue-400 text-white font-bold rounded-full shadow-lg hover:bg-blue-300 transition">Fale com um consultor</Link>
            </div>
          </div>
        </div>
        {/* Conteúdo principal */}
        <div className="p-8 space-y-10">
          {/* Seção: Benefícios */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="2"/><path d="M8 12l2 2 4-4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
              Por que escolher o Seguro Auto?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">🚗</span>
                <span>Proteção completa contra danos próprios e a terceiros</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">🕒</span>
                <span>Assistência em viagem 24h em Portugal e no estrangeiro</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">⚙️</span>
                <span>Opções flexíveis de coberturas e franquias</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">💡</span>
                <span>Processo de sinistro simples e rápido</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">👨‍👩‍👧‍👦</span>
                <span>Descontos para condutores experientes e famílias</span>
              </div>
            </div>
          </section>
          {/* Seção: Coberturas */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="14" rx="2" stroke="#2563eb" strokeWidth="2"/><path d="M16 3v4M8 3v4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="14" r="3" stroke="#2563eb" strokeWidth="2"/></svg>
              Coberturas disponíveis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Responsabilidade Civil Obrigatória</h3>
                <p className="text-gray-700">Cobre danos causados a terceiros, pessoas e bens.</p>
              </div>
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Danos Próprios</h3>
                <p className="text-gray-700">Cobre danos ao seu próprio veículo em caso de acidente, choque, colisão, capotamento, incêndio, furto ou roubo.</p>
              </div>
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Proteção Jurídica</h3>
                <p className="text-gray-700">Assistência legal em caso de litígio relacionado com o veículo.</p>
              </div>
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Assistência em Viagem</h3>
                <p className="text-gray-700">Reboque, transporte, alojamento e outros serviços em caso de avaria ou acidente.</p>
              </div>
            </div>
          </section>
          {/* Seção: Vantagens */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
              Vantagens exclusivas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">📱</span>
                <span>Gestão digital de apólice e sinistros</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">🔧</span>
                <span>Rede de oficinas recomendadas</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">⚡</span>
                <span>Descontos para veículos elétricos e híbridos</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">🎯</span>
                <span>Franquias ajustáveis conforme sua necessidade</span>
              </div>
            </div>
          </section>
          {/* Seção: Como contratar */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
              Como contratar?
            </h2>
            <ol className="list-decimal pl-6 text-blue-900 text-lg space-y-2">
              <li>Simule o seu seguro auto online ou fale com um consultor.</li>
              <li>Escolha as coberturas e franquias que melhor se adaptam ao seu perfil.</li>
              <li>Envie os documentos necessários e finalize a contratação.</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
