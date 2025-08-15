import React from "react";

export default function Contato() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">Fale Conosco</h2>
      <p className="mb-4 text-blue-700">Envie sua dúvida ou solicite uma cotação. Retornaremos o mais breve possível.</p>
      <form className="space-y-4">
        <input name="nome" placeholder="Nome" className="w-full p-2 border rounded" required />
        <input name="email" placeholder="Email" className="w-full p-2 border rounded" required />
        <textarea name="mensagem" placeholder="Mensagem" className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Enviar</button>
      </form>
    </div>
  );
}
