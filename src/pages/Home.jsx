import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <h1 className="text-4xl font-bold text-blue-900 mb-4">Ansião Seguros</h1>
      <p className="text-lg text-blue-700 mb-8">Protegendo o seu futuro com confiança. Especialistas em simulação de seguro auto e outros produtos.</p>
      <a href="/simulacao-auto" className="px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition">Simule seu seguro auto</a>
    </div>
  );
}
