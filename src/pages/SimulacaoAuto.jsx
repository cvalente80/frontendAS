import React, { useState } from "react";

export default function SimulacaoAuto() {
  const [form, setForm] = useState({ nome: "", email: "", modelo: "", ano: "" });
  const [resultado, setResultado] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Simulação simples
    setResultado(`Simulação para ${form.modelo} (${form.ano}): R$ 1.200,00/ano`);
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">Simulação de Seguro Auto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" className="w-full p-2 border rounded" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
        <input name="modelo" value={form.modelo} onChange={handleChange} placeholder="Modelo do carro" className="w-full p-2 border rounded" required />
        <input name="ano" value={form.ano} onChange={handleChange} placeholder="Ano" className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Simular</button>
      </form>
      {resultado && <div className="mt-4 p-3 bg-blue-50 text-blue-900 rounded">{resultado}</div>}
    </div>
  );
}
