import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: 'What is CarbonTrack?',
      answer: 'CarbonTrack is a web application designed to help households reduce their carbon footprint through AI-generated suggestions and interactive tools.'
    },
    {
      question: 'How can I use CarbonTrack?',
      answer: 'Users can monitor their daily activities, get personalized suggestions for sustainable living, and access features like a carbon footprint calculator and a product scanner.'
    },
    {
      question: 'Is CarbonTrack free to use?',
      answer: 'Yes, CarbonTrack is a free platform aimed at promoting eco-friendly lifestyles and sustainability.'
    }
    // Add more FAQs here
  ];

  return (
        <div className="faq">
            <h1>Frequently Asked Questions</h1>
            {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                </div>
            ))}
        </div>
  );
};

export default FAQ;
