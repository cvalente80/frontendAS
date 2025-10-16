import React from "react";
import Seo from "../components/Seo";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductCardMobile from "../components/ProductCardMobile";
import { ResponsiveGate } from "../components/ResponsiveGate";
import { useTranslation } from "react-i18next";

type Produto = { nome: string; descricao: string; imagem: string; to: string };

function useParticulares(): Produto[] {
  const { t } = useTranslation('products');
  return [
    {
      nome: t('individualsCards.auto.name'),
      descricao: t('individualsCards.auto.desc'),
      imagem: `${import.meta.env.BASE_URL}imagens/nosso-produtos-car.jpg`,
      to: 'produto-auto',
    },
    {
      nome: t('individualsCards.life.name'),
      descricao: t('individualsCards.life.desc'),
      imagem: 'https://images.pexels.com/photos/1683975/pexels-photo-1683975.jpeg?auto=compress&w=400&q=60',
      to: 'produto-vida',
    },
    {
      nome: t('individualsCards.health.name'),
      descricao: t('individualsCards.health.desc'),
      imagem: `${import.meta.env.BASE_URL}health-insurance.svg`,
      to: 'produto-saude',
    },
    {
      nome: t('individualsCards.home.name'),
      descricao: t('individualsCards.home.desc'),
      imagem: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80',
      to: 'produto-habitacao',
    },
  ];
}

function useEmpresas(): Produto[] {
  const { t } = useTranslation('products');
  return [
    {
      nome: t('businessCards.fleet.name'),
      descricao: t('businessCards.fleet.desc'),
      imagem: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
      to: 'produto-frota',
    },
    {
      nome: t('businessCards.work.name'),
      descricao: t('businessCards.work.desc'),
      imagem: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&w=400&q=60',
      to: 'produto-acidentes-trabalho',
    },
    {
      nome: t('businessCards.rcp.name'),
      descricao: t('businessCards.rcp.desc'),
      imagem: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&w=400&q=60',
      to: 'produto-responsabilidade-civil-profissional',
    },
    {
      nome: t('businessCards.mreb.name'),
      descricao: t('businessCards.mreb.desc'),
      imagem: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&w=400&q=60',
      to: 'produto-multirriscos-empresarial',
    },
    {
      nome: t('businessCards.condo.name'),
      descricao: t('businessCards.condo.desc'),
      imagem: 'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&w=400&q=60',
      to: 'produto-condominio',
    },
  ];
}

export default function Produtos() {
  const { t } = useTranslation('products');
  const { lang } = useParams();
  const base = lang === 'en' ? 'en' : 'pt';
  const particulares = useParticulares();
  const empresas = useEmpresas();
  return (
    <div className="min-h-screen bg-gray-50">
      <Seo
        title={t('title')}
        description={t('description')}
        canonicalPath={`/${base}/produtos`}
      />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 text-center">{t('heading')}</h2>
        <p className="text-blue-700 text-center mt-2">{t('subheading')}</p>

        <section className="mt-10">
          <h3 className="text-2xl font-semibold text-blue-800 mb-6">{t('individuals')}</h3>
          <ResponsiveGate
            mobile={
              <div className="grid grid-cols-1 gap-3">
                {particulares.map((p) => (
                  <ProductCardMobile key={p.nome} {...p} to={`/${base}/${p.to}`} />
                ))}
              </div>
            }
            desktop={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {particulares.map((p) => (
                  <ProductCard key={p.nome} {...p} to={`/${base}/${p.to}`} />
                ))}
              </div>
            }
          />
        </section>

        <section className="mt-12">
          <h3 className="text-2xl font-semibold text-blue-800 mb-6">{t('business')}</h3>
          <ResponsiveGate
            mobile={
              <div className="grid grid-cols-1 gap-3">
                {empresas.map((p) => (
                  <ProductCardMobile key={p.nome} {...p} to={`/${base}/${p.to}`} />
                ))}
              </div>
            }
            desktop={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {empresas.map((p) => (
                  <ProductCard key={p.nome} {...p} to={`/${base}/${p.to}`} />
                ))}
              </div>
            }
          />
        </section>
      </div>
    </div>
  );
}
