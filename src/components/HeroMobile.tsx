import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroMobile() {
  return (
    <section className="relative h-[320px] flex items-center justify-center bg-blue-900 md:hidden">
      <img
        src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=70"
        alt="Seguro Auto"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-3xl font-extrabold mb-3 text-white drop-shadow">Proteção para si e a sua família</h1>
        <p className="text-base mb-4 text-white/90">
          Simulações rápidas para Auto, Vida, Saúde e Habitação.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/simulacao-auto" className="px-4 py-3 bg-yellow-400 text-blue-900 font-bold rounded-full shadow-lg hover:bg-yellow-300 transition">
            Simular Auto
          </Link>
          <Link to="/produtos" className="px-4 py-3 bg-white/90 text-blue-900 font-bold rounded-full shadow-lg hover:bg-white transition">
            Ver produtos
          </Link>
        </div>
      </div>
    </section>
  );
}
