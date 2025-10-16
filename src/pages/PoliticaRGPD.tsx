import React from "react";
import Seo from "../components/Seo";

export default function PoliticaRGPD() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center py-12 px-4">
      <Seo title="Política de Privacidade & RGPD" canonicalPath="/politica-rgpd" noIndex />
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-6 text-center">Política de Privacidade e Proteção de Dados (RGPD)</h1>
        <p className="mb-4 text-lg text-gray-700">
          A Ansião Seguros está comprometida com a proteção dos seus dados pessoais, cumprindo rigorosamente o Regulamento Geral sobre a Proteção de Dados (RGPD) da União Europeia e a legislação portuguesa aplicável.
        </p>
        <h2 className="text-2xl font-bold text-blue-800 mt-8 mb-2">1. Responsabilidade e Finalidade</h2>
        <p className="mb-4 text-gray-700">
          Os seus dados são recolhidos exclusivamente para fins de prestação de serviços de mediação de seguros, gestão de contratos, simulações, apoio ao cliente e cumprimento de obrigações legais. Apenas recolhemos os dados estritamente necessários e nunca partilhamos com terceiros sem o seu consentimento, exceto quando exigido por lei.
        </p>
        <h2 className="text-2xl font-bold text-blue-800 mt-8 mb-2">2. Direitos dos Titulares</h2>
        <ul className="list-disc pl-6 mb-4 text-gray-700">
          <li>Acesso, retificação, atualização ou eliminação dos seus dados pessoais;</li>
          <li>Oposição ao tratamento ou portabilidade dos dados;</li>
          <li>Direito a retirar o consentimento a qualquer momento;</li>
          <li>Direito a apresentar reclamação à CNPD.</li>
        </ul>
        <h2 className="text-2xl font-bold text-blue-800 mt-8 mb-2">3. Segurança e Confidencialidade</h2>
        <p className="mb-4 text-gray-700">
          Utilizamos medidas técnicas e organizativas adequadas para garantir a segurança, confidencialidade e integridade dos seus dados, prevenindo acessos não autorizados, perda ou divulgação indevida.
        </p>
        <h2 className="text-2xl font-bold text-blue-800 mt-8 mb-2">4. Conservação dos Dados</h2>
        <p className="mb-4 text-gray-700">
          Os dados pessoais são conservados apenas pelo período necessário ao cumprimento das finalidades para que foram recolhidos, respeitando os prazos legais aplicáveis.
        </p>
        <h2 className="text-2xl font-bold text-blue-800 mt-8 mb-2">5. Contacto</h2>
        <p className="mb-4 text-gray-700">
          Para qualquer questão relacionada com a proteção de dados, pode contactar-nos através do email <a href="mailto:rgpd@ansiaoseguros.pt" className="text-blue-700 underline">rgpd@ansiaoseguros.pt</a>.
        </p>
        <h2 className="text-2xl font-bold text-blue-800 mt-8 mb-2">6. Atualizações</h2>
        <p className="mb-4 text-gray-700">
          Esta política pode ser atualizada periodicamente para refletir alterações legais ou operacionais. Recomendamos a consulta regular desta página.
        </p>
      </div>
    </div>
  );
}
