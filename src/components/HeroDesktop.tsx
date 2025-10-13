import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Link } from 'react-router-dom';

const slides: Array<{ imagem: string; titulo: string; texto: string }> = [
  {
    imagem: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80',
    titulo: 'Simule o seu seguro auto em segundos',
    texto: 'Proteção completa para o seu veículo com atendimento personalizado.',
  },
  {
    imagem: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=1200&q=80',
    titulo: 'Seguro Vida e Saúde',
    texto: 'Segurança para você e sua família, com planos flexíveis.',
  },
  {
    imagem: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
    titulo: 'Seguro  Multirriscos Habitação',
    texto: 'Proteja seu lar contra imprevistos e garanta tranquilidade.',
  },
];

export default function HeroDesktop() {
  return (
    <section className="relative h-[400px] flex items-center justify-center bg-blue-900">
      <Swiper
        className="w-full h-full"
        autoplay={{ delay: 10000, disableOnInteraction: false }}
        loop
        navigation
        modules={[Navigation, Autoplay]}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative h-[400px] flex items-center justify-center">
              <img src={slide.imagem} alt={slide.titulo} className="absolute inset-0 w-full h-full object-cover opacity-40" />
              <div className="relative z-10 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow">{slide.titulo}</h1>
                <p className="text-xl mb-6 text-white max-w-2xl mx-auto">{slide.texto}</p>
                {idx === 0 && (
                  <Link to="/simulacao-auto" className="px-8 py-4 bg-yellow-400 text-blue-900 font-bold rounded-full shadow-lg hover:bg-yellow-300 transition">
                    Simule seu seguro auto
                  </Link>
                )}
                {idx === 1 && (
                  <Link to="/simulacao-vida" className="px-8 py-4 bg-green-400 text-blue-900 font-bold rounded-full shadow-lg hover:bg-green-300 transition">
                    Simule seguro vida
                  </Link>
                )}
                {idx === 2 && (
                  <Link to="/simulacao-habitacao" className="px-8 py-4 bg-blue-400 text-white font-bold rounded-full shadow-lg hover:bg-blue-300 transition">
                    Simule seguro multirriscos habitação
                  </Link>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
