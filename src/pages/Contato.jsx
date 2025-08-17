import React from "react";

export default function Contato() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500">
      <div className="max-w-lg w-full p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-blue-900 text-center">Fale Conosco</h2>
        <p className="mb-6 text-blue-700 text-center">Envie sua dúvida ou solicite uma cotação. Retornaremos o mais breve possível.</p>
        <form className="space-y-5">
          <input name="nome" placeholder="Nome" className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <input name="email" placeholder="Email" className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <textarea name="mensagem" placeholder="Mensagem" className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <button type="submit" className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition">Enviar</button>
        </form>
      </div>
    </div>
  );
}
