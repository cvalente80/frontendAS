import React from "react";

export default function ProdutoFrota() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center py-12 px-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-0 overflow-hidden">
        {/* Header visual com imagem e título */}
        <div className="relative h-64 w-full flex items-center justify-center bg-blue-900">
          <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=60" alt="Seguro Frota Empresarial" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="relative z-10 text-center w-full">
            <h1 className="text-5xl font-extrabold text-white drop-shadow mb-2">Seguro Frota Empresarial</h1>
            <p className="text-lg text-blue-100 font-medium mb-4">Gestão eficiente e proteção completa para todos os veículos da sua empresa</p>
            <span className="inline-block px-6 py-2 bg-red-600 text-white font-bold rounded-full shadow-lg mb-2">Produto Fidelidade</span>
            <a href="/contato" className="inline-block px-8 py-3 bg-yellow-400 text-blue-900 font-bold rounded-full shadow-lg hover:bg-yellow-300 transition">Solicitar proposta</a>
          </div>
        </div>
        {/* Conteúdo principal */}
        <div className="p-8 space-y-10">
          {/* Seção: Benefícios */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="2"/><path d="M8 12l2 2 4-4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
              Por que escolher o Seguro Frota Empresarial?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">🚚</span>
                <span>Gestão centralizada de todos os veículos da empresa</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">🛡️</span>
                <span>Proteção contra danos próprios, terceiros e acidentes</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">🔧</span>
                <span>Assistência 24h em todo o território nacional</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">💼</span>
                <span>Opções flexíveis de coberturas e capitais</span>
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
                <h3 className="font-bold text-blue-700 mb-1">Danos Próprios</h3>
                <p className="text-gray-700">Cobertura para danos causados aos veículos da frota por acidente, colisão, incêndio, furto ou roubo.</p>
              </div>
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Responsabilidade Civil</h3>
                <p className="text-gray-700">Proteção contra danos causados a terceiros, pessoas e bens.</p>
              </div>
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Assistência em Viagem</h3>
                <p className="text-gray-700">Serviços de reboque, transporte, alojamento e apoio em caso de avaria ou acidente.</p>
              </div>
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Proteção Jurídica</h3>
                <p className="text-gray-700">Apoio legal em situações de litígio relacionadas com os veículos da empresa.</p>
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
                <span>Gestão digital da apólice e sinistros</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">🕒</span>
                <span>Atendimento especializado para empresas</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">💡</span>
                <span>Planos ajustáveis conforme o perfil da empresa</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">👨‍👩‍👧‍👦</span>
                <span>Cobertura para condutores e colaboradores</span>
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
              <li>Solicite uma proposta personalizada para a sua empresa.</li>
              <li>Escolha as coberturas e capitais que melhor se adaptam à sua frota.</li>
              <li>Envie os documentos necessários e finalize a contratação com o apoio de um consultor Fidelidade.</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
