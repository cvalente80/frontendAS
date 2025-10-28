import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  pt: {
    common: {
      brand: 'Ansião Seguros',
      nav: {
        homeLink: 'Início',
        auto: 'Simulação Auto',
        life: 'Simulação Vida',
        health: 'Simulação Saúde',
        homeInsurance: 'Simulação Habitação',
        simulator: 'Simulador',
        products: 'Produtos',
        contact: 'Contato'
      },
      a11y: {
        switchToEN: 'Mudar para Inglês',
        switchToPT: 'Mudar para Português',
      },
      chat: {
        title: 'Converse agora',
        subtitle: 'Responda com o seu pedido e os nossos consultores entram em contacto.',
        talkNow: 'Conversar agora',
        callNow: 'Ligar agora',
        callShort: 'Ligar',
        close: 'Fechar',
        namePlaceholder: 'O seu nome (opcional)',
        emailPlaceholder: 'Email (opcional)',
        phonePlaceholder: 'Telefone (opcional)',
        messagePlaceholder: 'Escreva a sua mensagem... (Ctrl/⌘+Enter para enviar)',
        send: 'Enviar',
        sending: 'A enviar…',
        sent: 'Mensagem enviada. Obrigado!',
        error: 'Falha ao enviar. Tente novamente.',
        you: 'Você',
        agent: 'Agente',
        empty: 'Comece por nos dizer em que o podemos ajudar.',
        whatsappNow: 'WhatsApp',
        whatsPrefill: 'Olá! Gostaria de falar com Ansião Seguros'
      }
    },
    sim_saude: {
      title: 'Simulação Seguro Saúde',
      stepProgress: 'Passo {{step}} de 2',
      step1Title: '1. Pessoas Seguras',
      step2Title: '2. Escolha a opção',
      placeholders: {
        fullName: 'Nome completo',
        birthDate: 'Data de nascimento (dd-mm-aaaa)',
        nif: 'NIF',
        yourName: 'O seu nome',
        email: 'nome@servidor.pt',
        phone: '9 dígitos'
      },
      buttons: {
        addInsured: 'Adicionar pessoa segura',
        remove: 'Remover',
        maxReached5: 'Máximo de 5 pessoas atingido',
        prev: 'Anterior',
        next: 'Próximo',
        submit: 'Pedir Proposta'
      },
      validations: {
        insuredNameRequired: 'Por favor, preencha o nome completo.',
        insuredBirthRequired: 'Por favor, preencha a data de nascimento.',
        insuredNifRequired: 'Por favor, preencha o NIF com 9 dígitos.',
        planRequired: 'Por favor, escolha uma das opções de plano.',
        nameRequired: 'Por favor, preencha o nome.',
        emailRequired: 'Por favor, preencha o email.',
        emailInvalid: 'Por favor, insira um email válido no formato nome@servidor.pt',
        phoneRequired: 'Por favor, preencha o telefone (9 dígitos).'
      },
      table: {
        coverages: 'Coberturas',
        option1: 'Opção 1',
        option2: 'Opção 2',
        option3: 'Opção 3',
        included: 'Incluído',
        notApplicable: '—',
        optional: 'Opcional',
        add: 'Aderir',
        discounts: 'Descontos',
        partial: 'Parcial',
        telemedicine: 'Telemedicina'
      },
      benefits: {
        consultas: 'Consultas (rede)',
        exames: 'Exames e meios complementares',
        ambulatoria: 'Assistência ambulatória',
        internamento: 'Internamento hospitalar',
        urgencias: 'Serviço de urgência',
        parto: 'Parto e assistência na maternidade',
        estomatologia: 'Estomatologia (dentista)',
        medicamentos: 'Medicamentos com prescrição',
        internacional: 'Assistência em viagem (internacional)',
        domicilio: 'Consulta ao domicílio / Telemedicina'
      },
      messages: {
        submitSuccess: 'Pedido efetuado com sucesso! Irá receber as próximas instruções por email.',
        submitError: 'Erro ao enviar pedido. Tente novamente ou contacte-nos.'
      },
      emailSummary: { person: 'Pessoa', name: 'Nome:', birth: 'Nascimento:', nif: 'NIF:' },
      backgroundAlt: 'Seguro Saúde'
    },
    sim_home: {
      title: 'Simulação Seguro Habitação',
      stepProgress: 'Passo {{step}} de 3',
      step1Title: '1. Dados do Imóvel',
      step2Title: '2. Dados Pessoais',
      step3Title: '3. Produto',
      labels: {
        situacao: 'Situação',
        tipoImovel: 'Tipo de imóvel',
        utilizacao: 'Utilização',
        anoConstrucao: 'Ano de construção',
        area: 'Área (m²)',
        codigoPostal: 'Código Postal do risco',
        construcao: 'Tipo de construção',
        capitalEdificio: 'Capital do Edifício (€)',
        capitalConteudo: 'Capital do Conteúdo (€)',
        seguranca: 'Sistemas de segurança',
        nomeCompleto: 'Nome completo',
        email: 'Email',
        telefone: 'Telefone',
        nif: 'NIF (Contribuinte)',
        adicionais: 'Coberturas adicionais',
        detalhesAdicionais: 'Detalhes adicionais',
        capitaisSelecionados: 'Capitais selecionados',
        capitalImovel: 'Capital Imóvel',
        capitalConteudoLabel: 'Capital Conteúdo'
      },
      options: {
        selecione: 'Selecione',
        situacao: { proprietario: 'Proprietário', inquilino: 'Inquilino' },
        tipoImovel: { apartamento: 'Apartamento', moradia: 'Moradia' },
        utilizacao: { permanente: 'Habitação Própria Permanente', secundaria: 'Habitação Secundária', arrendamento: 'Arrendamento' },
        construcao: { betao: 'Betão armado', alvenaria: 'Alvenaria (tijolo/pedra)', madeira: 'Madeira' },
        seguranca: { alarme: 'Alarme', portaBlindada: 'Porta blindada', cctv: 'Videovigilância' }
      },
      placeholders: {
        year: 'AAAA',
        area: 'Ex: 120',
        postal: '____-___',
        capEdificio: 'Ex: 150000',
        capConteudo: 'Ex: 25 000',
        yourName: 'O seu nome',
        email: 'nome@servidor.pt',
        phone: '__ _______',
        nif: '___ ___ ___',
        details: 'Descreva aqui necessidades específicas ou coberturas desejadas...'
      },
      product: {
        cards: {
          base: { title: 'Imóvel', desc: 'Proteção ao edifício com RC, incêndio/explosão, riscos elétricos e danos por água.' },
          intermedio: { title: 'Imóvel + Recheio', desc: 'Inclui proteção ao conteúdo (recheio), com RC, incêndio/explosão, riscos elétricos e danos por água.' },
          completo: { title: 'Imóvel + Recheio + Fenómenos Sísmicos', desc: 'Cobertura alargada incluindo fenómenos sísmicos, com RC e proteção ao edifício e recheio.' }
        },
        bullets: ['Responsabilidade civil','Incêndio e explosão','Riscos elétricos','Danos por água','Roubo (recheio)','Fenómenos sísmicos']
      },
      extras: { earthquake: 'Fenómenos sísmico', garageVehicles: 'Veículos em garagem' },
      buttons: { prev: 'Anterior', next: 'Próximo', submit: 'Pedir Proposta' },
      messages: {
        step1Missing: 'Por favor, preencha todos os campos obrigatórios do imóvel.',
        atLeastOneCapital: 'Indique pelo menos um capital: edifício ou conteúdo.',
        postalInvalid: 'Código Postal inválido. Formato XXXX-XXX.',
        yearInvalid: 'Ano de construção inválido (AAAA).',
        nameRequired: 'Preencha o nome.',
        emailInvalid: 'Insira um email válido.',
        phoneInvalid: 'Telefone deve ter 9 dígitos.',
        nifInvalid: 'NIF deve ter 9 dígitos.',
        productRequired: 'Selecione o produto.',
        rgpdRequired: 'Necessário aceitar a Política de Privacidade & RGPD.',
        submitSuccess: 'Pedido enviado com sucesso! Receberá instruções por email.',
        submitError: 'Ocorreu um erro ao enviar o pedido. Tente novamente.'
      }
    },
    sim_vida: {
      title: 'Simulação Seguro Vida',
      step1Title: '1. Pessoas Seguras',
      step2Title: '2. Capitais a Segurar',
      step3Title: '3. Tipo de Invalidez',
      insuranceType: {
        individual: 'Vida Individual',
        mortgage: 'Vida Crédito Habitação'
      },
      placeholders: {
        fullName: 'Nome completo',
        birthDate: 'Data de nascimento (dd-mm-aaaa)',
        nif: 'NIF',
        capital: 'Capital seguro',
        prazo: 'Prazo do seguro (anos)',
        yourName: 'Nome',
        email: 'Email',
        phone: 'Telefone'
      },
      buttons: {
        addInsured: 'Adicionar pessoa segura',
        remove: 'Remover',
        maxReached: 'Máximo de 2 pessoas atingido',
        prev: 'Anterior',
        next: 'Próximo',
        simulate: 'Simular'
      },
      validations: {
        insuredNameRequired: 'Por favor, preencha o nome completo.',
        insuredBirthRequired: 'Por favor, preencha a data de nascimento.',
        insuredNifRequired: 'Por favor, preencha o NIF com 9 dígitos.',
        capitalRequired: 'Por favor, preencha o capital seguro.',
        prazoRequired: 'Por favor, preencha o prazo do seguro.',
        nameRequired: 'Por favor, preencha o nome completo.',
        emailRequired: 'Por favor, preencha o email.',
        emailInvalid: 'Por favor, insira um email válido no formato nome@servidor.pt',
        phoneRequired: 'Por favor, preencha o telefone (9 dígitos).'
      },
      disability: {
        label: 'Tipo de Invalidez',
        explanationPrefix: 'Explicação:',
        options: { IAD: 'IAD', ITP: 'ITP' },
        emailLabels: {
          IAD: 'Invalidez Absoluta e Definitiva (IAD)',
          ITP: 'Invalidez Total e Permanente (ITP)'
        },
        explanations: {
          IAD: 'Invalidez Absoluta e Definitiva (IAD): A indemnização é realizada quando o segurado fica totalmente dependente de terceiros para as atividades básicas do dia a dia.',
          ITP: 'Invalidez Total e Permanente (ITP): A indemnização é realizada quando segurado fica impossibilitado de exercer qualquer atividade profissional, mas pode realizar tarefas básicas sozinho.'
        }
      },
      messages: {
        submitSuccess: 'Pedido efetuado com sucesso! Irá receber as próximas instruções por email.',
        submitError: 'Erro ao enviar pedido. Tente novamente ou contacte-nos.'
      },
      emailSummary: {
        person: 'Pessoa',
        name: 'Nome:',
        birth: 'Nascimento:',
        nif: 'NIF:'
      },
      backgroundAlt: 'Plano de proteção familiar - Seguro de Vida'
    },
    sim_auto: {
      title: 'Simulação de Seguro Auto',
      stepProgress: 'Passo {{step}} de 3',
      step1Title: 'Passo 1 - Identificação do condutor',
      step2Title: 'Passo 2 - Identificação da viatura',
      step3Title: 'Passo 3 - Produto e coberturas adicionais',
      placeholders: {
        name: 'Nome completo',
        email: 'Email',
        birthDate: 'Data de nascimento (dd-mm-aaaa)',
        licenseDate: 'Data da Carta de condução (dd-mm-aaaa)',
        postalCode: 'Código Postal (____-___)',
        nif: 'NIF (Contribuinte)',
        carBrand: 'Marca do carro',
        carModel: 'Modelo do carro',
        carYear: 'Ano',
        plate: 'XX-XX-XX',
        otherRequests: 'Ex.: limites, condutor jovem, franquias desejadas, observações...'
      },
      validations: {
        under18: 'Apenas condutores com 18 anos ou mais podem prosseguir.',
        nameFull: 'Por favor, indique o nome completo (pelo menos dois nomes).',
        emailRequired: 'Por favor, preencha o email.',
        emailInvalid: 'Por favor, insira um email válido.',
        postalFormat: 'O código postal deve ter 7 dígitos numéricos (formato XXXX-XXX).',
        postalHelp: 'Por favor, insira o código postal no formato XXXX-XXX com 7 dígitos numéricos.',
        nifInvalid: 'NIF inválido.',
        nifRequired: 'Por favor, preencha o NIF válido com 9 dígitos.',
        plateFormat: 'Por favor, preencha a matrícula no formato XX-XX-XX.',
        brandRequired: 'Por favor, preencha a marca do carro.',
        modelRequired: 'Por favor, preencha o modelo do carro.',
        yearRequired: 'Por favor, preencha o ano do carro.',
        rgpdRequired: 'Por favor, aceite a Política de Privacidade & RGPD para prosseguir.'
      },
      typeLabel: 'Tipo de seguro:',
      typeSelectPlaceholder: 'Selecione o tipo de seguro',
      typeThirdParty: 'Terceiros',
      typeOwnDamage: 'Danos Próprios',
      typeThirdPartyInfo: 'Seguro de Terceiros: cobre danos causados a terceiros, pessoas e bens, mas não cobre danos ao seu próprio veículo.',
      typeOwnDamageInfo: 'Seguro de Danos Próprios: cobre danos ao seu próprio veículo, além dos danos causados a terceiros.',
      baseCoverLabel: 'Coberturas base:',
      additionalCoverages: 'Coberturas adicionais:',
      baseCoversThirdParty: ['Responsabilidade civil', 'Proteção jurídica'],
      baseCoversOwnDamage: ['Choque, colisão e capotamento', 'Furto ou roubo', 'Incêndio'],
      coverageLabels: {
        occupants: 'Ocupantes',
        glass: 'Vidros',
        assistance: 'Assistência em viagem',
        fire: 'Incêndio',
        theft: 'Roubo',
        naturalCatastrophes: 'Riscos catastróficos da natureza',
        vandalism: 'Atos de vandalismo',
        replacementVehicle: 'Veículo de Substituição'
      },
      buttons: { prev: 'Anterior', next: 'Próximo', simulate: 'Simular' },
      messages: {
        selectType: 'Por favor, selecione o tipo de seguro.',
        submitSuccess: 'Simulação submetida com sucesso!\nEmail enviado.',
        submitEmailError: 'Simulação submetida, mas houve erro ao enviar o email.'
      },
      summary: {
        title: 'Simulação',
        labels: {
          vehicle: 'Viatura:',
          nif: 'NIF:',
          birthDate: 'Data Nascimento:',
          licenseDate: 'Data Carta:',
          postalCode: 'Código Postal:',
          type: 'Tipo:',
          coverages: 'Coberturas:',
          otherRequests: 'Outros pedidos:'
        }
      }
    },
    contact: {
      seoTitle: 'Contacto',
      seoDesc: 'Fale connosco para pedidos de informação, simulações ad hoc ou propostas personalizadas.',
      pageTitle: 'Fale connosco',
      pageSubtitle: 'Envie-nos um pedido de informação ou uma simulação ad hoc. Respondemos com brevidade.',
      placeholders: {
        name: 'Nome completo',
        email: 'Email',
        phoneOptional: 'Telefone (opcional)',
        subjectOptional: 'Assunto (opcional)',
        message: 'Descreva o seu pedido ou dúvida...',
        productInterestOptional: 'Produto de interesse (opcional)'
      },
      requestType: {
        label: 'Tipo de pedido',
        info: 'Pedido de informação',
        adhoc: 'Pedido de simulação ad hoc',
        contact: 'Pedido de contacto',
        other: 'Outro'
      },
      productInterest: {
        label: 'Produto de interesse',
        auto: 'Auto',
        life: 'Vida',
        health: 'Saúde',
        home: 'Habitação',
        fleet: 'Frota',
        work: 'Acidentes de Trabalho',
        mreb: 'Multirriscos Empresarial',
        rcp: 'RC Profissional',
        other: 'Outro'
      },
      labels: {
        contactDataTitle: 'Dados de contacto',
        requestTitle: 'Pedido',
        name: 'Nome',
        email: 'Email',
        phone: 'Telefone',
        requestType: 'Tipo de pedido',
        productInterest: 'Produto de interesse',
        subject: 'Assunto',
        message: 'Mensagem',
      },
      messages: {
        success: 'Obrigado! Recebemos o seu pedido e entraremos em contacto brevemente.',
        error: 'Ocorreu um erro ao enviar. Tente novamente.',
        sending: 'A enviar…',
        submit: 'Enviar pedido'
      },
      map: {
        whereTitle: 'Onde estamos',
        whereDesc: 'Vila de Ansião, distrito de Leiria.',
        iframeTitle: 'Mapa de Ansião, Leiria',
        openInMaps: 'Abrir no Google Maps'
      },
      rgpdText: 'Li e aceito a <0>Política de Privacidade & RGPD</0>.',
      validation: {
        nameRequired: 'Indique o seu nome.',
        emailInvalid: 'Insira um email válido.',
        messageRequired: 'Descreva o seu pedido.',
        rgpdRequired: 'Necessário aceitar a Política de Privacidade & RGPD.'
      },
      email: {
        subjectPrefix: 'Contacto: ',
        typePrefix: 'Contacto geral',
        typeWithProduct: 'Contacto / {{product}}'
      }
    },
    product_fleet: {
      seoTitle: 'Seguro Frota Empresarial',
      seoDesc: 'Gestão eficiente e proteção completa para os veículos da sua empresa. Solicite uma proposta personalizada.',
      headerTitle: 'Seguro Frota Empresarial',
      headerSubtitle: 'Gestão eficiente e proteção completa para todos os veículos da sua empresa',
      badge: 'Produto Fidelidade',
      ctaRequest: 'Solicitar proposta',
      ctaContact: 'Fale com um consultor',
      whyTitle: 'Por que escolher o Seguro Frota Empresarial?',
      whyItems: [
        'Gestão centralizada de todos os veículos da empresa',
        'Proteção contra danos próprios, terceiros e acidentes',
        'Assistência 24h em todo o território nacional',
        'Opções flexíveis de coberturas e capitais'
      ],
      coveragesTitle: 'Coberturas disponíveis',
      coverages: [
        { title: 'Danos Próprios', desc: 'Cobertura para danos causados aos veículos da frota por acidente, colisão, incêndio, furto ou roubo.' },
        { title: 'Responsabilidade Civil', desc: 'Proteção contra danos causados a terceiros, pessoas e bens.' },
        { title: 'Assistência em Viagem', desc: 'Serviços de reboque, transporte, alojamento e apoio em caso de avaria ou acidente.' },
        { title: 'Proteção Jurídica', desc: 'Apoio legal em situações de litígio relacionadas com os veículos da empresa.' }
      ],
      advantagesTitle: 'Vantagens exclusivas',
      advantages: [
        'Gestão digital da apólice e sinistros',
        'Atendimento especializado para empresas',
        'Planos ajustáveis conforme o perfil da empresa',
        'Cobertura para condutores e colaboradores'
      ],
      howTitle: 'Como contratar?',
      howSteps: [
        'Solicite uma proposta personalizada para a sua empresa.',
        'Escolha as coberturas e capitais que melhor se adaptam à sua frota.',
        'Envie os documentos necessários e finalize a contratação com o apoio de um consultor.'
      ],
      formTitle: 'Solicitar Proposta - Frota',
      stepProgress: 'Passo {{step}} de 3',
      step1Title: 'Passo 1 - Identificação do responsável',
      step2Title: 'Passo 2 - Identificação das viaturas',
      step3Title: 'Passo 3 - Produto e coberturas adicionais',
      placeholders: {
        name: 'Nome completo',
        email: 'Email',
        nif: 'NIF (Contribuinte)',
        postalCode: 'Código Postal (____-___)',
        birthDate: 'Data de nascimento (dd-mm-aaaa)',
        licenseDate: 'Data da Carta de condução (dd-mm-aaaa)',
        carBrand: 'Marca',
        carModel: 'Modelo',
        carYear: 'Ano',
        plate: 'XX-XX-XX',
        otherRequests: 'Ex.: limites por viatura, condutores nomeados, franquias desejadas, observações...'
      },
      vehicles: { titlePrefix: 'Viatura #', add: '+ Adicionar viatura', remove: 'Remover' },
      typeLabel: 'Tipo de seguro:',
      typeSelectPlaceholder: 'Selecione o tipo de seguro',
      typeThirdParty: 'Terceiros',
      typeOwnDamage: 'Danos Próprios',
      typeThirdPartyInfo: 'Seguro de Terceiros: cobre danos a terceiros, pessoas e bens.',
      typeOwnDamageInfo: 'Seguro de Danos Próprios: cobre danos ao seu veículo, além de terceiros.',
      additionalCoverages: 'Coberturas adicionais:',
      coverageLabels: {
        occupants: 'Ocupantes',
        glass: 'Vidros',
        assistance: 'Assistência em viagem',
        fire: 'Incêndio',
        theft: 'Roubo',
        naturalCatastrophes: 'Riscos catastróficos da natureza',
        vandalism: 'Atos de vandalismo',
        replacementVehicle: 'Veículo de Substituição'
      },
      otherRequestsLabel: 'Outros pedidos / detalhes',
      buttons: { prev: 'Anterior', next: 'Próximo', submit: 'Pedir Proposta' },
      rgpdText: 'Li e aceito a <0>Política de Privacidade & RGPD</0>.',
      messages: {
        selectType: 'Por favor, selecione o tipo de seguro.',
        submitSuccess: 'Pedido enviado com sucesso!',
        submitEmailError: 'Pedido submetido, mas houve erro ao enviar o email.',
        under18: 'Apenas condutores com 18 anos ou mais podem prosseguir.'
      },
      summary: {
        title: 'Proposta Frota',
        labels: {
          nif: 'NIF (Empresa):',
          birthDate: 'Data Nascimento:',
          licenseDate: 'Data Carta:',
          postalCode: 'Código Postal:',
          vehicles: 'Viaturas:',
          type: 'Tipo:',
          coverages: 'Coberturas:',
          otherRequests: 'Outros pedidos:'
        }
      }
    },
    product_health: {
      seoTitle: 'Seguro de Saúde',
      seoDesc: 'Planos de saúde com rede ampla e assistência 24h.',
      headerTitle: 'Seguro Saúde',
      headerSubtitle: 'Cuide do seu bem-estar com planos flexíveis e ampla cobertura',
      ctaSimulate: 'Simular Seguro Saúde',
      ctaContact: 'Fale com um consultor',
      whyTitle: 'Por que escolher o Seguro Saúde?',
      whyItems: [
        'Acesso a rede ampla de hospitais e clínicas',
        'Descontos em medicamentos e exames',
        'Consultas com especialistas sem burocracia',
        'Internamento hospitalar e cirurgias cobertas'
      ],
      coveragesTitle: 'Coberturas disponíveis',
      coverages: [
        { title: 'Consultas e Exames', desc: 'Cobertura para consultas médicas, exames laboratoriais e de imagem.' },
        { title: 'Internamento Hospitalar', desc: 'Cobertura para despesas de internamento e cirurgias.' },
        { title: 'Medicamentos', desc: 'Descontos e cobertura parcial para medicamentos prescritos.' },
        { title: 'Rede de Clínicas e Hospitais', desc: 'Acesso facilitado a uma rede credenciada de saúde.' }
      ],
      benefitsTitle: 'Vantagens exclusivas',
      benefits: [
        'Gestão digital da apólice e reembolsos',
        'Atendimento 24h para emergências',
        'Planos flexíveis para diferentes perfis',
        'Opção de cobertura para toda a família'
      ],
      howTitle: 'Como contratar?',
      howSteps: [
        'Simule o seu seguro saúde online ou fale com um consultor.',
        'Escolha o plano e coberturas que melhor se adaptam ao seu perfil.',
        'Envie os documentos necessários e finalize a contratação.'
      ]
    },
    product_home: {
      seoTitle: 'Seguro Multirriscos Habitação',
      seoDesc: 'Proteja o seu lar contra imprevistos com coberturas flexíveis.',
      headerTitle: 'Seguro Multirriscos Habitação',
      headerSubtitle: 'Proteja seu lar contra imprevistos e garanta tranquilidade para sua família',
      ctaSimulate: 'Simular Seguro Habitação',
      whyTitle: 'Por que escolher o Multirriscos Habitação?',
      whyItems: [
        'Proteção contra incêndio, inundação, roubo e outros riscos',
        'Assistência 24h para emergências domésticas',
        'Cobertura de responsabilidade civil',
        'Opções flexíveis de franquias e capitais'
      ],
      coveragesTitle: 'Coberturas disponíveis',
      coverages: [
        { title: 'Incêndio, Inundação e Fenómenos Naturais', desc: 'Proteção contra danos causados por fogo, água e eventos naturais.' },
        { title: 'Roubo e Furto', desc: 'Cobertura para bens roubados ou furtados na residência.' },
        { title: 'Responsabilidade Civil', desc: 'Proteção contra danos causados a terceiros.' },
        { title: 'Assistência 24h', desc: 'Serviços de emergência como chaveiro, eletricista e encanador.' }
      ],
      benefitsTitle: 'Vantagens exclusivas',
      benefits: [
        'Gestão digital da apólice e sinistros',
        'Atendimento 24h para emergências',
        'Planos flexíveis para diferentes perfis',
        'Opção de cobertura para toda a família'
      ],
      howTitle: 'Como contratar?',
      howSteps: [
        'Simule o seu seguro habitação online ou fale com um consultor.',
        'Escolha o plano e coberturas que melhor se adaptam ao seu perfil.',
        'Envie os documentos necessários e finalize a contratação.'
      ]
    },
    product_mreb: {
      seoTitle: 'Seguro Multirriscos Empresarial',
      seoDesc: 'Proteja edifícios, equipamentos e mercadorias da sua empresa com coberturas flexíveis.',
      headerTitle: 'Seguro Multirriscos Empresarial',
      headerSubtitle: 'Proteja o património da sua empresa contra imprevistos e garanta a continuidade do seu negócio',
      ctaContact: 'Fale com um consultor',
      whatTitle: 'O que é o Seguro Multirriscos Empresarial?',
      whatDesc: 'O Seguro Multirriscos Empresarial foi desenvolvido para proteger edifícios, equipamentos, mercadorias e outros bens essenciais ao funcionamento da sua empresa, garantindo apoio em situações de sinistro e minimizando prejuízos.',
      whoTitle: 'Para quem é indicado?',
      whoItems: [
        'Empresas de todos os setores e dimensões',
        'Comércios, indústrias e serviços',
        'Proprietários de edifícios comerciais'
      ],
      coveragesTitle: 'Coberturas principais',
      coverages: [
        { title: 'Incêndio, Inundação e Fenómenos Naturais', desc: 'Proteção contra danos causados por fogo, água, tempestades e outros eventos naturais.' },
        { title: 'Roubo e Furto', desc: 'Cobertura para bens e mercadorias em caso de roubo ou furto nas instalações.' },
        { title: 'Responsabilidade Civil', desc: 'Proteção contra danos causados a terceiros no exercício da atividade empresarial.' },
        { title: 'Assistência 24h', desc: 'Serviços de emergência como chaveiro, eletricista e canalizador para situações imprevistas.' }
      ],
      advantagesTitle: 'Vantagens do seguro',
      advantages: [
        'Tranquilidade para gerir o seu negócio',
        'Assistência rápida em situações de emergência',
        'Planos flexíveis e adaptáveis à realidade da empresa',
        'Cobertura para edifícios, equipamentos e mercadorias'
      ],
      howTitle: 'Como contratar?',
      howSteps: [
        'Solicite uma proposta personalizada para a sua empresa.',
        'Escolha as coberturas e capitais que melhor se adaptam ao seu negócio.',
        'Finalize a contratação com o apoio de um consultor especializado.'
      ]
    },
    product_rcp: {
      seoTitle: 'Seguro Responsabilidade Civil Profissional',
      seoDesc: 'Proteção financeira contra reclamações por erros e omissões no exercício profissional. Simule já.',
      headerTitle: 'Seguro Responsabilidade Civil Profissional',
      headerSubtitle: 'Proteja a sua atividade profissional contra reclamações e imprevistos.',
      ctaSimulate: 'Simular seguro responsabilidade civil',
      ctaContact: 'Fale com um consultor',
      whatTitle: 'O que é este seguro?',
      whatDesc: 'O Seguro de Responsabilidade Civil Profissional protege profissionais e empresas contra prejuízos financeiros causados a terceiros, resultantes de erros, omissões ou negligência no exercício da sua atividade.',
      whoTitle: 'Para quem é indicado?',
      whoItems: [
        'Profissionais liberais (advogados, engenheiros, arquitetos, médicos, etc.)',
        'Empresas de consultoria e prestação de serviços',
        'Outros profissionais sujeitos a responsabilidade civil no exercício da sua atividade'
      ],
      coveragesTitle: 'Coberturas principais',
      coverages: [
        { title: 'Erros e Omissões', desc: 'Proteção em caso de danos causados a terceiros por falhas profissionais.' },
        { title: 'Despesas de Defesa', desc: 'Inclui custos legais e honorários de advogados em processos judiciais.' },
        { title: 'Indemnizações', desc: 'Cobre indemnizações devidas a terceiros por danos materiais ou patrimoniais.' },
        { title: 'Proteção da Reputação', desc: 'Apoio em situações que possam afetar a imagem profissional.' }
      ],
      advantagesTitle: 'Vantagens do seguro',
      advantages: [
        'Tranquilidade para exercer a sua profissão',
        'Proteção financeira em caso de reclamações',
        'Processo de contratação simples e rápido',
        'Adaptável a diferentes áreas profissionais'
      ],
      howTitle: 'Como contratar?',
      howSteps: [
        'Solicite uma proposta personalizada para a sua atividade.',
        'Analise as coberturas e escolha as opções que melhor se adaptam ao seu perfil.',
        'Finalize a contratação com o apoio de um consultor especializado.'
      ]
    },
    product_condo: {
      seoTitle: 'Seguro Condomínio',
      seoDesc: 'Proteção completa para edifícios e áreas comuns do seu condomínio. Saiba mais.',
      headerTitle: 'Seguro Condomínio',
      headerSubtitle: 'Proteção completa para edifícios e áreas comuns do seu condomínio',
      ctaSimulate: 'Simular seguro Condomínio',
      ctaContact: 'Fale com um consultor',
      whatTitle: 'O que é o Seguro de Condomínio?',
      whatDesc: 'O Seguro de Condomínio foi pensado para proteger o edifício e as suas partes comuns, cobrindo danos por incêndio, fenómenos naturais, inundações, responsabilidade civil e outras situações que podem afetar a tranquilidade dos condóminos.',
      whoTitle: 'Para quem é indicado?',
      whoItems: [
        'Condomínios residenciais e mistos',
        'Prédios com garagens, arrecadações e espaços comuns',
        'Administrações de condomínio e comissões de condóminos'
      ],
      coveragesTitle: 'Coberturas principais',
      coverages: [
        { title: 'Incêndio, Inundação e Fenómenos Naturais', desc: 'Proteção contra danos causados por fogo, água, tempestades e outros eventos naturais.' },
        { title: 'Responsabilidade Civil do Condomínio', desc: 'Cobertura por danos causados a terceiros nas áreas comuns do edifício.' },
        { title: 'Danos por Água e Quebra de Vidros', desc: 'Proteção para sinistros frequentes que afetam as zonas comuns e fachadas.' },
        { title: 'Assistência 24h', desc: 'Apoio imediato com técnicos especializados para emergências.' }
      ],
      advantagesTitle: 'Vantagens do seguro',
      advantages: [
        'Proteção abrangente das partes comuns do edifício',
        'Segurança para condóminos e visitantes',
        'Coberturas de responsabilidade civil ajustáveis',
        'Assistência técnica 24 horas por dia'
      ],
      howTitle: 'Como contratar?',
      howSteps: [
        'Solicite uma proposta para o seu condomínio.',
        'Escolha as coberturas e capitais de acordo com as necessidades do edifício.',
        'Finalize com o apoio de um consultor especializado.'
      ]
    },
    product_work: {
      seoTitle: 'Seguro Acidentes de Trabalho Empresas',
      seoDesc: 'Proteção obrigatória e assistência completa para colaboradores. Peça a sua proposta.',
      headerTitle: 'Seguro Acidentes de Trabalho Empresas',
      headerSubtitle: 'Proteja os colaboradores da sua empresa com cobertura obrigatória e assistência completa',
      ctaRequest: 'Solicitar proposta',
      ctaContact: 'Fale com um consultor',
      whyTitle: 'Por que escolher o Seguro Acidentes de Trabalho?',
      whyItems: [
        'Cumpre a legislação obrigatória para empresas',
        'Proteção para colaboradores em caso de acidente durante o trabalho',
        'Assistência médica, hospitalar e farmacêutica',
        'Gestão digital de apólice e sinistros'
      ],
      coveragesTitle: 'Coberturas disponíveis',
      coverages: [
        { title: 'Despesas Médicas e Hospitalares', desc: 'Cobertura para tratamentos, consultas, internamentos e medicamentos necessários após acidente de trabalho.' },
        { title: 'Indemnizações por Incapacidade', desc: 'Garantia de indemnização em caso de incapacidade temporária ou permanente do colaborador.' },
        { title: 'Assistência Farmacêutica', desc: 'Cobertura para despesas com medicamentos prescritos após acidente.' },
        { title: 'Gestão de Sinistros', desc: 'Apoio na gestão e acompanhamento dos processos de sinistro.' }
      ],
      advantagesTitle: 'Vantagens exclusivas',
      advantages: [
        'Gestão digital da apólice e sinistros',
        'Atendimento especializado para empresas',
        'Planos ajustáveis conforme o perfil da empresa',
        'Cobertura para todos os colaboradores'
      ],
      howTitle: 'Como contratar?',
      howSteps: [
        'Solicite uma proposta personalizada para a sua empresa.',
        'Escolha as coberturas e capitais que melhor se adaptam ao seu negócio.',
        'Finalize a contratação com o apoio de um consultor especializado.'
      ],
      formTitle: 'Solicitar Proposta - Acidentes de Trabalho'
    },
    products: {
      title: 'Produtos de Seguros — Particulares e Empresas',
      description: 'Conheça todas as soluções: Auto, Vida, Saúde, Habitação, Frota, Acidentes de Trabalho, Multirriscos Empresarial e RC Profissional.',
      heading: 'Os nossos produtos',
      subheading: 'Soluções para particulares e empresas.',
      individuals: 'Particulares',
      business: 'Empresas',
      // cards
      individualsCards: {
        auto: { name: 'Seguro Auto', desc: 'Proteção completa para o seu veículo.', to: 'produto-auto' },
        life: { name: 'Seguro Vida', desc: 'Segurança para si e para a sua família.', to: 'produto-vida' },
        health: { name: 'Seguro Saúde', desc: 'Cuide do seu bem-estar com planos flexíveis.', to: 'produto-saude' },
        home: { name: 'Seguro Multirriscos Habitação', desc: 'Proteja o seu lar contra imprevistos.', to: 'produto-habitacao' },
      },
      businessCards: {
        fleet: { name: 'Seguro Frota', desc: 'Proteção para todos os veículos da empresa.', to: 'produto-frota' },
        work: { name: 'Seguro Acidentes de Trabalho', desc: 'Cobertura para colaboradores em caso de acidente.', to: 'produto-acidentes-trabalho' },
        rcp: { name: 'Seguro Responsabilidade Civil Profissional', desc: 'Proteja a sua atividade contra danos a terceiros.', to: 'produto-responsabilidade-civil-profissional' },
        mreb: { name: 'Seguro Multirriscos Empresarial', desc: 'Cobertura para instalações e bens empresariais.', to: 'produto-multirriscos-empresarial' },
        condo: { name: 'Seguro Condomínio', desc: 'Proteção completa para edifícios e áreas comuns.', to: 'produto-condominio' },
      },
    },
    product_auto: {
      seoTitle: 'Seguro Automóvel',
      seoDesc: 'Proteja o seu veículo com coberturas completas e assistência 24h. Simule e fale com um consultor.',
      headerTitle: 'Seguro Automóvel',
      headerSubtitle: 'Proteja o seu veículo com as melhores coberturas do mercado',
      ctaSimulate: 'Simular Seguro Auto',
      ctaContact: 'Fale com um consultor',
      whyTitle: 'Por que escolher o Seguro Auto?',
      whyItems: [
        'Proteção completa contra danos próprios e a terceiros',
        'Assistência em viagem 24h em Portugal e no estrangeiro',
        'Opções flexíveis de coberturas e franquias',
        'Processo de sinistro simples e rápido',
        'Descontos para condutores experientes e famílias'
      ],
      coveragesTitle: 'Coberturas disponíveis',
      coverages: [
        { title: 'Responsabilidade Civil Obrigatória', desc: 'Cobre danos causados a terceiros, pessoas e bens.' },
        { title: 'Danos Próprios', desc: 'Cobre danos ao seu próprio veículo em caso de acidente, choque, colisão, capotamento, incêndio, furto ou roubo.' },
        { title: 'Proteção Jurídica', desc: 'Assistência legal em caso de litígio relacionado com o veículo.' },
        { title: 'Assistência em Viagem', desc: 'Reboque, transporte, alojamento e outros serviços em caso de avaria ou acidente.' }
      ],
      benefitsTitle: 'Vantagens exclusivas',
      benefits: [
        'Gestão digital de apólice e sinistros',
        'Rede de oficinas recomendadas',
        'Descontos para veículos elétricos e híbridos',
        'Franquias ajustáveis conforme sua necessidade'
      ],
      howTitle: 'Como contratar?',
      howSteps: [
        'Simule o seu seguro auto online ou fale com um consultor.',
        'Escolha as coberturas e franquias que melhor se adaptam ao seu perfil.',
        'Envie os documentos necessários e finalize a contratação.'
      ]
    },
    product_life: {
      seoTitle: 'Seguro de Vida',
      seoDesc: 'Proteção financeira e tranquilidade para si e para a sua família.',
      headerTitle: 'Seguro Vida',
      headerSubtitle: 'Proteção financeira e tranquilidade para você e sua família',
      ctaSimulate: 'Simular seguro Vida',
      ctaContact: 'Fale com um consultor',
      typesTitle: 'Tipos de Seguro Vida',
      types: [
        { title: 'Vida Risco', desc: 'Proteção em caso de morte ou invalidez, garantindo segurança financeira para os beneficiários.' },
        { title: 'Vida Financeiro', desc: 'Acumulação de capital e proteção, ideal para quem deseja poupar e garantir o futuro da família.' },
        { title: 'Vida Misto', desc: 'Combina proteção e poupança, oferecendo cobertura em caso de morte, invalidez e sobrevivência.' }
      ],
      coveragesTitle: 'Coberturas e Benefícios',
      coverages: [
        { title: 'Morte ou Invalidez', desc: 'Proteção financeira para a família em caso de falecimento ou invalidez do segurado.' },
        { title: 'Doenças Graves', desc: 'Cobertura para diagnóstico de doenças graves, garantindo apoio financeiro.' },
        { title: 'Sobrevivência', desc: 'Recebimento de capital ao final do contrato, caso o segurado esteja vivo.' },
        { title: 'Poupança e Investimento', desc: 'Acumulação de capital para projetos futuros, educação ou aposentadoria.' }
      ],
      advantagesTitle: 'Vantagens do Seguro Vida',
      advantages: [
        'Proteção para toda a família',
        'Flexibilidade de coberturas e capitais',
        'Opção de poupança e investimento',
        'Cobertura para doenças graves'
      ],
      howTitle: 'Como contratar?',
      howSteps: [
        'Simule o seu seguro vida online ou fale com um consultor.',
        'Escolha o tipo de seguro e coberturas que melhor se adaptam ao seu perfil.',
        'Envie os documentos necessários e finalize a contratação.'
      ]
    },
    home: {
      heroTitle: 'Seguros em Ansião (Leiria) — Auto, Vida, Saúde e Habitação',
      heroDesc: 'Ansião Seguros: simulações rápidas e propostas personalizadas para Auto, Vida, Saúde, Habitação e soluções para empresas.',
      featuredIndividuals: 'Produtos para pessoas particulares',
      heroSlides: [
        {
          title: 'Simule o seu seguro auto em segundos',
          text: 'Proteção completa para o seu veículo com atendimento personalizado.',
          cta: 'Simule seu seguro auto'
        },
        {
          title: 'Seguro Vida e Saúde',
          text: 'Segurança para você e sua família, com planos flexíveis.',
          cta: 'Simule seguro vida'
        },
        {
          title: 'Seguro Multirriscos Habitação',
          text: 'Proteja seu lar contra imprevistos e garanta tranquilidade.',
          cta: 'Simule seguro multirriscos habitação'
        }
      ],
      productsIndividuals: {
        auto: { name: 'Seguro Auto', desc: 'Proteção completa para seu veículo.' },
        life: { name: 'Seguro Vida', desc: 'Segurança para você e sua família.' },
        health: { name: 'Seguro Saúde', desc: 'Cuide do seu bem-estar.' },
        home: { name: 'Seguro Multirriscos Habitação', desc: 'Proteja seu lar contra imprevistos.' }
      },
      featuredBusiness: 'Produtos para empresas',
      productsBusiness: {
        fleet: { name: 'Seguro Frota', desc: 'Proteção para todos os veículos da empresa.' },
        work: { name: 'Seguro Acidentes de Trabalho', desc: 'Cobertura para colaboradores em caso de acidente.' },
        rcp: { name: 'Seguro Responsabilidade Civil Profissional', desc: 'Proteja sua empresa contra danos a terceiros.' },
        mreb: { name: 'Seguro Multirriscos Empresarial', desc: 'Cobertura para as suas instalações e bens empresariais.' },
        condo: { name: 'Seguro Condomínio', desc: 'Proteção completa para edifícios e áreas comuns.' }
      },
      benefitsTitle: 'Por que escolher a Ansião Seguros?',
      benefits: [
        'Atendimento personalizado e consultoria especializada',
        'Simulação rápida e automática realizada pelos nossos sistemas inteligentes.',
        'Soluções para empresas e famílias',
        'Diversos produtos: auto, vida, saúde, residencial e mais'
      ],
      ctaMore: 'Saiba mais',
      ctaOpen: 'Abrir'
    }
  },
  en: {
    common: {
      brand: 'Ansião Seguros',
      nav: {
        homeLink: 'Home',
        auto: 'Car Quote',
        life: 'Life Quote',
        health: 'Health Quote',
        homeInsurance: 'Home Insurance Quote',
        simulator: 'Quotes',
        products: 'Products',
        contact: 'Contact'
      },
      a11y: {
        switchToEN: 'Switch to English',
        switchToPT: 'Switch to Portuguese',
      },
      chat: {
        title: 'Chat with us',
        subtitle: 'Tell us your request and our consultants will reach out.',
        talkNow: 'Chat now',
        callNow: 'Call now',
        callShort: 'Call',
        close: 'Close',
        namePlaceholder: 'Your name (optional)',
        emailPlaceholder: 'Email (optional)',
        phonePlaceholder: 'Phone (optional)',
        messagePlaceholder: 'Type your message... (Ctrl/⌘+Enter to send)',
        send: 'Send',
        sending: 'Sending…',
        sent: 'Message sent. Thank you!',
        error: 'Failed to send. Please try again.',
        you: 'You',
        agent: 'Agent',
        empty: 'Start by telling us how we can help.',
        whatsappNow: 'WhatsApp',
        whatsPrefill: 'Hello! I would like to chat with Ansião Seguros.'
      }
    },
    sim_saude: {
      title: 'Health Insurance Quote',
      stepProgress: 'Step {{step}} of 2',
      step1Title: '1. Insured persons',
      step2Title: '2. Choose an option',
      placeholders: {
        fullName: 'Full name',
        birthDate: 'Date of birth (dd-mm-yyyy)',
        nif: 'NIF (Tax ID)',
        yourName: 'Your name',
        email: 'Email',
        phone: '9 digits'
      },
      buttons: {
        addInsured: 'Add insured person',
        remove: 'Remove',
        maxReached5: 'Maximum of 5 people reached',
        prev: 'Previous',
        next: 'Next',
  submit: 'Request quote'
      },
      validations: {
        insuredNameRequired: 'Please enter the full name.',
        insuredBirthRequired: 'Please fill in the date of birth.',
        insuredNifRequired: 'Please fill in the 9‑digit NIF.',
        planRequired: 'Please choose one of the plan options.',
        nameRequired: 'Please enter your name.',
        emailRequired: 'Please fill in your email.',
        emailInvalid: 'Please enter a valid email (e.g., name@server.pt).',
        phoneRequired: 'Please fill in the phone number (9 digits).'
      },
      table: {
        coverages: 'Cover',
        option1: 'Option 1',
        option2: 'Option 2',
        option3: 'Option 3',
        included: 'Included',
        notApplicable: '—',
        optional: 'Optional',
        add: 'Add',
        discounts: 'Discounts',
        partial: 'Partial',
        telemedicine: 'Telemedicine'
      },
      benefits: {
        consultas: 'Consultations (approved network)',
        exames: 'Tests and diagnostics',
        ambulatoria: 'Out‑patient care',
        internamento: 'Hospitalisation',
        urgencias: 'Emergency care',
        parto: 'Childbirth and maternity care',
        estomatologia: 'Dental care',
        medicamentos: 'Prescription medicines',
        internacional: 'Travel assistance (international)',
        domicilio: 'Home visit / Telemedicine'
      },
      messages: {
        submitSuccess: 'Request submitted successfully! You will receive further instructions by email.',
        submitError: 'Error sending request. Please try again or contact us.'
      },
      emailSummary: { person: 'Person', name: 'Name:', birth: 'Date of birth:', nif: 'NIF:' },
      backgroundAlt: 'Health Insurance'
    },
    sim_home: {
      title: 'Home Insurance Quote',
      stepProgress: 'Step {{step}} of 3',
      step1Title: '1. Property details',
      step2Title: '2. Personal details',
      step3Title: '3. Product',
      labels: {
        situacao: 'Situation',
        tipoImovel: 'Property type',
        utilizacao: 'Use',
        anoConstrucao: 'Year of construction',
        area: 'Area (m²)',
        codigoPostal: 'Risk postcode',
        construcao: 'Construction type',
        capitalEdificio: 'Buildings sum insured (€)',
        capitalConteudo: 'Contents sum insured (€)',
        seguranca: 'Security systems',
        nomeCompleto: 'Full name',
        email: 'Email',
        telefone: 'Phone',
        nif: 'Portuguese NIF (Tax ID)',
  adicionais: 'Additional cover',
        detalhesAdicionais: 'Additional details',
        capitaisSelecionados: 'Selected sums insured',
        capitalImovel: 'Buildings capital',
        capitalConteudoLabel: 'Contents capital'
      },
      options: {
        selecione: 'Select',
        situacao: { proprietario: 'Owner', inquilino: 'Tenant' },
        tipoImovel: { apartamento: 'Apartment', moradia: 'House' },
        utilizacao: { permanente: 'Primary home', secundaria: 'Secondary home', arrendamento: 'Rental' },
        construcao: { betao: 'Reinforced concrete', alvenaria: 'Masonry (brick/stone)', madeira: 'Wood' },
        seguranca: { alarme: 'Alarm', portaBlindada: 'Security door', cctv: 'CCTV' }
      },
      placeholders: {
        year: 'YYYY',
        area: 'e.g., 120',
        postal: '____-___',
        capEdificio: 'e.g., 150000',
        capConteudo: 'e.g., 25 000',
        yourName: 'Your name',
        email: 'name@server.pt',
        phone: '__ _______',
        nif: '___ ___ ___',
        details: 'Describe any specific needs or desired cover...'
      },
      product: {
        cards: {
          base: { title: 'Buildings', desc: 'Buildings cover with liability, fire/explosion, electrical surge and water damage.' },
          intermedio: { title: 'Buildings + Contents', desc: 'Includes contents cover with liability, fire/explosion, electrical surge and water damage.' },
          completo: { title: 'Buildings + Contents + Seismic Events', desc: 'Extended cover including seismic events, with liability and cover for buildings and contents.' }
        },
        bullets: ['Liability','Fire and explosion','Electrical surge','Water damage','Theft (contents)','Seismic events']
      },
      extras: { earthquake: 'Seismic events', garageVehicles: 'Vehicles kept in a garage' },
  buttons: { prev: 'Previous', next: 'Next', submit: 'Request quote' },
      messages: {
        step1Missing: 'Please fill in all required property fields.',
        atLeastOneCapital: 'Provide at least one capital: building or contents.',
        postalInvalid: 'Invalid postcode. Format XXXX-XXX.',
        yearInvalid: 'Invalid construction year (YYYY).',
        nameRequired: 'Enter your name.',
        emailInvalid: 'Enter a valid email.',
        phoneInvalid: 'Phone must have 9 digits.',
        nifInvalid: 'NIF must have 9 digits.',
        productRequired: 'Select a product.',
        rgpdRequired: 'You must accept the Privacy Policy & GDPR.',
        submitSuccess: 'Request sent successfully! You will receive instructions by email.',
        submitError: 'An error occurred while sending the request. Please try again.'
      }
    },
    sim_vida: {
      title: 'Life Insurance Quote',
      step1Title: '1. Insured persons',
      step2Title: '2. Sums insured',
      step3Title: '3. Disability type',
      insuranceType: {
        individual: 'Individual Life',
        mortgage: 'Mortgage Life'
      },
      placeholders: {
        fullName: 'Full name',
        birthDate: 'Date of birth (dd-mm-yyyy)',
        nif: 'NIF (Tax ID)',
        capital: 'Sum insured',
        prazo: 'Policy term (years)',
        yourName: 'Name',
        email: 'Email',
        phone: 'Phone'
      },
      buttons: {
        addInsured: 'Add insured person',
        remove: 'Remove',
        maxReached: 'Maximum of 2 people reached',
        prev: 'Previous',
        next: 'Next',
        simulate: 'Get quote'
      },
      validations: {
        insuredNameRequired: 'Please enter the full name.',
        insuredBirthRequired: 'Please fill in the date of birth.',
        insuredNifRequired: 'Please fill in the 9‑digit NIF.',
        capitalRequired: 'Please fill in the sum insured.',
        prazoRequired: 'Please fill in the policy term.',
        nameRequired: 'Please enter your full name.',
        emailRequired: 'Please fill in your email.',
        emailInvalid: 'Please enter a valid email (e.g., name@server.pt).',
        phoneRequired: 'Please fill in the phone number (9 digits).'
      },
      disability: {
        label: 'Disability type',
        explanationPrefix: 'Explanation:',
        options: { IAD: 'IAD', ITP: 'ITP' },
        emailLabels: {
          IAD: 'Permanent and absolute disability (IAD)',
          ITP: 'Total and permanent disability (ITP)'
        },
        explanations: {
          IAD: 'Benefit is paid when the insured becomes totally dependent on others for basic daily activities (ADL‑based).',
          ITP: 'Benefit is paid when the insured is unable to perform any gainful occupation, though can perform basic tasks.'
        }
      },
      messages: {
        submitSuccess: 'Request submitted successfully! You will receive further instructions by email.',
        submitError: 'Error sending request. Please try again or contact us.'
      },
      emailSummary: {
        person: 'Person',
        name: 'Name:',
        birth: 'Date of birth:',
        nif: 'NIF:'
      },
      backgroundAlt: 'Family protection plan — Life Insurance'
    },
    sim_auto: {
      title: 'Car Insurance Quote',
      stepProgress: 'Step {{step}} of 3',
      step1Title: 'Step 1 — Driver details',
      step2Title: 'Step 2 — Vehicle details',
      step3Title: 'Step 3 — Product and additional cover',
      placeholders: {
        name: 'Full name',
        email: 'Email',
        birthDate: 'Date of birth (dd-mm-yyyy)',
        licenseDate: 'Driving licence issue date (dd-mm-yyyy)',
        postalCode: 'Postcode (____-___)',
        nif: 'NIF (Tax ID)',
        carBrand: 'Car make',
        carModel: 'Car model',
        carYear: 'Year',
        plate: 'Portuguese registration (XX-XX-XX)',
        otherRequests: 'E.g.: limits, young driver, desired deductibles, notes...'
      },
      validations: {
        under18: 'Only drivers aged 18 or older can proceed.',
        nameFull: 'Please enter your full name (at least two names).',
        emailRequired: 'Please fill in your email.',
        emailInvalid: 'Enter a valid email.',
        postalFormat: 'Postcode must have 7 numeric digits (format XXXX-XXX).',
        postalHelp: 'Please enter the postcode in the format XXXX-XXX with 7 numeric digits.',
        nifInvalid: 'Invalid NIF.',
        nifRequired: 'Enter a valid 9‑digit NIF.',
        plateFormat: 'Please enter the licence plate in the format XX-XX-XX.',
        brandRequired: 'Please fill in the car make.',
        modelRequired: 'Please fill in the car model.',
        yearRequired: 'Please fill in the car year.',
        rgpdRequired: 'You must accept the Privacy Policy & GDPR to proceed.'
      },
      typeLabel: 'Insurance type:',
      typeSelectPlaceholder: 'Select the insurance type',
      typeThirdParty: 'Third party',
      typeOwnDamage: 'Comprehensive',
      typeThirdPartyInfo: 'Third party insurance: covers liability to others (people and property); does not cover damage to your own vehicle.',
      typeOwnDamageInfo: 'Comprehensive insurance: includes damage to your own vehicle, as well as third party liability.',
      baseCoverLabel: 'Core cover:',
      additionalCoverages: 'Additional cover:',
      baseCoversThirdParty: ['Third party liability', 'Legal expenses'],
      baseCoversOwnDamage: ['Accidental damage', 'Theft', 'Fire'],
      coverageLabels: {
        occupants: 'Personal accident (occupants)',
        glass: 'Windscreen cover',
        assistance: 'Roadside assistance',
        fire: 'Fire',
        theft: 'Theft',
        naturalCatastrophes: 'Natural events',
        vandalism: 'Vandalism',
        replacementVehicle: 'Courtesy car'
      },
      buttons: { prev: 'Previous', next: 'Next', simulate: 'Get quote' },
      messages: {
        selectType: 'Please select the insurance type.',
        submitSuccess: 'Quote submitted successfully!\nEmail sent.',
        submitEmailError: 'Quote submitted, but there was an error sending the email.'
      },
      summary: {
        title: 'Quote',
        labels: {
          vehicle: 'Vehicle:',
          nif: 'NIF:',
          birthDate: 'Date of Birth:',
          licenseDate: 'Driving licence issue date:',
          postalCode: 'Postcode:',
          type: 'Type:',
          coverages: 'Cover:',
          otherRequests: 'Other requests:'
        }
      }
    },
    contact: {
      seoTitle: 'Contact',
      seoDesc: 'Get in touch for information requests, ad‑hoc quotes or tailored proposals.',
      pageTitle: 'Get in touch',
  pageSubtitle: 'Send us an information request or an ad‑hoc quote. We’ll reply shortly.',
      placeholders: {
        name: 'Full name',
        email: 'Email',
        phoneOptional: 'Phone (optional)',
        subjectOptional: 'Subject (optional)',
        message: 'Describe your request or question…',
        productInterestOptional: 'Product of interest (optional)'
      },
      requestType: {
        label: 'Request type',
        info: 'Information request',
        adhoc: 'Ad‑hoc quote request',
        contact: 'Callback request',
        other: 'Other'
      },
      productInterest: {
        label: 'Product of interest',
        auto: 'Auto',
        life: 'Life',
        health: 'Health',
        home: 'Home',
        fleet: 'Fleet',
        work: 'Workers’ Compensation',
        mreb: 'Business Multi‑risk',
        rcp: 'Professional Liability',
        other: 'Other'
      },
      labels: {
        contactDataTitle: 'Contact details',
        requestTitle: 'Request',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        requestType: 'Request type',
        productInterest: 'Product of interest',
        subject: 'Subject',
        message: 'Message',
      },
      messages: {
        success: 'Thank you! We’ve received your request and will get back to you shortly.',
        error: 'An error occurred while sending. Please try again.',
        sending: 'Sending…',
        submit: 'Send request'
      },
      map: {
        whereTitle: 'Where we are',
        whereDesc: 'Ansião town, Leiria district.',
        iframeTitle: 'Map of Ansião, Leiria',
        openInMaps: 'Open in Google Maps'
      },
      rgpdText: 'I have read and accept the <0>Privacy Policy & GDPR</0>.',
      validation: {
        nameRequired: 'Please enter your name.',
        emailInvalid: 'Enter a valid email.',
        messageRequired: 'Describe your request.',
        rgpdRequired: 'You must accept the Privacy Policy & GDPR.'
      },
      email: {
        subjectPrefix: 'Contact: ',
        typePrefix: 'General contact',
        typeWithProduct: 'Contact / {{product}}'
      }
    },
    product_fleet: {
      seoTitle: 'Business Fleet Insurance',
      seoDesc: 'Efficient management and comprehensive protection for your company vehicles. Request a tailored proposal.',
      headerTitle: 'Business Fleet Insurance',
      headerSubtitle: 'Efficient management and complete protection for all your company vehicles',
      badge: 'Fidelidade Product',
      ctaRequest: 'Request proposal',
  ctaContact: 'Talk to an adviser',
      whyTitle: 'Why choose Fleet Insurance?',
      whyItems: [
        'Centralised management of all company vehicles',
        'Protection against own damage, third‑party liability and accidents',
        '24/7 assistance across the country',
        'Flexible coverage options and sums insured'
      ],
      coveragesTitle: 'Available coverages',
      coverages: [
        { title: 'Accidental damage', desc: 'Covers damage to fleet vehicles caused by accident, collision, fire, theft or robbery.' },
        { title: 'Third party liability', desc: 'Protection against damage caused to third parties (people and property).' },
        { title: 'Roadside assistance', desc: 'Towing, transport, accommodation and support in case of breakdown or accident.' },
        { title: 'Legal expenses', desc: 'Legal expenses cover in dispute situations related to company vehicles.' }
      ],
      advantagesTitle: 'Exclusive advantages',
      advantages: [
        'Digital management of policy and claims',
        'Specialised support for businesses',
        'Plans tailored to your company profile',
        'Coverage for drivers and employees'
      ],
      howTitle: 'How to get it?',
      howSteps: [
        'Request a tailored proposal for your company.',
        'Choose the cover and sums insured that best suit your fleet.',
        'Send the required documents and complete the purchase with support from an adviser.'
      ],
      formTitle: 'Request Proposal — Fleet',
      stepProgress: 'Step {{step}} of 3',
      step1Title: 'Step 1 — Responsible person details',
      step2Title: 'Step 2 — Vehicle details',
      step3Title: 'Step 3 — Product and additional cover',
      placeholders: {
        name: 'Full name',
        email: 'Email',
        nif: 'NIF (Tax ID)',
        postalCode: 'Postcode (____-___)',
        birthDate: 'Date of birth (dd-mm-yyyy)',
  licenseDate: 'Driving licence issue date (dd-mm-yyyy)',
        carBrand: 'Make',
        carModel: 'Model',
        carYear: 'Year',
        plate: 'XX-XX-XX',
        otherRequests: 'E.g.: per‑vehicle limits, named drivers, desired deductibles, notes...'
      },
      vehicles: { titlePrefix: 'Vehicle #', add: '+ Add vehicle', remove: 'Remove' },
      typeLabel: 'Insurance type:',
      typeSelectPlaceholder: 'Select the insurance type',
  typeThirdParty: 'Third party',
  typeOwnDamage: 'Comprehensive',
  typeThirdPartyInfo: 'Third party insurance: covers liability to others (people and property).',
  typeOwnDamageInfo: 'Comprehensive insurance: includes damage to your vehicles, as well as third party liability.',
  additionalCoverages: 'Additional cover:',
      coverageLabels: {
        occupants: 'Personal accident (occupants)',
        glass: 'Windscreen cover',
        assistance: 'Roadside assistance',
        fire: 'Fire',
        theft: 'Theft',
        naturalCatastrophes: 'Natural events',
        vandalism: 'Vandalism',
        replacementVehicle: 'Courtesy car'
      },
      otherRequestsLabel: 'Other requests / details',
  buttons: { prev: 'Previous', next: 'Next', submit: 'Request quote' },
      rgpdText: 'I have read and accept the <0>Privacy Policy & GDPR</0>.',
      messages: {
        selectType: 'Please select the insurance type.',
        submitSuccess: 'Request sent successfully!',
        submitEmailError: 'Request submitted, but there was an error sending the email.',
        under18: 'Only drivers aged 18 or older can proceed.'
      },
      summary: {
        title: 'Fleet Proposal',
        labels: {
          nif: 'NIF (Company):',
          birthDate: 'Date of Birth:',
          licenseDate: 'Driving Licence Date:',
          postalCode: 'Postcode:',
          vehicles: 'Vehicles:',
          type: 'Type:',
          coverages: 'Coverages:',
          otherRequests: 'Other requests:'
        }
      }
    },
    product_health: {
      seoTitle: 'Health Insurance',
      seoDesc: 'Health plans with a wide network and 24/7 assistance.',
      headerTitle: 'Health Insurance',
      headerSubtitle: 'Take care of your well-being with flexible plans and broad coverage',
      ctaSimulate: 'Get Health Quote',
  ctaContact: 'Talk to an adviser',
      whyTitle: 'Why choose Health Insurance?',
      whyItems: [
        'Access to a wide network of hospitals and clinics',
        'Discounts on medication and exams',
        'Specialist appointments without hassle',
        'Hospitalisation and surgeries covered'
      ],
      coveragesTitle: 'Available coverages',
      coverages: [
        { title: 'Appointments and Exams', desc: 'Coverage for medical appointments, lab tests and imaging.' },
        { title: 'Hospitalisation', desc: 'Coverage for hospital stay expenses and surgeries.' },
        { title: 'Medication', desc: 'Discounts and partial cover for prescribed medicines.' },
        { title: 'Clinics and Hospitals Network', desc: 'Easy access to an accredited health network.' }
      ],
      benefitsTitle: 'Exclusive advantages',
      benefits: [
        'Digital policy and reimbursements management',
        '24/7 emergency support',
        'Flexible plans for different profiles',
        'Family coverage options'
      ],
      howTitle: 'How to get it?',
      howSteps: [
        'Get your health insurance quote online or talk to an advisor.',
        'Choose the plan and cover that best fit your profile.',
        'Send the required documents and complete the purchase.'
      ]
    },
    product_home: {
      seoTitle: 'Home Insurance (Buildings & Contents)',
      seoDesc: 'Protect your home against unforeseen events with flexible cover.',
      headerTitle: 'Home Insurance (Buildings & Contents)',
      headerSubtitle: 'Protect your home against unforeseen events and ensure peace of mind for your family',
      ctaSimulate: 'Get home insurance quote',
      ctaContact: 'Talk to an adviser',
      whyTitle: 'Why choose Home Insurance?',
      whyItems: [
        'Protection against fire, flood, theft and other risks',
        '24/7 assistance for household emergencies',
        'Third‑party liability coverage',
        'Flexible deductibles and sums insured'
      ],
      coveragesTitle: 'Available coverages',
      coverages: [
        { title: 'Fire, flood and natural events', desc: 'Protection against damage caused by fire, water and natural events.' },
        { title: 'Theft and burglary', desc: 'Cover for goods stolen or taken from the residence.' },
        { title: 'Liability', desc: 'Protection against damage caused to third parties.' },
        { title: '24/7 assistance', desc: 'Emergency services such as locksmith, electrician and plumber.' }
      ],
      benefitsTitle: 'Exclusive advantages',
      benefits: [
        'Digital policy and claims management',
        '24/7 emergency support',
        'Flexible plans for different profiles',
        'Family coverage options'
      ],
      howTitle: 'How to get it?',
      howSteps: [
        'Get your home insurance quote online or talk to an adviser.',
        'Choose the plan and cover that best fit your profile.',
        'Send the required documents and complete the purchase.'
      ]
    },
    product_mreb: {
      seoTitle: 'Commercial Multi‑risk Insurance',
      seoDesc: 'Protect your company’s buildings, equipment and goods with flexible cover.',
      headerTitle: 'Commercial Multi‑risk Insurance',
      headerSubtitle: 'Protect your company assets against unforeseen events and ensure business continuity',
      ctaContact: 'Talk to an adviser',
      whatTitle: 'What is Business Multi‑risk Insurance?',
      whatDesc: 'Business Multi‑risk Insurance is designed to protect buildings, equipment, goods and other assets essential to your company’s operations, providing support in the event of a claim and minimising losses.',
      whoTitle: 'Who is it for?',
      whoItems: [
        'Companies of any size and sector',
        'Retail, manufacturing and services',
        'Owners of commercial buildings'
      ],
      coveragesTitle: 'Main coverages',
      coverages: [
        { title: 'Fire, flood and natural events', desc: 'Protection against damage caused by fire, water, storms and other natural events.' },
        { title: 'Theft and burglary', desc: 'Cover for goods and merchandise in case of theft or burglary at the premises.' },
        { title: 'Liability', desc: 'Protection against damage caused to third parties in the course of business activities.' },
        { title: '24/7 assistance', desc: 'Emergency services such as locksmith, electrician and plumber for unforeseen situations.' }
      ],
  advantagesTitle: 'Insurance advantages',
      advantages: [
        'Peace of mind to run your business',
        'Fast assistance in emergencies',
        'Flexible plans tailored to your company',
        'Coverage for buildings, equipment and merchandise'
      ],
      howTitle: 'How to get it?',
      howSteps: [
        'Request a tailored proposal for your company.',
        'Choose the cover and sums insured that best suit your business.',
        'Complete the purchase with support from a specialist adviser.'
      ]
    },
    product_rcp: {
      seoTitle: 'Professional Indemnity Insurance',
      seoDesc: 'Financial protection against claims for errors and omissions in professional practice. Get a quote now.',
      headerTitle: 'Professional Indemnity Insurance',
      headerSubtitle: 'Protect your professional activity against claims and unforeseen events.',
      ctaSimulate: 'Get professional indemnity quote',
      ctaContact: 'Talk to an adviser',
      whatTitle: 'What is this insurance?',
      whatDesc: 'Professional indemnity insurance protects professionals and companies against financial losses caused to third parties as a result of errors, omissions or negligence in the course of their activity.',
      whoTitle: 'Who is it for?',
      whoItems: [
        'Liberal professionals (lawyers, engineers, architects, doctors, etc.)',
        'Consulting and service companies',
        'Other professionals exposed to liability in their activity'
      ],
      coveragesTitle: 'Main coverages',
      coverages: [
        { title: 'Errors and omissions', desc: 'Protection in case of damage caused to third parties due to professional failures.' },
        { title: 'Defence costs', desc: 'Includes legal costs and solicitors’ fees in court proceedings.' },
        { title: 'Indemnities', desc: 'Cover for indemnities owed to third parties for material or financial loss.' },
        { title: 'Reputation protection', desc: 'Support in situations that may affect professional reputation.' }
      ],
      advantagesTitle: 'Insurance advantages',
      advantages: [
        'Peace of mind to practice your profession',
        'Financial protection in case of claims',
        'Simple and fast purchase process',
        'Adaptable to different professional areas'
      ],
      howTitle: 'How to get it?',
      howSteps: [
        'Request a tailored proposal for your activity.',
        'Review the cover and choose the options that best suit your profile.',
        'Complete the purchase with support from a specialist adviser.'
      ]
    },
    product_condo: {
      seoTitle: 'Condominium Insurance',
      seoDesc: 'Comprehensive protection for buildings and shared areas in your condominium. Learn more.',
      headerTitle: 'Condominium Insurance',
      headerSubtitle: 'Complete protection for your building and common areas',
      ctaSimulate: 'Get condo quote',
  ctaContact: 'Talk to an adviser',
      whatTitle: 'What is Condominium Insurance?',
      whatDesc: 'Condominium Insurance is designed to protect the building and its common parts, covering damage from fire, natural events, flooding, liability and other situations that can affect residents’ peace of mind.',
      whoTitle: 'Who is it for?',
      whoItems: [
        'Residential and mixed‑use condominiums',
        'Buildings with garages, storage and shared spaces',
        'Condo management companies and owners’ committees'
      ],
      coveragesTitle: 'Main coverages',
      coverages: [
        { title: 'Fire, flood and natural events', desc: 'Protection against damage caused by fire, water, storms and other natural events.' },
        { title: 'Condominium liability', desc: 'Cover for damage caused to third parties in the building’s common areas.' },
        { title: 'Water damage and glass breakage', desc: 'Protection for frequent incidents affecting common areas and facades.' },
        { title: '24/7 assistance', desc: 'Immediate support from specialised technicians for emergencies.' }
      ],
      advantagesTitle: 'Insurance advantages',
      advantages: [
        'Comprehensive protection of common parts of the building',
        'Safety for residents and visitors',
        'Adjustable liability coverages',
        '24‑hour technical assistance'
      ],
      howTitle: 'How to get it?',
      howSteps: [
        'Request a proposal for your condominium.',
        'Choose the cover and sums insured according to the building’s needs.',
        'Complete with the support of a specialist adviser.'
      ]
    },
    product_work: {
      seoTitle: 'Occupational Accidents Insurance (Companies)',
      seoDesc: 'Mandatory protection and comprehensive assistance for employees. Request your proposal.',
      headerTitle: 'Occupational Accidents Insurance (Companies)',
      headerSubtitle: 'Protect your employees with mandatory coverage and comprehensive assistance',
      ctaRequest: 'Request proposal',
      ctaContact: 'Talk to an adviser',
      whyTitle: 'Why choose Occupational Accidents insurance?',
      whyItems: [
        'Complies with mandatory legislation for companies',
        'Protection for employees in case of accidents at work',
        'Medical, hospital and pharmaceutical assistance',
        'Digital policy and claims management'
      ],
      coveragesTitle: 'Available coverages',
      coverages: [
        { title: 'Medical and hospital expenses', desc: 'Cover for treatments, appointments, hospitalisation and medication after a workplace accident.' },
        { title: 'Disability compensation', desc: 'Indemnity in case of temporary or permanent disability of the employee.' },
        { title: 'Pharmaceutical assistance', desc: 'Cover for expenses with prescribed medicines after an accident.' },
        { title: 'Claims management', desc: 'Support in managing and following up claims processes.' }
      ],
      advantagesTitle: 'Exclusive advantages',
      advantages: [
        'Digital policy and claims management',
        'Specialised support for companies',
        'Plans adjustable to your company profile',
        'Coverage for all employees'
      ],
      howTitle: 'How to get it?',
      howSteps: [
        'Request a tailored proposal for your company.',
        'Choose the cover and sums insured that best suit your business.',
        'Complete the purchase with the support of a specialist adviser.'
      ],
      formTitle: 'Request Proposal — Workers’ Compensation'
    },
    products: {
      title: 'Insurance Products — Individuals and Businesses',
      description: 'Explore our solutions: Auto, Life, Health, Home, Fleet, Workers’ Comp, Business Multi-risk and Professional Liability.',
      heading: 'Our products',
      subheading: 'Solutions for individuals and businesses.',
      individuals: 'Individuals',
      business: 'Businesses',
      individualsCards: {
        auto: { name: 'Car Insurance', desc: 'Comprehensive protection for your vehicle.', to: 'produto-auto' },
        life: { name: 'Life Insurance', desc: 'Security for you and your family.', to: 'produto-vida' },
        health: { name: 'Health Insurance', desc: 'Take care of your well-being with flexible plans.', to: 'produto-saude' },
        home: { name: 'Home Insurance (Buildings & Contents)', desc: 'Protect your home against unforeseen events.', to: 'produto-habitacao' },
      },
      businessCards: {
        fleet: { name: 'Fleet Insurance', desc: 'Protection for all company vehicles.', to: 'produto-frota' },
        work: { name: 'Occupational Accidents', desc: 'Cover for employees in case of accidents.', to: 'produto-acidentes-trabalho' },
        rcp: { name: 'Professional Indemnity', desc: 'Protect your activity against third‑party damage.', to: 'produto-responsabilidade-civil-profissional' },
        mreb: { name: 'Commercial Multi‑risk', desc: 'Cover for facilities and business assets.', to: 'produto-multirriscos-empresarial' },
        condo: { name: 'Condominium Insurance', desc: 'Complete protection for buildings and common areas.', to: 'produto-condominio' },
      },
    },
    product_auto: {
      seoTitle: 'Car Insurance',
      seoDesc: 'Protect your vehicle with comprehensive cover and 24/7 assistance. Get a quote and talk to an advisor.',
      headerTitle: 'Car Insurance',
      headerSubtitle: 'Protect your vehicle with the best coverages on the market',
      ctaSimulate: 'Get Auto Quote',
  ctaContact: 'Talk to an adviser',
      whyTitle: 'Why choose Car Insurance?',
      whyItems: [
        'Comprehensive protection against own damage and third‑party liability',
        '24/7 roadside assistance in Portugal and abroad',
        'Flexible coverage and deductible options',
        'Simple and fast claims process',
        'Discounts for experienced drivers and families'
      ],
      coveragesTitle: 'Available coverages',
      coverages: [
        { title: 'Mandatory third party liability', desc: 'Covers damage caused to third parties (people and property).'},
        { title: 'Accidental damage (Comprehensive)', desc: 'Includes damage to your vehicle in case of accident, impact, collision, rollover, fire, theft or robbery.' },
        { title: 'Legal expenses', desc: 'Legal expenses cover in case of disputes related to the vehicle.' },
        { title: 'Roadside assistance', desc: 'Towing, transport, accommodation and other services in case of breakdown or accident.' }
      ],
      benefitsTitle: 'Exclusive advantages',
      benefits: [
        'Digital policy and claims management',
        'Network of recommended repair shops',
        'Discounts for electric and hybrid vehicles',
        'Adjustable deductibles to suit your needs'
      ],
      howTitle: 'How to get it?',
      howSteps: [
        'Get your auto quote online or talk to an adviser.',
        'Choose the cover and deductibles that best fit your profile.',
        'Send the required documents and complete the purchase.'
      ]
    },
    product_life: {
      seoTitle: 'Life Insurance',
      seoDesc: 'Financial protection and peace of mind for you and your family.',
      headerTitle: 'Life Insurance',
      headerSubtitle: 'Financial protection and peace of mind for you and your family',
      ctaSimulate: 'Get Life Quote',
  ctaContact: 'Talk to an adviser',
      typesTitle: 'Types of Life Insurance',
      types: [
        { title: 'Term Life', desc: 'Protection in case of death or disability, ensuring financial security for beneficiaries.' },
        { title: 'Savings Life', desc: 'Capital accumulation and protection—ideal for saving and securing your family’s future.' },
        { title: 'Mixed Life', desc: 'Combines protection and savings, offering coverage for death, disability and survival.' }
      ],
      coveragesTitle: 'Coverages and Benefits',
      coverages: [
        { title: 'Death or Disability', desc: 'Financial protection for the family in case of the insured’s death or disability.' },
        { title: 'Critical Illness', desc: 'Coverage for diagnosis of critical illnesses, ensuring financial support.' },
        { title: 'Survival', desc: 'Payment of capital at the end of the policy term if the insured is alive.' },
        { title: 'Savings and Investment', desc: 'Capital accumulation for future projects, education or retirement.' }
      ],
      advantagesTitle: 'Life Insurance Advantages',
      advantages: [
        'Protection for the whole family',
        'Flexible cover and sums insured',
        'Savings and investment option',
        'Coverage for critical illnesses'
      ],
      howTitle: 'How to get it?',
      howSteps: [
        'Get your life insurance quote online or talk to an advisor.',
        'Choose the type and cover that best fit your profile.',
        'Send the required documents and complete the purchase.'
      ]
    },
    home: {
      heroTitle: 'Insurance in Ansião (Leiria) — Auto, Life, Health and Home',
      heroDesc: 'Ansião Seguros: fast quotes and tailored proposals for Auto, Life, Health, Home and business solutions.',
      featuredIndividuals: 'Products for individuals',
      heroSlides: [
        {
          title: 'Get your car insurance quote in seconds',
          text: 'Comprehensive protection for your vehicle with personalised service.',
          cta: 'Get car insurance quote'
        },
        {
          title: 'Life and Health Insurance',
          text: 'Security for you and your family, with flexible plans.',
          cta: 'Get life insurance quote'
        },
        {
          title: 'Home Insurance (Buildings & Contents)',
          text: 'Protect your home against unforeseen events and ensure peace of mind.',
          cta: 'Get home insurance quote'
        }
      ],
      productsIndividuals: {
        auto: { name: 'Car Insurance', desc: 'Comprehensive protection for your vehicle.' },
        life: { name: 'Life Insurance', desc: 'Security for you and your family.' },
        health: { name: 'Health Insurance', desc: 'Take care of your well-being.' },
        home: { name: 'Home Multi-risk', desc: 'Protect your home against unforeseen events.' }
      },
      featuredBusiness: 'Products for businesses',
      productsBusiness: {
        fleet: { name: 'Fleet Insurance', desc: 'Protection for all company vehicles.' },
        work: { name: 'Workers’ Compensation', desc: 'Coverage for employees in case of accidents.' },
        rcp: { name: 'Professional Liability', desc: 'Protect your company against third-party damage.' },
        mreb: { name: 'Business Multi-risk', desc: 'Coverage for your facilities and business assets.' },
        condo: { name: 'Condominium Insurance', desc: 'Complete protection for buildings and common areas.' }
      },
      benefitsTitle: 'Why choose Ansião Seguros?',
      benefits: [
        'Personalized service and expert consulting',
        'Fast, automated quotes powered by our intelligent systems.',
        'Solutions for businesses and families',
        'Wide range of products: auto, life, health, home and more'
      ],
      ctaMore: 'Learn more',
      ctaOpen: 'Open'
    }
  }
};

const baseUrl = (import.meta as any)?.env?.BASE_URL || '/';
const pathIndex = baseUrl === '/' ? 0 : 1;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    supportedLngs: ['pt', 'en'],
  ns: ['common', 'home', 'products', 'product_auto', 'product_life', 'product_health', 'product_home', 'product_mreb', 'product_rcp', 'product_condo', 'product_work', 'product_fleet', 'contact', 'sim_auto', 'sim_vida', 'sim_saude', 'sim_home'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: {
      order: ['path', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupFromPathIndex: pathIndex,
    },
  });

export default i18n;
