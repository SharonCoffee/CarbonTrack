import React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';

const About = () => {
  return (
      <Container>
        <Header as='h1' className="about-header" textAlign='center'>
          About CarbonTrack
        </Header>
        <Segment>
          <Header as='h2'>Our Mission</Header>
          <p>
            At CarbonTrack, we&apos;re committed to accelerating the transition to sustainable living. We empower homeowners and policymakers with actionable insights to improve energy efficiency and reduce carbon footprints. Join us in transforming households into eco-friendly spaces, one BerRating at a time.
          </p>

          <Header as='h2'>Our Vision</Header>
          <p>
            We see a future where energy efficiency is the norm. CarbonTrack leverages advanced analytics and user-friendly interfaces to simplify BerRatings and energy improvement processes, making sustainable living achievable for everyone.
          </p>

          <Header as='h2'>Why BerRatings?</Header>
          <p>
            Building Energy Ratings (BerRatings) are essential in measuring a property&apos;s energy performance. With CarbonTrack, enhance your property&apos;s efficiency through clear, actionable steps. Save on costs and minimize environmental impacts, starting with your BerRating.
          </p>

          <Header as='h2'>Our Team</Header>
          <p>
            Our diverse team of environmental enthusiasts, data scientists, and tech innovators are at the heart of CarbonTrack. We are united by the urgent need to combat climate change and the belief in technology&apos;s power to foster significant environmental progress.
          </p>

          <Header as='h2'>Join Us</Header>
          <p>
            CarbonTrack is more than a platform; it&apos;s a movement towards sustainable living standards. We invite you to be part of this transformative journey. Whether you&apos;re looking to improve your home&apos;s energy efficiency or contribute to a larger cause, your journey towards a sustainable future starts here.
          </p>

          <p>
            Explore how CarbonTrack can guide you through the process of improving your BerRating and making your home more energy-efficient. Click <a href="/BerRatingForm">here</a> to begin your journey to sustainability.
          </p>
        </Segment>
      </Container>
  );
};

export default About;
