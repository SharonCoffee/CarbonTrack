import React from 'react';
import { Container, Header, Segment, Button } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleBerRatingClick = () => {
    if (currentUser) {
      navigate('/berRatingForm'); // Navigate to BerRatingForm if logged in
    } else {
      navigate('/login'); // Navigate to login page if not logged in
    }
  };

  const handlePolicyInsightsClick = () => {
    if (currentUser) {
      navigate('/policyinsights'); // Navigate to Countymap page
    } else {
      navigate('/login'); // Navigate to login page if not logged in
    }
  };

  return (
      <Container>
        <Header as='h1' textAlign='center' style={{ margin: '20px 0' }}>
          Welcome to CarbonTrack
        </Header>
        <Segment>
          <Header as='h2'>Empowering Sustainable Living</Header>
          <p>
            At CarbonTrack, our mission is to empower households and policymakers with the knowledge and tools needed to make informed decisions about energy efficiency and sustainability. We understand the importance of reducing carbon footprints and improving the energy performance of our homes and communities.
          </p>
          <p>
            Our platform provides detailed insights into the Building Energy Ratings (BerRatings) of properties, offering valuable information on how households can improve their energy efficiency. By focusing on BerRatings, we help you understand the current energy performance of your property and outline practical steps to enhance it, leading to reduced energy consumption, lower utility bills, and a smaller environmental impact.
          </p>

          <Header as='h2'>A Tool for Positive Change</Header>
          <p>
            For policymakers, CarbonTrack serves as a crucial tool in identifying properties that would benefit most from retrofitting efforts. By analyzing BerRatings across regions, we can target interventions more effectively, ensuring resources are directed where they can make the most significant difference in improving energy efficiency and sustainability.
          </p>
          <p>
            Together, we can work towards a future where every home is energy-efficient, environmentally friendly, and a contributor to the fight against climate change. Join us in making a difference, one property at a time.
          </p>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button primary size='large' onClick={handleBerRatingClick}>
              Learn How to Improve Your BerRating
            </Button>
            <Button secondary size='large' onClick={handlePolicyInsightsClick}>
              For Policymakers: Start Here
            </Button>
          </div>
        </Segment>
      </Container>
  );
};

export default Home;
