import React, { useState } from 'react';

const faqData = [
  {
    title: 'What is BER?',
    content: 'A Building Energy Rating (BER), is a standardised rating for the energy efficiency of a property. It helps property owners understand how energy-efficient their property is on a scale from A (most efficient) to G (least efficient). Improving your BER can lead to reduced energy bills, lower carbon emissions, and improved property value.'
  },
  {
    title: 'How can I improve my property\'s BER?',
    content: 'Improving your property\'s BER can be achieved through various measures, such as installing/replacing insulation, upgrading heating systems, installing energy-efficient windows, and more. CarbonTrack provides insights and recommendations tailored to your property to help you make informed decisions on improvements.'
  },
  {
    title: 'Is CarbonTrack free to use?',
    content: 'Yes, CarbonTrack is currently free to use for individual homeowners looking to improve their BER. Our goal is to empower as many people as possible to make their homes more energy-efficient and sustainable.'
  },
  {
    title: 'How does CarbonTrack help policymakers?',
    content: 'CarbonTrack assists policymakers by providing aggregated data on the energy efficiency of properties within their jurisdiction. This information can be instrumental in identifying areas with low BER, enabling targeted retrofitting programs and policies to improve overall energy efficiency.'
  },
  {
    title: 'Can I use CarbonTrack if I\'m not in the process of selling my home?',
    content: 'Absolutely! While BER certificates are often associated with the sale or renting of properties, improving your home\'s energy efficiency is beneficial at any time. It not only contributes to a more sustainable environment but also can significantly reduce your energy costs.'
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
      <div className="faq-container">
        <h2>Frequently Asked Questions</h2>
        <p>Click on a question below to view the answer.</p>
        {faqData.map((faq, index) => (
            <div key={index} className="faq-item">
              <div
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
              >
                {faq.title} {/* Corrected from faq.question to faq.title */}
              </div>
              {activeIndex === index && (
                  <div className="faq-answer">
                    {faq.content} {/* Corrected from faq.answer to faq.content */}
                  </div>
              )}
            </div>
        ))}
      </div>
  );
};

export default FAQ;
