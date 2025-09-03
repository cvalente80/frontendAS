import React from "react";

export default function ProdutoAcidentesTrabalho() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center py-12 px-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-0 overflow-hidden">
        {/* Header visual com imagem e título */}
        <div className="relative h-64 w-full flex items-center justify-center bg-blue-900">
          <img src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&w=800&q=60" alt="Seguro Acidentes de Trabalho" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="relative z-10 text-center w-full">
            <h1 className="text-5xl font-extrabold text-white drop-shadow mb-2">Seguro Acidentes de Trabalho Empresas</h1>
            <p className="text-lg text-blue-100 font-medium mb-4">Proteja os colaboradores da sua empresa com cobertura obrigatória e assistência completa</p>
            <a href="/contato" className="inline-block px-8 py-3 bg-yellow-400 text-blue-900 font-bold rounded-full shadow-lg hover:bg-yellow-300 transition">Solicitar proposta</a>
          </div>
        </div>
        {/* Conteúdo principal */}
        <div className="p-8 space-y-10">
          {/* Seção: Benefícios */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="2"/><path d="M8 12l2 2 4-4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
              Por que escolher o Seguro Acidentes de Trabalho?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">🦺</span>
                <span>Cumpre a legislação obrigatória para empresas</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">👷‍♂️</span>
                <span>Proteção para colaboradores em caso de acidente durante o trabalho</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">🏥</span>
                <span>Assistência médica, hospitalar e farmacêutica</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">💼</span>
                <span>Gestão digital de apólice e sinistros</span>
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
                <h3 className="font-bold text-blue-700 mb-1">Despesas Médicas e Hospitalares</h3>
                <p className="text-gray-700">Cobertura para tratamentos, consultas, internamentos e medicamentos necessários após acidente de trabalho.</p>
              </div>
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Indemnizações por Incapacidade</h3>
                <p className="text-gray-700">Garantia de indemnização em caso de incapacidade temporária ou permanente do colaborador.</p>
              </div>
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Assistência Farmacêutica</h3>
                <p className="text-gray-700">Cobertura para despesas com medicamentos prescritos após acidente.</p>
              </div>
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Gestão de Sinistros</h3>
                <p className="text-gray-700">Apoio na gestão e acompanhamento dos processos de sinistro.</p>
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
                <span>Cobertura para todos os colaboradores</span>
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
              <li>Escolha as coberturas que melhor se adaptam à sua atividade.</li>
              <li>Envie os documentos necessários e finalize a contratação com o apoio de um consultor especializado.</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
