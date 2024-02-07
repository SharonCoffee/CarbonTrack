import React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';

const About = () => {
  return (
      <Container>
        <Header as='h1' textAlign='center' style={{ margin: '20px 0' }}>
          About CarbonTrack
        </Header>
        <Segment>
          <Header as='h2'>Our Mission</Header>
          <p>
            Our mission at CarbonTrack is to accelerate the transition to sustainable living by empowering individuals and policymakers with actionable insights into energy efficiency. We believe in a world where every household contributes to the global effort of reducing carbon emissions, one BerRating improvement at a time.
          </p>

          <Header as='h2'>Our Vision</Header>
          <p>
            We envision a future where energy efficiency and sustainability are not just aspirations but realities for all. Through advanced analytics and user-friendly tools, CarbonTrack aims to demystify the complexities surrounding BerRatings and energy improvements, making sustainable living accessible to everyone.
          </p>

          <Header as='h2'>Why BerRatings?</Header>
          <p>
            Building Energy Ratings (BerRatings) serve as a key indicator of a property&apos;s energy performance. By focusing on BerRatings, we provide a clear and measurable pathway for homeowners and building managers to enhance their energy efficiency. This not only leads to cost savings but also significantly reduces the environmental impact of our communities.
          </p>

          <Header as='h2'>Our Team</Header>
          <p>
            Behind CarbonTrack is a team of passionate environmentalists, data scientists, and software developers committed to making a difference. We&apos;re driven by the challenge of climate change and motivated by the potential of technology to inspire and enact real change.
          </p>

          <Header as='h2'>Join Us</Header>
          <p>
            We&apos;re on a mission to make sustainable living a standard, not an exception. If you share our passion for the environment and believe in the power of technology to drive change, we invite you to join us. Together, we can create a more sustainable future for the next generation.
          </p>
        </Segment>
      </Container>
  );
};

export default About;
