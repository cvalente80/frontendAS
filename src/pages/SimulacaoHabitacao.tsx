import React, { useState, ChangeEvent, FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { EMAILJS_SERVICE_ID_SAUDE, EMAILJS_TEMPLATE_ID_HABITACAO, EMAILJS_USER_ID_SAUDE } from "../emailjs.config";

type FormState = {
  // Passo 1 - Imóvel
  situacao: "proprietario" | "inquilino" | "";
  tipoImovel: "apartamento" | "moradia" | "";
  utilizacao: "permanente" | "secundaria" | "arrendamento" | "";
  anoConstrucao: string;
  area: string; // m2
  codigoPostal: string;
  construcao: "betao" | "alvenaria" | "madeira" | "";
  seguranca: string[]; // alarme, porta, cctv
  capitalEdificio?: string; // obrigatório se proprietario
  capitalConteudo: string;

  // Passo 2 - Dados pessoais
  nome: string;
  email: string;
  telefone: string;
  contribuinte: string;
  aceitaRgpd: boolean;

  // Passo 3 - Produto
  produto: "base" | "intermedio" | "completo" | "";
  extras: string[]; // sismo, inundacoes, rcExtra, assistenciaLar
  detalhes?: string; // campo aberto para detalhes adicionais
};

export default function SimulacaoHabitacao() {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<FormState>({
    situacao: "",
    tipoImovel: "",
    utilizacao: "",
  anoConstrucao: "",
  area: "",
    codigoPostal: "",
    construcao: "",
    seguranca: [],
    capitalEdificio: "",
    capitalConteudo: "",
    nome: "",
    email: "",
    telefone: "",
    contribuinte: "",
    aceitaRgpd: false,
    produto: "",
    extras: [],
    detalhes: "",
  });
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [mensagemTipo, setMensagemTipo] = useState<"sucesso" | "erro" | null>(null);

  // Helper para formatar capitais em EUR (sem casas decimais)
  const formatCapital = (v?: string) => {
    const n = Number(v);
    if (!v || !isFinite(n) || n <= 0) return 'n/a';
    try {
      return new Intl.NumberFormat('pt-PT', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n) + ' €';
    } catch {
      return n.toString() + ' €';
    }
  };

  // Formatação para o input (sem símbolo €)
  const formatThousands = (v?: string) => {
    if (!v) return '';
    const n = Number(v);
    if (!isFinite(n)) return '';
    try {
      return new Intl.NumberFormat('pt-PT', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
    } catch {
      return v;
    }
  };

  // Formatação telefone / NIF (### ### ###)
  const formatNineDigitsSpaced = (v: string) => {
    const raw = (v || '').replace(/\D/g, '').slice(0,9);
    return raw.replace(/(\d{3})(\d{3})(\d{0,3})/, (m, a, b, c) => c ? `${a} ${b} ${c}` : `${a} ${b}` ).trim();
  };

  // Formatação telefone PT específica (XX XXXXXXX)
  const formatPhoneTwoSeven = (v: string) => {
    const raw = (v || '').replace(/\D/g,'').slice(0,9);
    if (!raw) return '';
    if (raw.length <= 2) return raw; // ainda a escrever prefixo
    return raw.slice(0,2) + ' ' + raw.slice(2);
  };

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    if (type === "checkbox") {
      const checked = (target as HTMLInputElement).checked;
      if (name === "aceitaRgpd") {
        setForm(prev => ({ ...prev, aceitaRgpd: checked }));
      } else if (name === "seguranca" || name === "extras") {
        const group = name as "seguranca" | "extras";
        setForm(prev => {
          const arr = new Set(prev[group]);
          if (checked) arr.add(value); else arr.delete(value);
          return { ...prev, [group]: Array.from(arr) } as FormState;
        });
      }
    } else {
      if (name === 'produto') {
        setForm(prev => {
          const next: FormState = { ...prev, produto: value as FormState['produto'] };
          if (value === 'completo' && next.extras.includes('sismo')) {
            next.extras = next.extras.filter(e => e !== 'sismo');
          }
          return next;
        });
      } else {
        setForm(prev => ({ ...prev, [name]: value } as FormState));
      }
    }
  }

  // Utilitários
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

  function validarPasso1(): boolean {
    if (!form.situacao || !form.tipoImovel || !form.utilizacao || !form.anoConstrucao || !form.area || !form.codigoPostal || !form.construcao) {
      setMensagem("Por favor, preencha todos os campos obrigatórios do imóvel.");
      setMensagemTipo("erro");
      return false;
    }
    // Pelo menos um dos capitais (edifício ou conteúdo) deve estar preenchido (>0)
    const capitalEdificioValido = !!form.capitalEdificio && Number(form.capitalEdificio) > 0;
    const capitalConteudoValido = !!form.capitalConteudo && Number(form.capitalConteudo) > 0;
    if (!capitalEdificioValido && !capitalConteudoValido) {
      setMensagem("Indique pelo menos um capital: edifício ou conteúdo.");
      setMensagemTipo("erro");
      return false;
    }
    if (!/^[0-9]{4}-[0-9]{3}$/.test(form.codigoPostal)) {
      setMensagem("Código Postal inválido. Formato XXXX-XXX.");
      setMensagemTipo("erro");
      return false;
    }
    if (!/^\d{4}$/.test(form.anoConstrucao)) {
      setMensagem("Ano de construção inválido (AAAA).");
      setMensagemTipo("erro");
      return false;
    }
    setMensagem(null); setMensagemTipo(null);
    return true;
  }

  function validarPasso2(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!form.nome) { setMensagem("Preencha o nome."); setMensagemTipo("erro"); return false; }
    if (!form.email || !emailRegex.test(form.email)) { setMensagem("Insira um email válido."); setMensagemTipo("erro"); return false; }
  if (!/^[0-9]{9}$/.test(form.telefone)) { setMensagem("Telefone deve ter 9 dígitos."); setMensagemTipo("erro"); return false; }
  if (!/^[0-9]{9}$/.test(form.contribuinte)) { setMensagem("NIF deve ter 9 dígitos."); setMensagemTipo("erro"); return false; }
    setMensagem(null); setMensagemTipo(null);
    return true;
  }

  function handleNext(e: FormEvent) {
    e.preventDefault();
    if (step === 1) {
      if (validarPasso1()) setStep(2);
    } else if (step === 2) {
      if (validarPasso2()) setStep(3);
    }
  }

  function handlePrev(e: FormEvent) {
    e.preventDefault();
    setStep(s => Math.max(1, s - 1));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.produto) {
      setMensagem("Selecione o produto.");
      setMensagemTipo("erro");
      return;
    }
    if (!form.aceitaRgpd) {
      setMensagem("É necessário aceitar a Política de Privacidade & RGPD.");
      setMensagemTipo("erro");
      return;
    }

  const produtoLabel = form.produto === 'base' ? 'Imóvel' : form.produto === 'intermedio' ? 'Imóvel + Recheio' : 'Imóvel + Recheio + Fenómenos Sísmicos';
  const extrasLabel = (form.extras || []).map(x => x === 'sismo' ? 'Fenómenos sísmico' : x === 'veiculos-garagem' ? 'Veículos em garagem' : x).join(', ');
  const telefoneFormatado = formatPhoneTwoSeven(form.telefone);
  const segurancaLista = form.seguranca.join(', ') || 'Nenhuma';

  const resumo =
`Imóvel: ${form.tipoImovel} | Situação: ${form.situacao} | Utilização: ${form.utilizacao}
Ano: ${form.anoConstrucao} | Área: ${form.area} m²
Construção: ${form.construcao} | Segurança: ${form.seguranca.join(', ') || 'Nenhuma'}
CP: ${form.codigoPostal} | Capitais -> Edifício: ${form.situacao==='proprietario'?form.capitalEdificio+' €':'n/a'} | Conteúdo: ${form.capitalConteudo} €
Produto: ${produtoLabel} | Extras: ${extrasLabel || 'Nenhum'}
Detalhes: ${form.detalhes?.trim() ? form.detalhes?.trim() : '-'}
Cliente: ${form.nome} | Email: ${form.email} | Tel: ${form.telefone} | NIF: ${form.contribuinte}`;

    const templateParams = {
      // Identificação
      nome: form.nome,
      email: form.email,
      telefone: telefoneFormatado,
      nif: form.contribuinte,
      // Dados do risco
      situacao: form.situacao,
      tipo_imovel: form.tipoImovel,
      utilizacao: form.utilizacao,
      ano_construcao: form.anoConstrucao,
      area_m2: form.area,
      codigo_postal: form.codigoPostal,
      construcao: form.construcao,
      seguranca: segurancaLista,
      capital_edificio: form.situacao==='proprietario' && form.capitalEdificio ? form.capitalEdificio : 'n/a',
      capital_conteudo: form.capitalConteudo || 'n/a',
      // Produto e coberturas
      produto: produtoLabel,
      extras: extrasLabel || 'Nenhum',
      detalhes: form.detalhes?.trim() ? form.detalhes.trim() : '-',
      // Resumo legacy / compatibilidade
      resultado: resumo,
      tipoSeguro: `Casa (${produtoLabel})`,
    } as Record<string, any>;

    const isDev = (import.meta as any)?.env?.DEV;
    if (isDev) {
      // Log seguro (não mostra todos os dados sensíveis, mas suficiente para debug)
      // Atenção: remover se for exposto em produção.
      console.log('[EmailJS][DEBUG] Enviando', {
        service: EMAILJS_SERVICE_ID_SAUDE,
        template: EMAILJS_TEMPLATE_ID_HABITACAO,
        user: EMAILJS_USER_ID_SAUDE?.slice(0,4) + '***',
        params: templateParams
      });
    }

    emailjs
      .send(EMAILJS_SERVICE_ID_SAUDE, EMAILJS_TEMPLATE_ID_HABITACAO, templateParams, EMAILJS_USER_ID_SAUDE)
      .then((resp) => {
        if (isDev) console.log('[EmailJS][DEBUG] Sucesso', resp.status, resp.text);
        setMensagem("Pedido enviado com sucesso! Receberá instruções por email.");
        setMensagemTipo("sucesso");
        // reset parcial
        setForm({
          situacao: "",
          tipoImovel: "",
          utilizacao: "",
          anoConstrucao: "",
          area: "",
          codigoPostal: "",
          construcao: "",
          seguranca: [],
          capitalEdificio: "",
          capitalConteudo: "",
          nome: "",
          email: "",
          telefone: "",
          contribuinte: "",
          aceitaRgpd: false,
          produto: "",
          extras: [],
          detalhes: "",
        });
        setStep(1);
        setTimeout(() => { setMensagem(null); setMensagemTipo(null); }, 6000);
      })
      .catch((error) => {
        if (isDev) console.error('[EmailJS][DEBUG] Erro envio', error);
        setMensagem("Ocorreu um erro ao enviar o pedido. Tente novamente.");
        setMensagemTipo("erro");
        console.error(error);
        setTimeout(() => { setMensagem(null); setMensagemTipo(null); }, 6000);
      });
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-blue-50 relative pt-8 md:pt-12">
      <img
  src={`${import.meta.env.BASE_URL}imagens/insurance-background.jpg`}
        alt="Seguro Habitação"
        className="absolute inset-0 w-full h-full object-cover opacity-25"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/family-happy2.png'; }}
      />
      <div className="relative z-10 max-w-3xl w-full bg-white bg-opacity-90 rounded-xl shadow-xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">Simulação Seguro Habitação</h1>

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
              <h3 className="text-xl font-semibold text-blue-700 mb-2 text-center">1. Dados do Imóvel</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Situação</label>
                  <select name="situacao" value={form.situacao} onChange={handleChange} className="w-full p-3 border rounded" required onInvalid={e=>setCustomValidity(e,'Selecione a sua situação.')} onInput={e=>setCustomValidity(e,'')}>
                    <option value="">Selecione</option>
                    <option value="proprietario">Proprietário</option>
                    <option value="inquilino">Inquilino</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Tipo de imóvel</label>
                  <select name="tipoImovel" value={form.tipoImovel} onChange={handleChange} className="w-full p-3 border rounded" required onInvalid={e=>setCustomValidity(e,'Selecione o tipo de imóvel.')} onInput={e=>setCustomValidity(e,'')}>
                    <option value="">Selecione</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="moradia">Moradia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Utilização</label>
                  <select name="utilizacao" value={form.utilizacao} onChange={handleChange} className="w-full p-3 border rounded" required onInvalid={e=>setCustomValidity(e,'Selecione a utilização.')} onInput={e=>setCustomValidity(e,'')}>
                    <option value="">Selecione</option>
                    <option value="permanente">Habitação Própria Permanente</option>
                    <option value="secundaria">Habitação Secundária</option>
                    <option value="arrendamento">Arrendamento</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Ano de construção</label>
                  <input name="anoConstrucao" value={form.anoConstrucao} onChange={e=>{
                    const v = e.target.value.replace(/\D/g,'').slice(0,4);
                    setForm(prev=>({ ...prev, anoConstrucao: v }));
                  }} placeholder="AAAA" className="w-full p-3 border rounded" required onInvalid={e=>setCustomValidity(e,'Indique o ano de construção.')} onInput={e=>setCustomValidity(e,'')} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Área (m²)</label>
                  <input name="area" value={form.area} onChange={e=>{
                    const v = e.target.value.replace(/[^\d.]/g,'').slice(0,6);
                    setForm(prev=>({ ...prev, area: v }));
                  }} placeholder="Ex: 120" className="w-full p-3 border rounded" required onInvalid={e=>setCustomValidity(e,'Indique a área em m².')} onInput={e=>setCustomValidity(e,'')} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Código Postal do risco</label>
                  <input name="codigoPostal" value={form.codigoPostal} onChange={e=>{
                    let v = e.target.value.replace(/\D/g,"");
                    if (v.length > 4) v = v.slice(0,4)+'-'+v.slice(4,7);
                    if (v.length > 8) v = v.slice(0,8);
                    setForm(prev=>({ ...prev, codigoPostal: v }));
                  }} placeholder="____-___" className="w-full p-3 border rounded" required maxLength={8} pattern="^[0-9]{4}-[0-9]{3}$" onInvalid={e=>setCustomValidity(e,'Formato XXXX-XXX.')} onInput={e=>setCustomValidity(e,'')} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Tipo de construção</label>
                  <select name="construcao" value={form.construcao} onChange={handleChange} className="w-full p-3 border rounded" required onInvalid={e=>setCustomValidity(e,'Selecione o tipo de construção.')} onInput={e=>setCustomValidity(e,'')}>
                    <option value="">Selecione</option>
                    <option value="betao">Betão armado</option>
                    <option value="alvenaria">Alvenaria (tijolo/pedra)</option>
                    <option value="madeira">Madeira</option>
                  </select>
                </div>
                {form.situacao === 'proprietario' && (
                  <div>
                    <label className="block text-sm font-semibold mb-1">Capital do Edifício (€)</label>
                    <input
                      name="capitalEdificio"
                      value={formatThousands(form.capitalEdificio)}
                      onChange={e=>{
                        const raw = e.target.value.replace(/[^0-9]/g,'').slice(0,9);
                        setForm(prev=>({ ...prev, capitalEdificio: raw }));
                      }}
                      placeholder="Ex: 150000"
                      inputMode="numeric"
                      className="w-full p-3 border rounded"
                      onPaste={e=>{
                        const text = e.clipboardData.getData('text');
                        if (!/^[0-9]+$/.test(text.replace(/[^0-9]/g,''))) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold mb-1">Capital do Conteúdo (€)</label>
                  <input
                    name="capitalConteudo"
                    value={formatThousands(form.capitalConteudo)}
                    onChange={e=>{
                      const raw = e.target.value.replace(/[^0-9]/g,'').slice(0,9);
                      setForm(prev=>({ ...prev, capitalConteudo: raw }));
                    }}
                    placeholder="Ex: 25 000"
                    inputMode="numeric"
                    className="w-full p-3 border rounded"
                    onPaste={e=>{
                      const text = e.clipboardData.getData('text');
                      if (!/^[0-9]+$/.test(text.replace(/[^0-9]/g,''))) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Sistemas de segurança</label>
                <div className="flex flex-wrap gap-4 text-sm">
                  <label className="inline-flex items-center gap-2"><input type="checkbox" name="seguranca" value="alarme" checked={form.seguranca.includes('alarme')} onChange={handleChange}/> Alarme</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" name="seguranca" value="porta-blindada" checked={form.seguranca.includes('porta-blindada')} onChange={handleChange}/> Porta blindada</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" name="seguranca" value="cctv" checked={form.seguranca.includes('cctv')} onChange={handleChange}/> Videovigilância</label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="px-6 py-2 bg-gray-200 rounded" disabled>Anterior</button>
                <button type="submit" className="px-6 py-2 bg-blue-700 text-white rounded font-bold hover:bg-blue-900 transition">Próximo</button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="text-xl font-semibold text-blue-700 mb-2 text-center">2. Dados Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Nome completo</label>
                  <input name="nome" value={form.nome} onChange={handleChange} placeholder="O seu nome" className="w-full p-3 border rounded" required onInvalid={e=>setCustomValidity(e,'Indique o nome.')} onInput={e=>setCustomValidity(e,'')} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="nome@servidor.pt" className="w-full p-3 border rounded" required pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" onInvalid={e=>setCustomValidity(e,'Insira um email válido.')} onInput={e=>setCustomValidity(e,'')} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Telefone</label>
                  <input
                    name="telefone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10} /* 2 + espaço + 7 */
                    value={formatPhoneTwoSeven(form.telefone)}
                    onChange={e=>{
                      const raw = e.target.value.replace(/\D/g,'').slice(0,9);
                      setForm(prev=>({ ...prev, telefone: raw }));
                    }}
                    placeholder="__ _______"
                    className="w-full p-3 border rounded"
                    required
                    onInvalid={e=>setCustomValidity(e,'Telefone deve ter 9 dígitos.')}
                    onInput={e=>setCustomValidity(e,'')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">NIF (Contribuinte)</label>
                  <input
                    name="contribuinte"
                    type="tel"
                    inputMode="numeric"
                    maxLength={11}
                    value={formatNineDigitsSpaced(form.contribuinte)}
                    onChange={e=>{
                      const raw = e.target.value.replace(/\D/g,'').slice(0,9);
                      setForm(prev=>({ ...prev, contribuinte: raw }));
                    }}
                    placeholder="___ ___ ___"
                    className="w-full p-3 border rounded"
                    required
                    onInvalid={e=>setCustomValidity(e,'NIF deve ter 9 dígitos.')}
                    onInput={e=>setCustomValidity(e,'')}
                  />
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
              <h3 className="text-xl font-semibold text-blue-700 mb-2 text-center">3. Produto</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {([
                  { key: 'base', title: 'Imóvel', desc: 'Proteção ao edifício com RC, incêndio/explosão, riscos elétricos e danos por água.' },
                  { key: 'intermedio', title: 'Imóvel + Recheio', desc: 'Inclui proteção ao conteúdo (recheio), com RC, incêndio/explosão, riscos elétricos e danos por água.' },
                  { key: 'completo', title: 'Imóvel + Recheio + Fenómenos Sísmicos', desc: 'Cobertura alargada incluindo fenómenos sísmicos, com RC e proteção ao edifício e recheio.' },
                ] as const).map(card => (
                  <label key={card.key} className={`border rounded-xl p-4 cursor-pointer shadow-sm flex flex-col gap-2 ${form.produto === card.key ? 'ring-2 ring-blue-600 bg-blue-50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-900">{card.title}</span>
                      <input type="radio" name="produto" value={card.key} checked={form.produto === card.key} onChange={handleChange} />
                    </div>
                    <p className="text-sm text-blue-800">{card.desc}</p>
                    <ul className="text-xs text-blue-900 list-disc list-inside">
                      {card.key === 'base' && (<>
                        <li>Responsabilidade civil</li>
                        <li>Incêndio e explosão</li>
                        <li>Riscos elétricos</li>
                        <li>Danos por água</li>
                      </>)}
                      {card.key === 'intermedio' && (<>
                        <li>Responsabilidade civil</li>
                        <li>Incêndio e explosão</li>
                        <li>Riscos elétricos</li>
                        <li>Danos por água</li>
                        <li>Roubo (recheio)</li>
                      </>)}
                      {card.key === 'completo' && (<>
                        <li>Responsabilidade civil</li>
                        <li>Incêndio e explosão</li>
                        <li>Riscos elétricos</li>
                        <li>Danos por água</li>
                        <li>Roubo (recheio)</li>
                        <li>Fenómenos sísmicos</li>
                      </>)}
                    </ul>
                    {/* Capitais selecionados */}
                    <div className="mt-2 text-xs text-blue-900 bg-white/70 border border-blue-100 rounded p-2">
                      <div className="font-semibold mb-1">Capitais selecionados</div>
                      {card.key === 'base' && (
                        <div className="flex items-center justify-between gap-2">
                          <span>Capital Imóvel</span>
                          <span className="font-bold">{formatCapital(form.capitalEdificio)}</span>
                        </div>
                      )}
                      {card.key !== 'base' && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span>Capital Imóvel</span>
                            <span className="font-bold">{formatCapital(form.capitalEdificio)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span>Capital Conteúdo</span>
                            <span className="font-bold">{formatCapital(form.capitalConteudo)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold mb-1">Coberturas adicionais</label>
                <div className="flex flex-wrap gap-4 text-sm">
                  {form.produto !== 'completo' && (
                    <label className="inline-flex items-center gap-2"><input type="checkbox" name="extras" value="sismo" checked={form.extras.includes('sismo')} onChange={handleChange}/> Fenómenos sísmico</label>
                  )}
                  <label className="inline-flex items-center gap-2"><input type="checkbox" name="extras" value="veiculos-garagem" checked={form.extras.includes('veiculos-garagem')} onChange={handleChange}/> Veículos em garagem</label>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-semibold mb-1">Detalhes adicionais</label>
                  <textarea
                    name="detalhes"
                    value={form.detalhes || ''}
                    onChange={handleChange}
                    placeholder="Descreva aqui necessidades específicas ou coberturas desejadas..."
                    className="w-full p-3 border rounded min-h-[90px]"
                  />
                </div>
              </div>
              <div className="flex justify-between gap-2 mt-2">
                <button type="button" onClick={handlePrev} className="px-6 py-2 bg-gray-200 rounded">Anterior</button>
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 transition">Pedir Proposta</button>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <input type="checkbox" id="aceitaRgpd" name="aceitaRgpd" checked={form.aceitaRgpd} onChange={handleChange} className="accent-blue-700 w-5 h-5" required onInvalid={e=>setCustomValidity(e as any,'Necessário aceitar a Política de Privacidade.')} onInput={e=>setCustomValidity(e as any,'')} />
                <label htmlFor="aceitaRgpd" className="text-blue-900 text-sm select-none">Li e aceito a <a href={`${import.meta.env.BASE_URL}politica-rgpd`} target="_blank" rel="noopener noreferrer" className="underline text-blue-700 hover:text-blue-900">Política de Privacidade & RGPD</a>.</label>
              </div>
            </>
          )}
        </form>

        {mensagem && (
          <div className={`fixed bottom-8 right-8 z-50 p-4 rounded-lg font-semibold shadow transition-opacity duration-500 ${mensagemTipo === 'sucesso' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`} style={{ minWidth: '260px', maxWidth: '350px', textAlign: 'left' }}>
            {mensagem}
          </div>
        )}
      </div>
    </div>
  );
}
