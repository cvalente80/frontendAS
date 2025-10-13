import React from 'react';
import { Link } from 'react-router-dom';
import type { ProductInfo } from './ProductCard';

export default function ProductCardMobile({ nome, descricao, imagem, to }: ProductInfo) {
  return (
    <Link to={to} className="bg-white rounded-2xl shadow transition block overflow-hidden">
      <div className="p-4 flex items-center gap-4">
  <img src={imagem} alt={nome} loading="lazy" className="w-16 h-16 object-cover rounded-full border-4 border-blue-200 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-semibold text-blue-700 truncate">{nome}</h4>
          <p className="text-gray-700 text-sm line-clamp-2">{descricao}</p>
          <span className="inline-block mt-2 text-blue-700 underline">Abrir</span>
        </div>
      </div>
    </Link>
  );
}
