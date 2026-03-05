import { useState } from "react";
import {
  FaChevronRight,
  FaChevronDown,
  FaQuestionCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="w-full max-w-none sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
      <div
        className="flex justify-between items-center ring ring-white ring-offset-2 ring-offset-slate-50 dark:ring-offset-white font-medium rounded-lg border transition-all duration-300 py-3 sm:py-4 px-4 sm:px-6 cursor-pointer transform hover:scale-[1.01] hover:shadow-md bg-white"
        onClick={onToggle}
      >
        <h2 className="text-sm sm:text-base md:text-lg font-semibold pr-3 sm:pr-4 leading-relaxed flex-1 text-gray-800">
          {question}
        </h2>
        <div className="flex-shrink-0">
          <div
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-90" : ""
            }`}
          >
            {isOpen ? (
              <FaChevronDown className="text-sm sm:text-base md:text-lg text-blue-600" />
            ) : (
              <FaChevronRight className="text-sm sm:text-base md:text-lg text-gray-500" />
            )}
          </div>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white text-gray-700 px-4 sm:px-6 py-4 sm:py-5 rounded-b-xl shadow-lg border-l-4 border-blue-600 mx-1">
          <div
            className={`transition-all duration-300 ${
              isOpen ? "translate-y-0" : "translate-y-2"
            }`}
          >
            <p className="leading-relaxed text-sm sm:text-base">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Comment puis-je passer une commande ?",
      answer:
        "Vous pouvez commander directement sur notre site web ou nous envoyer un message via WhatsApp. Il vous suffit de choisir votre produit, de remplir vos informations de livraison, et nous vous contacterons pour confirmer.",
    },
    {
      question: "Quels sont les délais et frais de livraison ?",
      answer:
        "La livraison est GRATUITE à Agadir et ses environs. Pour les autres villes du Maroc, les frais varient selon le poids et la destination. Le délai moyen est de 24 à 48 heures.",
    },
    {
      question: "Puis-je payer à la livraison ?",
      answer:
        "Oui, nous acceptons le paiement en espèces à la livraison (Cash on Delivery) partout au Maroc. Vous ne payez que lorsque vous recevez et vérifiez votre produit.",
    },
    {
      question: "Les produits sont-ils couverts par une garantie ?",
      answer:
        "Absolument. Tous nos appareils (TV, Réfrigérateurs, Machines à laver, etc.) bénéficient d'une garantie constructeur officielle de 12 à 24 mois selon la marque.",
    },
    {
      question: "Les produits sont-ils originaux ?",
      answer:
        "Oui, Galaxy Digital s'engage à ne vendre que des produits 100% originaux et neufs dans leur emballage d'origine. Nous travaillons directement avec les plus grandes marques.",
    },
    {
      question: "Que faire en cas de problème avec mon appareil ?",
      answer:
        "Notre service après-vente est basé à Agadir. En cas de souci, contactez notre support technique via WhatsApp ou par téléphone, et nous organiserons l'intervention nécessaire.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center justify-center ">
      <div className="w-full max-w-7xl mx-auto">
        {/* En-tête de la section */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="flex justify-center items-center gap-2 sm:gap-3 mb-4 sm:mb-6 tracking-tighter">
            <div className="hidden sm:block">
              <FaQuestionCircle className="text-2xl sm:text-3xl md:text-4xl text-blue-600" />
            </div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-800 pb-2">
              Questions Fréquemment Posées
            </h1>
          </div>
          <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-lg md:max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            Tout ce que vous devez savoir sur Galaxy Digital et comment nous 
            facilitons l'achat de vos équipements électroménagers au Maroc.
          </p>
        </div>

        {/* Conteneur des éléments FAQ */}
        <div className="flex flex-col lg:flex-row lg:gap-12 xl:gap-16 items-start justify-center">
          {/* Liste des questions */}
          <div className="w-full lg:w-2/3 xl:w-3/5 space-y-4 sm:space-y-6">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => toggleFAQ(index)}
              />
            ))}
          </div>

          {/* Panneau latéral - Desktop */}
          <div className="hidden lg:block lg:w-1/3 xl:w-2/5 mt-8 lg:mt-0">
            <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaQuestionCircle className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Besoin d'aide ?
                </h3>
                <p className="text-gray-600 text-sm">
                  Vous ne trouvez pas la réponse à votre question ? Notre équipe est là pour vous aider !
                </p>
              </div>

              <div className="space-y-4">
                <a 
                  href="https://wa.me/212608936659" 
                  target="_blank"
                  className="w-full bg-blue-600 text-center block text-white py-3 px-4 cursor-pointer rounded-lg font-bold hover:bg-blue-700 transition-colors duration-200"
                >
                  Contacter le support
                </a>
                <Link 
                  to="/boutique"
                  className="w-full border-2 border-blue-600 text-blue-600 text-center block py-3 px-4 rounded-lg font-bold hover:bg-blue-50 transition-all duration-200"
                >
                  Voir les produits
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Réponse moyenne : moins de 2 heures</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Mobile */}
        <div className="lg:hidden mt-8 sm:mt-12 text-center">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Besoin d'aide supplémentaire ?
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Contactez-nous directement sur WhatsApp pour une réponse rapide.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="https://wa.me/212608936659"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-bold transition-colors duration-200 text-sm"
              >
                WhatsApp
              </a>
              <Link
                to="/contact"
                className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-4 rounded-lg font-bold transition-all duration-200 text-sm"
              >
                Contact direct
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;