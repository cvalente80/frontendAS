# Ansião Seguros

Este template foi criado com React e Tailwind CSS, focado em simulações de seguro auto, mas preparado para outros produtos.

## Páginas principais
- Home
- Simulação Auto
- Produtos
- Sobre/Contato

## Como usar
Este projeto pode ser facilmente adaptado para outras empresas e produtos de seguros.

## Instalação
1. Instale as dependências: `npm install`
2. Inicie o servidor: `npm run dev`
3. Pré-visualização de build: `npm run build && npm run preview`
	- Importante: como o build usa `base: '/frontendAS/'`, abra a app em `http://localhost:<porta>/frontendAS/pt` (e não apenas `/pt`).
	- Em desenvolvimento (`npm run dev`), o endereço é `http://localhost:5173/pt`.

## Personalização
Adicione ou edite componentes em `src/` para adaptar o site a outros clientes ou produtos.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## TODO

- Adicionar ligue-me
- Adicionar depoimentos de clientes
- Incluir seção de perguntas frequentes (FAQ)
- Melhorar responsividade em dispositivos móveis
- Adicionar página de equipe/quem somos
- Integrar formulário de contato com backend ou serviço de email
- Adicionar animações sutis para transições
- Incluir ícones personalizados para cada produto
- Revisar textos institucionais e comerciais
- Adicionar links para redes sociais no rodapé
- Implementar página de política de privacidade
- Otimizar imagens para carregamento rápido
- Testar acessibilidade (contraste, navegação por teclado)
- Adicionar favicon personalizado
- Revisar SEO (títulos, meta tags, descrição)

## Internacionalização (PT/EN)

- Rotas sob `/:lang(pt|en)/*`; `/` redireciona para `/pt`.
- Switcher de idioma no topo preserva o caminho atual ao alternar PT/EN.
- i18n com i18next + react-i18next configurado em `src/i18n.ts`.
- SEO ajusta `html[lang]` e `og:locale` dinamicamente.
