import React from "react";

const produtos = [
  { nome: "Seguro Auto", descricao: "Proteção completa para seu veículo." },
  { nome: "Seguro Vida", descricao: "Segurança para você e sua família." },
  { nome: "Seguro Saúde", descricao: "Cuide do seu bem-estar." },
  { nome: "Seguro Residencial", descricao: "Proteja seu lar contra imprevistos." },
];

export default function Produtos() {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-blue-900">Nossos Produtos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {produtos.map((p) => (
          <div key={p.nome} className="p-6 bg-white rounded shadow">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">{p.nome}</h3>
            <p className="text-gray-700">{p.descricao}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
