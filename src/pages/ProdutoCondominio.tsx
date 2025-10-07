import React from "react";

export default function ProdutoCondominio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center py-12 px-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-0 overflow-hidden">
        {/* Header visual com imagem e título */}
        <div className="relative h-64 w-full flex items-center justify-center bg-blue-900">
          <img src="https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&w=1000&q=60" alt="Seguro Condomínio" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="relative z-10 text-center w-full">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-2">Seguro Condomínio</h1>
            <p className="text-lg text-blue-100 font-medium mb-4">Proteção completa para edifícios e áreas comuns do seu condomínio</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="/simulacao-condominio" className="inline-block px-8 py-3 bg-blue-400 text-white font-bold rounded-full shadow-lg hover:bg-blue-300 transition">Simular seguro Condomínio</a>
              <a href="/contato" className="inline-block px-8 py-3 bg-blue-400 text-white font-bold rounded-full shadow-lg hover:bg-blue-300 transition">Fale com um consultor</a>
            </div>
          </div>
        </div>
        {/* Conteúdo principal */}
        <div className="p-8 space-y-10">
          {/* O que é */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="14" rx="2" stroke="#2563eb" strokeWidth="2"/><path d="M16 3v4M8 3v4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
              O que é o Seguro de Condomínio?
            </h2>
            <p className="text-gray-700 mb-4">
              O Seguro de Condomínio foi pensado para proteger o edifício e as suas partes comuns, cobrindo danos por incêndio, fenómenos naturais, inundações, responsabilidade civil e outras situações que podem afetar a tranquilidade dos condóminos.
            </p>
          </section>
          {/* Para quem é indicado */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
              Para quem é indicado?
            </h2>
            <ul className="list-disc pl-6 text-blue-900 text-lg space-y-2">
              <li>Condomínios residenciais e mistos</li>
              <li>Prédios com garagens, arrecadações e espaços comuns</li>
              <li>Administrações de condomínio e comissões de condóminos</li>
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
                <h3 className="font-bold text-blue-700 mb-1">Responsabilidade Civil do Condomínio</h3>
                <p className="text-gray-700">Cobertura por danos causados a terceiros nas áreas comuns do edifício.</p>
              </div>
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Danos por Água e Quebra de Vidros</h3>
                <p className="text-gray-700">Proteção para sinistros frequentes que afetam as zonas comuns e fachadas.</p>
              </div>
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Assistência 24h</h3>
                <p className="text-gray-700">Apoio imediato com técnicos especializados para emergências.</p>
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
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start"><span className="text-blue-700 text-2xl">🏢</span><span>Proteção abrangente das partes comuns do edifício</span></div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start"><span className="text-blue-700 text-2xl">👥</span><span>Segurança para condóminos e visitantes</span></div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start"><span className="text-blue-700 text-2xl">⚖️</span><span>Coberturas de responsabilidade civil ajustáveis</span></div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start"><span className="text-blue-700 text-2xl">🔧</span><span>Assistência técnica 24 horas por dia</span></div>
            </div>
          </section>
          {/* Como contratar */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
              Como contratar?
            </h2>
            <ol className="list-decimal pl-6 text-blue-900 text-lg space-y-2">
              <li>Solicite uma proposta para o seu condomínio.</li>
              <li>Escolha as coberturas e capitais de acordo com as necessidades do edifício.</li>
              <li>Finalize com o apoio de um consultor especializado.</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
