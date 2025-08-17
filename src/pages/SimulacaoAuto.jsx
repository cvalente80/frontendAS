import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import pt from "date-fns/locale/pt";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("pt", pt);

export default function SimulacaoAuto() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    dataNascimento: "",
    modelo: "",
    ano: "",
    matricula: "",
    tipoSeguro: "",
    coberturas: [],
  });
  const [resultado, setResultado] = useState(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => {
        const coberturas = checked
          ? [...prev.coberturas, value]
          : prev.coberturas.filter((c) => c !== value);
        return { ...prev, coberturas };
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  function handleNext(e) {
    e.preventDefault();
    setStep((s) => s + 1);
  }

  function handlePrev(e) {
    e.preventDefault();
    setStep((s) => s - 1);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setResultado(
      `Simulação para ${form.modelo} (${form.ano}) - ${form.tipoSeguro}: R$ 1.200,00/ano\nCoberturas: ${form.coberturas.join(", ")}`
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <img src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80" alt="Estrada" className="absolute inset-0 w-full h-full object-cover opacity-30" />
      <div className="max-w-lg w-full p-8 bg-white bg-opacity-90 rounded-2xl shadow-xl relative z-10">
        <h2 className="text-3xl font-bold mb-6 text-blue-900 text-center">Simulação de Seguro Auto</h2>
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1,2,3].map(n => (
              <div
                key={n}
                className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white transition-all duration-300 ${step >= n ? 'bg-blue-700 scale-110' : 'bg-blue-300 scale-100'}`}
              >
                {n}
              </div>
            ))}
          </div>
          <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-2 bg-blue-700 transition-all duration-500"
              style={{ width: `${step * 33.33}%` }}
            />
          </div>
          <div className="text-center text-blue-700 font-medium mt-2">Passo {step} de 3</div>
        </div>
        <form onSubmit={step === 3 ? handleSubmit : handleNext} className="space-y-5">
          {step === 1 && (
            <>
              <h3 className="text-xl font-semibold text-blue-700 mb-2 text-center">Passo 1 - Identificação do condutor</h3>
              <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" className="w-full p-3 border border-blue-300 rounded-lg" required onInvalid={e => e.target.setCustomValidity('Por favor, preencha o nome.')} onInput={e => e.target.setCustomValidity('')} />
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-3 border border-blue-300 rounded-lg" required onInvalid={e => e.target.setCustomValidity(e.target.validity.valueMissing ? 'Por favor, preencha o email.' : 'Por favor, insira um email válido.')} onInput={e => e.target.setCustomValidity('')} />
              <div className="w-full">
                <DatePicker
                  selected={form.dataNascimento ? new Date(form.dataNascimento) : null}
                  onChange={date => handleChange({ target: { name: "dataNascimento", value: date ? date.toISOString().slice(0, 10) : "" } })}
                  locale="pt"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Data de nascimento"
                  className="w-full p-3 border border-blue-300 rounded-lg"
                  required
                  todayButton="Hoje"
                  isClearable
                  clearButtonText="Limpar"
                  showYearDropdown
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="px-6 py-2 bg-gray-200 rounded" disabled>Anterior</button>
                <button type="submit" className="px-6 py-2 bg-blue-700 text-white rounded font-bold hover:bg-blue-900 transition">Próximo</button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h3 className="text-xl font-semibold text-blue-700 mb-2 text-center">Passo 2 - Identificação da viatura</h3>
              <input name="modelo" value={form.modelo} onChange={handleChange} placeholder="Modelo do carro" className="w-full p-3 border border-blue-300 rounded-lg" required onInvalid={e => e.target.setCustomValidity('Por favor, preencha o modelo do carro.')} onInput={e => e.target.setCustomValidity('')} />
              <input name="ano" value={form.ano} onChange={handleChange} placeholder="Ano" className="w-full p-3 border border-blue-300 rounded-lg" required onInvalid={e => e.target.setCustomValidity('Por favor, preencha o ano do carro.')} onInput={e => e.target.setCustomValidity('')} />
              <input name="matricula" value={form.matricula} onChange={handleChange} placeholder="Matrícula" className="w-full p-3 border border-blue-300 rounded-lg" required onInvalid={e => e.target.setCustomValidity('Por favor, preencha a matrícula.')} onInput={e => e.target.setCustomValidity('')} />
              <div className="flex justify-between gap-2">
                <button type="button" onClick={handlePrev} className="px-6 py-2 bg-gray-200 rounded">Anterior</button>
                <button type="submit" className="px-6 py-2 bg-blue-700 text-white rounded font-bold hover:bg-blue-900 transition">Próximo</button>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h3 className="text-xl font-semibold text-blue-700 mb-2 text-center">Passo 3 - Produto e coberturas adicionais</h3>
              <select name="tipoSeguro" value={form.tipoSeguro} onChange={handleChange} className="w-full p-3 border border-blue-300 rounded-lg" required onInvalid={e => e.target.setCustomValidity('Por favor, selecione o tipo de seguro.')} onInput={e => e.target.setCustomValidity('')}>
                <option value="">Selecione o tipo de seguro</option>
                <option value="Básico">Básico</option>
                <option value="Completo">Completo</option>
                <option value="Premium">Premium</option>
              </select>
              <label className="block font-semibold mb-2">Coberturas adicionais:</label>
              <div className="flex flex-col gap-2">
                <label><input type="checkbox" name="coberturas" value="Vidros" checked={form.coberturas.includes("Vidros")} onChange={handleChange} /> Vidros</label>
                <label><input type="checkbox" name="coberturas" value="Assistência 24h" checked={form.coberturas.includes("Assistência 24h")} onChange={handleChange} /> Assistência 24h</label>
                <label><input type="checkbox" name="coberturas" value="Carro reserva" checked={form.coberturas.includes("Carro reserva")} onChange={handleChange} /> Carro reserva</label>
                <label><input type="checkbox" name="coberturas" value="Proteção jurídica" checked={form.coberturas.includes("Proteção jurídica")} onChange={handleChange} /> Proteção jurídica</label>
              </div>
              <div className="flex justify-between gap-2 mt-4">
                <button type="button" onClick={handlePrev} className="px-6 py-2 bg-gray-200 rounded">Anterior</button>
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 transition">Simular</button>
              </div>
            </>
          )}
        </form>
        {resultado && <div className="mt-6 p-4 bg-blue-50 text-blue-900 rounded-lg text-center font-semibold shadow whitespace-pre-line">{resultado}</div>}
      </div>
    </div>
  );
}
