import React from "react";
import Seo from "../components/Seo";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductCardMobile from "../components/ProductCardMobile";
import HeroDesktop from "../components/HeroDesktop";
import HeroMobile from "../components/HeroMobile";
import { ResponsiveGate } from "../components/ResponsiveGate";

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


export default function Home() {
	return (
		<div className="min-h-screen bg-white flex flex-col">
			<Seo
				title="Seguros em Ansião (Leiria) — Auto, Vida, Saúde e Habitação"
				description="Ansião Seguros: simulações rápidas e propostas personalizadas para Auto, Vida, Saúde, Habitação e soluções para empresas."
				image={`${import.meta.env.BASE_URL}logo-empresarial.svg`}
				canonicalPath="/"
				structuredData={[
					{
						"@context": "https://schema.org",
						"@type": "Organization",
						name: "Ansião Seguros",
						url: typeof window !== 'undefined' ? window.location.origin + (import.meta.env.BASE_URL || '/') : undefined,
						logo: `${import.meta.env.BASE_URL}logo-empresarial.svg`,
						address: { "@type": "PostalAddress", addressLocality: "Ansião", addressRegion: "Leiria", addressCountry: "PT" },
					},
				]}
			/>
			{/* Hero responsivo */}
			<ResponsiveGate mobile={<HeroMobile />} desktop={<HeroDesktop />} />
			{/* Produtos em destaque */}
			<section className="py-16 px-6 bg-gray-50">
				<h2 className="text-3xl font-bold text-blue-900 mb-10 text-center">
					Produtos para pessoas particulares
				</h2>
				<ResponsiveGate
					mobile={
						<div className="grid grid-cols-1 gap-3 max-w-6xl mx-auto">
							{produtos.map((p) => {
								const to = p.nome === "Seguro Auto"
									? "/produto-auto"
									: p.nome === "Seguro Vida"
									? "/produto-vida"
									: p.nome === "Seguro Saúde"
									? "/produto-saude"
									: p.nome === "Seguro Multirriscos Habitação"
									? "/produto-habitacao"
									: "/produtos";
								return <ProductCardMobile key={p.nome} {...p} to={to} />;
							})}
						</div>
					}
					desktop={
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
							{produtos.map((p) => {
								const to = p.nome === "Seguro Auto"
									? "/produto-auto"
									: p.nome === "Seguro Vida"
									? "/produto-vida"
									: p.nome === "Seguro Saúde"
									? "/produto-saude"
									: p.nome === "Seguro Multirriscos Habitação"
									? "/produto-habitacao"
									: "/produtos";
								return <ProductCard key={p.nome} {...p} to={to} />;
							})}
						</div>
					}
				/>
			</section>
			{/* Produtos para empresas */}
			<section className="py-16 px-6 bg-gray-50">
				<h2 className="text-3xl font-bold text-blue-900 mb-10 text-center">
					Produtos para empresas
				</h2>
				<ResponsiveGate
					mobile={
						<div className="grid grid-cols-1 gap-3 max-w-6xl mx-auto">
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
							].map((p) => {
								const to = p.nome === "Seguro Frota"
									? "/produto-frota"
									: p.nome === "Seguro Acidentes de Trabalho"
									? "/produto-acidentes-trabalho"
									: p.nome === "Seguro Responsabilidade Civil Profissional"
									? "/produto-responsabilidade-civil-profissional"
									: p.nome === "Seguro Multirriscos Empresarial"
									? "/produto-multirriscos-empresarial"
									: p.nome === "Seguro Condomínio"
									? "/produto-condominio"
									: "/produtos";
								return <ProductCardMobile key={p.nome} {...p} to={to} />;
							})}
						</div>
					}
					desktop={
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
									imagem: "https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&w=400&q=60",
								},
								{
									nome: "Seguro Condomínio",
									descricao: "Proteção completa para edifícios e áreas comuns.",
									imagem: "https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&w=400&q=60",
								},
							].map((p) => {
								const to = p.nome === "Seguro Frota"
									? "/produto-frota"
									: p.nome === "Seguro Acidentes de Trabalho"
									? "/produto-acidentes-trabalho"
									: p.nome === "Seguro Responsabilidade Civil Profissional"
									? "/produto-responsabilidade-civil-profissional"
									: p.nome === "Seguro Multirriscos Empresarial"
									? "/produto-multirriscos-empresarial"
									: p.nome === "Seguro Condomínio"
									? "/produto-condominio"
									: "/produtos";
								return <ProductCard key={p.nome} {...p} to={to} />;
							})}
						</div>
					}
				/>
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
