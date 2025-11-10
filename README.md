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


## Gestão de PDFs de simulação (Admin)

- O sistema permite associar um PDF (por exemplo, uma proposta/simulação) a cada registo de simulação.
- Apenas utilizadores com perfil `isAdmin` verdadeiro conseguem carregar o PDF.
- O PDF é guardado no Firebase Storage em `simulations/{uid}/{simulationId}/quote.pdf` e o link público (`pdfUrl`) é gravado no documento da simulação em Firestore (`users/{uid}/simulations/{simulationId}`).

### Como definir um administrador

1. No Firestore, abra a coleção `users` e edite/crie o documento do utilizador com o seu `uid`.
2. Adicione o campo booleano `isAdmin` com valor `true`.
3. Opcionalmente mantenha `email`, `displayName` e `createdAt`.

Nota: durante o registo via email/palavra‑passe, criamos/atualizamos o documento `users/{uid}` com `isAdmin: false` por omissão.

### Onde carregar/ver o PDF

- Na página "As minhas simulações" (`/minhas-simulacoes`), cada card mostra:
  - Se existir `pdfUrl`, um link "Ver PDF da simulação" visível para todos os utilizadores.
  - Se o utilizador atual for admin, surge um campo para carregar ficheiro `.pdf`; após upload ficará imediatamente disponível.

### Regras de segurança recomendadas

- Configure as regras do Firebase Storage/Firestore para que apenas admins possam escrever o campo `pdfUrl` e fazer upload para o caminho `simulations/**`.
- Exemplo (pseudo): permitir `read` ao dono do documento, mas `write` apenas a `isAdmin == true`.
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
