import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { EMAILJS_SERVICE_ID, EMAILJS_USER_ID } from "../emailjs.config";
import DatePicker, { registerLocale } from "react-datepicker";
import { pt } from "date-fns/locale/pt";
import "react-datepicker/dist/react-datepicker.css";
import './SimulacaoVida.css';
registerLocale("pt", pt);

const EXPLICACAO_INVALIDEZ = {
	IAD: "Invalidez Absoluta e Definitiva (IAD): A indemnização é realizada quando o segurado fica totalmente dependente de terceiros para as atividades básicas do dia a dia.",
	ITP: "Invalidez Total e Permanente (ITP): A indemnização é realizada quando segurado fica impossibilitado de exercer qualquer atividade profissional, mas pode realizar tarefas básicas sozinho."
};
// Novo mapeamento para valor enviado no email (sem o texto longo explicativo)
const LABEL_INVALIDEZ_EMAIL = {
	IAD: 'Invalidez Absoluta e Definitiva (IAD)',
	ITP: 'Invalidez Total e Permanente (ITP)'
} as const;

export default function SimulacaoVida() {
	const [form, setForm] = useState({
		tipoSeguro: "Vida Individual",
		capital: "",
		prazo: "",
		fumador: "Não",
		segurados: [
			{ nome: "", nascimento: "", nascimentoManual: "", contribuinte: "" }
		],
		tipoInvalidez: "IAD",
		nome: "",
		email: "",
		telefone: ""
	});
	const [step, setStep] = useState(1);
	const [openNascimento, setOpenNascimento] = useState<number | null>(null);
	const [errosSegurados, setErrosSegurados] = useState<{ nome?: string; nascimento?: string; contribuinte?: string }[]>([]);
	const [errosPasso2, setErrosPasso2] = useState<{ capital?: string; prazo?: string }>({});
	const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

	// Formata capital em milhares (apenas visual)
	function formatMilhares(valor: string) {
		if (!valor) return '';
		const num = Number(valor.replace(/\D/g, ''));
		if (isNaN(num)) return valor;
		return num.toLocaleString('pt-PT');
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
		const { name, value } = e.target;
		setForm(f => ({ ...f, [name]: value }));
	}

	function handleChangeSegurado(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
		const { name, value } = e.target;
		setForm(f => {
			const segurados = [...f.segurados];
			segurados[idx] = { ...segurados[idx], [name]: value };
			return { ...f, segurados };
		});
		// Limpa erro do campo editado
		setErrosSegurados(errs => {
			const copy = [...errs];
			if (!copy[idx]) copy[idx] = {};
			if (name === 'nome' || name === 'nascimento' || name === 'contribuinte') {
				copy[idx][name] = '';
			}
			return copy;
		});
	}

	function addSegurado() {
		setForm(f => {
			if (f.segurados.length >= 2) return f; // máximo 2
			return { ...f, segurados: [...f.segurados, { nome: '', nascimento: '', nascimentoManual: '', contribuinte: '' }] };
		});
	}
	function removeSegurado(idx: number) {
		setForm(f => ({ ...f, segurados: f.segurados.filter((_, i) => i !== idx) }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		// Validação final extra (proteção caso avance por DevTools)
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!form.email || !emailRegex.test(form.email)) {
			alert('Por favor, insira um email válido no formato nome@servidor.pt');
			return;
		}
		const templateParams = {
			tipoSeguro: form.tipoSeguro,
			capital: form.capital,
			prazo: form.prazo,
			fumador: form.fumador,
			tipoInvalidez: LABEL_INVALIDEZ_EMAIL[form.tipoInvalidez as 'IAD' | 'ITP'],
			explicacaoInvalidez: EXPLICACAO_INVALIDEZ[form.tipoInvalidez as keyof typeof EXPLICACAO_INVALIDEZ],
			nome: form.nome,
			email: form.email,
			telefone: form.telefone,
			pessoasSeguras: form.segurados.map((s, i) => `Pessoa ${i+1}: Nome: ${s.nome}, Nascimento: ${s.nascimentoManual}, NIF: ${s.contribuinte}`).join(" | ")
		};
		emailjs.send(
			EMAILJS_SERVICE_ID,
			"template_95ayhir",
			templateParams,
			EMAILJS_USER_ID
		).then(() => {
			setMensagemSucesso('Pedido efetuado com sucesso! Irá receber as próximas instruções por email.');
			// Reset mantendo o tipoSeguro atual
			setForm(f => ({
				...f,
				capital: '',
				prazo: '',
				segurados: [{ nome: '', nascimento: '', nascimentoManual: '', contribuinte: '' }],
				tipoInvalidez: 'IAD',
				nome: '',
				email: '',
				telefone: ''
			}));
			setStep(1);
			setTimeout(() => setMensagemSucesso(null), 7000);
		}).catch(() => {
			setMensagemSucesso('Erro ao enviar pedido. Tente novamente ou contacte-nos.');
			setTimeout(() => setMensagemSucesso(null), 7000);
		});
	}

	function handleNext(e: React.FormEvent) {
		e.preventDefault();
		// Valida agora para ambos os tipos de seguro
		if (step === 1) {
			const novosErros = form.segurados.map(seg => ({
				nome: !seg.nome ? 'Por favor, preencha o nome completo.' : undefined,
				nascimento: !seg.nascimento ? 'Por favor, preencha a data de nascimento.' : undefined,
				contribuinte: !seg.contribuinte ? 'Por favor, preencha o NIF.' : undefined,
			}));
			setErrosSegurados(novosErros);
			if (novosErros.some(err => err.nome || err.nascimento || err.contribuinte)) return;
		}
		if (step === 2) {
			const erros: { capital?: string; prazo?: string } = {};
			if (!form.capital) erros.capital = 'Por favor, preencha o capital seguro.';
			if (!form.prazo) erros.prazo = 'Por favor, preencha o prazo do seguro.';
			setErrosPasso2(erros);
			if (erros.capital || erros.prazo) return;
		}
		if (step === 3) {
			const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
			if (!form.email || !emailRegex.test(form.email)) {
				alert('Por favor, insira um email válido no formato nome@servidor.pt');
				return;
			}
		}
		if (step < 3) setStep(s => s + 1);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-blue-50 relative">
			{/* Background local (adicione o ficheiro em public/imagens/seguro-vida-bg.jpg). Fallback para imagem existente. */}
			<img
				src={`${import.meta.env.BASE_URL}imagens/seguro-vida-bg.jpg`}
				alt="Plano de proteção familiar - Seguro de Vida"
				className="absolute inset-0 w-full h-full object-cover opacity-30"
				onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/family-happy2.png'; }}
			/>
			<div className="relative z-10 max-w-lg w-full bg-white bg-opacity-90 rounded-xl shadow-xl p-8">
				<h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
					Simulação Seguro Vida
				</h1>
				<form className="space-y-4" onSubmit={handleSubmit}>
					<select name="tipoSeguro" value={form.tipoSeguro} onChange={handleChange} className="w-full p-3 rounded border" required>
						<option value="Vida Individual">Vida Individual</option>
						<option value="Vida Crédito Habitação">Vida Crédito Habitação</option>
					</select>
					{/* Removido o formulário simples; wizard usado para ambos os tipos */}
					{(
						<div>
							{/* Wizard de 3 passos */}
							{step === 1 && (
								<div>
									<h2 className="text-xl font-bold text-blue-800 mb-4">1. Pessoas Seguras</h2>
									{form.segurados.map((seg, idx) => (
										<div key={idx} className="mb-4 p-3 bg-blue-50 flex flex-col gap-4 rounded">
											<div className="relative">
												<span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700">
													{/* Ícone de pessoa */}
													<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>
												</span>
												<input
													type="text"
													name="nome"
													value={seg.nome}
													onChange={e => { handleChangeSegurado(e as any, idx); setErrosSegurados(errs => { const copy = [...errs]; if (copy[idx]) copy[idx].nome = ''; return copy; }); }}
													placeholder="Nome completo"
													className={`w-full rounded border h-11 pl-10 ${errosSegurados[idx]?.nome ? 'border-red-500' : ''}`}
													required
												/>
											</div>
											{errosSegurados[idx]?.nome && <div className="text-red-600 text-sm mt-1 text-left">{errosSegurados[idx].nome}</div>}
											<div className="relative">
												<DatePicker
													selected={seg.nascimento ? new Date(seg.nascimento) : null}
													onChange={date => {
														if (date) {
															const iso = date.toISOString().slice(0, 10);
															const [year, month, day] = iso.split('-');
															const manual = `${day}-${month}-${year}`;
															handleChangeSegurado({ target: { name: 'nascimento', value: iso } } as any, idx);
															handleChangeSegurado({ target: { name: 'nascimentoManual', value: manual } } as any, idx);
															setErrosSegurados(errs => { const copy = [...errs]; if (copy[idx]) copy[idx].nascimento = ''; return copy; });
														} else {
															handleChangeSegurado({ target: { name: 'nascimento', value: '' } } as any, idx);
															handleChangeSegurado({ target: { name: 'nascimentoManual', value: '' } } as any, idx);
														}
													}}
													locale="pt"
													dateFormat="dd-MM-yyyy"
													placeholderText="Data de nascimento (dd-mm-aaaa)"
													className="w-full rounded pr-10"
													required
													showMonthDropdown
													showYearDropdown
													yearDropdownItemNumber={100}
													scrollableYearDropdown
													value={seg.nascimentoManual || ''}
													customInput={
														<div className="relative w-full">
															<button type="button" onClick={() => setOpenNascimento(idx)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-0.5 shadow" tabIndex={-1}>
																<svg width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="14" rx="2" stroke="#2563eb" strokeWidth="2"/><path d="M16 3v4M8 3v4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="14" r="3" stroke="#2563eb" strokeWidth="2"/></svg>
															</button>
															<input
																type="text"
																className="w-full p-2 rounded border pl-10 pr-10"
																value={seg.nascimentoManual || ''}
																required
																readOnly
																placeholder="Data de nascimento (dd-mm-aaaa)"
															/>
															<button type="button" onClick={() => setOpenNascimento(idx)} className="absolute right-2 top-1/2 -translate-y-1/2" tabIndex={-1}>
																<svg width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="14" rx="2" stroke="#2563eb" strokeWidth="2"/><path d="M16 3v4M8 3v4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="14" r="3" stroke="#2563eb" strokeWidth="2"/></svg>
															</button>
														</div>
													}
													open={openNascimento === idx}
													onClickOutside={() => setOpenNascimento(null)}
												/>
											</div>
											{errosSegurados[idx]?.nascimento && <div className="text-red-600 text-sm mt-1 text-left">{errosSegurados[idx].nascimento}</div>}
											<div className="relative">
												<span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700">
													{/* Ícone de cartão */}
													<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 10h20"/></svg>
												</span>
												<input
													type="text"
													name="contribuinte"
													value={seg.contribuinte}
													onChange={e => { handleChangeSegurado(e as any, idx); setErrosSegurados(errs => { const copy = [...errs]; if (copy[idx]) copy[idx].contribuinte = ''; return copy; }); }}
													placeholder="NIF"
													className={`w-full rounded border h-11 pl-10 ${errosSegurados[idx]?.contribuinte ? 'border-red-500' : ''}`}
													required
													pattern="^[0-9]{9}$"
													maxLength={9}
													onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Por favor, preencha o NIF com 9 dígitos.')}
													onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
												/>
											</div>
											{errosSegurados[idx]?.contribuinte && <div className="text-red-600 text-sm mt-1 text-left">{errosSegurados[idx].contribuinte}</div>}
											{form.segurados.length > 1 && (
												<button type="button" onClick={() => removeSegurado(idx)} className="text-red-500 text-sm">Remover</button>
											)}
										</div>
									))}
									{form.segurados.length < 2 && (
										<button type="button" onClick={addSegurado} className="w-full py-2 bg-blue-200 text-blue-900 font-bold rounded hover:bg-blue-300 transition mb-2">Adicionar pessoa segura</button>
									)}
									{form.segurados.length >= 2 && (
										<p className="text-xs text-blue-700 font-medium -mt-2 mb-2 text-right">Máximo de 2 pessoas atingido</p>
									)}
									<div className="flex justify-end">
										<button type="button" onClick={handleNext} className="px-6 py-2 bg-blue-700 text-white rounded font-bold hover:bg-blue-900 transition">Próximo</button>
									</div>
								</div>
							)}
							{step === 2 && (
								<div>
									<h2 className="text-xl font-bold text-blue-800 mb-4">2. Capitais a Segurar</h2>
									<div className="flex flex-col gap-5 mb-4">
										<div className="relative">
											<span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700">
												{/* Ícone de pessoa */}
												<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>
											</span>
											<input
												type="text"
												name="capital"
												value={formatMilhares(form.capital)}
												onChange={e => {
													// Aceita apenas números
													const raw = e.target.value.replace(/\D/g, '');
													setForm(f => ({ ...f, capital: raw }));
												}}
												placeholder="Capital seguro"
												className="w-full p-3 rounded border h-11 pr-10 pl-10"
												min="10000"
												max="1000000"
												required
												inputMode="numeric"
												pattern="[0-9]*"
											/>
											<span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-700 font-bold">€</span>
										</div>
										<div className="relative">
											<span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700">
												{/* Ícone de calendário */}
												<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M16 3v4M8 3v4" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="14" r="3"/></svg>
											</span>
											<input
												type="number"
												name="prazo"
												value={form.prazo}
												onChange={handleChange}
												placeholder="Prazo do seguro (anos)"
												className="w-full p-3 rounded border h-11 mb-2 pl-10"
												min="1"
												max="40"
												required
											/>
										</div>
									</div>
									{(errosPasso2.capital || errosPasso2.prazo) && (
										<div className="text-red-600 text-sm mt-2 text-left">
											{errosPasso2.capital && <div>{errosPasso2.capital}</div>}
											{errosPasso2.prazo && <div>{errosPasso2.prazo}</div>}
										</div>
									)}
									<div className="flex justify-between mt-4">
										<button type="button" onClick={() => setStep(1)} className="px-6 py-2 bg-gray-200 rounded">Anterior</button>
										<button type="button" onClick={handleNext} className="px-6 py-2 bg-blue-700 text-white rounded font-bold hover:bg-blue-900 transition">Próximo</button>
									</div>
								</div>
							)}
							{step === 3 && (
								<div>
									<h2 className="text-xl font-bold text-blue-800 mb-4">3. Tipo de Invalidez</h2>
									<select name="tipoInvalidez" value={form.tipoInvalidez} onChange={handleChange} className="w-full p-3 rounded border mb-4" required>
										<option value="IAD">IAD</option>
										<option value="ITP">ITP</option>
									</select>
									<div className="bg-blue-50 p-3 rounded mb-4 text-blue-900 text-sm">
										<strong>Explicação:</strong> {EXPLICACAO_INVALIDEZ[form.tipoInvalidez as keyof typeof EXPLICACAO_INVALIDEZ]}
									</div>
									<div className="flex flex-col gap-5 mb-4">
										<div className="relative">
											<span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700">
												<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/><path d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"/></svg>
											</span>
											<input
												type="text"
												name="nome"
												value={form.nome}
												onChange={handleChange}
												placeholder="Nome"
												className="w-full rounded border h-11 pl-10"
												required
												onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Por favor, preencha o nome completo.')}
												onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
											/>
										</div>
										<div className="relative">
											<span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700">
												<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4z"/><path d="M4 4l8 8 8-8"/></svg>
											</span>
											<input
												type="email"
												name="email"
												value={form.email}
												onChange={handleChange}
												placeholder="Email"
												className="w-full rounded border h-11 pl-10"
												required
												pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
												onInvalid={e => {
													const input = e.target as HTMLInputElement;
													if (input.validity.valueMissing) {
														input.setCustomValidity('Por favor, preencha o email.');
													} else if (input.validity.typeMismatch || input.validity.patternMismatch || !/^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/.test(input.value)) {
														input.setCustomValidity('Por favor, insira um email válido no formato nome@servidor.pt');
													} else {
														input.setCustomValidity('');
													}
												}}
												onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
											/>
										</div>
										<div className="relative">
											<span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700">
												<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.12.45 2.33.68 3.48.68a1 1 0 011 1v3.5a1 1 0 01-1 1C7.61 21 3 16.39 3 11.5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.15.23 2.36.68 3.48a1 1 0 01-.21 1.11l-2.2 2.2z"/></svg>
											</span>
											<input
												type="tel"
												name="telefone"
												value={form.telefone}
												onChange={handleChange}
												placeholder="Telefone"
												className="w-full rounded border h-11 pl-10"
												pattern="[0-9]{9}"
												required
												onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Por favor, preencha o telefone (9 dígitos).')}
												onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
											/>
										</div>
									</div>
									<div className="flex justify-between mt-4">
										<button type="button" onClick={() => setStep(2)} className="px-6 py-2 bg-gray-200 rounded">Anterior</button>
										<button type="submit" className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 transition">Simular</button>
									</div>
								</div>
							)}
						</div>
					)}
				</form>
				{mensagemSucesso && (
					<div className="fixed bottom-8 right-8 z-50 p-4 rounded-lg font-semibold shadow bg-green-100 text-green-900" style={{ minWidth: '260px', maxWidth: '350px', textAlign: 'left' }}>
						{mensagemSucesso}
					</div>
				)}
			</div>
		</div>
	);
}
