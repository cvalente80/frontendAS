import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const produtos: Array<{
	nome: string;
	descricao: string;
	imagem: string;
}> = [
	{
		nome: "Seguro Auto",
		descricao: "Proteção completa para seu veículo.",
		imagem: "/imagens/nosso-produtos-car.jpg", // imagem profissional correta
	},
	{
		nome: "Seguro Vida",
		descricao: "Segurança para você e sua família.",
		imagem: "/family-happy2.png",
	},
	{
		nome: "Seguro Saúde",
		descricao: "Cuide do seu bem-estar.",
		imagem: "/health-insurance.svg",
	},
	{
		nome: "Seguro Residencial",
		descricao: "Proteja seu lar contra imprevistos.",
		imagem: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80",
	},
];

const slides: Array<{
	imagem: string;
	titulo: string;
	texto: string;
}> = [
	{
		imagem: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
		titulo: "Simule o seu seguro auto em segundos",
		texto: "Proteção completa para o seu veículo com atendimento personalizado.",
	},
	{
		imagem: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=1200&q=80", // Família feliz em parque com árvores
		titulo: "Seguro Vida e Saúde",
		texto: "Segurança para você e sua família, com planos flexíveis.",
	},
	{
		imagem: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
		titulo: "Seguro Residencial",
		texto: "Proteja seu lar contra imprevistos e garanta tranquilidade.",
	},
];

export default function Home() {
	return (
		<div className="min-h-screen bg-white flex flex-col">
			{/* Navbar moderna */}
			{/* Banner principal */}
			<section className="relative h-[400px] flex items-center justify-center bg-blue-900">
				<Swiper
					className="w-full h-full"
					autoplay={{ delay: 10000 }}
					loop={true}
					navigation={true}
					modules={[Navigation]}
				>
					{slides.map((slide, idx) => (
						<SwiperSlide key={idx}>
							<div className="relative h-[400px] flex items-center justify-center">
								<img
									src={slide.imagem}
									alt={slide.titulo}
									className="absolute inset-0 w-full h-full object-cover opacity-40"
								/>
								<div className="relative z-10 text-center">
									<h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow">
										{slide.titulo}
									</h1>
									<p className="text-xl mb-6 text-white max-w-2xl mx-auto">
										{slide.texto}
									</p>
									{idx === 0 && (
										<a
											href="/simulacao-auto"
											className="px-8 py-4 bg-yellow-400 text-blue-900 font-bold rounded-full shadow-lg hover:bg-yellow-300 transition"
										>
											Simule seu seguro auto
										</a>
									)}
									{idx === 1 && (
										<a
											href="/simulacao-vida-saude"
											className="px-8 py-4 bg-green-400 text-blue-900 font-bold rounded-full shadow-lg hover:bg-green-300 transition"
										>
											Simule seguro vida e saúde
										</a>
									)}
									{idx === 2 && (
										<a
											href="/simulacao-habitacao"
											className="px-8 py-4 bg-blue-400 text-white font-bold rounded-full shadow-lg hover:bg-blue-300 transition"
										>
											Simule seguro multirriscos habitação
										</a>
									)}
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</section>
			{/* Produtos em destaque */}
			<section className="py-16 px-6 bg-gray-50">
				<h2 className="text-3xl font-bold text-blue-900 mb-10 text-center">
					Nossos Produtos
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
					{produtos.map((p) => (
						<div
							key={p.nome}
							className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition"
						>
							<img
								src={p.imagem}
								alt={p.nome}
								className="w-24 h-24 object-cover rounded-full mb-4 border-4 border-blue-200"
							/>
							<h3 className="text-xl font-semibold text-blue-700 mb-2">
								{p.nome}
							</h3>
							<p className="text-gray-700 text-center mb-2">
								{p.descricao}
							</p>
							<a
								href="/produtos"
								className="text-blue-600 underline hover:text-blue-900"
							>
								Saiba mais
							</a>
						</div>
					))}
				</div>
			</section>
			{/* Benefícios */}
			<section className="py-16 px-6 bg-white">
				<div className="max-w-4xl mx-auto bg-blue-50 rounded-xl shadow-xl p-8">
					<h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">
						Por que escolher a Ansião Seguros?
					</h2>
					<ul className="space-y-3 text-blue-800 text-lg list-disc pl-6">
						<li>Atendimento personalizado e consultoria especializada</li>
						<li>Simulação rápida e transparente de seguros auto</li>
						<li>Soluções para empresas e famílias</li>
						<li>Diversos produtos: auto, vida, saúde, residencial e mais</li>
					</ul>
				</div>
			</section>
			{/* Rodapé */}
			<footer className="bg-blue-950 text-blue-100 py-6 px-6 text-center text-sm mt-auto">
				&copy; {new Date().getFullYear()} Ansião Seguros. Todos os direitos
				reservados. |{" "}
				<a
					href="/contato"
					className="underline text-blue-300 hover:text-yellow-400"
				>
					Fale conosco
				</a>
			</footer>
		</div>
	);
}
