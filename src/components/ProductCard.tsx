import React from 'react';
import { Link } from 'react-router-dom';

export type ProductInfo = {
  nome: string;
  descricao: string;
  imagem: string;
  to: string;
};

export default function ProductCard({ nome, descricao, imagem, to }: ProductInfo) {
  return (
    <Link to={to} className="bg-white rounded-xl shadow hover:shadow-lg transition block overflow-hidden">
      <div className="p-6 flex flex-col items-center">
  <img src={imagem} alt={nome} loading="lazy" className="w-24 h-24 object-cover rounded-full mb-4 border-4 border-blue-200" />
        <h4 className="text-lg font-semibold text-blue-700 text-center">{nome}</h4>
        <p className="text-gray-700 text-sm text-center mt-1">{descricao}</p>
        <span className="mt-3 text-blue-600 underline">Saiba mais</span>
      </div>
    </Link>
  );
}
