import React from 'react';
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
      <>
        <div className="home-header">
          <br></br>
          <h1><span className="carbon">Welcome to Carbon</span><span className="track">Track</span></h1>
          <br></br>
        </div>
        <div className="home-challenge-container">
          <h2>Steering Energy Efficiency for Homeowners and Policymakers</h2>
          <h3>The Challenge</h3>
          <br></br>
          <p>Amid rising energy demands, residential buildings significantly contribute to CO2 emissions. Many homes,
            especially older constructions, are not energy efficient.
            <br></br>
            <br></br>
            Homeowners face the challenge of understanding and
            undertaking the retrofitting process to improve their homes&apos; energy performance. The lack of clear,
            accessible information on where to begin, what improvements will have the most impact, and how to balance
            the investment against the expected benefits adds layers of complexity. Moreover, deciphering the
            technical aspects of Building Energy Ratings (BER) and understanding which retrofits will offer
            significant improvements can be daunting. This lack of clarity can lead to indecision, delayed action, and
            missed opportunities for both cost savings and environmental impact.
            <br></br>
            <br></br>
            For policymakers, the challenge lies in effectively scaling retrofitting efforts to meet climate action
            targets. They must prioritize initiatives across diverse residential landscapes, allocate grants and
            subsidies judiciously, and measure the impact of these policies. Policymakers are often tasked with the
            herculean job of streamlining processes to support homeowners&apos; retrofitting projects while ensuring
            transparency and fairness. They must also bridge the gap between policy goals and tangible actions,
            facilitating homeowners in navigating through available assistance and retrofitting pathways, all while
            operating within budget constraints and tight timelines.
          </p>
        </div>
        <div className="solution-container">
          <div className="homeowner-container">
            <h3>For the homeowner: A practical guide to a Home Energy Upgrade</h3>
            <p>Discover how you can improve your home&apos;s Building Energy Rating (BER) by analysing your home&apos;s
              current energy usage and recommending targeted improvements. These targeted improvements range from
              insulating walls
              to upgrading windows, and also include installing solar PV panels or a heatpump. The platform outlines
              estimated costs and
              grant opportunities tailored to your home. It leverages machine learning to forecast potential energy
              savings.</p>
            <div>
              <button type="button" className="homeowner-button" onClick={handleBerRatingClick}>Homeowners: Learn How to
                Improve Your BER Rating
              </button>
            </div>
          </div>
          <div className="policy-container">
            <h3>For local council officials: Strategic Insights for Decision-making</h3>
            <p>The platform visualises the energy status of home per county, tracks the progress of retrofits and grant
              allocations. It pinpoints the number of homes needing attention. It&apos;s a strategic asset in
              accelerating
              the retrofitting initiative, aiming to streamline decision-making and optimise resource allocation.</p>
            <div>
              <button type="button" className="policy-button" onClick={handlePolicyInsightsClick}>For Policymakers:
                Start
                Here
              </button>
            </div>
          </div>
        </div>
      </>
  );
};

export default Home;
