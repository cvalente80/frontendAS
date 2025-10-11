import React, { useState, ChangeEvent, FormEvent } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { pt } from "date-fns/locale/pt";
import "react-datepicker/dist/react-datepicker.css";
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_USER_ID } from "../emailjs.config";
import emailjs from "@emailjs/browser";
registerLocale("pt", pt);


interface FormState {
  nome: string;
  email: string;
  contribuinte: string;
  dataNascimento: string;
  dataNascimentoManual?: string;
  dataCartaConducao?: string;
  dataCartaConducaoManual?: string;
  modelo: string;
  marca?: string;
  ano: string;
  matricula: string;
  tipoSeguro: string;
  coberturas: string[];
  codigoPostal?: string;
  outrosPedidos?: string;
}

export default function SimulacaoAuto() {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<FormState>({
    nome: "",
    email: "",
    contribuinte: "",
    dataNascimento: "",
    modelo: "",
    marca: "",
    ano: "",
    matricula: "",
    tipoSeguro: "",
    coberturas: [],
    codigoPostal: "",
    outrosPedidos: "",

  });
  const [resultado, setResultado] = useState<string | null>(null);
  const [openNascimento, setOpenNascimento] = useState<boolean>(false);
  const [openCarta, setOpenCarta] = useState<boolean>(false);
  const [erroNascimento, setErroNascimento] = useState<string>("");
  const [erroCarta, setErroCarta] = useState<string>("");
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [mensagemTipo, setMensagemTipo] = useState<string | null>(null);


  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    if (type === "checkbox") {
      const checked = (target as HTMLInputElement).checked;

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


  // Função utilitária para setCustomValidity e validity
  function setCustomValidity(e: React.FormEvent<HTMLInputElement | HTMLSelectElement>, message: string) {
    (e.target as HTMLInputElement | HTMLSelectElement).setCustomValidity(message);
  }

  function validarDatas() {
    // Sem validação manual de formato, apenas obrigatório
    setErroNascimento("");
    setErroCarta("");
    return true;
  }

  function validarNIF(nif: string): boolean {
    if (!/^[0-9]{9}$/.test(nif)) return false;
    const n = nif.split('').map(Number);
    const start = n[0];
    if (![1,2,3,5,6,8,9].includes(start)) return false;
    let soma = 0;
    for (let i = 0; i < 8; i++) {
      soma += n[i] * (9 - i);
    }
    let controlo = 11 - (soma % 11);
    if (controlo >= 10) controlo = 0;
    return controlo === n[8];
  }


  function handleNext(e: FormEvent) {
    e.preventDefault();
    if (step === 1) {
      if (!validarDatas()) return;
      if (idadeMenorQue18(form.dataNascimento)) {
        setErroNascimento("Apenas condutores com 18 anos ou mais podem prosseguir.");
        return;
      }
    }
    setStep((s) => s + 1);
  }


  function handlePrev(e: FormEvent) {
    e.preventDefault();
    setStep((s) => s - 1);
  }


  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.tipoSeguro) {
      setMensagem('Por favor, selecione o tipo de seguro.');
      setMensagemTipo('erro');
      setTimeout(() => {
        setMensagem(null);
        setMensagemTipo(null);
      }, 6000);
      return;
    }
  const resumo = `Simulação para ${form.marca} ${form.modelo} (${form.ano}) - ${form.tipoSeguro}\nNIF: ${form.contribuinte}\nData Nascimento: ${form.dataNascimento ? formatDate(form.dataNascimento) : '-'}\nData Carta: ${form.dataCartaConducao ? formatDate(form.dataCartaConducao) : '-'}\nCódigo Postal: ${form.codigoPostal || '-'}\nCoberturas: ${form.coberturas.join(", ")}\nOutros pedidos: ${form.outrosPedidos?.trim() ? form.outrosPedidos.trim() : '-'}`;
    setResultado(resumo);

    // Enviar email via EmailJS
    const templateParams = {
      email: form.email,
      nome: form.nome,
      contribuinte: form.contribuinte,
      dataNascimento: form.dataNascimento ? formatDate(form.dataNascimento) : '',
      dataCartaConducao: form.dataCartaConducao ? formatDate(form.dataCartaConducao) : '',
      codigoPostal: form.codigoPostal || '',
      modelo: form.modelo,
      marca: form.marca,
      ano: form.ano,
      matricula: form.matricula,
      tipoSeguro: form.tipoSeguro,
      coberturas: form.coberturas.join(", "),
      outrosPedidos: form.outrosPedidos?.trim() ? form.outrosPedidos.trim() : '-',
      resultado: resumo,
    };
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_USER_ID)
      .then(() => {
        setMensagem('Simulação submetida com sucesso!\nEmail enviado.');
        setMensagemTipo('sucesso');
      })
      .catch((error) => {
        setMensagem('Simulação submetida, mas houve erro ao enviar o email.');
        setMensagemTipo('erro');
        // Exibe o erro no canto inferior esquerdo, incluindo o user_id
        const errorDiv = document.createElement('div');
        errorDiv.textContent = `Erro ao enviar email: ${error?.text || error?.message || error} | user_id: ${EMAILJS_USER_ID}`;
        errorDiv.style.position = 'fixed';
        errorDiv.style.left = '24px';
        errorDiv.style.bottom = '24px';
        errorDiv.style.background = '#fee2e2';
        errorDiv.style.color = '#991b1b';
        errorDiv.style.padding = '12px 20px';
        errorDiv.style.borderRadius = '8px';
        errorDiv.style.fontWeight = 'bold';
        errorDiv.style.zIndex = '9999';
        errorDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
        document.body.appendChild(errorDiv);
        setTimeout(() => {
          if (errorDiv.parentNode) errorDiv.parentNode.removeChild(errorDiv);
        }, 8000);
      });

    setTimeout(() => {
      setMensagem(null);
      setMensagemTipo(null);
    }, 6000);
  }

  function formatDate(dateStr: string) {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  }

  function idadeMenorQue18(data: string): boolean {
    if (!data) return true;
    const [ano, mes, dia] = data.split('-').map(Number);
    const hoje = new Date();
    let idade = hoje.getFullYear() - ano;
    if (
      hoje.getMonth() + 1 < mes ||
      (hoje.getMonth() + 1 === mes && hoje.getDate() < dia)
    ) {
      idade--;
    }
    return idade < 18;
  }

  function nomeCompletoValido(nome: string): boolean {
    if (!nome) return false;
    return nome.trim().split(/\s+/).length > 1;
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
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Nome completo"
                className={`w-full p-3 border rounded-lg ${form.nome && !nomeCompletoValido(form.nome) ? 'border-red-500' : 'border-blue-300'}`}
                required
                onBlur={e => {
                  if (!nomeCompletoValido(e.target.value)) {
                    e.target.setCustomValidity('Por favor, indique o nome completo.');
                  } else {
                    e.target.setCustomValidity('');
                  }
                }}
                onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Por favor, indique o nome completo (pelo menos dois nomes).')}
                onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
              />
              {form.nome && !nomeCompletoValido(form.nome) && (
                <div className="text-red-600 text-sm mt-1">Por favor, indique o nome completo.</div>
              )}
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 border border-blue-300 rounded-lg"
                required
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                onInvalid={e => {
                  const input = e.target as HTMLInputElement;
                  if (input.validity.valueMissing) {
                    input.setCustomValidity('Por favor, preencha o email.');
                  } else if (input.validity.typeMismatch || input.validity.patternMismatch) {
                    input.setCustomValidity('Por favor, insira um email válido.');
                  } else {
                    input.setCustomValidity('');
                  }
                }}
                onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
              />
              <div className="w-full relative">
                <DatePicker
                  selected={form.dataNascimento ? new Date(form.dataNascimento) : null}
                  onChange={date => {
                    if (date) {
                      // Salva em ISO, mas também atualiza o manual para dd-mm-aaaa
                      const iso = date.toISOString().slice(0, 10);
                      const [year, month, day] = iso.split('-');
                      const manual = `${day}-${month}-${year}`;
                      setForm(f => ({ ...f, dataNascimento: iso, dataNascimentoManual: manual }));
                    } else {
                      setForm(f => ({ ...f, dataNascimento: "", dataNascimentoManual: "" }));
                    }
                  }}
                  locale="pt"
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Data de nascimento (dd-mm-aaaa)"
                  className="w-full p-3 border border-blue-300 rounded-lg pr-10"
                  required
                  todayButton="Hoje"
                  isClearable
                  clearButtonTitle="Limpar"
                  showMonthDropdown
                  showYearDropdown
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  value={form.dataNascimentoManual || ""}
                  customInput={
                    React.createElement('input', {
                      type: 'text',
                      className: 'w-full p-3 border border-blue-300 rounded-lg pr-10',
                      value: form.dataNascimentoManual || '',
                      required: true,
                      readOnly: true,
                      placeholder: 'Data de nascimento (dd-mm-aaaa)'
                    })
                  }
                  open={openNascimento}
                  onClickOutside={() => setOpenNascimento(false)}
                  calendarClassName="relative"
                  renderCustomHeader={props => (
                    <div className="flex items-center justify-between px-2 pb-2">
                      <div className="flex gap-2 items-center">
                        <button type="button" onClick={props.decreaseMonth} className="px-2 py-1 text-blue-700">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>
                        <select
                          value={props.date.getMonth()}
                          onChange={e => props.changeMonth(Number(e.target.value))}
                          className="border rounded px-2 py-1"
                        >

                          {["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"].map((month, idx) => (
                            <option key={month} value={idx}>{month}</option>
                          ))}
                        </select>
                        <select
                          value={props.date.getFullYear()}
                          onChange={e => props.changeYear(Number(e.target.value))}
                          className="border rounded px-2 py-1"
                        >
                          {Array.from({length: 100}, (_, i) => new Date().getFullYear() - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        <button type="button" onClick={props.increaseMonth} className="px-2 py-1 text-blue-700">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                      </div>
                    </div>
                  )}
                />
                {erroNascimento && <div className="text-red-600 text-sm mt-1">{erroNascimento}</div>}
                <div className="absolute top-1/2 -translate-y-1/2 flex gap-2" style={{ right: '2.5rem' }}>
                  <button type="button" onClick={() => setOpenNascimento(true)} tabIndex={-1}>
                    <svg width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="14" rx="2" stroke="#2563eb" strokeWidth="2"/><path d="M16 3v4M8 3v4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="14" r="3" stroke="#2563eb" strokeWidth="2"/></svg>
                  </button>
                </div>
              </div>
              <div className="w-full mt-2 relative">
                <DatePicker
                  selected={form.dataCartaConducao ? new Date(form.dataCartaConducao) : null}
                  onChange={date => setForm(f => ({ ...f, dataCartaConducao: date ? date.toISOString().slice(0, 10) : "" }))}
                  locale="pt"
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Data da Carta de condução (dd-mm-aaaa)"
                  className="w-full p-3 border border-blue-300 rounded-lg pr-10"
                  required
                  todayButton="Hoje"
                  isClearable
                  clearButtonTitle="Limpar"
                  showMonthDropdown
                  showYearDropdown
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  value={form.dataCartaConducao ? `${formatDate(form.dataCartaConducao)} (data da carta de condução)` : ""}
                  customInput={
                    React.createElement('input', {
                      type: 'text',
                      className: 'w-full p-3 border border-blue-300 rounded-lg pr-10',
                      value: form.dataCartaConducaoManual !== undefined ? form.dataCartaConducaoManual : (form.dataCartaConducao ? formatDate(form.dataCartaConducao) : ''),
                      required: true,
                      readOnly: true,
                      placeholder: 'Data da Carta de condução (dd-mm-aaaa)'
                    })
                  }
                  open={openCarta}
                  onClickOutside={() => setOpenCarta(false)}
                  calendarClassName="relative"
                  renderCustomHeader={props => (
                    <div className="flex items-center justify-between px-2 pb-2">
                      <div className="flex gap-2 items-center">
                        <button type="button" onClick={props.decreaseMonth} className="px-2 py-1 text-blue-700">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>
                        <select
                          value={props.date.getMonth()}
                          onChange={e => props.changeMonth(Number(e.target.value))}
                          className="border rounded px-2 py-1"
                        >
                          {["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"].map((month, idx) => (

                            <option key={month} value={idx}>{month}</option>
                          ))}
                        </select>
                        <select
                          value={props.date.getFullYear()}
                          onChange={e => props.changeYear(Number(e.target.value))}
                          className="border rounded px-2 py-1"
                        >
                          {Array.from({length: 100}, (_, i) => new Date().getFullYear() - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        <button type="button" onClick={props.increaseMonth} className="px-2 py-1 text-blue-700">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                      </div>
                    </div>
                  )}
                />
                {erroCarta && <div className="text-red-600 text-sm mt-1">{erroCarta}</div>}
                <div className="absolute top-1/2 -translate-y-1/2 flex gap-2" style={{ right: '2.5rem' }}>
                  <button type="button" onClick={() => setOpenCarta(true)} tabIndex={-1}>
                    <svg width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="14" rx="2" stroke="#2563eb" strokeWidth="2"/><path d="M16 3v4M8 3v4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="14" r="3" stroke="#2563eb" strokeWidth="2"/></svg>
                  </button>
                </div>
              </div>
              <input
                name="codigoPostal"
                value={form.codigoPostal || ""}
                onChange={e => {
                  let v = e.target.value.replace(/[^\d]/g, "");
                  if (v.length > 4) v = v.slice(0, 4) + '-' + v.slice(4, 7);
                  if (v.length > 8) v = v.slice(0, 8);
                  setForm({ ...form, codigoPostal: v });
                }}
                placeholder="Código Postal (____-___)"
                className="w-full p-3 border border-blue-300 rounded-lg mt-2"
                maxLength={8}
                required
                pattern="^\d{4}-\d{3}$"
                onFocus={e => {
                  if (!form.codigoPostal) {
                    setForm({ ...form, codigoPostal: "" });
                  }
                }}
                onInvalid={e => setCustomValidity(e, 'Por favor, insira o código postal no formato XXXX-XXX com 7 dígitos numéricos.')}
                onInput={e => setCustomValidity(e, '')}
              />
              {form.codigoPostal && !/^\d{4}-\d{3}$/.test(form.codigoPostal) && (
                <div className="text-red-600 text-sm mt-1">O código postal deve ter 7 dígitos numéricos (formato XXXX-XXX).</div>
              )}
              <input
                name="contribuinte"
                type="text"
                value={form.contribuinte || ""}
                onChange={handleChange}
                placeholder="NIF (Contribuinte)"
                className={`w-full p-3 border rounded-lg ${form.contribuinte && !validarNIF(form.contribuinte) ? 'border-red-500' : 'border-blue-300'}`}
                required
                pattern="[0-9]{9}"
                maxLength={9}
                minLength={9}
                onBlur={e => {
                  if (e.target.value && !validarNIF(e.target.value)) {
                    e.target.setCustomValidity('NIF inválido.');
                  } else {
                    e.target.setCustomValidity('');
                  }
                }}
                onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Por favor, preencha o NIF válido com 9 dígitos.')}
                onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
              />
              {form.contribuinte && !validarNIF(form.contribuinte) && (
                <div className="text-red-600 text-sm mt-1">NIF inválido.</div>
              )}
              <div className="flex justify-end gap-2">
                <button type="button" className="px-6 py-2 bg-gray-200 rounded" disabled>Anterior</button>
                <button type="submit" className="px-6 py-2 bg-blue-700 text-white rounded font-bold hover:bg-blue-900 transition">Próximo</button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h3 className="text-xl font-semibold text-blue-700 mb-2 text-center">Passo 2 - Identificação da viatura</h3>
              <input name="marca" value={form.marca || ""} onChange={handleChange} placeholder="Marca do carro" className="w-full p-3 border border-blue-300 rounded-lg" required onInvalid={e => setCustomValidity(e, 'Por favor, preencha a marca do carro.')} onInput={e => setCustomValidity(e, '')} />
              <input name="modelo" value={form.modelo} onChange={handleChange} placeholder="Modelo do carro" className="w-full p-3 border border-blue-300 rounded-lg" required onInvalid={e => setCustomValidity(e, 'Por favor, preencha o modelo do carro.')} onInput={e => setCustomValidity(e, '')} />
              <input name="ano" value={form.ano} onChange={e => {
  let v = e.target.value.replace(/[^\d]/g, "");
  if (v.length > 4) v = v.slice(0, 4);
  setForm({ ...form, ano: v });
}} placeholder="Ano" className="w-full p-3 border border-blue-300 rounded-lg" required maxLength={4} onInvalid={e => setCustomValidity(e, 'Por favor, preencha o ano do carro.')} onInput={e => setCustomValidity(e, '')} />

              <div className="flex justify-center my-2">
  <div className="border-4 border-gray-700 rounded-lg flex items-center px-4 py-2 shadow-md" style={{ minWidth: '180px', maxWidth: '220px', background: 'white' }}>
    <input
      name="matricula"
      value={form.matricula}
      onChange={e => {
        let v = e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
        if (v.length > 2) v = v.slice(0,2) + '-' + v.slice(2);
        if (v.length > 5) v = v.slice(0,5) + '-' + v.slice(5,7);
        if (v.length > 8) v = v.slice(0,8);
        setForm({ ...form, matricula: v });
      }}
      placeholder="XX-XX-XX"
      className="text-center font-mono text-lg bg-transparent outline-none w-full"
      maxLength={8}
      required
      onInvalid={e => setCustomValidity(e, 'Por favor, preencha a matrícula no formato XX-XX-XX.')}
      onInput={e => setCustomValidity(e, '')}
      style={{ letterSpacing: '2px' }}
    />
    <svg width="32" height="20" viewBox="0 0 32 20" className="ml-2" fill="none"><rect x="0.5" y="0.5" width="31" height="19" rx="3" fill="#2563eb" stroke="#1e293b"/><text x="16" y="14" textAnchor="middle" fontSize="10" fill="#fff">PT</text></svg>
  </div>
</div>
              <div className="flex justify-between gap-2">
                <button type="button" onClick={handlePrev} className="px-6 py-2 bg-gray-200 rounded">Anterior</button>
                <button type="submit" className="px-6 py-2 bg-blue-700 text-white rounded font-bold hover:bg-blue-900 transition">Próximo</button>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h3 className="text-xl font-semibold text-blue-700 mb-2 text-center">Passo 3 - Produto e coberturas adicionais</h3>
              {/* RGPD Checkbox */}
              <div className="mb-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="aceitaRgpd"
                  required
                  className="accent-blue-700 w-5 h-5"
                  style={{ minWidth: 20, minHeight: 20 }}
                  onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Por favor, aceite a Política de Privacidade & RGPD para prosseguir.')}
                  onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
                />
                <label htmlFor="aceitaRgpd" className="text-blue-900 text-sm select-none">
                  Li e aceito a <a href={`${import.meta.env.BASE_URL}politica-rgpd`} target="_blank" rel="noopener noreferrer" className="underline text-blue-700 hover:text-blue-900">Política de Privacidade &amp; RGPD</a> da Ansião Seguros.
                </label>
              </div>
              <label className="block font-semibold mb-2 text-left" htmlFor="tipoSeguro">Tipo de seguro:</label>
<select id="tipoSeguro" name="tipoSeguro" value={form.tipoSeguro || ""} onChange={handleChange} className="w-full p-3 border border-blue-300 rounded-lg text-left" required onInvalid={e => setCustomValidity(e, 'Por favor, selecione o tipo de seguro.')} onInput={e => setCustomValidity(e, '')}>

  <option value="">Selecione o tipo de seguro</option>
  <option value="Terceiros">Terceiros</option>
  <option value="Danos Próprios">Danos Próprios</option>
</select>
              {form.tipoSeguro === "Terceiros" && (
                <div className="text-sm text-blue-700 mt-1 bg-blue-50 rounded p-2">Seguro de <b>Terceiros</b>: cobre danos causados a outros veículos, pessoas ou propriedades, mas não cobre danos ao seu próprio veículo.</div>
              )}
              {form.tipoSeguro === "Danos Próprios" && (
                <div className="text-sm text-blue-700 mt-1 bg-blue-50 rounded p-2">Seguro de <b>Danos Próprios</b>: cobre danos ao seu próprio veículo, além dos danos causados a terceiros.</div>
              )}
              <label className="block font-semibold mb-2">Coberturas base:</label>
              {form.tipoSeguro === "Terceiros" && (
  <div className="flex flex-col gap-2 mb-2">
    <label><input type="checkbox" checked disabled /> Responsabilidade civil</label>
    <label><input type="checkbox" checked disabled /> Proteção jurídica</label>
  </div>
)}
{form.tipoSeguro === "Danos Próprios" && (
  <div className="flex flex-col gap-2 mb-2">
    <label><input type="checkbox" checked disabled /> Choque, colisão e capotamento</label>
    <label><input type="checkbox" checked disabled /> Furto ou roubo</label>
    <label><input type="checkbox" checked disabled /> Incêndio</label>
  </div>
)}
<label className="block font-semibold mb-2">Coberturas adicionais:</label>
              {form.tipoSeguro === "Terceiros" && (
  <div className="flex flex-col gap-2">
    <label><input type="checkbox" name="coberturas" value="Ocupantes" checked={form.coberturas.includes("Ocupantes")} onChange={handleChange} /> Ocupantes</label>
    <label><input type="checkbox" name="coberturas" value="Vidros" checked={form.coberturas.includes("Vidros")} onChange={handleChange} /> Vidros</label>
    <label><input type="checkbox" name="coberturas" value="Assistência em viagem" checked={form.coberturas.includes("Assistência em viagem")} onChange={handleChange} /> Assistência em viagem</label>
    <label><input type="checkbox" name="coberturas" value="Incêndio" checked={form.coberturas.includes("Incêndio")} onChange={handleChange} /> Incêndio</label>
    <label><input type="checkbox" name="coberturas" value="Roubo" checked={form.coberturas.includes("Roubo")} onChange={handleChange} /> Roubo</label>
  </div>
)}
{form.tipoSeguro === "Danos Próprios" && (
  <div className="flex flex-col gap-2">
    <label><input type="checkbox" name="coberturas" value="Riscos catastróficos da natureza" checked={form.coberturas.includes("Riscos catastróficos da natureza")} onChange={handleChange} /> Riscos catastróficos da natureza</label>
    <label><input type="checkbox" name="coberturas" value="Atos de vandalismo" checked={form.coberturas.includes("Atos de vandalismo")} onChange={handleChange} /> Atos de vandalismo</label>
    <label><input type="checkbox" name="coberturas" value="Veículo de Substituição" checked={form.coberturas.includes("Veículo de Substituição")} onChange={handleChange} /> Veículo de Substituição</label>
  </div>
)}
<div className="mt-4">
  <label className="block text-sm font-semibold mb-1">Outros pedidos / detalhes</label>
  <textarea
    name="outrosPedidos"
    value={form.outrosPedidos || ''}
    onChange={handleChange}
    placeholder="Ex.: limites, condutor jovem, franquias desejadas, observações..."
    className="w-full p-3 border rounded bg-white min-h-[90px]"
  />
</div>
              <div className="flex justify-between gap-2 mt-4">
                <button type="button" onClick={handlePrev} className="px-6 py-2 bg-gray-200 rounded">Anterior</button>
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 transition">Simular</button>
              </div>
            </>
          )}
        </form>
        {resultado && <div className="mt-6 p-4 bg-blue-50 text-blue-900 rounded-lg text-center font-semibold shadow whitespace-pre-line">{resultado}</div>}
        {mensagem && (
          <div className={`fixed bottom-8 right-8 z-50 p-4 rounded-lg font-semibold shadow transition-opacity duration-500 ${mensagemTipo === 'sucesso' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}
            style={{ minWidth: '260px', maxWidth: '350px', textAlign: 'left' }}>
            {mensagem.split('\n').map((line, idx) => (
              <div key={idx} style={{ textAlign: 'left' }}>{line}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
