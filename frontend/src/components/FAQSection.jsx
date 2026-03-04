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
        <h2 className="text-sm sm:text-base md:text-lg font-semibold pr-3 sm:pr-4 leading-relaxed flex-1">
          {question}
        </h2>
        <div className="flex-shrink-0">
          <div
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-90" : ""
            }`}
          >
            {isOpen ? (
              <FaChevronDown className="text-sm sm:text-base md:text-lg text-primary" />
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
        <div className="bg-white text-gray-700 px-4 sm:px-6 py-4 sm:py-5 rounded-b-xl shadow-lg border-l-4 border-primary mx-1">
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
      question: "How can I book an appointment?",
      answer:
        "You can book an appointment easily through our website by visiting the appointment page. Select the department, choose your preferred doctor, pick an available time slot, and your appointment will be confirmed instantly.",
    },
    {
      question: "Can I create an account to access my medical records?",
      answer:
        "Yes, ShifaHMS allows you to create a personal account where you can track your appointments, view test results, access prescriptions, and review your bills.",
    },
    {
      question: "Does the system support emergency services?",
      answer:
        "Yes, our platform provides 24/7 access to emergency contact information. You can also check real-time emergency room status and priority levels.",
    },
    {
      question: "Can I access my lab test results online?",
      answer:
        "Absolutely. Once you log into your account, you can view and download all your lab reports as soon as they are uploaded by the laboratory team.",
    },
    {
      question: "Is my medical information secure?",
      answer:
        "Yes, we use advanced encryption and security protocols to ensure your data stays private. ShifaHMS follows international health information security standards.",
    },
    {
      question: "How can I contact the hospital?",
      answer:
        "You can easily reach us through the Contact Us page, where you will find our phone number, email address, and location map. You can also send a direct support message.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center justify-center ">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="flex justify-center items-center gap-2 sm:gap-3 mb-4 sm:mb-6 tracking-tighter">
            <div className="hidden sm:block">
              <FaQuestionCircle className="text-2xl sm:text-3xl md:text-4xl text-black" />
            </div>
            <h1 className="text-xl md:text-3xl font-[500] text-[#404040] pb-2">
              Frequently Asked Questions
            </h1>
          </div>
          <p className="text-[#606060] opacity-75 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-lg md:max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            Everything you need to know about Shifa and how we&apos;re making
            remote work accessible for everyone.
          </p>
        </div>

        {/* FAQ Items Container */}
        <div className="flex flex-col lg:flex-row lg:gap-12 xl:gap-16 items-start justify-center">
          {/* FAQ Items */}
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

          {/* Side Panel - Hidden on mobile, visible on large screens */}
          <div className="hidden lg:block lg:w-1/3 xl:w-2/5 mt-8 lg:mt-0">
            <div className="sticky top-8 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaQuestionCircle className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Need More Help?
                </h3>
                <p className="text-gray-600 text-sm">
                  Can&apos;t find what you&apos;re looking for? We&apos;re here
                  to help!
                </p>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-primary  text-white py-3 px-4 cursor-pointer rounded-lg font-medium transition-colors duration-200">
                  Contact Support
                </button>
                <button className="w-full border-2 border-primary text-primary cursor-pointer py-3 px-4 rounded-lg font-medium transition-all duration-200">
                  Browse Shifa
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Average response time: 2 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile CTA Section */}
        <div className="lg:hidden mt-8 sm:mt-12 text-center">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Need More Help?
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Can&apos;t find what you&apos;re looking for?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to={"/contact"}
                className="flex-1 bg-primary hover:bg-[#5a4de6] text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 text-sm"
              >
                Contact Support
              </Link>
              <Link
                to={"/FindJob"}
                className="flex-1 border-2 border-primary text-primary hover:bg-primary/80 hover:text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 text-sm"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
