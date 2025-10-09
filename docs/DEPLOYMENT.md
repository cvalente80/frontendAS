# Guia de Deploy no GitHub Pages

## Configuração Inicial

Para publicar o site Ansião Seguros no GitHub Pages, siga estes passos:

### 1. Ativar GitHub Pages

1. Acesse o repositório no GitHub: https://github.com/cvalente80/frontendAS
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Pages**
4. Em **Build and deployment**:
   - **Source**: Selecione "GitHub Actions"
   
![GitHub Pages Settings](https://docs.github.com/assets/images/help/pages/pages-source-github-actions.png)

5. Clique em **Save**

### 2. Deploy Automático

Após a configuração, o site será automaticamente publicado em:
```
https://cvalente80.github.io/frontendAS/
```

O deploy automático ocorre sempre que:
- Há um push para a branch `main`
- Você pode também acionar manualmente através da aba **Actions**

### 3. Verificar o Deploy

1. Vá para a aba **Actions** no repositório
2. Verá o workflow "Deploy to GitHub Pages" em execução
3. Aguarde a conclusão (geralmente 2-3 minutos)
4. O site estará disponível no URL acima

## Estrutura do Workflow

O workflow de deploy está configurado em `.github/workflows/deploy.yml`:

- **Build**: Instala dependências e constrói o projeto com Vite
- **Deploy**: Publica os arquivos estáticos no GitHub Pages

## Configuração do Vite

O arquivo `vite.config.js` está configurado com:
```javascript
base: '/frontendAS/'
```

Isto garante que todos os caminhos dos assets (CSS, JS, imagens) funcionem corretamente no GitHub Pages.

## Troubleshooting

### O site não carrega ou mostra erro 404

- Verifique se GitHub Pages está ativado nas configurações
- Certifique-se de que selecionou "GitHub Actions" como source
- Aguarde alguns minutos após o deploy

### Imagens ou assets não carregam

- Verifique se os caminhos começam com `/` (absolutos)
- O Vite automaticamente ajusta os caminhos durante o build

### Deploy falhou

1. Vá para **Actions** no GitHub
2. Clique no workflow que falhou
3. Veja os logs para identificar o erro
4. Erros comuns:
   - Erro de build: Verifique se o código compila localmente com `npm run build`
   - Erro de permissões: Verifique as permissões do workflow

## Deploy Manual Local

Para testar o build localmente antes de fazer deploy:

```bash
# Instalar dependências
npm install

# Build do projeto
npm run build

# Preview do build
npm run preview
```

O preview estará disponível em `http://localhost:4173/frontendAS/`

## Atualizar o Site

Para publicar alterações:

1. Faça suas alterações no código
2. Commit e push para a branch `main`:
   ```bash
   git add .
   git commit -m "Descrição das alterações"
   git push origin main
   ```
3. O GitHub Actions automaticamente fará o deploy

## Recursos Adicionais

- [Documentação GitHub Pages](https://docs.github.com/pages)
- [Documentação Vite](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions Docs](https://docs.github.com/actions)
