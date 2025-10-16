import React from "react";
import Seo from "../components/Seo";
import { Link } from "react-router-dom";

export default function ProdutoVida() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center py-12 px-4">
      <Seo
        title="Seguro de Vida"
        description="Proteção financeira e tranquilidade para si e para a sua família."
        canonicalPath="/produto-vida"
      />
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-0 overflow-hidden">
        {/* Header visual com imagem e título */}
  <div className="relative h-56 md:h-80 w-full flex items-center justify-center bg-blue-900">
          <img src="https://images.pexels.com/photos/1683975/pexels-photo-1683975.jpeg?auto=compress&w=800&q=60" alt="Seguro Vida" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="relative z-10 text-center w-full">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow mb-2">Seguro Vida</h1>
            <p className="text-base md:text-lg text-blue-100 font-medium mb-4">Proteção financeira e tranquilidade para você e sua família</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/simulacao-vida" className="inline-block px-8 py-3 bg-yellow-400 text-blue-900 font-bold rounded-full shadow-lg hover:bg-yellow-300 transition">Simular seguro Vida</Link>
              <Link to="/contato" className="inline-block px-8 py-3 bg-blue-400 text-white font-bold rounded-full shadow-lg hover:bg-blue-300 transition">Fale com um consultor</Link>
            </div>
          </div>
        </div>
        {/* Conteúdo principal */}
        <div className="p-8 space-y-10">
          {/* Seção: Tipos de Seguro Vida */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="2"/><path d="M8 12l2 2 4-4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
              Tipos de Seguro Vida
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-xl p-5 shadow flex flex-col items-start">
                <span className="text-blue-700 text-2xl mb-2">🛡️</span>
                <h3 className="font-bold text-blue-700 mb-1">Vida Risco</h3>
                <p>Proteção em caso de morte ou invalidez, garantindo segurança financeira para os beneficiários.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex flex-col items-start">
                <span className="text-blue-700 text-2xl mb-2">💰</span>
                <h3 className="font-bold text-blue-700 mb-1">Vida Financeiro</h3>
                <p>Acumulação de capital e proteção, ideal para quem deseja poupar e garantir o futuro da família.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex flex-col items-start">
                <span className="text-blue-700 text-2xl mb-2">🔄</span>
                <h3 className="font-bold text-blue-700 mb-1">Vida Misto</h3>
                <p>Combina proteção e poupança, oferecendo cobertura em caso de morte, invalidez e sobrevivência.</p>
              </div>
            </div>
          </section>
          {/* Seção: Coberturas e Benefícios */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="14" rx="2" stroke="#2563eb" strokeWidth="2"/><path d="M16 3v4M8 3v4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="14" r="3" stroke="#2563eb" strokeWidth="2"/></svg>
              Coberturas e Benefícios
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Morte ou Invalidez</h3>
                <p className="text-gray-700">Proteção financeira para a família em caso de falecimento ou invalidez do segurado.</p>
              </div>
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Doenças Graves</h3>
                <p className="text-gray-700">Cobertura para diagnóstico de doenças graves, garantindo apoio financeiro.</p>
              </div>
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Sobrevivência</h3>
                <p className="text-gray-700">Recebimento de capital ao final do contrato, caso o segurado esteja vivo.</p>
              </div>
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Poupança e Investimento</h3>
                <p className="text-gray-700">Acumulação de capital para projetos futuros, educação ou aposentadoria.</p>
              </div>
            </div>
          </section>
          {/* Seção: Vantagens */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
              Vantagens do Seguro Vida
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">👨‍👩‍👧‍👦</span>
                <span>Proteção para toda a família</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">💼</span>
                <span>Flexibilidade de coberturas e capitais</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">💸</span>
                <span>Opção de poupança e investimento</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">🩺</span>
                <span>Cobertura para doenças graves</span>
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
              <li>Simule o seu seguro vida online ou fale com um consultor.</li>
              <li>Escolha o tipo de seguro e coberturas que melhor se adaptam ao seu perfil.</li>
              <li>Envie os documentos necessários e finalize a contratação.</li>
            </ol>
          </section>
          {/* Simulador removido desta página; usar o botão acima para navegar para /simulacao-vida */}
        </div>
      </div>
    </div>
  );
}
