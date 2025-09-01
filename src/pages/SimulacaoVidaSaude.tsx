import React from "react";

export default function SimulacaoVidaSaude() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-blue-50 relative">
			<img
				src="https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=1200&q=80"
				alt="Família feliz e hospital"
				className="absolute inset-0 w-full h-full object-cover opacity-30"
			/>
			<div className="relative z-10 max-w-lg w-full bg-white bg-opacity-90 rounded-xl shadow-xl p-8">
				<h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
					Simulação Seguro Vida e Saúde
				</h1>
				<form className="space-y-4">
					<input type="text" placeholder="Nome completo" className="w-full p-3 rounded border" />
					<input type="email" placeholder="Email" className="w-full p-3 rounded border" />
					<input type="number" placeholder="Idade" className="w-full p-3 rounded border" />
					<select className="w-full p-3 rounded border">
						<option>Plano Individual</option>
						<option>Plano Familiar</option>
					</select>
					<input type="text" placeholder="Hospital preferido" className="w-full p-3 rounded border" />
					<button type="submit" className="w-full py-3 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition">
						Simular
					</button>
				</form>
			</div>
		</div>
	);
}
