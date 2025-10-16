import React, { useMemo, useState } from "react";
import Seo from "../components/Seo";
import emailjs from "@emailjs/browser";
import { EMAILJS_SERVICE_ID_GENERIC, EMAILJS_TEMPLATE_ID_GENERIC, EMAILJS_USER_ID_GENERIC } from "../emailjs.config";

type FormState = {
  nome: string;
  email: string;
  telefone?: string;
  tipoPedido: string;
  produtoInteresse: string;
  assunto?: string;
  mensagem: string;
  aceitaRgpd: boolean;
};

const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';

function sanitizeTemplateParams(params: Record<string, any>) {
  const out: Record<string,string> = {};
  for (const [k,v] of Object.entries(params)) {
    if (v === undefined || v === null) { out[k] = ""; continue; }
    if (typeof v === 'string') { out[k] = v; continue; }
    try { out[k] = JSON.stringify(v); }
    catch { out[k] = String(v); }
  }
  return out;
}

export default function Contato() {
  const [form, setForm] = useState<FormState>({
    nome: "",
    email: "",
    telefone: "",
    tipoPedido: "Pedido de informação",
    produtoInteresse: "",
    assunto: "",
    mensagem: "",
    aceitaRgpd: false,
  });
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState<string>("");
  const [mensagemTipo, setMensagemTipo] = useState<'sucesso'|'erro'|''>("");

  const canSubmit = useMemo(()=>{
    return !!form.nome && !!form.email && !!form.mensagem && form.aceitaRgpd && !enviando;
  }, [form, enviando]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = (e) => {
    const target = e.target as HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement;
    const { name, value } = target;
    setMensagem(""); setMensagemTipo("");
    if ((target as HTMLInputElement).type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: (target as HTMLInputElement).checked } as FormState));
    } else if (name === 'telefone') {
      // permitir +, espaços e dígitos
      const v = value.replace(/[^+0-9\s]/g, '').slice(0, 20);
      setForm(prev => ({ ...prev, telefone: v }));
    } else {
      setForm(prev => ({ ...prev, [name]: value } as FormState));
    }
  };

  const setCustomValidity = (e: React.FormEvent<any>, message: string) => {
    (e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).setCustomValidity(message);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setEnviando(true);
    setMensagem(""); setMensagemTipo("");

    const tipoSeguro = form.produtoInteresse ? `Contacto / ${form.produtoInteresse}` : 'Contacto geral';
    const subjectEmail = `Contacto: ${form.tipoPedido}`;

    const resumo = [
      `Nome: ${form.nome}`,
      `Email: ${form.email}`,
      form.telefone ? `Telefone: ${form.telefone}` : null,
      `Tipo de pedido: ${form.tipoPedido}`,
      form.produtoInteresse ? `Produto de interesse: ${form.produtoInteresse}` : null,
      form.assunto ? `Assunto: ${form.assunto}` : null,
      `Mensagem: ${form.mensagem}`
    ].filter(Boolean).join('\n');

    const detalhes_html = `
      <h4 style="margin:12px 0 6px;">Dados de contacto</h4>
      <table style="border-collapse:collapse;width:100%">
        <tbody>
          <tr><td><b>Nome</b></td><td>${form.nome}</td></tr>
          <tr><td><b>Email</b></td><td>${form.email}</td></tr>
          ${form.telefone ? `<tr><td><b>Telefone</b></td><td>${form.telefone}</td></tr>` : ''}
        </tbody>
      </table>
      <h4 style="margin:12px 0 6px;">Pedido</h4>
      <table style="border-collapse:collapse;width:100%">
        <tbody>
          <tr><td><b>Tipo de pedido</b></td><td>${form.tipoPedido}</td></tr>
          ${form.produtoInteresse ? `<tr><td><b>Produto de interesse</b></td><td>${form.produtoInteresse}</td></tr>` : ''}
          ${form.assunto ? `<tr><td><b>Assunto</b></td><td>${form.assunto}</td></tr>` : ''}
          <tr><td style="vertical-align:top"><b>Mensagem</b></td><td>${form.mensagem.replace(/\n/g,'<br/>')}</td></tr>
        </tbody>
      </table>
    `;

    const templateParams = sanitizeTemplateParams({
      nome: form.nome,
      email: form.email,
      telefone: form.telefone || '',
      tipoSeguro,
      subjectEmail,
      resultado: resumo,
      detalhes_html,
    });

    if (isDev) {
      console.debug('[EmailJS][Contato] Params keys:', Object.keys(templateParams));
      console.debug('[EmailJS][Contato] detalhes_html length:', templateParams.detalhes_html?.length);
    }

    emailjs
      .send(EMAILJS_SERVICE_ID_GENERIC, EMAILJS_TEMPLATE_ID_GENERIC, templateParams, EMAILJS_USER_ID_GENERIC)
      .then(() => {
        setMensagem("Obrigado! Recebemos o seu pedido e entraremos em contacto brevemente.");
        setMensagemTipo('sucesso');
        setForm({ nome: '', email: '', telefone: '', tipoPedido: 'Pedido de informação', produtoInteresse: '', assunto: '', mensagem: '', aceitaRgpd: false });
      })
      .catch((err) => {
        console.error('[EmailJS][Contato] send error:', err);
        setMensagem('Ocorreu um erro ao enviar. Tente novamente.');
        setMensagemTipo('erro');
      })
      .finally(() => setEnviando(false));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Seo
        title="Contacto"
        description="Fale connosco para pedidos de informação, simulações ad hoc ou propostas personalizadas."
        canonicalPath="/contato"
      />
      <div className="bg-white/80 backdrop-blur rounded-xl shadow-md p-6 md:p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 text-center">Fale connosco</h2>
        <p className="text-blue-700 text-center mt-2">Envie-nos um pedido de informação ou uma simulação ad hoc. Respondemos com brevidade.</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome completo" className="w-full p-3 border border-blue-300 rounded-lg" required onInvalid={e=>setCustomValidity(e,'Indique o seu nome.')} onInput={e=>setCustomValidity(e,'')} />
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-3 border border-blue-300 rounded-lg" required pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" onInvalid={e=>setCustomValidity(e,'Insira um email válido.')} onInput={e=>setCustomValidity(e,'')} />
              <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="Telefone (opcional)" className="w-full p-3 border border-blue-300 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select name="tipoPedido" value={form.tipoPedido} onChange={handleChange} className="w-full p-3 border border-blue-300 rounded-lg" required>
                <option>Pedido de informação</option>
                <option>Pedido de simulação ad hoc</option>
                <option>Pedido de contacto</option>
                <option>Outro</option>
              </select>
              <select name="produtoInteresse" value={form.produtoInteresse} onChange={handleChange} className="w-full p-3 border border-blue-300 rounded-lg">
                <option value="">Produto de interesse (opcional)</option>
                <option>Auto</option>
                <option>Vida</option>
                <option>Saúde</option>
                <option>Habitação</option>
                <option>Frota</option>
                <option>Acidentes de Trabalho</option>
                <option>Multirriscos Empresarial</option>
                <option>RC Profissional</option>
                <option>Outro</option>
              </select>
            </div>
            <input name="assunto" value={form.assunto} onChange={handleChange} placeholder="Assunto (opcional)" className="w-full p-3 border border-blue-300 rounded-lg" />
            <textarea name="mensagem" value={form.mensagem} onChange={handleChange} placeholder="Descreva o seu pedido ou dúvida..." className="w-full p-3 border border-blue-300 rounded-lg min-h-[140px]" required onInvalid={e=>setCustomValidity(e,'Descreva o seu pedido.')} onInput={e=>setCustomValidity(e,'')} />
            <label className="flex items-start gap-2 text-sm text-blue-800">
              <input type="checkbox" name="aceitaRgpd" checked={form.aceitaRgpd} onChange={handleChange} required onInvalid={e=> (e.target as HTMLInputElement).setCustomValidity('Necessário aceitar a Política de Privacidade & RGPD.')} onInput={e=> (e.target as HTMLInputElement).setCustomValidity('')} />
              <span>Li e aceito a <a href={`${import.meta.env.BASE_URL}politica-rgpd`} className="underline" target="_blank" rel="noreferrer">Política de Privacidade & RGPD</a>.</span>
            </label>

            {mensagem && (
              <div className={"p-3 rounded " + (mensagemTipo==='sucesso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>{mensagem}</div>
            )}

            <div className="flex justify-end">
              <button type="submit" disabled={!canSubmit} className={`px-6 py-3 rounded font-bold text-white transition ${canSubmit ? 'bg-blue-700 hover:bg-blue-900' : 'bg-blue-300 cursor-not-allowed'}`}>
                {enviando ? 'A enviar…' : 'Enviar pedido'}
              </button>
            </div>
          </form>

          {/* Mapa */}
          <div>
            <h3 className="text-xl font-semibold text-blue-900 mb-3">Onde estamos</h3>
            <p className="text-blue-700 mb-3">Vila de Ansião, distrito de Leiria.</p>
            <div className="rounded-xl overflow-hidden shadow border border-blue-200">
              <iframe
                title="Mapa de Ansião, Leiria"
                src="https://www.google.com/maps?q=Ansião,Leiria,Portugal&hl=pt-PT&z=13&output=embed"
                width="100%"
                height="360"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a className="text-blue-700 underline mt-2 inline-block" href="https://maps.google.com/?q=Ansião,Leiria,Portugal" target="_blank" rel="noreferrer">Abrir no Google Maps</a>
          </div>
        </div>
      </div>
    </div>
  );
}
