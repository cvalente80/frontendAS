/**
 * seedVfxNews.mjs
 * Popula o Firestore com notícias da região de Vila Franca de Xira (region: "vfx").
 *
 * Uso:
 *   node --env-file=../../.env.local functions/scripts/seedVfxNews.mjs
 *
 * Requer:
 *   FIREBASE_SERVICE_ACCOUNT_JSON  – JSON da service account Firebase Admin
 *   OPENAI_API_KEY                 – (opcional) gera sumários automáticos
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  console.error('Missing FIREBASE_SERVICE_ACCOUNT_JSON');
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)) });
}
const db = getFirestore();

const ALLOWED_TAGS = [
  'auto','vida','saude','habitacao','empresas','rc-profissional',
  'condominio','multirriscos-empresarial','frota','acidentes-trabalho',
  'fiscalidade','sinistros','economia','ambiente','infraestruturas','local','nacional',
];

const REGION = 'vfx';

// --------------------------------------------------------------------------
// Lista de notícias seed para Vila Franca de Xira
// Adiciona / remove entradas conforme necessário.
// --------------------------------------------------------------------------
const NEWS_SEED = [
  {
    title: 'Vila Franca de Xira: câmara aprova orçamento para 2025 com foco em habitação e mobilidade',
    url: 'https://www.cm-vfxira.pt/pages/1',
    source: 'Câmara Municipal de Vila Franca de Xira',
    tags: ['habitacao', 'infraestruturas', 'local'],
    summary: 'A Câmara Municipal de Vila Franca de Xira aprovou o orçamento para 2025, com prioridade para investimentos em habitação pública e mobilidade sustentável. O plano prevê a requalificação de várias artérias do município e o reforço dos transportes públicos.',
  },
  {
    title: 'Zona industrial de Vila Franca de Xira recebe novos investimentos empresariais',
    url: 'https://www.cm-vfxira.pt/pages/2',
    source: 'Câmara Municipal de Vila Franca de Xira',
    tags: ['empresas', 'economia', 'local'],
    summary: 'A zona industrial do município de Vila Franca de Xira vai receber novos investimentos de empresas dos setores logístico e agroalimentar, reforçando a posição do concelho como polo económico da Área Metropolitana de Lisboa.',
  },
  {
    title: 'Proteção civil de Vila Franca de Xira reforça meios para época de incêndios',
    url: 'https://www.cm-vfxira.pt/pages/3',
    source: 'Câmara Municipal de Vila Franca de Xira',
    tags: ['local', 'ambiente'],
    summary: 'O município de Vila Franca de Xira anunciou o reforço dos meios de proteção civil para a época de maior risco de incêndios, incluindo a aquisição de novo equipamento e o aumento do efetivo de voluntários nas corporações de bombeiros locais.',
  },
  {
    title: 'Simulações de seguro automóvel: o que muda com as novas regras do IVA em 2025',
    url: 'https://www.portaseguro.pt/noticias/iva-seguros-auto-2025',
    source: 'Porta Seguro',
    tags: ['auto', 'fiscalidade', 'nacional'],
    summary: 'As alterações ao regime do IVA aplicável aos seguros automóvel em 2025 trazem novas obrigações para seguradoras e mediadores. O impacto nos prémios varia consoante o tipo de cobertura e o perfil do condutor, sendo recomendável rever a apólice com um mediador de confiança.',
  },
  {
    title: 'Seguros de habitação: como proteger a sua casa em zona de cheias no Ribatejo',
    url: 'https://www.deco.proteste.pt/dinheiro/seguros/noticias/seguros-habitacao-cheias',
    source: 'DECO Proteste',
    tags: ['habitacao', 'sinistros', 'local'],
    summary: 'As zonas ribeirinhas do Tejo, incluindo partes do concelho de Vila Franca de Xira, estão sujeitas a risco de cheias. Especialistas da DECO recomendam a contratação de seguros multirriscos habitação com cobertura alargada para fenómenos climáticos, incluindo inundações e danos por água.',
  },
  {
    title: 'Mercado automóvel em Portugal: vendas crescem mas prémios de seguro sobem',
    url: 'https://www.autoportal.pt/noticias/vendas-auto-premios-seguro-2025',
    source: 'Autoportal',
    tags: ['auto', 'economia', 'nacional'],
    summary: 'As vendas de veículos automóveis em Portugal registaram um crescimento expressivo no primeiro semestre de 2025, mas os prémios médios de seguro automóvel também subiram, pressionados pelo aumento dos custos de reparação e peças. Os condutores são aconselhados a comparar propostas antes de renovar.',
  },
  {
    title: 'Saúde: novos centros de saúde previstos para o concelho de Vila Franca de Xira',
    url: 'https://www.cm-vfxira.pt/pages/4',
    source: 'Câmara Municipal de Vila Franca de Xira',
    tags: ['saude', 'local', 'infraestruturas'],
    summary: 'O Ministério da Saúde e a Câmara Municipal de Vila Franca de Xira chegaram a acordo para a construção de dois novos centros de saúde no concelho, visando reduzir os tempos de espera e melhorar o acesso aos cuidados primários para a população local.',
  },
  {
    title: 'Condomínios: obrigações legais dos condóminos em 2025',
    url: 'https://www.dre.pt/noticias/condominios-obrigacoes-2025',
    source: 'Diário da República Eletrónico',
    tags: ['condominio', 'habitacao', 'nacional'],
    summary: 'A legislação em vigor em 2025 reforça as obrigações dos condóminos no que respeita à manutenção de partes comuns, seguros obrigatórios e comunicação de obras. Administradores de condomínio devem assegurar a existência de apólice de seguro multirriscos que cubra as áreas comuns do edifício.',
  },
];
// --------------------------------------------------------------------------

async function generateSummary(title, url, existingSummary) {
  if (!process.env.OPENAI_API_KEY) return existingSummary;
  try {
    let articleText = '';
    try {
      const r = await fetch(url);
      if (r.ok) articleText = (await r.text()).slice(0, 6000);
    } catch { /* ignore */ }

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Responde apenas em JSON com os campos "summary" (string, 5-8 frases, português de Portugal) e "tags" (array de strings).' },
          { role: 'user', content: `Título: "${title}"\nURL: ${url}\n${articleText ? `Conteúdo:\n${articleText}` : `Resumo base: ${existingSummary}`}` },
        ],
        temperature: 0.3,
      }),
    });
    if (!resp.ok) return existingSummary;
    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content || '';
    const cleaned = content.replace(/```[a-zA-Z]*\s*/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return parsed.summary || existingSummary;
  } catch {
    return existingSummary;
  }
}

async function main() {
  console.log(`\n🗺️  A popular notícias para região: ${REGION} (Vila Franca de Xira)\n`);
  let inserted = 0;
  let skipped = 0;

  for (const item of NEWS_SEED) {
    // Verificar se já existe pelo URL para evitar duplicados
    const existing = await db.collection('news').where('url', '==', item.url).limit(1).get();
    if (!existing.empty) {
      console.log(`⏭️  Já existe: ${item.title.slice(0, 60)}…`);
      skipped++;
      continue;
    }

    const summary = await generateSummary(item.title, item.url, item.summary);
    const tags = item.tags.filter(t => ALLOWED_TAGS.includes(t));
    const publishedAt = new Date().toISOString();

    await db.collection('news').add({
      title: item.title,
      url: item.url,
      source: item.source,
      region: REGION,
      summary,
      tags,
      publishedAt,
    });

    console.log(`✅ Inserida: ${item.title.slice(0, 60)}…`);
    inserted++;
  }

  console.log(`\n📊 Resultado: ${inserted} inseridas, ${skipped} já existiam.\n`);
}

main().catch(err => { console.error(err); process.exit(1); });
