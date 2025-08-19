import React from "react";

export default function SimulacaoHabitacao() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-blue-50 relative">
			<img
				src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80"
				alt="Casa moderna"
				className="absolute inset-0 w-full h-full object-cover opacity-30"
			/>
			<div className="relative z-10 max-w-lg w-full bg-white bg-opacity-90 rounded-xl shadow-xl p-8">
				<h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
					Simulação Seguro Multirriscos Habitação
				</h1>
				<form className="space-y-4">
					<input type="text" placeholder="Nome completo" className="w-full p-3 rounded border" />
					<input type="email" placeholder="Email" className="w-full p-3 rounded border" />
					<input type="text" placeholder="Endereço do imóvel" className="w-full p-3 rounded border" />
					<input type="number" placeholder="Área (m²)" className="w-full p-3 rounded border" />
					<select className="w-full p-3 rounded border">
						<option>Casa</option>
						<option>Apartamento</option>
					</select>
					<button type="submit" className="w-full py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition">
						Simular
					</button>
				</form>
			</div>
		</div>
	);
}
