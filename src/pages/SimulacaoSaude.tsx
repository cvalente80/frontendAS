import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { EMAILJS_SERVICE_ID_SAUDE, EMAILJS_TEMPLATE_ID_SAUDE, EMAILJS_USER_ID_SAUDE } from "../emailjs.config";
import DatePicker, { registerLocale } from "react-datepicker";
import { pt } from "date-fns/locale/pt";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("pt", pt);

type Segurado = { nome: string; nascimento: string; nascimentoManual: string; contribuinte: string };

export default function SimulacaoSaude() {
	const [step, setStep] = useState<1 | 2>(1);
	const [segurados, setSegurados] = useState<Segurado[]>([
		{ nome: "", nascimento: "", nascimentoManual: "", contribuinte: "" }
	]);
	const [openNascimento, setOpenNascimento] = useState<number | null>(null);
	const [errosSegurados, setErrosSegurados] = useState<{ nome?: string; nascimento?: string; contribuinte?: string }[]>([]);

	const [plano, setPlano] = useState<"opcao1" | "opcao2" | "opcao3" | "">("");
	const [addEstomatologia2, setAddEstomatologia2] = useState<boolean>(false);
	const [addEstomatologia3, setAddEstomatologia3] = useState<boolean>(false);
	const [nome, setNome] = useState("");
	const [email, setEmail] = useState("");
	const [telefone, setTelefone] = useState("");
	const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

	function handleChangeSegurado(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
		const { name, value } = e.target;
		setSegurados(prev => {
			const copy = [...prev];
			copy[idx] = { ...copy[idx], [name]: value } as Segurado;
			return copy;
		});
		setErrosSegurados(errs => {
			const copy = [...errs];
			if (!copy[idx]) copy[idx] = {};
			if (name === 'nome' || name === 'nascimento' || name === 'contribuinte') {
				copy[idx][name] = '' as any;
			}
			return copy;
		});
	}

	function addSegurado() {
		setSegurados(prev => (prev.length >= 5 ? prev : [...prev, { nome: "", nascimento: "", nascimentoManual: "", contribuinte: "" }]));
	}
	function removeSegurado(idx: number) {
		setSegurados(prev => prev.filter((_, i) => i !== idx));
	}

	function validarPasso1(): boolean {
		const novosErros = segurados.map(seg => ({
			nome: !seg.nome ? 'Por favor, preencha o nome completo.' : undefined,
			nascimento: !seg.nascimento ? 'Por favor, preencha a data de nascimento.' : undefined,
			contribuinte: !seg.contribuinte ? 'Por favor, preencha o NIF.' : undefined,
		}));
		setErrosSegurados(novosErros);
		return !novosErros.some(e => e.nome || e.nascimento || e.contribuinte);
	}

	function validarPasso2(): boolean {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!plano) {
			alert("Por favor, escolha uma das opções de plano.");
			return false;
		}
		if (!nome) {
			alert("Por favor, preencha o seu nome.");
			return false;
		}
		if (!email || !emailRegex.test(email)) {
			alert("Por favor, insira um email válido no formato nome@servidor.pt");
			return false;
		}
		if (!telefone || !/^[0-9]{9}$/.test(telefone)) {
			alert("Por favor, preencha o telefone (9 dígitos).");
			return false;
		}
		return true;
	}

	function handleNext(e: React.FormEvent) {
		e.preventDefault();
		if (step === 1) {
			if (validarPasso1()) setStep(2);
		}
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!validarPasso2()) return;
		// Mapeamento conforme o template fornecido: {{nome}}, {{time}}, {{opcao}}, {{pessoasSeguras}}
		const now = new Date();
		const time = now.toLocaleString('pt-PT', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
		const opcao = plano === 'opcao1' ? 'Opção 1' : plano === 'opcao2' ? 'Opção 2' : 'Opção 3';
		const pessoasSeguras = segurados
			.map((s, i) => `Pessoa ${i + 1}: Nome: ${s.nome}, Nascimento: ${s.nascimentoManual}, NIF: ${s.contribuinte}`)
			.join(' | ');
		const templateParams = { nome, time, opcao, pessoasSeguras };
		emailjs
			.send(EMAILJS_SERVICE_ID_SAUDE, EMAILJS_TEMPLATE_ID_SAUDE, templateParams, EMAILJS_USER_ID_SAUDE)
			.then(() => {
				setMensagemSucesso("Pedido efetuado com sucesso! Irá receber as próximas instruções por email.");
				setSegurados([{ nome: "", nascimento: "", nascimentoManual: "", contribuinte: "" }]);
				setPlano("");
				setAddEstomatologia2(false);
				setAddEstomatologia3(false);
				setNome("");
				setEmail("");
				setTelefone("");
				setStep(1);
				setTimeout(() => setMensagemSucesso(null), 7000);
			})
			.catch(() => {
				setMensagemSucesso("Erro ao enviar pedido. Tente novamente ou contacte-nos.");
				setTimeout(() => setMensagemSucesso(null), 7000);
			});
	}

	// Dados da grelha comparativa de planos (texto genérico, sem preços)
	const beneficios: { chave: string; label: string; op1: string | boolean; op2: string | boolean; op3: string | boolean }[] = [
		{ chave: "consultas", label: "Consultas (rede)", op1: true, op2: true, op3: true },
		{ chave: "exames", label: "Exames e meios complementares", op1: true, op2: true, op3: true },
		{ chave: "ambulatoria", label: "Assistência ambulatória", op1: "Opcional", op2: "2.500 €", op3: "5.000 €" },
		{ chave: "internamento", label: "Internamento hospitalar", op1: "15.000 €", op2: "50.000 €", op3: "1.000.000 €" },
		{ chave: "urgencias", label: "Serviço de urgência", op1: true, op2: true, op3: true },
		{ chave: "parto", label: "Parto e assistência na maternidade", op1: false, op2: "Opcional", op3: true },
		{ chave: "estomatologia", label: "Estomatologia (dentista)", op1: "Descontos", op2: "Parcial", op3: "Ampla" },
		{ chave: "medicamentos", label: "Medicamentos com prescrição", op1: false, op2: "Parcial", op3: "Parcial" },
		{ chave: "internacional", label: "Assistência em viagem (internacional)", op1: false, op2: true, op3: true },
		{ chave: "domicilio", label: "Consulta ao domicílio / Telemedicina", op1: "Telemedicina", op2: true, op3: true },
	];

	const valorCelula = (b: typeof beneficios[number], col: 1 | 2 | 3) => {
		const val = col === 1 ? b.op1 : col === 2 ? b.op2 : b.op3;
		if (typeof val === 'boolean') return val ? 'Incluído' : '—';
		return val;
	};

	return (
		<div className="min-h-screen flex items-start justify-center bg-blue-50 relative pt-8 md:pt-12">
			<img
				src="/imagens/insurance-background.jpg"
				alt="Seguro Saúde"
				className="absolute inset-0 w-full h-full object-cover opacity-25"
				onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/family-happy2.png'; }}
			/>
			<div className="relative z-10 max-w-5xl w-full bg-white bg-opacity-90 rounded-xl shadow-xl p-6 md:p-8">
				<h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
					Simulação Seguro Saúde
				</h1>
				<form className="space-y-4" onSubmit={handleSubmit}>
					{step === 1 && (
						<div>
							<h2 className="text-xl font-bold text-blue-800 mb-4">1. Pessoas Seguras</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{segurados.map((seg, idx) => (
									<div key={idx} className="p-4 rounded-xl bg-blue-50 flex flex-col gap-4">
										<div className="relative">
											<span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700">
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
												onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Por favor, preencha o nome completo.')}
												onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
											/>
										</div>
										{errosSegurados[idx]?.nome && <div className="text-red-600 text-sm -mt-2">{errosSegurados[idx].nome}</div>}
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
															onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Por favor, preencha a data de nascimento.')}
															onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
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
										{errosSegurados[idx]?.nascimento && <div className="text-red-600 text-sm -mt-2">{errosSegurados[idx].nascimento}</div>}
										<div className="relative">
											<span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700">
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
										{errosSegurados[idx]?.contribuinte && <div className="text-red-600 text-sm -mt-2">{errosSegurados[idx].contribuinte}</div>}
										{segurados.length > 1 && (
											<button type="button" onClick={() => removeSegurado(idx)} className="text-red-500 text-sm self-end">Remover</button>
										)}
									</div>
								))}
							</div>
							<div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
								{segurados.length < 5 ? (
									<button type="button" onClick={addSegurado} className="px-4 py-2 bg-blue-200 text-blue-900 font-bold rounded hover:bg-blue-300 transition">Adicionar pessoa segura</button>
								) : (
									<p className="text-xs text-blue-700 font-medium">Máximo de 5 pessoas atingido</p>
								)}
								<div className="flex-1" />
								<button type="button" onClick={handleNext} className="px-6 py-2 bg-blue-700 text-white rounded font-bold hover:bg-blue-900 transition self-end">Próximo</button>
							</div>
						</div>
					)}

					{step === 2 && (
						<div>
							<h2 className="text-xl font-bold text-blue-800 mb-4">2. Escolha a opção</h2>
							<div className="overflow-auto rounded-xl border bg-white shadow">
								<table className="min-w-full text-sm">
									<thead>
										<tr className="bg-blue-50 text-blue-900">
											<th className="text-left p-3 font-semibold">Coberturas</th>
											<th className="p-3 font-bold">
												<label className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${plano === 'opcao1' ? 'bg-green-100 text-green-800' : 'bg-white text-blue-900 border'}`}>
													<input type="radio" name="plano" value="opcao1" checked={plano === 'opcao1'} onChange={e => setPlano(e.target.value as any)} />
													Opção 1
												</label>
											</th>
											<th className="p-3 font-bold">
												<label className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${plano === 'opcao2' ? 'bg-green-100 text-green-800' : 'bg-white text-blue-900 border'}`}>
													<input type="radio" name="plano" value="opcao2" checked={plano === 'opcao2'} onChange={e => setPlano(e.target.value as any)} />
													Opção 2
												</label>
											</th>
											<th className="p-3 font-bold">
												<label className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${plano === 'opcao3' ? 'bg-green-100 text-green-800' : 'bg-white text-blue-900 border'}`}>
													<input type="radio" name="plano" value="opcao3" checked={plano === 'opcao3'} onChange={e => setPlano(e.target.value as any)} />
													Opção 3
												</label>
											</th>
										</tr>
									</thead>
									<tbody>
										{beneficios.map((b, i) => (
											<tr key={b.chave} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50/40'}>
												<td className="p-3 text-blue-900">{b.label}</td>
												{/* Coluna Opção 1 */}
												<td className="p-3 text-center font-medium">
													{b.chave === 'estomatologia' ? (
														<span>Descontos</span>
													) : (
														<span>{valorCelula(b, 1)}</span>
													)}
												</td>
												{/* Coluna Opção 2 */}
												<td className="p-3 text-center font-medium">
													{b.chave === 'estomatologia' ? (
														<label className="inline-flex items-center gap-2">
															<input
																type="checkbox"
																checked={addEstomatologia2}
																onChange={(e) => setAddEstomatologia2(e.target.checked)}
															/>
															<span>Aderir</span>
														</label>
													) : (
														<span>{valorCelula(b, 2)}</span>
													)}
												</td>
												{/* Coluna Opção 3 */}
												<td className="p-3 text-center font-medium">
													{b.chave === 'estomatologia' ? (
														<label className="inline-flex items-center gap-2">
															<input
																type="checkbox"
																checked={addEstomatologia3}
																onChange={(e) => setAddEstomatologia3(e.target.checked)}
															/>
															<span>Aderir</span>
														</label>
													) : (
														<span>{valorCelula(b, 3)}</span>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							<div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="md:col-span-1">
									<label className="block text-sm font-semibold text-blue-900 mb-1">Nome</label>
									<input
										type="text"
										value={nome}
										onChange={e => setNome(e.target.value)}
										className="w-full rounded border h-11 px-3"
										placeholder="O seu nome"
										required
										onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Por favor, preencha o nome.')}
										onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
									/>
								</div>
								<div className="md:col-span-1">
									<label className="block text-sm font-semibold text-blue-900 mb-1">Email</label>
									<input
										type="email"
										value={email}
										onChange={e => setEmail(e.target.value)}
										className="w-full rounded border h-11 px-3"
										placeholder="nome@servidor.pt"
										required
										pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
										onInvalid={e => {
											const input = e.target as HTMLInputElement;
											if (input.validity.valueMissing) input.setCustomValidity('Por favor, preencha o email.');
											else input.setCustomValidity('Por favor, insira um email válido no formato nome@servidor.pt');
										}}
										onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
									/>
								</div>
								<div className="md:col-span-1">
									<label className="block text-sm font-semibold text-blue-900 mb-1">Telefone</label>
									<input
										type="tel"
										value={telefone}
										onChange={e => {
											const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 9);
											setTelefone(onlyDigits);
										}}
										className="w-full rounded border h-11 px-3"
										placeholder="9 dígitos"
										required
										inputMode="numeric"
										pattern="[0-9]{9}"
										maxLength={9}
										onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Por favor, preencha o telefone (9 dígitos).')}
										onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
									/>
								</div>
							</div>

							<div className="flex justify-between mt-6">
								<button type="button" onClick={() => setStep(1)} className="px-6 py-2 bg-gray-200 rounded">Anterior</button>
								<button type="submit" className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 transition">Pedir Proposta</button>
							</div>
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
