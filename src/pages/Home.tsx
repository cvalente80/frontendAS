import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
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
		imagem: `${import.meta.env.BASE_URL}imagens/nosso-produtos-car.jpg`, // imagem profissional correta

	},
	{
		nome: "Seguro Vida",
		descricao: "Segurança para você e sua família.",
		imagem: "https://images.pexels.com/photos/1683975/pexels-photo-1683975.jpeg?auto=compress&w=400&q=60", // Família feliz com pessoas (Pexels)
	},
	{
		nome: "Seguro Saúde",
		descricao: "Cuide do seu bem-estar.",
		imagem: `${import.meta.env.BASE_URL}health-insurance.svg`,

	},
	{
		nome: "Seguro Multirriscos Habitação", // Corrigido para 'Multirriscos' com rr
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

		imagem: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=1200&q=80", // Família feliz: pai, mãe e filho
		titulo: "Seguro Vida e Saúde",
		texto: "Segurança para você e sua família, com planos flexíveis.",
	},
	{
		imagem: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
		titulo: "Seguro  Multirriscos Habitação",
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
					autoplay={{ delay: 10000, disableOnInteraction: false }}
					loop={true}
					navigation={true}
					modules={[Navigation, Autoplay]}
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
										<Link
											to="/simulacao-auto"
											className="px-8 py-4 bg-yellow-400 text-blue-900 font-bold rounded-full shadow-lg hover:bg-yellow-300 transition"
										>
											Simule seu seguro auto
										</Link>
									)}
									{idx === 1 && (
										<Link
											to="/simulacao-vida"
											className="px-8 py-4 bg-green-400 text-blue-900 font-bold rounded-full shadow-lg hover:bg-green-300 transition"
										>
											Simule seguro vida
										</Link>
									)}
									{idx === 2 && (
										<Link
											to="/simulacao-habitacao"
											className="px-8 py-4 bg-blue-400 text-white font-bold rounded-full shadow-lg hover:bg-blue-300 transition"
										>
											Simule seguro multirriscos habitação
										</Link>
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
					Produtos para pessoas particulares
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
					{produtos.map((p) => (
						<div key={p.nome} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition cursor-pointer">
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
							<Link
								to={p.nome === "Seguro Auto" ? "/produto-auto" : p.nome === "Seguro Vida" ? "/produto-vida" : p.nome === "Seguro Saúde" ? "/produto-saude" : p.nome === "Seguro Multirriscos Habitação" ? "/produto-habitacao" : "/produtos"}
								className="text-blue-600 underline hover:text-blue-900"
							>
								Saiba mais
							</Link>
						</div>
					))}
				</div>
			</section>
			{/* Produtos para empresas */}
			<section className="py-16 px-6 bg-gray-50">
				<h2 className="text-3xl font-bold text-blue-900 mb-10 text-center">
					Produtos para empresas
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
					{[
						{
							nome: "Seguro Frota",
							descricao: "Proteção para todos os veículos da empresa.",
							imagem: "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&w=400&q=60",
						},
						{
							nome: "Seguro Acidentes de Trabalho",
							descricao: "Cobertura para colaboradores em caso de acidente.",
							imagem: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&w=400&q=60",
						},
						{
							nome: "Seguro Responsabilidade Civil Profissional",
							descricao: "Proteja sua empresa contra danos a terceiros.",
							imagem: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&w=400&q=60",
						},
						{
							nome: "Seguro Multirriscos Empresarial",
							descricao: "Cobertura para as suas instalações e bens empresariais.",
							imagem: "https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&w=400&q=60", // Instalações empresariais (Pexels)
						},
						{
							nome: "Seguro Condomínio",
							descricao: "Proteção completa para edifícios e áreas comuns.",
							imagem: "https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&w=400&q=60",
						},
					].map((p) => (
						<div key={p.nome} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition cursor-pointer">
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
							<Link
								to={p.nome === "Seguro Frota" ? "/produto-frota" : p.nome === "Seguro Acidentes de Trabalho" ? "/produto-acidentes-trabalho" : p.nome === "Seguro Responsabilidade Civil Profissional" ? "/produto-responsabilidade-civil-profissional" : p.nome === "Seguro Multirriscos Empresarial" ? "/produto-multirriscos-empresarial" : p.nome === "Seguro Condomínio" ? "/produto-condominio" : "/produtos"}
								className="text-blue-600 underline hover:text-blue-900"
							>
								Saiba mais
							</Link>
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
					<ul className="space-y-3 text-blue-800 text-lg pl-0">
						<li className="flex items-center gap-3"><span className="text-2xl">🤝</span>Atendimento personalizado e consultoria especializada</li>
						<li className="flex items-center gap-3"><span className="text-2xl">⚡</span>Simulação rápida e automática realizada pelos nossos sistemas inteligentes.</li>
						<li className="flex items-center gap-3"><span className="text-2xl">🏢</span>Soluções para empresas e famílias</li>
						<li className="flex items-center gap-3"><span className="text-2xl">📦</span>Diversos produtos: auto, vida, saúde, residencial e mais</li>
					</ul>
				</div>
			</section>
		</div>
	);
}
