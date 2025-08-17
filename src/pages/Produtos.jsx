import React from "react";

const produtos = [
  { nome: "Seguro Auto", descricao: "Proteção completa para seu veículo." },
  { nome: "Seguro Vida", descricao: "Segurança para você e sua família." },
  { nome: "Seguro Saúde", descricao: "Cuide do seu bem-estar." },
  { nome: "Seguro Residencial", descricao: "Proteja seu lar contra imprevistos." },
];

export default function Produtos() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-200 to-blue-400 flex items-center justify-center">
      <div className="max-w-4xl w-full p-10 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-8 text-blue-900 text-center">Nossos Produtos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {produtos.map((p) => (
            <div key={p.nome} className="p-8 bg-blue-50 rounded-xl shadow hover:scale-105 transition">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">{p.nome}</h3>
              <p className="text-gray-700">{p.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
