import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Papa from 'papaparse';

function SuggestionsPage () {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const location = useLocation();

  const selectedProperty = location.state ? location.state.selectedProperty : null;
  const selectedDwellingType = useState('');
  const [newEnergyRating, setNewEnergyRating] = useState('');
  const [selectClass, setSelectClass] = useState('');
  const [archetypeData, setArchetypeData] = useState([]);
  const [seaiGrants, setSeaiGrants] = useState([]);
  const [selectedUValues, setSelectedUValues] = useState({});
  const [wallInsulationQuantity, setWallInsulationQuantity] = useState(selectedProperty ? selectedProperty.WallArea : 0);
  const [roofInsulationQuantity, setRoofInsulationQuantity] = useState(selectedProperty ? selectedProperty.RoofArea : 0);
  const [floorInsulationQuantity, setFloorInsulationQuantity] = useState(selectedProperty ? selectedProperty.FloorArea : 0);
  const [windowQuantity, setWindowQuantity] = useState(1);
  const [BackDoorQuantity, setBackDoorQuantity] = useState(1);
  const [FrontDoorQuantity, setFrontDoorQuantity] = useState(1);
  const [totalEstimatedCost, setTotalEstimatedCost] = useState(0);
  const [totalGrant, setTotalGrant] = useState(0);
  const [totalCostToHomeowner, setTotalCostToHomeowner] = useState(0);

  const availableRatings = selectedProperty && ['A1', 'A2', 'A3', 'B1', 'B2'].filter(rating => rating !== selectedProperty.EnergyRating && rating < selectedProperty.EnergyRating);

  const [thresholdValues, setThresholdValues] = useState({
    wall: 0, // Default values, will be updated dynamically
    roof: 0,
    floor: 0,
    window: 0,
    door: 0
  });

  const [improvementCosts, setImprovementCosts] = useState({
    WallCavityInsulation: 0, // initial values
    WallInternalInsulation: 0,
    WallExternalInsulation: 0,
    AtticInsulation: 0,
    RafterInsulation: 0,
    FloorInsulation: 0,
    WindowReplacement: 0,
    BackDoorReplacement: 0,
    FrontDoorReplacement: 0
    // other initial values
  });

  const [availableGrants, setAvailableGrants] = useState({
    WallCavityGrant: 0, // initial values
    WallInternalGrant: 0,
    WallExternalGrant: 0,
    AtticGrant: 0,
    RafterGrant: 0,
    FloorGrant: 0,
    WindowGrant: 0,
    BackDoorGrant: 0,
    FrontDoorGrant: 0
    // other initial values
  });

  const handleUValueChange = (e, field) => {
    setSelectedUValues({ ...selectedUValues, [field]: e.target.checked });
  };

  const submitNewUValues = () => {
    // Logic to calculate predicted results based on new U-values
    console.log('New U-Values submitted:', selectedUValues);
    // You might want to set some results state here based on the new U-values
  };

  const submitNewEnergyRating = () => {
    // Logic to calculate predicted results based on new U-values
    console.log('New U-Values submitted:', selectedUValues);
    // You might want to set some results state here based on the new U-values
  };

  const handleCheckboxChange = (e, improvementType, cost, recalculatedGrantValue) => {
    // Convert recalculatedGrantValue to a number, in case it's provided as a string
    const recalculatedGrant = parseFloat(recalculatedGrantValue);

    if (e.target.checked) {
      // When checking the checkbox
      setTotalEstimatedCost(prevTotal => prevTotal + cost);
      setTotalGrant(prevTotal => Math.min(prevTotal + recalculatedGrant, totalEstimatedCost * 0.5)); // Adjusted for 50% cap if needed
      setTotalCostToHomeowner(prevTotal => prevTotal + Math.max(0, cost - recalculatedGrant));
    } else {
      // When unchecking the checkbox
      setTotalEstimatedCost(prevTotal => Math.max(0, prevTotal - cost));
      setTotalGrant(prevTotal => Math.max(0, prevTotal - recalculatedGrant));
      setTotalCostToHomeowner(prevTotal => Math.max(0, prevTotal - Math.max(0, cost - recalculatedGrant)));
    }
  };

  useEffect(() => {
    // Scrolls the window to the top of the new page
    window.scrollTo(0, 0);

    // Set the initial wall insulation quantity based on the selected property
    if (selectedProperty && selectedProperty.WallArea) {
      setWallInsulationQuantity(selectedProperty.WallArea);
    }

    // Set the initial roof insulation quantity based on the selected property
    if (selectedProperty && selectedProperty.RoofArea) {
      setRoofInsulationQuantity(selectedProperty.RoofArea);
    }

    // Set the initial floor insulation quantity based on the selected property
    if (selectedProperty && selectedProperty.FloorArea) {
      setFloorInsulationQuantity(selectedProperty.FloorArea);
    }

    // Define a function to fetch and parse the SEAI grants data
    const fetchSEAIgrants = async () => {
      const response = await fetch('/data/seai_grants.csv');
      const text = await response.text();
      return Papa.parse(text, { header: true, dynamicTyping: true }).data;
    };

    // Define a function to fetch and parse the building archetype data
    const fetchArchetypeData = async () => {
      const response = await fetch('/data/data_building_archetype.csv');
      const text = await response.text();
      return Papa.parse(text, { header: true, dynamicTyping: true }).data;
    };

    // Use Promise.all to fetch both datasets concurrently
    Promise.all([fetchSEAIgrants(), fetchArchetypeData()]).then(([seaiGrantsData, archetypeData]) => {
      setSeaiGrants(seaiGrantsData);
      setArchetypeData(archetypeData);

      // Assuming selectedDwellingType holds type like 'Semi-detached house'
      const dwellingType = selectedProperty ? selectedProperty.DwellingTypeDescr : '';
      const newRating = newEnergyRating;

      // Find matching row for new energy rating and dwelling type from archetype data
      const matchedRow = archetypeData.find(row => row.DwellingType === dwellingType && row.EnergyRating === newRating);

      // If a matching row is found, update the threshold values
      if (matchedRow) {
        setThresholdValues({
          wall: matchedRow.UValueWallMean,
          roof: matchedRow.UValueRoofMean,
          floor: matchedRow.UValueFloorMean,
          window: matchedRow.UValueWindowMean,
          door: matchedRow.UValueDoorMean
        });
      }

      // Update improvement costs and available grants based on SEAI grants data and dwelling type
      const updatedImprovementCosts = { ...improvementCosts };
      const updatedAvailableGrants = { ...availableGrants };

      seaiGrantsData.forEach(grant => {
        console.log(grant); // To check what's in each grant entry
        if (grant.DwellingTypes === dwellingType) {
          switch (grant.GrantName) { // Use 'GrantName' as in your CSV
            case 'Cavity wall insulation': // Use the exact name from your CSV
              updatedImprovementCosts.WallCavityInsulation = grant.EstimatedImprovementCost;
              updatedAvailableGrants.WallCavityGrant = grant.GrantValue;
              break;
            case 'Internal Insulation (Dry Lining)': // Use the exact name from your CSV
              updatedImprovementCosts.WallInternalInsulation = grant.EstimatedImprovementCost;
              updatedAvailableGrants.WallInternalGrant = grant.GrantValue;
              break;
            case 'External Wall Insulation (The Wrap)': // Use the exact name from your CSV
              updatedImprovementCosts.WallExternalInsulation = grant.EstimatedImprovementCost;
              updatedAvailableGrants.WallExternalGrant = grant.GrantValue;
              break;
            case 'Attic insulation': // Use the exact name from your CSV
              updatedImprovementCosts.AtticInsulation = grant.EstimatedImprovementCost;
              updatedAvailableGrants.AtticGrant = grant.GrantValue;
              break;
            case 'Rafter insulation': // Use the exact name from your CSV
              updatedImprovementCosts.RafterInsulation = grant.EstimatedImprovementCost;
              updatedAvailableGrants.RafterGrant = grant.GrantValue;
              break;
            case 'Floor Insulation': // Use the exact name from your CSV
              updatedImprovementCosts.FloorInsulation = grant.EstimatedImprovementCost;
              updatedAvailableGrants.FloorGrant = grant.GrantValue;
              break;
            case 'Windows (Complete Upgrade)': // Use the exact name from your CSV
              updatedImprovementCosts.WindowReplacement = grant.EstimatedImprovementCost;
              updatedAvailableGrants.WindowGrant = grant.GrantValue;
              break;
            case 'External Back door': // Use the exact name from your CSV
              updatedImprovementCosts.BackDoorReplacement = grant.EstimatedImprovementCost;
              updatedAvailableGrants.BackDoorGrant = grant.GrantValue;
              break;
            case 'External Front door': // Use the exact name from your CSV
              updatedImprovementCosts.FrontDoorReplacement = grant.EstimatedImprovementCost;
              updatedAvailableGrants.FrontDoorGrant = grant.GrantValue;
              break;

              // Add cases for other types of insulation or improvements
          }
        }
      });

      setImprovementCosts(updatedImprovementCosts);
      setAvailableGrants(updatedAvailableGrants);
    });
  }, [selectedProperty, newEnergyRating]); // Ensure useEffect is triggered when these values change

  // Display the selected property and inputs for modifying U-values
  return (
      <>
        <div>
          <h1>Selected Property Details</h1>
          {selectedProperty && (
              <div className="properties-container">
                <table className="properties-table">
                  <thead>
                  <tr>
                    <th>Property ID</th>
                    <th>Dwelling Type</th>
                    <th>Year of Construction</th>
                    <th>Energy Rating</th>
                    <th>BER Rating</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>{selectedProperty.PropertyID}</td>
                    <td>{selectedProperty.DwellingTypeDescr}</td>
                    <td>{selectedProperty.Year_of_Construction}</td>
                    <td>{selectedProperty.EnergyRating}</td>
                    <td>{selectedProperty.BerRating}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
          )}
        </div>
        <div className="return-button-container">
          <button
              type="button"
              className="button-blue return-to-form"
              onClick={() => navigate('/BerRatingForm')} // Adjust the path as necessary
          >
            Start New Property Search
          </button>
        </div>
        <div className="new-energy-rating-container">
          <h2>Select new energy rating category to compare your existing U-Values</h2>
          <p>
            Choosing a new energy rating category for your home is a proactive step towards improving your living
            environment and reducing your energy bills.
            A higher energy rating category means that your home is more energy-efficient, meaning that your home
            retains more heat and uses less energy to maintain a comfortable temperature.
            This not only improves comfort, but also reduces the need for excessive heating or cooling, leading to lower
            energy bills and a reduced carbon footprint.
            Select a new energy rating category to compare your existing U-Values with the recommended U-Values for the
            selected energy rating category.
            Any discrepancies between the existing and recommended U-Values will be highlighted.
            If your existing U-Values are higher than the recommended U-Values, these will be highlighted in red,
            indicating areas where improvements can be made to improve the energy efficiency of your home.
            You can then explore the potential improvements that can be made to your home to achieve the selected energy
            rating category, with the potential grants you can receive.
            If your existing U-Values are lower than the recommended U-Values, these will be highlighted in green,
            indicating areas where your home already meets or exceeds the energy efficiency requirements for the
            selected energy rating category.
            This may mean that your home could require some additional improvements, as other factors such as
            air tightness and ventilation also play a role in determining the energy rating of your home.
            Thus, it may be necessary to select a different energy rating category to see how your existing U-Values
            compare.
          </p>
          <select
              value={newEnergyRating}
              onChange={e => {
                setNewEnergyRating(e.target.value);
                // Update the selectClass state based on the selected rating
                const newSelectClass = e.target.value.startsWith('A') ? 'a-rating' : e.target.value.startsWith('B') ? 'b-rating' : '';
                setSelectClass(newSelectClass);
              }}
              className={`energy-rating-select ${selectClass}`}
          >
            <option value="">Select New Energy Rating</option>
            {availableRatings && availableRatings.map(rating => (
                <option key={rating} value={rating}>{rating}</option>
            ))}
          </select>

          <button onClick={submitNewEnergyRating} className="button-blue">Submit</button>
        </div>
        <div className="u-values-table-container">
          <h2>Target U-Values vs Existing U-Values for {newEnergyRating} Energy Rating Category</h2>
          <p>
            If your existing U-Values are highlighted in red, it is recommended to improve them by retrofitting your
            property.
            If your existing U-Values are highlighted in green, your property already meets or exceeds the energy
            efficiency requirements for the selected energy rating category.
            If your existing U-Values are highlighted in amber, your property meets the minimum standard, but
            improvements could still be beneficial.
          </p>
          <table className="u-values-table">
            <thead>
            <tr>
              <th>U-Value Types</th>
              <th>Target U-Values</th>
              <th>Existing U-Values</th>
              <th>Description</th>
              <th>Select U-Values for Retrofitting</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <th>Walls UValue</th>
              <td>{thresholdValues.wall}</td>
              <td className={`value-cell ${selectedProperty.UValueWall > thresholdValues.wall ? 'u-value-high' : selectedProperty.UValueWall < thresholdValues.wall ? 'u-value-low' : 'u-value-medium'}`}>
                {selectedProperty.UValueWall}
              </td>
              <td className={`${selectedProperty.UValueWall > thresholdValues.wall ? 'u-value-high' : selectedProperty.UValueWall < thresholdValues.wall ? 'u-value-low' : 'u-value-medium'}`}>
                {selectedProperty.UValueWall > thresholdValues.wall
                  ? 'Your walls are not holding heat well. Consider upgrading insulation.'
                  : selectedProperty.UValueWall < thresholdValues.wall
                    ? 'Your walls are well insulated against heat loss.'
                    : 'Your walls meet the minimum standard, but improvements could still be beneficial.'}
              </td>
              <td>
                <button type="button" className="button-blue"
                        onClick={() => handleUValueChange({ target: { checked: !selectedUValues.UValueWall } }, 'UValueWall')}>
                  {selectedUValues.UValueWall ? 'Deselect' : 'Select'}
                </button>
              </td>
            </tr>
            <tr>
              <th>Roof UValue</th>
              <td>{thresholdValues.roof}</td>
              <td className={`value-cell ${selectedProperty.UValueRoof > thresholdValues.roof ? 'u-value-high' : selectedProperty.UValueRoof < thresholdValues.roof ? 'u-value-low' : 'u-value-medium'}`}>
                {selectedProperty.UValueRoof}
              </td>
              <td className={`${selectedProperty.UValueRoof > thresholdValues.roof ? 'u-value-high' : selectedProperty.UValueRoof < thresholdValues.roof ? 'u-value-low' : 'u-value-medium'}`}>
                {selectedProperty.UValueRoof > thresholdValues.roof
                  ? 'Heat is escaping through your roof. Consider upgrading insulation.'
                  : selectedProperty.UValueRoof < thresholdValues.roof
                    ? 'Your roof is well insulated against heat loss.'
                    : 'Your roof meets the minimum standard, but improvements could still be beneficial.'}
              </td>
              <td>
                <button type="button" className="button-blue"
                        onClick={() => handleUValueChange({ target: { checked: !selectedUValues.UValueRoof } }, 'UValueRoof')}>
                  {selectedUValues.UValueRoof ? 'Deselect' : 'Select'}
                </button>
              </td>
            </tr>
            <tr>
              <th>Floors UValue</th>
              <td>{thresholdValues.floor}</td>
              <td className={`value-cell ${selectedProperty.UValueFloor > thresholdValues.floor ? 'u-value-high' : selectedProperty.UValueFloor < thresholdValues.floor ? 'u-value-low' : 'u-value-medium'}`}>
                {selectedProperty.UValueFloor}
              </td>
              <td className={`${selectedProperty.UValueFloor > thresholdValues.floor ? 'u-value-high' : selectedProperty.UValueFloor < thresholdValues.floor ? 'u-value-low' : 'u-value-medium'}`}>
                {selectedProperty.UValueFloor > thresholdValues.floor
                  ? 'Your floors are losing heat, consider improving insulation.'
                  : selectedProperty.UValueFloor < thresholdValues.floor
                    ? 'Your floors are retaining heat efficiently.'
                    : 'Your floors meet the standard, but consider enhancements for better warmth.'}
              </td>
              <td>
                <button type="button" className="button-blue"
                        onClick={() => handleUValueChange({ target: { checked: !selectedUValues.UValueFloor } }, 'UValueFloor')}>
                  {selectedUValues.UValueFloor ? 'Deselect' : 'Select'}
                </button>
              </td>
            </tr>
            <tr>
              <th>Windows UValue</th>
              <td>{thresholdValues.window}</td>
              <td className={`value-cell ${selectedProperty.UValueWindow > thresholdValues.window ? 'u-value-high' : selectedProperty.UValueWindow < thresholdValues.window ? 'u-value-low' : 'u-value-medium'}`}>
                {selectedProperty.UValueWindow}
              </td>
              <td className={`${selectedProperty.UValueWindow > thresholdValues.window ? 'u-value-high' : selectedProperty.UValueWindow < thresholdValues.window ? 'u-value-low' : 'u-value-medium'}`}>
                {selectedProperty.UValueWindow > thresholdValues.window
                  ? 'Your windows are not keeping heat in effectively. Consider updating them.'
                  : selectedProperty.UValueWindow < thresholdValues.window
                    ? 'Your windows are performing well in retaining heat.'
                    : 'Your windows are adequate, but newer models could offer more savings.'}
              </td>
              <td>
                <button type="button" className="button-blue"
                        onClick={() => handleUValueChange({ target: { checked: !selectedUValues.UValueWindow } }, 'UValueWindow')}>
                  {selectedUValues.UValueWindow ? 'Deselect' : 'Select'}
                </button>
              </td>
            </tr>
            <tr>
              <th>Doors UValue</th>
              <td>{thresholdValues.door}</td>
              <td className={`value-cell ${selectedProperty.UvalueDoor > thresholdValues.door ? 'u-value-high' : selectedProperty.UvalueDoor < thresholdValues.door ? 'u-value-low' : 'u-value-medium'}`}>
                {selectedProperty.UvalueDoor}
              </td>
              <td className={`${selectedProperty.UvalueDoor > thresholdValues.door ? 'u-value-high' : selectedProperty.UvalueDoor < thresholdValues.door ? 'u-value-low' : 'u-value-medium'}`}>
                {selectedProperty.UvalueDoor > thresholdValues.door
                  ? 'Your doors are not insulating well. Consider replacements or sealing gaps.'
                  : selectedProperty.UvalueDoor < thresholdValues.door
                    ? 'Your doors are well-sealed and insulated.'
                    : 'Your doors meet the current standard, yet there might be room for improvement.'}
              </td>
              <td>
                <button type="button" className="button-blue"
                        onClick={() => handleUValueChange({ target: { checked: !selectedUValues.UvalueDoor } }, 'UvalueDoor')}>
                  {selectedUValues.UvalueDoor ? 'Deselect' : 'Select'}
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div className="optional-table-container">
          <h2>Select optional items to install</h2>
          <table className="optional-table">
            <thead>
            <tr>
              <th>Other Improvements</th>
              <th>Select</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Solar Panels</td>
              <td>
                <button type="button" className="button-blue"
                        onClick={() => handleUValueChange({ target: { checked: !selectedUValues.SolarPanels } }, 'SolarPanels')}>
                  {selectedUValues.SolarPanels ? 'Deselect' : 'Select'}
                </button>
              </td>
            </tr>
            <tr>
              <td>Heat Pump</td>
              <td>
                <button type="button" className="button-blue"
                        onClick={() => handleUValueChange({ target: { checked: !selectedUValues.HeatPump } }, 'HeatPump')}>
                  {selectedUValues.HeatPump ? 'Deselect' : 'Select'}
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div className="improvements-table-container">
          <h2>Improvement Estimates for {selectedProperty.DwellingTypeDescr}</h2>
          <p>
            Based on the selected improvements, the estimated costs and potential grants are displayed below.
            The estimated costs are based on the average costs for each improvement, while the potential grants
            are based on the SEAI grants available for each improvement.
            The total estimated cost and potential grants are also displayed.
            The estimated savings are based on the energy savings from the improvements and the potential grants
            received.
          </p>
          <table className="improvements-table">
            <thead>
            <tr>
              <th>Improvement</th>
              <th>Quantity</th>
              <th>Estimated Works Cost</th>
              <th>Maximum Available SEAI Grant*</th>
              <th>Recalculated SEAI Grant</th>
              <th>Estimated Cost to Homeowner</th>
              <th>Select items to apply for grants</th>
            </tr>
            </thead>
            <tbody>
            {selectedUValues.UValueWall && (
                <>
                  <tr>
                    <td>Cavity Wall Insulation</td>
                    <td>{wallInsulationQuantity} m²</td>
                    <td>€{(improvementCosts.WallCavityInsulation * wallInsulationQuantity).toFixed(2)}</td>
                    <td>€{availableGrants.WallCavityGrant}*</td>
                    <td>€{Math.min(availableGrants.WallCavityGrant, (improvementCosts.WallCavityInsulation * wallInsulationQuantity) / 2 || 0).toFixed(2)}</td>
                    <td>€{Math.max(0, (improvementCosts.WallCavityInsulation * wallInsulationQuantity) - Math.min(availableGrants.WallCavityGrant, (improvementCosts.WallCavityInsulation * wallInsulationQuantity) / 2) || 0).toFixed(2)}</td>
                    <td>
                      <div className="checkbox-container">
                        <input type="checkbox" id="applyCavityWallInsulation" name="applyCavityWallInsulationGrant"
                               onChange={(e) => handleCheckboxChange(e,
                                 'WallCavityInsulation',
                                 improvementCosts.WallCavityInsulation * wallInsulationQuantity,
                                 Math.min(availableGrants.WallCavityGrant, (improvementCosts.WallCavityInsulation * wallInsulationQuantity) / 2 || 0)
                               )}/>
                        <label htmlFor="applyCavityWallInsulation">Select</label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Internal Wall Insulation</td>
                    <td>{wallInsulationQuantity} m²</td>
                    <td>€{(improvementCosts.WallInternalInsulation * wallInsulationQuantity).toFixed(2)}</td>
                    <td>€{availableGrants.WallInternalGrant}*</td>
                    <td>€{Math.min(availableGrants.WallInternalGrant, (improvementCosts.WallInternalInsulation * wallInsulationQuantity) / 2 || 0).toFixed(2)}</td>
                    <td>€{Math.max(0, (improvementCosts.WallInternalInsulation * wallInsulationQuantity) - Math.min(availableGrants.WallInternalGrant, (improvementCosts.WallInternalInsulation * wallInsulationQuantity) / 2) || 0).toFixed(2)}</td>
                    <td>
                      <div className="checkbox-container">
                        <input type="checkbox" id="applyInternalWallInsulation" name="applyInternalWallInsulationGrant"
                                 onChange={(e) => handleCheckboxChange(e,
                                   'WallInternalInsulation',
                                   improvementCosts.WallInternalInsulation * wallInsulationQuantity,
                                   Math.min(availableGrants.WallInternalGrant, (improvementCosts.WallInternalInsulation * wallInsulationQuantity) / 2 || 0)
                                 )}/>
                        <label htmlFor="applyInternalWallInsulation">Select</label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>External Wall Insulation</td>
                    <td>{wallInsulationQuantity} m²</td>
                    <td>€{(improvementCosts.WallExternalInsulation * wallInsulationQuantity).toFixed(2)}</td>
                    <td>€{availableGrants.WallExternalGrant}*</td>
                    <td>€{Math.min(availableGrants.WallExternalGrant, (improvementCosts.WallExternalInsulation * wallInsulationQuantity) / 2 || 0).toFixed(2)}</td>
                    <td>€{Math.max(0, (improvementCosts.WallExternalInsulation * wallInsulationQuantity) - Math.min(availableGrants.WallExternalGrant, (improvementCosts.WallExternalInsulation * wallInsulationQuantity) / 2) || 0).toFixed(2)}</td>
                    <td>
                      <div className="checkbox-container">
                        <input type="checkbox" id="applyExternalWallInsulation" name="applyExternalWallInsulationGrant"
                               onChange={(e) => handleCheckboxChange(e,
                                 'WallExternalInsulation',
                                 improvementCosts.WallExternalInsulation * wallInsulationQuantity,
                                 Math.min(availableGrants.WallExternalGrant, (improvementCosts.WallExternalInsulation * wallInsulationQuantity) / 2 || 0)
                               )}/>
                        <label htmlFor="applyExternalWallInsulation">Select</label>
                      </div>
                    </td>

                  </tr>
                </>
            )}
            {selectedUValues.UValueRoof && (
                <>
                  <tr>
                    <td>Attic Insulation</td>
                    <td>{roofInsulationQuantity} m²</td>
                    <td>€{(improvementCosts.AtticInsulation * roofInsulationQuantity).toFixed(2)}</td>
                    <td>€{availableGrants.AtticGrant}*</td>
                    <td>€{Math.min(availableGrants.AtticGrant, (improvementCosts.AtticInsulation * roofInsulationQuantity) / 2 || 0).toFixed(2)}</td>
                    <td>€{Math.max(0, (improvementCosts.AtticInsulation * roofInsulationQuantity) - Math.min(availableGrants.AtticGrant, (improvementCosts.AtticInsulation * roofInsulationQuantity) / 2) || 0).toFixed(2)}</td>
                    <td>
                      <div className="checkbox-container">
                        <input type="checkbox" id="applyAtticInsulation" name="applyAtticInsulationGrant"
                               onChange={(e) => handleCheckboxChange(e,
                                 'AtticInsulation',
                                 improvementCosts.AtticInsulation * roofInsulationQuantity,
                                 Math.min(availableGrants.AtticGrant, (improvementCosts.AtticInsulation * roofInsulationQuantity) / 2 || 0)
                               )}/>
                        <label htmlFor="applyAtticInsulation">Select</label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Rafter Insulation</td>
                    <td>{roofInsulationQuantity} m²</td>
                    <td>€{(improvementCosts.RafterInsulation * roofInsulationQuantity).toFixed(2)}</td>
                    <td>€{availableGrants.RafterGrant}*</td>
                    <td>€{Math.min(availableGrants.RafterGrant, (improvementCosts.RafterInsulation * roofInsulationQuantity) / 2 || 0).toFixed(2)}</td>
                    <td>€{Math.max(0, (improvementCosts.RafterInsulation * roofInsulationQuantity) - Math.min(availableGrants.RafterGrant, (improvementCosts.RafterInsulation * roofInsulationQuantity) / 2) || 0).toFixed(2)}</td>
                    <td>
                      <div className="checkbox-container">
                        <input type="checkbox" id="applyRafterInsulation" name="applyRafterInsulationGrant"
                               onChange={(e) => handleCheckboxChange(e,
                                 'RafterInsulation',
                                 improvementCosts.RafterInsulation * roofInsulationQuantity,
                                 Math.min(availableGrants.RafterGrant, (improvementCosts.RafterInsulation * roofInsulationQuantity) / 2 || 0)
                               )}/>
                        <label htmlFor="applyRafterInsulation">Select</label>
                      </div>
                    </td>
                  </tr>
                </>
            )}
            {selectedUValues.UValueFloor && (
                <>
                  <tr>
                    <td>Floor Insulation</td>
                    <td>{floorInsulationQuantity} m²</td>
                    <td>€{(improvementCosts.FloorInsulation * floorInsulationQuantity).toFixed(2)}</td>
                    <td>€{availableGrants.FloorGrant}*</td>
                    <td>€{Math.min(availableGrants.FloorGrant, (improvementCosts.FloorInsulation * floorInsulationQuantity) / 2 || 0).toFixed(2)}</td>
                    <td>€{Math.max(0, (improvementCosts.FloorInsulation * floorInsulationQuantity) - Math.min(availableGrants.FloorGrant, (improvementCosts.FloorInsulation * floorInsulationQuantity) / 2) || 0).toFixed(2)}</td>
                    <td>
                      <div className="checkbox-container">
                        <input type="checkbox" id="applyFloorInsulation" name="applyFloorInsulationGrant"
                               onChange={(e) => handleCheckboxChange(e,
                                 'FloorInsulation',
                                 improvementCosts.FloorInsulation * floorInsulationQuantity,
                                 Math.min(availableGrants.FloorGrant, (improvementCosts.FloorInsulation * floorInsulationQuantity) / 2 || 0)
                               )}/>
                        <label htmlFor="applyFloorInsulation">Select</label>
                      </div>
                    </td>
                  </tr>
                </>
            )}
            {selectedUValues.UValueWindow && (
                <>
                  <tr>
                    <td>Windows Upgrade</td>
                    <td>
                      <select
                          value={windowQuantity}
                          onChange={e => setWindowQuantity(Math.max(1, Math.min(50, parseInt(e.target.value, 10))))}
                      >
                        {Array.from({ length: 50 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                        ))}
                      </select>
                    </td>
                    <td>€{(improvementCosts.WindowReplacement * windowQuantity).toFixed(2)}</td>
                    <td>€{availableGrants.WindowGrant}*</td>
                    <td>€{Math.min(availableGrants.WindowGrant, (improvementCosts.WindowReplacement * windowQuantity) / 2 || 0).toFixed(2)}</td>
                    <td>€{Math.max(0, (improvementCosts.WindowReplacement * windowQuantity) - Math.min(availableGrants.WindowGrant, (improvementCosts.WindowReplacement * windowQuantity) / 2) || 0).toFixed(2)}</td>
                    <td>
                      <div className="checkbox-container">
                        <input type="checkbox" id="applyWindowReplacement" name="applyWindowReplacementGrant"
                               onChange={(e) => handleCheckboxChange(e,
                                 'WindowReplacement',
                                 improvementCosts.WindowReplacement * windowQuantity,
                                 Math.min(availableGrants.WindowGrant, (improvementCosts.WindowReplacement * windowQuantity) / 2 || 0)
                               )}/>
                        <label htmlFor="applyWindowReplacement">Select</label>
                      </div>
                    </td>
                  </tr>
                </>
            )}
            {selectedUValues.UvalueDoor && (
                <>
                  <tr>
                    <td>External Back Door Upgrade</td>
                    <td>
                      <select
                          value={BackDoorQuantity}
                          onChange={e => setBackDoorQuantity(Math.max(1, Math.min(5, parseInt(e.target.value, 10))))}
                      >
                        {Array.from({ length: 5 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                        ))}
                      </select>
                    </td>
                    <td>€{(improvementCosts.BackDoorReplacement * BackDoorQuantity).toFixed(2)}</td>
                    <td>€{availableGrants.BackDoorGrant}*</td>
                    <td>€{Math.min(availableGrants.BackDoorGrant, (improvementCosts.BackDoorReplacement * BackDoorQuantity) / 2 || 0).toFixed(2)}</td>
                    <td>€{Math.max(0, (improvementCosts.BackDoorReplacement * BackDoorQuantity) - Math.min(availableGrants.BackDoorGrant, (improvementCosts.BackDoorReplacement * BackDoorQuantity) / 2) || 0).toFixed(2)}</td>
                    <td>
                      <div className="checkbox-container">
                        <input type="checkbox" id="applyBackDoorReplacement" name="applyBackDoorReplacementGrant"
                               onChange={(e) => handleCheckboxChange(e,
                                 'BackDoorReplacement',
                                 improvementCosts.BackDoorReplacement * BackDoorQuantity,
                                 Math.min(availableGrants.BackDoorGrant, (improvementCosts.BackDoorReplacement * BackDoorQuantity) / 2 || 0)
                               )}/>
                        <label htmlFor="applyBackDoorReplacement">Select</label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>External Front Door Upgrade</td>
                    <td>
                      <select
                          value={FrontDoorQuantity}
                          onChange={e => setFrontDoorQuantity(Math.max(1, Math.min(5, parseInt(e.target.value, 10))))}
                      >
                        {Array.from({ length: 5 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                        ))}
                      </select>
                    </td>
                    <td>€{(improvementCosts.FrontDoorReplacement * FrontDoorQuantity).toFixed(2)}</td>
                    <td>€{availableGrants.FrontDoorGrant}*</td>
                    <td>€{Math.min(availableGrants.FrontDoorGrant, (improvementCosts.FrontDoorReplacement * FrontDoorQuantity) / 2 || 0).toFixed(2)}</td>
                    <td>€{Math.max(0, (improvementCosts.FrontDoorReplacement * FrontDoorQuantity) - Math.min(availableGrants.FrontDoorGrant, (improvementCosts.FrontDoorReplacement * FrontDoorQuantity) / 2) || 0).toFixed(2)}</td>
                    <td>
                      <div className="checkbox-container">
                        <input type="checkbox" id="applyFrontDoorReplacement" name="applyFrontDoorReplacementGrant"
                               onChange={(e) => handleCheckboxChange(e,
                                 'FrontDoorReplacement',
                                 improvementCosts.FrontDoorReplacement * FrontDoorQuantity,
                                 Math.min(availableGrants.FrontDoorGrant, (improvementCosts.FrontDoorReplacement * FrontDoorQuantity) / 2 || 0)
                               )}/>
                        <label htmlFor="applyFrontDoorReplacement">Select</label>
                      </div>
                    </td>
                  </tr>
                </>
            )}
            <tr className="total-row">
              <td colSpan="2">Total</td>
              <td>€{totalEstimatedCost.toFixed(2)}</td>
              <td></td>
              <td>€{totalGrant.toFixed(2)}*</td>
              <td>€{totalCostToHomeowner.toFixed(2)}**</td>
              <td><a href="https://www.seai.ie/grants/home-energy-grants/insulation-grants/" target="_blank"
                     rel="noopener noreferrer" className="button-blue">Apply</a></td>
            </tr>
            </tbody>
          </table>
          <h3>Disclaimer</h3>
          <p>*Grants may be limited to only 50% of the total estimated cost for each improvement. <br/><br/>
            **Total estimated cost to homeowner is based on the estimated works cost minus the total SEAI grants limited
            to 50% of the estimated works cost.
            However, this amount may be change, depending on the SEAI grants approved.
          </p>
        </div>

      </>
  );
}

export default SuggestionsPage;
