import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Papa from 'papaparse';

function SuggestionsPage () {
  const location = useLocation();
  const selectedProperty = location.state ? location.state.selectedProperty : null;
  const selectedDwellingType = useState('');
  const [newEnergyRating, setNewEnergyRating] = useState('');
  const [archetypeData, setArchetypeData] = useState([]);
  const [seaiGrants, setSeaiGrants] = useState([]);
  const [modifiedValues, setModifiedValues] = useState({});
  const [selectedUValues, setSelectedUValues] = useState({});
  const [improvementEstimates, setImprovementEstimates] = useState({});
  const [wallInsulationQuantity, setWallInsulationQuantity] = useState(selectedProperty ? selectedProperty.WallArea : 0);
  const [roofInsulationQuantity, setRoofInsulationQuantity] = useState(selectedProperty ? selectedProperty.RoofArea : 0);
  const [floorInsulationQuantity, setFloorInsulationQuantity] = useState(selectedProperty ? selectedProperty.FloorArea : 0);
  const [windowQuantity, setWindowQuantity] = useState(1);
  const [BackDoorQuantity, setBackDoorQuantity] = useState(1);
  const [FrontDoorQuantity, setFrontDoorQuantity] = useState(1);

  const handleValueChange = (field, value) => {
    setModifiedValues(prev => ({ ...prev, [field]: value }));
  };

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
          switch (grant.GrantName) { // Ensure you use 'GrantName' as in your CSV
            case 'Cavity wall insulation': // Ensure you use the exact name from your CSV
              updatedImprovementCosts.WallCavityInsulation = grant.EstimatedImprovementCost;
              updatedAvailableGrants.WallCavityGrant = grant.GrantValue;
              break;
            case 'Internal Insulation (Dry Lining)': // Ensure you use the exact name from your CSV
              updatedImprovementCosts.WallInternalInsulation = grant.EstimatedImprovementCost;
              updatedAvailableGrants.WallInternalGrant = grant.GrantValue;
              break;
            case 'External Wall Insulation (The Wrap)': // Ensure you use the exact name from your CSV
              updatedImprovementCosts.WallExternalInsulation = grant.EstimatedImprovementCost;
              updatedAvailableGrants.WallExternalGrant = grant.GrantValue;
              break;
            case 'Attic insulation': // Ensure you use the exact name from your CSV
              updatedImprovementCosts.AtticInsulation = grant.EstimatedImprovementCost;
              updatedAvailableGrants.AtticGrant = grant.GrantValue;
              break;
            case 'Rafter insulation': // Ensure you use the exact name from your CSV
              updatedImprovementCosts.RafterInsulation = grant.EstimatedImprovementCost;
              updatedAvailableGrants.RafterGrant = grant.GrantValue;
              break;
            case 'Floor Insulation': // Ensure you use the exact name from your CSV
              updatedImprovementCosts.FloorInsulation = grant.EstimatedImprovementCost;
              updatedAvailableGrants.FloorGrant = grant.GrantValue;
              break;
            case 'Windows (Complete Upgrade)': // Ensure you use the exact name from your CSV
              updatedImprovementCosts.WindowReplacement = grant.EstimatedImprovementCost;
              updatedAvailableGrants.WindowGrant = grant.GrantValue;
              break;
            case 'External Back door': // Ensure you use the exact name from your CSV
              updatedImprovementCosts.BackDoorReplacement = grant.EstimatedImprovementCost;
              updatedAvailableGrants.BackDoorGrant = grant.GrantValue;
              break;
            case 'External Front door': // Ensure you use the exact name from your CSV
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
      <div>
        <h1>Selected Property</h1>
        {selectedProperty && (
            <div className="u-values-card">
              <p><strong>Dwelling Type:</strong> {selectedProperty.DwellingTypeDescr}</p>
              <p><strong>Current Energy Rating:</strong> {selectedProperty.EnergyRating}</p>
              <p></p>
              <h2>Select New Energy Rating</h2>
              <p>
                Choosing a new Energy Rating for your home is a proactive step towards enhancing your living
                environment and reducing your energy costs.
              </p>
              <p>
                A higher Energy Rating signifies better thermal efficiency, meaning your home retains heat more
                effectively during winter and stays cooler during summer.
              </p>
              <p>
                This not only improves comfort but also reduces the need for excessive heating or
                cooling, leading to significant savings on energy bills.
              </p>
              <p>
                Additionally, upgrading your home&apos;s energy performance can increase its market
                value and reduce its environmental impact by lowering carbon emissions.
              </p>
              <p>
                Select a new Energy Rating below to see how you can achieve these benefits.
              </p>
              <select value={newEnergyRating} onChange={e => setNewEnergyRating(e.target.value)}>
                <option value="">Select New Energy Rating</option>
                {availableRatings && availableRatings.map(rating => <option key={rating}
                                                                            value={rating}>{rating}</option>)}
              </select>
              <button onClick={submitNewEnergyRating} className="button-blue">Submit</button>
              <h2>Current U-Values</h2>
              <table className="u-values-table">
                <thead>
                <tr>
                  <th>U-Value Types</th>
                  <th>Target U-Values</th>
                  <th>Existing U-Values</th>
                  <th>Description</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th>Walls UValue</th>
                  <td>{thresholdValues.wall}</td>
                  <td className={`value-cell ${selectedProperty.UValueWall - thresholdValues.wall > 0.01 ? 'u-value-high' : selectedProperty.UValueWall - thresholdValues.wall < -0.01 ? 'u-value-low' : 'u-value-medium'}`}>
                    {selectedProperty.UValueWall}
                  </td>
                  <td className={`${selectedProperty.UValueWall - thresholdValues.wall > 0.01 ? 'u-value-high' : selectedProperty.UValueWall - thresholdValues.wall < -0.01 ? 'u-value-low' : 'u-value-medium'}`}>
                    {selectedProperty.UValueWall - thresholdValues.wall > 0.01
                      ? 'Your walls are not holding heat well. Consider upgrading insulation.'
                      : selectedProperty.UValueWall - thresholdValues.wall < -0.01
                        ? 'Your walls are well insulated against heat loss.'
                        : 'Your walls meet the minimum standard, but improvements could still be beneficial.'}
                  </td>
                </tr>
                <tr>
                  <th>Roof UValue</th>
                  <td>{thresholdValues.roof}</td>
                  <td className={`value-cell ${selectedProperty.UValueRoof - thresholdValues.roof > 0.01 ? 'u-value-high' : selectedProperty.UValueRoof - thresholdValues.roof < -0.01 ? 'u-value-low' : 'u-value-medium'}`}>
                    {selectedProperty.UValueRoof}
                  </td>
                  <td className={`${selectedProperty.UValueRoof - thresholdValues.roof > 0.01 ? 'u-value-high' : selectedProperty.UValueRoof - thresholdValues.roof < -0.01 ? 'u-value-low' : 'u-value-medium'}`}>
                    {selectedProperty.UValueRoof > thresholdValues.roof
                      ? 'Heat is escaping through your roof. Consider upgrading insulation.'
                      : selectedProperty.UValueRoof === thresholdValues.roof
                        ? 'Your roof meets the minimum standard, but improvements could still be beneficial.'
                        : 'Your roof is well insulated against heat loss.'}
                  </td>
                </tr>
                <tr>
                  <th>Floors UValue</th>
                  <td>{thresholdValues.floor}</td>
                  <td className={`value-cell ${selectedProperty.UValueFloor - thresholdValues.floor > 0.01 ? 'u-value-high' : selectedProperty.UValueFloor - thresholdValues.floor < -0.01 ? 'u-value-low' : 'u-value-medium'}`}>
                    {selectedProperty.UValueFloor}
                  </td>
                  <td className={`${selectedProperty.UValueFloor - thresholdValues.floor > 0.01 ? 'u-value-high' : selectedProperty.UValueFloor - thresholdValues.floor < -0.01 ? 'u-value-low' : 'u-value-medium'}`}>
                    {selectedProperty.UValueFloor > thresholdValues.floor
                      ? 'Your floors are losing heat, consider improving insulation.'
                      : selectedProperty.UValueFloor === thresholdValues.floor
                        ? 'Your floors meet the standard, but consider enhancements for better warmth.'
                        : 'Your floors are retaining heat efficiently.'}
                  </td>
                </tr>
                <tr>
                  <th>Windows UValue</th>
                  <td>{thresholdValues.window}</td>
                  <td className={`value-cell ${selectedProperty.UValueWindow - thresholdValues.window > 0.01 ? 'u-value-high' : selectedProperty.UValueWindow - thresholdValues.window < -0.01 ? 'u-value-low' : 'u-value-medium'}`}>
                    {selectedProperty.UValueWindow}
                  </td>
                  <td className={`${selectedProperty.UValueWindow - thresholdValues.window > 0.01 ? 'u-value-high' : selectedProperty.UValueWindow - thresholdValues.window < -0.01 ? 'u-value-low' : 'u-value-medium'}`}>
                    {selectedProperty.UValueWindow > thresholdValues.window
                      ? 'Your windows are not keeping heat in effectively. Consider updating them.'
                      : selectedProperty.UValueWindow === thresholdValues.window
                        ? 'Your windows are adequate, but newer models could offer more savings.'
                        : 'Your windows are performing well in retaining heat.'}
                  </td>
                </tr>
                <tr>
                  <th>Doors UValue</th>
                  <td>{thresholdValues.door}</td>
                  <td className={`value-cell ${selectedProperty.UvalueDoor - thresholdValues.door > 0.01 ? 'u-value-high' : selectedProperty.UvalueDoor - thresholdValues.door < -0.01 ? 'u-value-low' : 'u-value-medium'}`}>
                    {selectedProperty.UvalueDoor}
                  </td>
                  <td className={`${selectedProperty.UvalueDoor - thresholdValues.door > 0.01 ? 'u-value-high' : selectedProperty.UvalueDoor - thresholdValues.door < -0.01 ? 'u-value-low' : 'u-value-medium'}`}>
                    {selectedProperty.UvalueDoor > thresholdValues.door
                      ? 'Your doors are not insulating well. Consider replacements or sealing gaps.'
                      : selectedProperty.UvalueDoor === thresholdValues.door
                        ? 'Your doors meet the current standard, yet there might be room for improvement.'
                        : 'Your doors are well-sealed and insulated.'}
                  </td>
                </tr>
                </tbody>
              </table>
              <h2>Select U-Values to Modify</h2>
              <div>
                <label>
                  <input type="checkbox" checked={!!selectedUValues.UValueWall}
                         onChange={(e) => handleUValueChange(e, 'UValueWall')}/>
                  Wall
                </label>
              </div>
              <div>
                <label>
                  <input type="checkbox" checked={!!selectedUValues.UValueRoof}
                         onChange={(e) => handleUValueChange(e, 'UValueRoof')}/>
                  Roof
                </label>
              </div>
              <div>
                <label>
                  <input type="checkbox" checked={!!selectedUValues.UValueFloor}
                         onChange={(e) => handleUValueChange(e, 'UValueFloor')}/>
                  Floor
                </label>
              </div>
              <div>
                <label>
                  <input type="checkbox" checked={!!selectedUValues.UValueWindow}
                         onChange={(e) => handleUValueChange(e, 'UValueWindow')}/>
                  Window
                </label>
              </div>
              <div>
                <label>
                  <input type="checkbox" checked={!!selectedUValues.UValueDoor}
                         onChange={(e) => handleUValueChange(e, 'UValueDoor')}/>
                  Door
                </label>
              </div>
              <h2>Select optional items to install</h2>
              <div>
                <label>
                  <input
                      type="checkbox"
                      checked={!!selectedUValues.SolarPanels}
                      onChange={(e) => handleUValueChange(e, 'SolarPanels')}
                  />
                  Solar Panels
                </label>
              </div>
              <div>
                <label>
                  <input
                      type="checkbox"
                      checked={!!selectedUValues.HeatPump}
                      onChange={(e) => handleUValueChange(e, 'HeatPump')}
                  />
                  Heat Pump
                </label>
              </div>

              <div className="u-values-card">
                <h2>Improvement Estimates</h2>
                <table className="u-values-table">
                  <thead>
                  <tr>
                    <th>Improvement</th>
                    <th>Quantity</th>
                    <th>Estimated Works Cost</th>
                    <th>Available SEAI Grant</th>
                    <th>Estimated Cost to Homeowner</th>
                    <th>Apply for Grant</th>
                  </tr>
                  </thead>
                  <tbody>
                  {selectedUValues.UValueWall && (
                      <>
                        <tr>
                          <td>Cavity Wall Insulation</td>
                          <td>{wallInsulationQuantity} m²</td>
                          <td>€{(improvementCosts.WallCavityInsulation * wallInsulationQuantity).toFixed(2)}</td>
                          <td>€{availableGrants.WallCavityGrant}</td>
                          <td>€{Math.max(0, (improvementCosts.WallCavityInsulation * wallInsulationQuantity) - availableGrants.WallCavityGrant).toFixed(2)}</td>
                          <td><a href="https://www.seai.ie/grants/home-energy-grants/insulation-grants/" target="_blank"
                                 rel="noopener noreferrer" className="button-blue">Apply</a></td>
                        </tr>
                        <tr>
                          <td>Internal Wall Insulation</td>
                          <td>{wallInsulationQuantity} m²</td>
                          <td>€{(improvementCosts.WallInternalInsulation * wallInsulationQuantity).toFixed(2)}</td>
                          <td>€{availableGrants.WallInternalGrant}</td>
                          <td>€{Math.max(0, (improvementCosts.WallInternalInsulation * wallInsulationQuantity) - availableGrants.WallInternalGrant).toFixed(2)}</td>
                          <td><a href="https://www.seai.ie/grants/home-energy-grants/insulation-grants/" target="_blank"
                                 rel="noopener noreferrer" className="button-blue">Apply</a></td>
                        </tr>
                        <tr>
                          <td>External Wall Insulation</td>
                          <td>{wallInsulationQuantity} m²</td>
                          <td>€{(improvementCosts.WallExternalInsulation * wallInsulationQuantity).toFixed(2)}</td>
                          <td>€{availableGrants.WallExternalGrant}</td>
                          <td>€{Math.max(0, (improvementCosts.WallExternalInsulation * wallInsulationQuantity) - availableGrants.WallExternalGrant).toFixed(2)}</td>
                          <td><a href="https://www.seai.ie/grants/home-energy-grants/insulation-grants/" target="_blank"
                                 rel="noopener noreferrer" className="button-blue">Apply</a></td>
                        </tr>
                      </>
                  )}
                  {selectedUValues.UValueRoof && (
                      <>
                        <tr>
                          <td>Attic Insulation</td>
                          <td>{roofInsulationQuantity} m²</td>
                          <td>€{(improvementCosts.AtticInsulation * roofInsulationQuantity).toFixed(2)}</td>
                          <td>€{availableGrants.AtticGrant}</td>
                          <td>€{Math.max(0, (improvementCosts.AtticInsulation * roofInsulationQuantity) - availableGrants.AtticGrant).toFixed(2)}</td>
                          <td><a href="https://www.seai.ie/grants/home-energy-grants/insulation-grants/" target="_blank"
                                 rel="noopener noreferrer" className="button-blue">Apply</a></td>
                        </tr>
                        <tr>
                          <td>Rafter Insulation</td>
                          <td>{roofInsulationQuantity} m²</td>
                          <td>€{(improvementCosts.RafterInsulation * roofInsulationQuantity).toFixed(2)}</td>
                          <td>€{availableGrants.RafterGrant}</td>
                          <td>€{Math.max(0, (improvementCosts.RafterInsulation * roofInsulationQuantity) - availableGrants.RafterGrant).toFixed(2)}</td>
                          <td><a href="https://www.seai.ie/grants/home-energy-grants/insulation-grants/" target="_blank"
                                 rel="noopener noreferrer" className="button-blue">Apply</a></td>
                        </tr>
                      </>
                  )}
                  {selectedUValues.UValueFloor && (
                      <>
                        <tr>
                          <td>Floor Insulation</td>
                          <td>{floorInsulationQuantity} m²</td>
                          <td>€{(improvementCosts.FloorInsulation * floorInsulationQuantity).toFixed(2)}</td>
                          <td>€{availableGrants.FloorGrant}</td>
                          <td>€{Math.max(0, (improvementCosts.FloorInsulation * floorInsulationQuantity) - availableGrants.FloorGrant).toFixed(2)}</td>
                          <td><a href="https://www.seai.ie/grants/home-energy-grants/insulation-grants/" target="_blank"
                                 rel="noopener noreferrer" className="button-blue">Apply</a></td>
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
                          <td>€{availableGrants.WindowGrant}</td>
                          <td>€{Math.max(0, (improvementCosts.WindowReplacement * windowQuantity) - availableGrants.WindowGrant).toFixed(2)}</td>
                          <td><a href="https://www.seai.ie/grants/home-energy-grants/insulation-grants/" target="_blank"
                                 rel="noopener noreferrer" className="button-blue">Apply</a></td>
                        </tr>
                      </>
                  )}
                  {selectedUValues.UValueDoor && (
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
                          <td>€{availableGrants.BackDoorGrant}</td>
                          <td>€{Math.max(0, (improvementCosts.BackDoorReplacement * BackDoorQuantity) - availableGrants.BackDoorGrant).toFixed(2)}</td>
                          <td><a href="https://www.seai.ie/grants/home-energy-grants/insulation-grants/" target="_blank"
                                 rel="noopener noreferrer" className="button-blue">Apply</a></td>
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
                          <td>€{availableGrants.FrontDoorGrant}</td>
                          <td>€{Math.max(0, (improvementCosts.FrontDoorReplacement * FrontDoorQuantity) - availableGrants.FrontDoorGrant).toFixed(2)}</td>
                          <td><a href="https://www.seai.ie/grants/home-energy-grants/insulation-grants/" target="_blank"
                                 rel="noopener noreferrer" className="button-blue">Apply</a></td>
                        </tr>
                      </>
                  )}
                  {/* Repeat similar structures for UValueFloor, UValueWindow, UValueDoor if necessary */}
                  </tbody>
                </table>
                {/* You can add additional instructions or information below the table */}
              </div>

            </div>
        )}
      </div>
  );
}

export default SuggestionsPage;
