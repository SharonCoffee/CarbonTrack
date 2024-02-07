import React from 'react';
import { Container, Header, Accordion } from 'semantic-ui-react';

const faqData = [
  {
    title: 'What is a BerRating?',
    content: 'A BerRating, or Building Energy Rating, is a standardized rating for the energy efficiency of a property. It helps property owners understand how energy-efficient their property is on a scale from A (most efficient) to G (least efficient). Improving your BerRating can lead to reduced energy bills, lower carbon emissions, and improved property value.'
  },
  {
    title: 'How can I improve my property\'s BerRating?',
    content: 'Improving your property\'s BerRating can be achieved through various measures, such as enhancing insulation, upgrading heating systems, installing energy-efficient windows, and more. CarbonTrack provides insights and recommendations tailored to your property to help you make informed decisions on improvements.'
  },
  {
    title: 'Is CarbonTrack free to use?',
    content: 'Yes, CarbonTrack is currently free to use for individual homeowners looking to improve their BerRatings. Our goal is to empower as many people as possible to make their homes more energy-efficient and sustainable.'
  },
  {
    title: 'How does CarbonTrack help policymakers?',
    content: 'CarbonTrack assists policymakers by providing aggregated data on the energy efficiency of properties within their jurisdiction. This information can be instrumental in identifying areas with low BerRatings, enabling targeted retrofitting programs and policies to improve overall energy efficiency.'
  },
  {
    title: 'Can I use CarbonTrack if I\'m not in the process of selling my home?',
    content: 'Absolutely! While BerRatings are often associated with the sale of properties, improving your home\'s energy efficiency is beneficial at any time. It not only contributes to a more sustainable environment but also can significantly reduce your energy costs.'
  }
];

const FAQ = () => {
  const panels = faqData.map((faq, idx) => ({
    key: `panel-${idx}`,
    title: faq.title,
    content: { content: faq.content }
  }));

  return (
      <Container>
        <Header as='h1' textAlign='center' style={{ margin: '20px 0' }}>
          Frequently Asked Questions
        </Header>
        <Accordion defaultActiveIndex={0} panels={panels} fluid styled />
      </Container>
  );
};

export default FAQ;
