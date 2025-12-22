<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Copilot Instructions — Ansião Seguros Template

Este projeto é um template empresarial para "Ansião Seguros" usando React + Vite e Tailwind CSS. Foco principal: simulação de seguro auto; preparado para outros produtos e reutilização.

## Visão Geral
- Rotas com internacionalização: `/:lang(pt|en)/*` (redireciona `/` → `/pt`).
- Build em GitHub Pages usa `base: '/frontendAS/'` (ver `vite.config.js`).
- Firebase (Auth, Firestore, Storage) para autenticação, chat em tempo real e simulações.
- EmailJS para envio de propostas e notificações de chat.

## Arquitetura e Fluxos
- `src/pages/*`: páginas de produto e simulação (ex.: `SimulacaoAuto.tsx`).
- `src/components/*`: UI compartilhada (`Seo`, `Header`, `ChatWidget`, etc.).
- `src/context/AuthContext.tsx`: gere sessão, cria/atualiza `users/{uid}`, detecta admin via `admins/{uid}` ou `users/{uid}.isAdmin`.
- `src/lib/chat.ts`: modelo `chats/{chatId=userId}` com subcoleção `messages`. Campos-chave: `firstNotified`, `unreadForAdmin`, `typingUser/Admin`, `lastMessageAt/Preview`.
- Simulações: gravadas em `users/{uid}/simulations/{simulationId}` via `utils/simulations.ts` (com `idempotencyKey`). PDFs em Storage: `simulations/{uid}/{simulationId}/quote.pdf` e link `pdfUrl` no doc.
- Funções Cloud (`functions/`): notificação no primeiro contacto do chat (`notifyOnFirstUserMessage`) e integração de EmailJS (ver `functions/README.md`).

## Workflows de Dev
- Desenvolvimento: `npm run dev` (porta padrão 5175, auto-open). Acesse `http://localhost:5175/pt`.
- Build local: `npm run build && npm run preview` (usa `base: '/'`).
- Build para GitHub Pages: `npm run build:gh` e sirva com `npm run preview`; acesse `/frontendAS/pt`.
- Testes de regras Firestore: `npm run test:rules` ou `npm run emulators:test:rules` (usa `@firebase/rules-unit-testing`).
- Firebase:
	- Regras: `firebase deploy --only firestore:rules` (veja `firestore.rules`).
	- Emuladores: `firebase emulators:start --only functions,firestore` (ver `firebase.json`).
	- Funções: `cd functions && npm run deploy`.

## Convenções Importantes
- Importar Firebase sempre de `src/firebase.ts` (singletons re-exportados), não inicializar localmente.
- Chat: `chatId === userId`. Use helpers (`ensureChatForUser`, `addUserMessage`, `subscribeChats`, etc.) em `src/lib/chat.ts`.
- Notificação de primeiro contacto: flip atómico de `firstNotified` via `runTransaction` no cliente; função Cloud também pode enviar email.
- Autorização de Admin: preferir `admins/{uid}`; fallback `users/{uid}.isAdmin`.
- SEO/i18n: use `Seo` e `useTranslation(namespace)`; defina `canonicalPath` com idioma atual.
- URLs com base: para GH Pages, componha links como `origin + BASE_URL + lang` (ex.: inbox admin).

## Integrações e Configuração
- EmailJS frontend: IDs em `src/emailjs.config.ts` (ex.: `EMAILJS_SERVICE_ID_CHAT`, `EMAILJS_TEMPLATE_ID_CHAT`, `EMAILJS_USER_ID_CHAT`).
- EmailJS nas Functions: configure `EMAIL_NOTIFICATIONS_ENABLED`, `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`, `ADMIN_TO`, `SITE_BASE_URL`.
- Firestore Rules: atuais são permissivas até `2025-12-31` (arquivo `firestore.rules`). Execute testes e planeie endurecimento.

## Exemplos Rápidos
- Criar/usar chat do utilizador:
	```ts
	const chatId = await ensureChatForUser(uid);
	await addUserMessage(chatId, uid, 'Primeira mensagem');
	```
- Marcar chat aberto pelo admin: `await markAdminOpened(chatId)`.
- Guardar simulação Auto e enviar email:
	```ts
	await saveSimulation(uid, { type: 'auto', ... }, { idempotencyKey });
	await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params, EMAILJS_USER_ID);
	```

## Ficheiros Chave
- `src/lib/chat.ts`, `src/context/AuthContext.tsx`, `src/pages/SimulacaoAuto.tsx`.
- `src/emailjs.config.ts`, `src/i18n.ts`, `src/components/Seo.tsx`.
- `firebase.json`, `firestore.rules`, `functions/README.md`, `functions/src/index.ts`.

Se algo estiver ambíguo (ex.: regras de Storage, nomes de namespaces i18n), diga o que vai assumir e proponha uma verificação. Envie melhorias com base neste guia e peça validação quando necessário.
