import React from "react";
import Seo from "../components/Seo";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductCardMobile from "../components/ProductCardMobile";
import { ResponsiveGate } from "../components/ResponsiveGate";

type Produto = { nome: string; descricao: string; imagem: string; to: string };

const particulares: Produto[] = [
  {
    nome: "Seguro Auto",
    descricao: "Proteção completa para o seu veículo.",
    imagem: `${import.meta.env.BASE_URL}imagens/nosso-produtos-car.jpg`,
    to: "/produto-auto",
  },
  {
    nome: "Seguro Vida",
    descricao: "Segurança para si e para a sua família.",
    imagem: "https://images.pexels.com/photos/1683975/pexels-photo-1683975.jpeg?auto=compress&w=400&q=60",
    to: "/produto-vida",
  },
  {
    nome: "Seguro Saúde",
    descricao: "Cuide do seu bem-estar com planos flexíveis.",
    imagem: `${import.meta.env.BASE_URL}health-insurance.svg`,
    to: "/produto-saude",
  },
  {
    nome: "Seguro Multirriscos Habitação",
    descricao: "Proteja o seu lar contra imprevistos.",
    imagem: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80",
    to: "/produto-habitacao",
  },
];

const empresas: Produto[] = [
  {
    nome: "Seguro Frota",
    descricao: "Proteção para todos os veículos da empresa.",
    imagem: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
    to: "/produto-frota",
  },
  {
    nome: "Seguro Acidentes de Trabalho",
    descricao: "Cobertura para colaboradores em caso de acidente.",
    imagem: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&w=400&q=60",
    to: "/produto-acidentes-trabalho",
  },
  {
    nome: "Seguro Responsabilidade Civil Profissional",
    descricao: "Proteja a sua atividade contra danos a terceiros.",
    imagem: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&w=400&q=60",
    to: "/produto-responsabilidade-civil-profissional",
  },
  {
    nome: "Seguro Multirriscos Empresarial",
    descricao: "Cobertura para instalações e bens empresariais.",
    imagem: "https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&w=400&q=60",
    to: "/produto-multirriscos-empresarial",
  },
  {
    nome: "Seguro Condomínio",
    descricao: "Proteção completa para edifícios e áreas comuns.",
    imagem: "https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&w=400&q=60",
    to: "/produto-condominio",
  },
];

export default function Produtos() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Seo
        title="Produtos de Seguros — Particulares e Empresas"
        description="Conheça todas as soluções: Auto, Vida, Saúde, Habitação, Frota, Acidentes de Trabalho, Multirriscos Empresarial e RC Profissional."
        canonicalPath="/produtos"
      />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 text-center">Os nossos produtos</h2>
        <p className="text-blue-700 text-center mt-2">Soluções para particulares e empresas.</p>

        <section className="mt-10">
          <h3 className="text-2xl font-semibold text-blue-800 mb-6">Particulares</h3>
          <ResponsiveGate
            mobile={
              <div className="grid grid-cols-1 gap-3">
                {particulares.map((p) => (
                  <ProductCardMobile key={p.nome} {...p} />
                ))}
              </div>
            }
            desktop={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {particulares.map((p) => (
                  <ProductCard key={p.nome} {...p} />
                ))}
              </div>
            }
          />
        </section>

        <section className="mt-12">
          <h3 className="text-2xl font-semibold text-blue-800 mb-6">Empresas</h3>
          <ResponsiveGate
            mobile={
              <div className="grid grid-cols-1 gap-3">
                {empresas.map((p) => (
                  <ProductCardMobile key={p.nome} {...p} />
                ))}
              </div>
            }
            desktop={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {empresas.map((p) => (
                  <ProductCard key={p.nome} {...p} />
                ))}
              </div>
            }
          />
        </section>
      </div>
    </div>
  );
}
