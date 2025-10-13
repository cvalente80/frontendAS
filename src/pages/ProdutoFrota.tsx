import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { pt } from "date-fns/locale/pt";
import "react-datepicker/dist/react-datepicker.css";
import emailjs from "@emailjs/browser";
import { Link, useLocation } from "react-router-dom";
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_USER_ID } from "../emailjs.config";

registerLocale("pt", pt);

type Vehicle = {
  marca: string;
  modelo: string;
  ano: string;
  matricula: string;
};

type FormState = {
  // Passo 1
  nome: string;
  email: string;
  contribuinte: string;
  dataNascimento: string;
  dataNascimentoManual?: string;
  dataCartaConducao?: string;
  dataCartaConducaoManual?: string;
  codigoPostal?: string;
  // Passo 2
  viaturas: Vehicle[];
  // Passo 3
  tipoSeguro: string;
  coberturas: string[];
  aceitaRgpd?: boolean;
  outrosPedidos?: string;
};

export default function ProdutoFrota() {
  // Estado do formulário (similar ao SimulacaoAuto)
  const [step, setStep] = useState<number>(1);
  const [showForm, setShowForm] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement | null>(null);
  const { hash } = useLocation();
  const [form, setForm] = useState<FormState>({
    nome: "",
    email: "",
    contribuinte: "",
    dataNascimento: "",
    dataNascimentoManual: "",
    dataCartaConducao: "",
    dataCartaConducaoManual: "",
    codigoPostal: "",
    viaturas: [{ marca: "", modelo: "", ano: "", matricula: "" }],
    tipoSeguro: "",
    coberturas: [],
    aceitaRgpd: false,
    outrosPedidos: "",
  });
  const [resultado, setResultado] = useState<string | null>(null);
  const [openNascimento, setOpenNascimento] = useState<boolean>(false);
  const [openCarta, setOpenCarta] = useState<boolean>(false);
  const [erroNascimento, setErroNascimento] = useState<string>("");
  const [erroCarta, setErroCarta] = useState<string>("");
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [mensagemTipo, setMensagemTipo] = useState<"sucesso" | "erro" | null>(null);

  // Exibir formulário se URL tiver âncora (#form-frota) e fazer scroll suave
  useEffect(() => {
    if (hash === "#form-frota") {
      setShowForm(true);
      // Aguarda render para rolar
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    }
  }, [hash]);

  function handleAbrirFormulario() {
    setShowForm(true);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function setCustomValidity(e: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, message: string) {
    (e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).setCustomValidity(message);
  }

  function validarNIF(nif: string): boolean {
    if (!/^[0-9]{9}$/.test(nif)) return false;
    const n = nif.split('').map(Number);
    if (![1,2,3,5,6,8,9].includes(n[0])) return false;
    let soma = 0;
    for (let i = 0; i < 8; i++) soma += n[i] * (9 - i);
    let controlo = 11 - (soma % 11);
    if (controlo >= 10) controlo = 0;
    return controlo === n[8];
  }

  function idadeMenorQue18(data: string): boolean {
    if (!data) return true;
    const [ano, mes, dia] = data.split('-').map(Number);
    const hoje = new Date();
    let idade = hoje.getFullYear() - ano;
    if ((hoje.getMonth()+1) < mes || ((hoje.getMonth()+1) === mes && hoje.getDate() < dia)) idade--;
    return idade < 18;
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    if (type === "checkbox") {
      const checked = (target as HTMLInputElement).checked;
      if (name === 'aceitaRgpd') {
        setForm(prev => ({ ...prev, aceitaRgpd: checked }));
      } else {
        setForm(prev => {
          const coberturas = checked ? [...prev.coberturas, value] : prev.coberturas.filter(c => c !== value);
          return { ...prev, coberturas };
        });
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

  function handleVehicleChange(idx: number, field: keyof Vehicle, raw: string) {
    setForm(prev => {
      const viaturas = prev.viaturas.map((v, i) => {
        if (i !== idx) return v;
        let value = raw;
        if (field === 'ano') {
          value = raw.replace(/[^\d]/g, '').slice(0,4);
        }
        if (field === 'matricula') {
          let vmat = raw.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
          if (vmat.length > 2) vmat = vmat.slice(0,2) + '-' + vmat.slice(2);
          if (vmat.length > 5) vmat = vmat.slice(0,5) + '-' + vmat.slice(5,7);
          if (vmat.length > 8) vmat = vmat.slice(0,8);
          value = vmat;
        }
        return { ...v, [field]: value } as Vehicle;
      });
      return { ...prev, viaturas };
    });
  }

  function addVehicle() {
    setForm(prev => ({ ...prev, viaturas: [...prev.viaturas, { marca: "", modelo: "", ano: "", matricula: "" }] }));
  }
  function removeVehicle(idx: number) {
    setForm(prev => ({ ...prev, viaturas: prev.viaturas.length > 1 ? prev.viaturas.filter((_, i) => i !== idx) : prev.viaturas }));
  }

  function validarDatas() { setErroNascimento(""); setErroCarta(""); return true; }

  function handleNext(e: FormEvent) {
    e.preventDefault();
    if (step === 1) {
      if (!validarDatas()) return;
      if (idadeMenorQue18(form.dataNascimento)) { setErroNascimento("Apenas condutores com 18 anos ou mais podem prosseguir."); return; }
      if (!form.nome || !form.email || !form.contribuinte || !form.codigoPostal) { return; }
      if (!validarNIF(form.contribuinte)) { return; }
    }
    if (step === 2) {
      // validar todas as viaturas
      for (const v of form.viaturas) {
        if (!v.marca || !v.modelo || !v.ano || !v.matricula) { return; }
        if (v.ano.length !== 4) { return; }
        if (!/^([A-Z0-9]{2}-){2}[A-Z0-9]{2}$/.test(v.matricula)) { return; }
      }
    }
    setStep(s => s + 1);
  }

  function handlePrev(e: FormEvent) { e.preventDefault(); setStep(s => s - 1); }

  function formatDate(dateStr: string) {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.tipoSeguro) {
      setMensagem('Por favor, selecione o tipo de seguro.');
      setMensagemTipo('erro');
      setTimeout(() => { setMensagem(null); setMensagemTipo(null); }, 6000);
      return;
    }
  const viaturasResumo = form.viaturas.map((v, i) => `${i+1}. ${v.marca} ${v.modelo} (${v.ano}) [${v.matricula}]`).join('\n');
  const resumo = `Proposta Frota\nNIF (Empresa): ${form.contribuinte}\nData Nascimento: ${form.dataNascimento ? formatDate(form.dataNascimento) : '-'}\nData Carta: ${form.dataCartaConducao ? formatDate(form.dataCartaConducao) : '-'}\nCódigo Postal: ${form.codigoPostal || '-'}\nViaturas:\n${viaturasResumo}\nTipo: ${form.tipoSeguro}\nCoberturas: ${form.coberturas.join(', ')}\nOutros pedidos: ${form.outrosPedidos?.trim() ? form.outrosPedidos.trim() : '-'}`;
    setResultado(resumo);

    const primeira = form.viaturas[0] || { marca: '', modelo: '', ano: '', matricula: '' };
    const templateParams = {
      email: form.email,
      nome: form.nome,
      contribuinte: form.contribuinte,
  dataNascimento: form.dataNascimento ? formatDate(form.dataNascimento) : '',
  dataCartaConducao: form.dataCartaConducao ? formatDate(form.dataCartaConducao) : '',
  codigoPostal: form.codigoPostal || '',
      // Compatibilidade com template de Auto
      marca: primeira.marca,
      modelo: primeira.modelo,
      ano: primeira.ano,
      matricula: primeira.matricula,
      tipoSeguro: `Frota - ${form.tipoSeguro}`,
      coberturas: form.coberturas.join(', '),
      viaturas: viaturasResumo,
      outrosPedidos: form.outrosPedidos?.trim() ? form.outrosPedidos.trim() : '-',
      resultado: resumo,
    } as Record<string, any>;

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_USER_ID)
      .then(() => { setMensagem('Pedido enviado com sucesso!'); setMensagemTipo('sucesso'); })
      .catch((error) => { setMensagem('Pedido submetido, mas houve erro ao enviar o email.'); setMensagemTipo('erro'); console.error(error); });

    setTimeout(() => { setMensagem(null); setMensagemTipo(null); }, 6000);
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center py-12 px-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-0 overflow-hidden">
        {/* Header visual com imagem e título */}
  <div className="relative h-56 md:h-80 w-full flex items-center justify-center bg-blue-900">
          <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=60" alt="Seguro Frota Empresarial" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="relative z-10 text-center w-full">
      <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow mb-2">Seguro Frota Empresarial</h1>
      <p className="text-base md:text-lg text-blue-100 font-medium mb-4">Gestão eficiente e proteção completa para todos os veículos da sua empresa</p>
            <span className="inline-block px-6 py-2 bg-red-600 text-white font-bold rounded-full shadow-lg mb-2">Produto Fidelidade</span>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button type="button" onClick={handleAbrirFormulario} className="inline-block px-8 py-3 bg-yellow-400 text-blue-900 font-bold rounded-full shadow-lg hover:bg-yellow-300 transition">Solicitar proposta</button>
                <Link to="/contato" className="inline-block px-8 py-3 bg-blue-400 text-white font-bold rounded-full shadow-lg hover:bg-blue-300 transition">Fale com um consultor</Link>
            </div>
          </div>
        </div>
        {/* Conteúdo principal */}
        <div className="p-8 space-y-10">
          {/* Seção: Benefícios */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="2"/><path d="M8 12l2 2 4-4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
              Por que escolher o Seguro Frota Empresarial?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">🚚</span>
                <span>Gestão centralizada de todos os veículos da empresa</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">🛡️</span>
                <span>Proteção contra danos próprios, terceiros e acidentes</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">🔧</span>
                <span>Assistência 24h em todo o território nacional</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">💼</span>
                <span>Opções flexíveis de coberturas e capitais</span>
              </div>
            </div>
          </section>
          {/* Seção: Coberturas */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="14" rx="2" stroke="#2563eb" strokeWidth="2"/><path d="M16 3v4M8 3v4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="14" r="3" stroke="#2563eb" strokeWidth="2"/></svg>
              Coberturas disponíveis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Danos Próprios</h3>
                <p className="text-gray-700">Cobertura para danos causados aos veículos da frota por acidente, colisão, incêndio, furto ou roubo.</p>
              </div>
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Responsabilidade Civil</h3>
                <p className="text-gray-700">Proteção contra danos causados a terceiros, pessoas e bens.</p>
              </div>
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Assistência em Viagem</h3>
                <p className="text-gray-700">Serviços de reboque, transporte, alojamento e apoio em caso de avaria ou acidente.</p>
              </div>
              <div className="bg-white rounded-xl border border-blue-100 shadow p-5">
                <h3 className="font-bold text-blue-700 mb-1">Proteção Jurídica</h3>
                <p className="text-gray-700">Apoio legal em situações de litígio relacionadas com os veículos da empresa.</p>
              </div>
            </div>
          </section>
          {/* Seção: Vantagens */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
              Vantagens exclusivas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">📱</span>
                <span>Gestão digital da apólice e sinistros</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">🕒</span>
                <span>Atendimento especializado para empresas</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">💡</span>
                <span>Planos ajustáveis conforme o perfil da empresa</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                <span className="text-blue-700 text-2xl">👨‍👩‍👧‍👦</span>
                <span>Cobertura para condutores e colaboradores</span>
              </div>
            </div>
          </section>
          {/* Seção: Como contratar */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
              Como contratar?
            </h2>
            <ol className="list-decimal pl-6 text-blue-900 text-lg space-y-2">
              <li>Solicite uma proposta personalizada para a sua empresa.</li>
              <li>Escolha as coberturas e capitais que melhor se adaptam à sua frota.</li>
              <li>Envie os documentos necessários e finalize a contratação com o apoio de um consultor Fidelidade.</li>
            </ol>
          </section>
        </div>
      </div>
      {/* Formulário de Proposta Frota (3 passos) */}
      {showForm && (
      <div id="form-frota" ref={formRef} className="max-w-lg w-full mt-12 p-8 bg-white bg-opacity-90 rounded-2xl shadow-xl relative z-10">
        <h2 className="text-3xl font-bold mb-6 text-blue-900 text-center">Solicitar Proposta - Frota</h2>
        {/* Stepper */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1,2,3].map(n => (
              <div key={n} className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white transition-all duration-300 ${step >= n ? 'bg-blue-700 scale-110' : 'bg-blue-300 scale-100'}`}>{n}</div>
            ))}
          </div>
          <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
            <div className="h-2 bg-blue-700 transition-all duration-500" style={{ width: `${step * 33.33}%` }} />
          </div>
          <div className="text-center text-blue-700 font-medium mt-2">Passo {step} de 3</div>
        </div>
        <form onSubmit={step === 3 ? handleSubmit : handleNext} className="space-y-5">
          {step === 1 && (
            <>
              <h3 className="text-xl font-semibold text-blue-700 mb-2 text-center">Passo 1 - Identificação do responsável</h3>
              <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome completo" className="w-full p-3 border border-blue-300 rounded-lg" required onInvalid={e=>setCustomValidity(e,'Indique o nome completo.')} onInput={e=>setCustomValidity(e,'')} />
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-3 border border-blue-300 rounded-lg" required pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" onInvalid={e=>setCustomValidity(e,'Insira um email válido.')} onInput={e=>setCustomValidity(e,'')} />
              <input name="contribuinte" value={form.contribuinte} onChange={handleChange} placeholder="NIF (Contribuinte)" className={`w-full p-3 border rounded-lg ${form.contribuinte && !validarNIF(form.contribuinte) ? 'border-red-500' : 'border-blue-300'}`} required pattern="[0-9]{9}" maxLength={9} minLength={9} onInvalid={e=>setCustomValidity(e,'NIF inválido (9 dígitos).')} onInput={e=>setCustomValidity(e,'')} />
              <div className="w-full relative">
                <DatePicker
                  selected={form.dataNascimento ? new Date(form.dataNascimento) : null}
                  onChange={date => {
                    if (date) {
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
                  customInput={React.createElement('input', { type: 'text', className: 'w-full p-3 border border-blue-300 rounded-lg pr-10', value: form.dataNascimentoManual || '', required: true, readOnly: true, placeholder: 'Data de nascimento (dd-mm-aaaa)' })}
                  open={openNascimento}
                  onClickOutside={() => setOpenNascimento(false)}
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
                  customInput={React.createElement('input', { type: 'text', className: 'w-full p-3 border border-blue-300 rounded-lg pr-10', value: form.dataCartaConducaoManual !== undefined ? form.dataCartaConducaoManual : (form.dataCartaConducao ? formatDate(form.dataCartaConducao) : ''), required: true, readOnly: true, placeholder: 'Data da Carta de condução (dd-mm-aaaa)' })}
                  open={openCarta}
                  onClickOutside={() => setOpenCarta(false)}
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
              <input name="codigoPostal" value={form.codigoPostal || ""} onChange={e=>{ let v=e.target.value.replace(/[^\d]/g,""); if(v.length>4) v=v.slice(0,4)+'-'+v.slice(4,7); if(v.length>8) v=v.slice(0,8); setForm(prev=>({...prev,codigoPostal:v})); }} placeholder="Código Postal (____-___)" className="w-full p-3 border border-blue-300 rounded-lg mt-2" maxLength={8} required pattern="^\d{4}-\d{3}$" onInvalid={e=>setCustomValidity(e,'Formato XXXX-XXX.')} onInput={e=>setCustomValidity(e,'')} />
              <div className="flex justify-end gap-2"><button type="button" className="px-6 py-2 bg-gray-200 rounded" disabled>Anterior</button><button type="submit" className="px-6 py-2 bg-blue-700 text-white rounded font-bold hover:bg-blue-900 transition">Próximo</button></div>
            </>
          )}
          {step === 2 && (
            <>
              <h3 className="text-xl font-semibold text-blue-700 mb-2 text-center">Passo 2 - Identificação das viaturas</h3>
              <div className="space-y-4">
                {form.viaturas.map((v, idx) => (
                  <div key={idx} className="border border-blue-100 rounded-lg p-4 bg-blue-50/40">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-blue-900">Viatura #{idx+1}</div>
                      <button type="button" onClick={()=>removeVehicle(idx)} className="text-red-700 text-sm hover:underline" disabled={form.viaturas.length===1}>Remover</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input value={v.marca} onChange={e=>handleVehicleChange(idx,'marca',e.target.value)} placeholder="Marca" className="w-full p-3 border border-blue-300 rounded-lg" required />
                      <input value={v.modelo} onChange={e=>handleVehicleChange(idx,'modelo',e.target.value)} placeholder="Modelo" className="w-full p-3 border border-blue-300 rounded-lg" required />
                      <input value={v.ano} onChange={e=>handleVehicleChange(idx,'ano',e.target.value)} placeholder="Ano" className="w-full p-3 border border-blue-300 rounded-lg" required maxLength={4} />
                      <div className="flex justify-center">
                        <div className="border-4 border-gray-700 rounded-lg flex items-center px-4 py-2 shadow-md" style={{ minWidth: '180px', maxWidth: '220px', background: 'white' }}>
                          <input value={v.matricula} onChange={e=>handleVehicleChange(idx,'matricula',e.target.value)} placeholder="XX-XX-XX" className="text-center font-mono text-lg bg-transparent outline-none w-full" maxLength={8} required style={{ letterSpacing: '2px' }} />
                          <svg width="32" height="20" viewBox="0 0 32 20" className="ml-2" fill="none"><rect x="0.5" y="0.5" width="31" height="19" rx="3" fill="#2563eb" stroke="#1e293b"/><text x="16" y="14" textAnchor="middle" fontSize="10" fill="#fff">PT</text></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div>
                  <button type="button" onClick={addVehicle} className="px-4 py-2 rounded bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200">+ Adicionar viatura</button>
                </div>
              </div>
              <div className="flex justify-between gap-2 mt-2"><button type="button" onClick={handlePrev} className="px-6 py-2 bg-gray-200 rounded">Anterior</button><button type="submit" className="px-6 py-2 bg-blue-700 text-white rounded font-bold hover:bg-blue-900 transition">Próximo</button></div>
            </>
          )}
          {step === 3 && (
            <>
              <h3 className="text-xl font-semibold text-blue-700 mb-2 text-center">Passo 3 - Produto e coberturas adicionais</h3>
              <div className="mb-4 flex items-center gap-2">
                <input type="checkbox" id="aceitaRgpd" name="aceitaRgpd" checked={!!form.aceitaRgpd} onChange={handleChange} className="accent-blue-700 w-5 h-5" required onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Necessário aceitar a Política de Privacidade & RGPD.')} onInput={e => (e.target as HTMLInputElement).setCustomValidity('')} />
                <label htmlFor="aceitaRgpd" className="text-blue-900 text-sm select-none">Li e aceito a <a href={`${import.meta.env.BASE_URL}politica-rgpd`} target="_blank" rel="noopener noreferrer" className="underline text-blue-700 hover:text-blue-900">Política de Privacidade & RGPD</a>.</label>
              </div>
              <label className="block font-semibold mb-2 text-left" htmlFor="tipoSeguro">Tipo de seguro:</label>
              <select id="tipoSeguro" name="tipoSeguro" value={form.tipoSeguro} onChange={handleChange} className="w-full p-3 border border-blue-300 rounded-lg text-left" required onInvalid={e=>setCustomValidity(e,'Selecione o tipo de seguro.')} onInput={e=>setCustomValidity(e,'')}>
                <option value="">Selecione o tipo de seguro</option>
                <option value="Terceiros">Terceiros</option>
                <option value="Danos Próprios">Danos Próprios</option>
              </select>
              {form.tipoSeguro === "Terceiros" && (<div className="text-sm text-blue-700 mt-1 bg-blue-50 rounded p-2">Seguro de <b>Terceiros</b>: cobre danos a terceiros, pessoas e bens.</div>)}
              {form.tipoSeguro === "Danos Próprios" && (<div className="text-sm text-blue-700 mt-1 bg-blue-50 rounded p-2">Seguro de <b>Danos Próprios</b>: cobre danos ao seu veículo, além de terceiros.</div>)}
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
                <textarea name="outrosPedidos" value={form.outrosPedidos || ''} onChange={handleChange} placeholder="Ex.: limites por viatura, condutores nomeados, franquias desejadas, observações..." className="w-full p-3 border rounded bg-white min-h-[90px]" />
              </div>
              <div className="flex justify-between gap-2 mt-4"><button type="button" onClick={handlePrev} className="px-6 py-2 bg-gray-200 rounded">Anterior</button><button type="submit" className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 transition">Pedir Proposta</button></div>
            </>
          )}
        </form>
        {resultado && (<div className="mt-6 p-4 bg-blue-50 text-blue-900 rounded-lg text-center font-semibold shadow whitespace-pre-line">{resultado}</div>)}
        {mensagem && (
          <div className={`fixed bottom-8 right-8 z-50 p-4 rounded-lg font-semibold shadow transition-opacity duration-500 ${mensagemTipo === 'sucesso' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`} style={{ minWidth: '260px', maxWidth: '350px', textAlign: 'left' }}>
            {mensagem}
          </div>
        )}
      </div>
      )}
    </div>
  );
}
