import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Papa from 'papaparse';

function SuggestionsPage () {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const location = useLocation();

  const selectedProperty = location.state ? location.state.selectedProperty : null;
  const [newEnergyRating, setNewEnergyRating] = useState('');
  const [tempNewEnergyRating, setTempNewEnergyRating] = useState('');
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
  const [SolarPanelQuantity, setSolarPanelQuantity] = useState(1);
  const [SolarHotWaterQuantity, setSolarHotWaterQuantity] = useState(1);
  const [HeatPumpQuantity, setHeatPumpQuantity] = useState(1);
  const [CentralHeatingSystemQuantity, setCentralHeatingSystemQuantity] = useState(1);
  const [HeatingControlsQuantity, setHeatingControlsQuantity] = useState(1);
  const [MechanicalVentilationQuantity, setMechanicalVentilationQuantity] = useState(1);
  const [AirTightnessQuantity, setAirTightnessQuantity] = useState(1);
  const [totalEstimatedCost, setTotalEstimatedCost] = useState(0);
  const [totalAvailableGrant, setTotalAvailableGrant] = useState(0);
  const [totalRecalculatedGrant, setTotalRecalculatedGrant] = useState(0);
  const [totalCostToHomeowner, setTotalCostToHomeowner] = useState(0);
  const [selectedItemsCosts, setSelectedItemsCosts] = useState([]);
  const [selectedItemsGrants, setSelectedItemsGrants] = useState([]);

  const availableRatings = selectedProperty && ['A1', 'A2', 'A3', 'B1', 'B2'].filter(rating => rating !== selectedProperty.EnergyRating && rating < selectedProperty.EnergyRating);

  const [thresholdValues, setThresholdValues] = useState({
    wall: 0, // Default values, will be updated dynamically
    roof: 0,
    floor: 0,
    window: 0,
    door: 0
  });

  const [lowestMeanValues, setLowestMeanValues] = useState({
    wall: 0,
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
    FrontDoorReplacement: 0,
    SolarPanels: 0,
    SolarHotWater: 0,
    HeatPumpAssessment: 0,
    HeatPumpAirToWater: 0,
    HeatPumpGroundSource: 0,
    HeatPumpExhaustAir: 0,
    HeatPumpWaterToWater: 0,
    HeatPumpAirToAir: 0,
    CentralHeatingSystem: 0,
    HeatingControls: 0,
    HeatPumpBonus: 0,
    MechanicalVentilation: 0,
    AirTightness: 0
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
    FrontDoorGrant: 0,
    SolarPanelsGrant: 0,
    SolarHotWaterGrant: 0,
    HeatPumpAssessmentGrant: 0,
    HeatPumpAirToWaterGrant: 0,
    HeatPumpGroundSourceGrant: 0,
    HeatPumpExhaustAirGrant: 0,
    HeatPumpWaterToWaterGrant: 0,
    HeatPumpAirToAirGrant: 0,
    CentralHeatingSystemGrant: 0,
    HeatingControlsGrant: 0,
    HeatPumpBonusGrant: 0,
    MechanicalVentilationGrant: 0,
    AirTightnessGrant: 0
    // other initial values
  });

  const handleUValueChange = (e, field) => {
    setSelectedUValues({ ...selectedUValues, [field]: e.target.checked });
  };

  const submitNewEnergyRating = () => {
    setNewEnergyRating(tempNewEnergyRating);
    const newSelectClass = tempNewEnergyRating.startsWith('A') ? 'a-rating' : tempNewEnergyRating.startsWith('B') ? 'b-rating' : '';
    setSelectClass(newSelectClass);

    // Existing logic for updating target U-Values based on the new energy rating
    // Logic to calculate predicted results based on new U-values
    console.log('New U-Values submitted:', tempNewEnergyRating);
  };

  const handleCheckboxChange = (e, improvementType, cost, grant) => {
    // Prevent scrolling when refocusing
    const x = window.scrollX; const y = window.scrollY;
    e.target.focus();
    window.scrollTo(x, y);

    const numericCost = parseFloat(cost);
    const numericGrant = parseFloat(grant);

    if (e.target.checked) {
      // Add the cost and grant of the selected item
      setSelectedItemsCosts(oldCosts => [...oldCosts, numericCost]);
      setSelectedItemsGrants(oldGrants => [...oldGrants, numericGrant]);
    } else {
      // Remove the cost and grant of the deselected item
      setSelectedItemsCosts(oldCosts => oldCosts.filter(itemCost => itemCost !== numericCost));
      setSelectedItemsGrants(oldGrants => oldGrants.filter(itemGrant => itemGrant !== numericGrant));
    }
  };

  useEffect(() => {
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

    // Set the SolarHotWater quantity based on the selected property
    if (selectedProperty && selectedProperty.SolarHotWater) {
      setSolarHotWaterQuantity(selectedProperty.SolarHotWater);
    }

    // Set the HeatPump quantity based on the selected property
    if (selectedProperty && selectedProperty.HeatPump) {
      setHeatPumpQuantity(selectedProperty.HeatPump);
    }

    // Set the CentralHeatingSystem quantity based on the selected property
    if (selectedProperty && selectedProperty.CentralHeatingSystem) {
      setCentralHeatingSystemQuantity(selectedProperty.CentralHeatingSystem);
    }

    // Set the HeatingControls quantity based on the selected property
    if (selectedProperty && selectedProperty.HeatingControls) {
      setHeatingControlsQuantity(selectedProperty.HeatingControls);
    }

    // Set the MechanicalVentilation quantity based on the selected property
    if (selectedProperty && selectedProperty.MechanicalVentilation) {
      setMechanicalVentilationQuantity(selectedProperty.MechanicalVentilation);
    }

    // Set the AirTightness quantity based on the selected property
    if (selectedProperty && selectedProperty.AirTightness) {
      setAirTightnessQuantity(selectedProperty.AirTightness);
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

      // Find the Energy Rating A1 for dwelling type from archetype data
      const lowestMeanRow = archetypeData.find(row => row.DwellingType === dwellingType && row.EnergyRating === 'A1');

      // If a matching row is found, update the lowest mean values
      if (lowestMeanRow) {
        setLowestMeanValues({
          wall: lowestMeanRow.UValueWallMean,
          roof: lowestMeanRow.UValueRoofMean,
          floor: lowestMeanRow.UValueFloorMean,
          window: lowestMeanRow.UValueWindowMean,
          door: lowestMeanRow.UValueDoorMean
        });
      }

      // Update improvement costs and available grants based on SEAI grants data and dwelling type
      const updatedImprovementCosts = { ...improvementCosts };
      const updatedAvailableGrants = { ...availableGrants };

      seaiGrantsData.forEach(grant => {
        console.log(grant); // To check what's in each grant entry
        if (grant.DwellingTypes === dwellingType) {
          switch (grant.GrantName) { // Use 'GrantName' as in the CSV
            case 'Cavity wall insulation': // Use the exact name from the CSV
              updatedImprovementCosts.WallCavityInsulation = grant.EstimatedImprovementCost;
              updatedAvailableGrants.WallCavityGrant = grant.GrantValue;
              break;
            case 'Internal Insulation (Dry Lining)': // Use the exact name from the CSV
              updatedImprovementCosts.WallInternalInsulation = grant.EstimatedImprovementCost;
              updatedAvailableGrants.WallInternalGrant = grant.GrantValue;
              break;
            case 'External Wall Insulation (The Wrap)': // Use the exact name from the CSV
              updatedImprovementCosts.WallExternalInsulation = grant.EstimatedImprovementCost;
              updatedAvailableGrants.WallExternalGrant = grant.GrantValue;
              break;
            case 'Attic insulation': // Use the exact name from the CSV
              updatedImprovementCosts.AtticInsulation = grant.EstimatedImprovementCost;
              updatedAvailableGrants.AtticGrant = grant.GrantValue;
              break;
            case 'Rafter insulation': // Use the exact name from the CSV
              updatedImprovementCosts.RafterInsulation = grant.EstimatedImprovementCost;
              updatedAvailableGrants.RafterGrant = grant.GrantValue;
              break;
            case 'Floor Insulation': // Use the exact name from the CSV
              updatedImprovementCosts.FloorInsulation = grant.EstimatedImprovementCost;
              updatedAvailableGrants.FloorGrant = grant.GrantValue;
              break;
            case 'Windows (Complete Upgrade)': // Use the exact name from the CSV
              updatedImprovementCosts.WindowReplacement = grant.EstimatedImprovementCost;
              updatedAvailableGrants.WindowGrant = grant.GrantValue;
              break;
            case 'External Back door': // Use the exact name from the CSV
              updatedImprovementCosts.BackDoorReplacement = grant.EstimatedImprovementCost;
              updatedAvailableGrants.BackDoorGrant = grant.GrantValue;
              break;
            case 'External Front door': // Use the exact name from the CSV
              updatedImprovementCosts.FrontDoorReplacement = grant.EstimatedImprovementCost;
              updatedAvailableGrants.FrontDoorGrant = grant.GrantValue;
              break;
            case 'Solar PV Grant': // Use the exact name from the CSV
              updatedImprovementCosts.SolarPanels = grant.EstimatedImprovementCost;
              updatedAvailableGrants.SolarPanelsGrant = grant.GrantValue;
              break;
            case 'Solar Hot Water': // Use the exact name from the CSV
              updatedImprovementCosts.SolarHotWater = grant.EstimatedImprovementCost;
              updatedAvailableGrants.SolarHotWaterGrant = grant.GrantValue;
              break;
            case 'Heat Pump Technical Assessment': // Use the exact name from the CSV
              updatedImprovementCosts.HeatPumpAssessment = grant.EstimatedImprovementCost;
              updatedAvailableGrants.HeatPumpAssessmentGrant = grant.GrantValue;
              break;
            case 'Air to Water heat pump system': // Use the exact name from the CSV
              updatedImprovementCosts.HeatPumpAirToWater = grant.EstimatedImprovementCost;
              updatedAvailableGrants.HeatPumpAirToWaterGrant = grant.GrantValue;
              break;
            case 'Ground Source to Water heat pump system': // Use the exact name from the CSV
              updatedImprovementCosts.HeatPumpGroundSource = grant.EstimatedImprovementCost;
              updatedAvailableGrants.HeatPumpGroundSourceGrant = grant.GrantValue;
              break;
            case 'Exhaust Air to Water heat pump system': // Use the exact name from the CSV
              updatedImprovementCosts.HeatPumpExhaustAir = grant.EstimatedImprovementCost;
              updatedAvailableGrants.HeatPumpExhaustAirGrant = grant.GrantValue;
              break;
            case 'Water to Water heat pump system': // Use the exact name from the CSV
              updatedImprovementCosts.HeatPumpWaterToWater = grant.EstimatedImprovementCost;
              updatedAvailableGrants.HeatPumpWaterToWaterGrant = grant.GrantValue;
              break;
            case 'Air to Air heat pump system': // Use the exact name from the CSV
              updatedImprovementCosts.HeatPumpAirToAir = grant.EstimatedImprovementCost;
              updatedAvailableGrants.HeatPumpAirToAirGrant = grant.GrantValue;
              break;
            case 'Central Heating System for Heat Pump': // Use the exact name from the CSV
              updatedImprovementCosts.CentralHeatingSystem = grant.EstimatedImprovementCost;
              updatedAvailableGrants.CentralHeatingSystemGrant = grant.GrantValue;
              break;
            case 'Heating Controls': // Use the exact name from the CSV
              updatedImprovementCosts.HeatingControls = grant.EstimatedImprovementCost;
              updatedAvailableGrants.HeatingControlsGrant = grant.GrantValue;
              break;
            case 'Heat Pump Bonus': // Use the exact name from the CSV
              updatedImprovementCosts.HeatPumpBonus = grant.EstimatedImprovementCost;
              updatedAvailableGrants.HeatPumpBonusGrant = grant.GrantValue;
              break;
            case 'Mechanical Ventilation': // Use the exact name from the CSV
              updatedImprovementCosts.MechanicalVentilation = grant.EstimatedImprovementCost;
              updatedAvailableGrants.MechanicalVentilationGrant = grant.GrantValue;
              break;
            case 'Air Tightness': // Use the exact name from the CSV
              updatedImprovementCosts.AirTightness = grant.EstimatedImprovementCost;
              updatedAvailableGrants.AirTightnessGrant = grant.GrantValue;
              break;
            case 'Home Energy Assessment': // Use the exact name from the CSV
              updatedImprovementCosts.HomeEnergyAssessment = grant.EstimatedImprovementCost;
              updatedAvailableGrants.HomeEnergyAssessmentGrant = grant.GrantValue;
              break;
            case 'Project Management': // Use the exact name from the CSV
              updatedImprovementCosts.ProjectManagement = grant.EstimatedImprovementCost;
              updatedAvailableGrants.ProjectManagementGrant = grant.GrantValue;
              break;
          }
        }
      });

      setImprovementCosts(updatedImprovementCosts);
      setAvailableGrants(updatedAvailableGrants);
    });

    let SolarPanelQuantity = 0;
    switch (selectedProperty.DwellingTypeDescr) {
      case 'Mid-terrace house':
        SolarPanelQuantity = 8;
        break;
      case 'Semi-detached house':
        SolarPanelQuantity = 10;
        break;
      case 'End of terrace house':
        SolarPanelQuantity = 8;
        break;
      case 'House':
        SolarPanelQuantity = 12;
        break;
      case 'Detached house':
        SolarPanelQuantity = 16;
        break;
      default: SolarPanelQuantity = 0;
    }
    setSolarPanelQuantity(SolarPanelQuantity);

    const totalCost = selectedItemsCosts.reduce((acc, cur) => acc + cur, 0);
    const totalGrant = selectedItemsGrants.reduce((acc, cur) => acc + cur, 0);
    const recalculatedGrant = Math.min(totalGrant, totalCost * 0.5); // Ensure grant doesn't exceed 50% of the total cost
    const homeownerCost = Math.max(0, totalCost - recalculatedGrant); // Ensure homeowner cost doesn't go below 0

    setTotalEstimatedCost(totalCost);
    setTotalAvailableGrant(totalGrant);
    setTotalRecalculatedGrant(recalculatedGrant);
    setTotalCostToHomeowner(homeownerCost);
  }, [selectedProperty, newEnergyRating, selectedItemsCosts, selectedItemsGrants]); // Ensure useEffect is triggered when these values change

  // Display the selected property and inputs for modifying U-values
  return (
      <>
        <div>
          <h1>Your Selected Property Details</h1>
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
              value={tempNewEnergyRating}
              onChange={e => setTempNewEnergyRating(e.target.value)}
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
            If your existing U-Values are higher than the recommended U-Values, these will be highlighted in
            <span className="color-block red"></span><span className="color-word">red</span>,
            indicating areas where improvements can be made to improve the energy efficiency of your home.<br></br>
            If your existing U-Values are lower than the recommended U-Values, these will be highlighted in
            <span className="color-block green"></span><span className="color-word">green</span>,
            indicating areas where your home already meets or exceeds the energy efficiency requirements for the
            selected energy rating category.<br></br>
            If your existing U-Values are close to the recommended U-Values, these will be highlighted in
            <span className="color-block amber"></span><span className="color-word">amber</span>,
            indicating that your home meets the minimum standards but could still benefit from improvements.
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
              <td className={`value-cell ${
                  selectedProperty.UValueWall > thresholdValues.wall
                      ? 'u-value-high'
                      : selectedProperty.UValueWall < thresholdValues.wall && selectedProperty.UValueWall > lowestMeanValues.wall
                          ? 'u-value-medium'
                          : 'u-value-low'
              }`}>
                {selectedProperty.UValueWall}
              </td>
              <td>{
                selectedProperty.UValueWall > thresholdValues.wall
                  ? 'Your walls are not holding heat well. Consider upgrading insulation.'
                  : selectedProperty.UValueWall < thresholdValues.wall && selectedProperty.UValueWall > lowestMeanValues.wall
                    ? 'Your walls meet the minimum standard, but improvements could still be beneficial.'
                    : 'Your walls are well insulated against heat loss.'
              }</td>
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
              <td className={`value-cell ${
                  selectedProperty.UValueRoof > thresholdValues.roof
                      ? 'u-value-high'
                      : selectedProperty.UValueRoof < thresholdValues.roof && selectedProperty.UValueRoof > lowestMeanValues.roof
                          ? 'u-value-medium'
                          : 'u-value-low'
              }`}>
                {selectedProperty.UValueRoof}
              </td>
              <td>{
                selectedProperty.UValueRoof > thresholdValues.roof
                  ? 'Your roof is not insulating well. Consider upgrading insulation.'
                  : selectedProperty.UValueRoof < thresholdValues.roof && selectedProperty.UValueRoof > lowestMeanValues.roof
                    ? 'Your roof meets the minimum standard, but improvements could still be beneficial.'
                    : 'Your roof is well insulated against heat loss.'
              }</td>
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
              <td className={`value-cell ${
                  selectedProperty.UValueFloor > thresholdValues.floor
                      ? 'u-value-high'
                      : selectedProperty.UValueFloor < thresholdValues.floor && selectedProperty.UValueFloor > lowestMeanValues.floor
                          ? 'u-value-medium'
                          : 'u-value-low'
              }`}>
                {selectedProperty.UValueFloor}
              </td>
              <td>{
                selectedProperty.UValueFloor > thresholdValues.floor
                  ? 'Your floors are not insulating well. Consider upgrading insulation.'
                  : selectedProperty.UValueFloor < thresholdValues.floor && selectedProperty.UValueFloor > lowestMeanValues.floor
                    ? 'Your floors meet the minimum standard, but improvements could still be beneficial.'
                    : 'Your floors are well insulated against heat loss.'
              }</td>
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
              <td className={`value-cell ${
                  selectedProperty.UValueWindow > thresholdValues.window
                      ? 'u-value-high'
                      : selectedProperty.UValueWindow < thresholdValues.window && selectedProperty.UValueWindow > lowestMeanValues.window
                          ? 'u-value-medium'
                          : 'u-value-low'
              }`}>
                {selectedProperty.UValueWindow}
              </td>
              <td>{
                selectedProperty.UValueWindow > thresholdValues.window
                  ? 'Your windows are not insulating well. Consider upgrading to double or triple glazing.'
                  : selectedProperty.UValueWindow < thresholdValues.window && selectedProperty.UValueWindow > lowestMeanValues.window
                    ? 'Your windows meet the minimum standard, but improvements could still be beneficial.'
                    : 'Your windows are well insulated against heat loss.'
              }</td>
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
              <td className={`value-cell ${
                  selectedProperty.UvalueDoor > thresholdValues.door
                      ? 'u-value-high'
                      : selectedProperty.UvalueDoor < thresholdValues.door && selectedProperty.UvalueDoor > lowestMeanValues.door
                          ? 'u-value-medium'
                          : 'u-value-low'
              }`}>
                {selectedProperty.UvalueDoor}
              </td>
              <td>{
                selectedProperty.UvalueDoor > thresholdValues.door
                  ? 'Your doors are not insulating well. Consider upgrading to insulated doors.'
                  : selectedProperty.UvalueDoor < thresholdValues.door && selectedProperty.UvalueDoor > lowestMeanValues.door
                    ? 'Your doors meet the minimum standard, but improvements could still be beneficial.'
                    : 'Your doors are well insulated against heat loss.'
              }</td>
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
                                 availableGrants.WallCavityGrant)}
                        />
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
                                   availableGrants.WallInternalGrant)}
                        />
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
                                 availableGrants.WallExternalGrant)}
                        />
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
                                 availableGrants.AtticGrant)}
                        />
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
                                 availableGrants.RafterGrant)}
                        />
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
                                 availableGrants.FloorGrant)}
                        />
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
                                 availableGrants.WindowGrant)}
                        />
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
                    <td>€{availableGrants.BackDoorGrant.toFixed(2)}</td>
                    <td>€{Math.max(0, (improvementCosts.BackDoorReplacement * BackDoorQuantity) - availableGrants.BackDoorGrant).toFixed(2)}</td>
                    <td>
                      <div className="checkbox-container">
                        <input type="checkbox" id="applyBackDoorReplacement" name="applyBackDoorReplacementGrant"
                               onChange={(e) => handleCheckboxChange(e,
                                 'BackDoorReplacement',
                                 improvementCosts.BackDoorReplacement * BackDoorQuantity,
                                 availableGrants.BackDoorGrant)}
                        />
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
                    <td>€{availableGrants.FrontDoorGrant.toFixed(2)}</td>
                    <td>€{Math.max(0, (improvementCosts.FrontDoorReplacement * FrontDoorQuantity) - availableGrants.FrontDoorGrant).toFixed(2)}</td>
                    <td>
                      <div className="checkbox-container">
                        <input type="checkbox" id="applyFrontDoorReplacement" name="applyFrontDoorReplacementGrant"
                               onChange={(e) => handleCheckboxChange(e,
                                 'FrontDoorReplacement',
                                 improvementCosts.FrontDoorReplacement * FrontDoorQuantity,
                                 availableGrants.FrontDoorGrant)}
                        />
                        <label htmlFor="applyFrontDoorReplacement">Select</label>
                      </div>
                    </td>
                  </tr>
                </>
            )}
            {selectedUValues.SolarPanels && (
                <>
                  <tr>
                    <td>Solar Panels (incl. Inverter and Batteries)</td>
                    <td>{SolarPanelQuantity}</td>
                    <td>€{(improvementCosts.SolarPanels).toFixed(2)}</td>
                    <td>€{availableGrants.SolarPanelsGrant}*</td>
                    <td>€{availableGrants.SolarPanelsGrant.toFixed(2)}</td>
                    <td>€{Math.max(0, (improvementCosts.SolarPanels - availableGrants.SolarPanelsGrant)).toFixed(2)}</td>
                    <td>
                      <div className="checkbox-container">
                        <input type="checkbox" id="applySolarPanels" name="applySolarPanelsGrant"
                               onChange={(e) => handleCheckboxChange(e,
                                 'SolarPanels',
                                 improvementCosts.SolarPanels,
                                 availableGrants.SolarPanelsGrant)}
                        />
                        <label htmlFor="applySolarPanels">Select</label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Solar Hot Water</td>
                    <td>{SolarHotWaterQuantity}</td>
                    <td>€{(improvementCosts.SolarHotWater * SolarHotWaterQuantity).toFixed(2)}</td>
                    <td>€{availableGrants.SolarHotWaterGrant}*</td>
                    <td>€{availableGrants.SolarHotWaterGrant.toFixed(2)}</td>
                    <td>€{Math.max(0, (improvementCosts.SolarHotWater * SolarHotWaterQuantity) - availableGrants.SolarHotWaterGrant).toFixed(2)}</td>
                    <td>
                      <div className="checkbox-container">
                        <input type="checkbox" id="applySolarHotWater" name="applySolarHotWaterGrant"
                               onChange={(e) => handleCheckboxChange(e,
                                 'SolarHotWater',
                                 improvementCosts.SolarHotWater * SolarHotWaterQuantity,
                                 availableGrants.SolarHotWaterGrant)}
                        />
                        <label htmlFor="applySolarHotWater">Select</label>
                      </div>
                    </td>
                  </tr>
                </>
            )}
            {selectedUValues.HeatPump && (
                <>
                  <tr>
                    <td>Air to Water Heat Pump System</td>
                    <td>{HeatPumpQuantity}</td>
                    <td>€{(improvementCosts.HeatPumpAirToWater * HeatPumpQuantity).toFixed(2)}</td>
                    <td>€{availableGrants.HeatPumpAirToWaterGrant}*</td>
                    <td>€{availableGrants.HeatPumpAirToWaterGrant.toFixed(2)}</td>
                    <td>€{Math.max(0, (improvementCosts.HeatPumpAirToWater * HeatPumpQuantity) - availableGrants.HeatPumpAirToWaterGrant).toFixed(2)}</td>
                    <td>
                      <div className="checkbox-container">
                        <input type="checkbox" id="applyHeatPumpAirToWater" name="applyHeatPumpAirToWaterGrant"
                               onChange={(e) => handleCheckboxChange(e,
                                 'HeatPumpAirToWater',
                                 improvementCosts.HeatPumpAirToWater * HeatPumpQuantity,
                                 availableGrants.HeatPumpAirToWaterGrant)}
                        />
                        <label htmlFor="applyHeatPumpAirToWater">Select</label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Ground Source Heat Pump System</td>
                    <td>{HeatPumpQuantity}</td>
                    <td>€{(improvementCosts.HeatPumpGroundSource * HeatPumpQuantity).toFixed(2)}</td>
                    <td>€{availableGrants.HeatPumpGroundSourceGrant}*</td>
                    <td>€{availableGrants.HeatPumpGroundSourceGrant.toFixed(2)}</td>
                    <td>€{Math.max(0, (improvementCosts.HeatPumpGroundSource * HeatPumpQuantity) - availableGrants.HeatPumpGroundSourceGrant).toFixed(2)}</td>
                    <td>
                      <div className="checkbox-container">
                        <input type="checkbox" id="applyHeatPumpGroundSource" name="applyHeatPumpGroundSourceGrant"
                               onChange={(e) => handleCheckboxChange(e,
                                 'HeatPumpGroundSource',
                                 improvementCosts.HeatPumpGroundSource * HeatPumpQuantity,
                                 availableGrants.HeatPumpGroundSourceGrant)}
                        />
                        <label htmlFor="applyHeatPumpGroundSource">Select</label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Exhaust Air to Water Heat Pump System</td>
                    <td>{HeatPumpQuantity}</td>
                    <td>€{(improvementCosts.HeatPumpExhaustAir * HeatPumpQuantity).toFixed(2)}</td>
                    <td>€{availableGrants.HeatPumpExhaustAirGrant}*</td>
                    <td>€{availableGrants.HeatPumpExhaustAirGrant.toFixed(2)}</td>
                    <td>€{Math.max(0, (improvementCosts.HeatPumpExhaustAir * HeatPumpQuantity) - availableGrants.HeatPumpExhaustAirGrant).toFixed(2)}</td>
                    <td>
                      <div className="checkbox-container">
                        <input type="checkbox" id="applyHeatPumpExhaustAir" name="applyHeatPumpExhaustAirGrant"
                               onChange={(e) => handleCheckboxChange(e,
                                 'HeatPumpExhaustAir',
                                 improvementCosts.HeatPumpExhaustAir * HeatPumpQuantity,
                                 availableGrants.HeatPumpExhaustAirGrant)}
                        />
                        <label htmlFor="applyHeatPumpExhaustAir">Select</label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Water to Water Heat Pump System</td>
                    <td>{HeatPumpQuantity}</td>
                    <td>€{(improvementCosts.HeatPumpWaterToWater * HeatPumpQuantity).toFixed(2)}</td>
                    <td>€{availableGrants.HeatPumpWaterToWaterGrant}*</td>
                    <td>€{availableGrants.HeatPumpWaterToWaterGrant.toFixed(2)}</td>
                    <td>€{Math.max(0, (improvementCosts.HeatPumpWaterToWater * HeatPumpQuantity) - availableGrants.HeatPumpWaterToWaterGrant).toFixed(2)}</td>
                    <td>
                      <div className="checkbox-container">
                        <input type="checkbox" id="applyHeatPumpWaterToWater" name="applyHeatPumpWaterToWaterGrant"
                               onChange={(e) => handleCheckboxChange(e,
                                 'HeatPumpWaterToWater',
                                 improvementCosts.HeatPumpWaterToWater * HeatPumpQuantity,
                                 availableGrants.HeatPumpWaterToWaterGrant)}
                        />
                        <label htmlFor="applyHeatPumpWaterToWater">Select</label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Air to Air Heat Pump System</td>
                    <td>{HeatPumpQuantity}</td>
                    <td>€{(improvementCosts.HeatPumpAirToAir * HeatPumpQuantity).toFixed(2)}</td>
                    <td>€{availableGrants.HeatPumpAirToAirGrant}*</td>
                    <td>€{availableGrants.HeatPumpAirToAirGrant.toFixed(2)}</td>
                    <td>€{Math.max(0, (improvementCosts.HeatPumpAirToAir * HeatPumpQuantity) - availableGrants.HeatPumpAirToAirGrant).toFixed(2)}</td>
                    <td>
                      <div className="checkbox-container">
                        <input type="checkbox" id="applyHeatPumpAirToAir" name="applyHeatPumpAirToAirGrant"
                               onChange={(e) => handleCheckboxChange(e,
                                 'HeatPumpAirToAir',
                                 improvementCosts.HeatPumpAirToAir * HeatPumpQuantity,
                                 availableGrants.HeatPumpAirToAirGrant)}
                        />
                        <label htmlFor="applyHeatPumpAirToAir">Select</label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Central Heating System for Heat Pump</td>
                    <td>{CentralHeatingSystemQuantity}</td>
                    <td>€{(improvementCosts.CentralHeatingSystem * CentralHeatingSystemQuantity).toFixed(2)}</td>
                    <td>€{availableGrants.CentralHeatingSystemGrant}*</td>
                    <td>€{availableGrants.CentralHeatingSystemGrant.toFixed(2)}</td>
                    <td>€{availableGrants.CentralHeatingSystemGrant.toFixed(2)}</td>
                    <td>
                      <div className="checkbox-container">
                        <input type="checkbox" id="applyCentralHeatingSystem" name="applyCentralHeatingSystemGrant"
                               onChange={(e) => handleCheckboxChange(e,
                                 'CentralHeatingSystem',
                                 improvementCosts.CentralHeatingSystem * CentralHeatingSystemQuantity,
                                 availableGrants.CentralHeatingSystemGrant)}
                        />
                        <label htmlFor="applyCentralHeatingSystem">Select</label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Heating Controls</td>
                    <td>{HeatingControlsQuantity}</td>
                    <td>€{(improvementCosts.HeatingControls * HeatingControlsQuantity).toFixed(2)}</td>
                    <td>€{availableGrants.HeatingControlsGrant}*</td>
                    <td>€{availableGrants.HeatingControlsGrant.toFixed(2)}</td>
                    <td>€{Math.max(0, (improvementCosts.HeatingControls * HeatingControlsQuantity) - availableGrants.HeatingControlsGrant).toFixed(2)}</td>
                    <td>
                      <div className="checkbox-container">
                        <input type="checkbox" id="applyHeatingControls" name="applyHeatingControlsGrant"
                               onChange={(e) => handleCheckboxChange(e,
                                 'HeatingControls',
                                 improvementCosts.HeatingControls * HeatingControlsQuantity,
                                 availableGrants.HeatingControlsGrant)}
                        />
                        <label htmlFor="applyHeatingControls">Select</label>
                      </div>
                    </td>
                  </tr>
                </>
            )}
            <tr>
              <td>Mechanical Ventilation</td>
              <td>{MechanicalVentilationQuantity}</td>
              <td>€{(improvementCosts.MechanicalVentilation * MechanicalVentilationQuantity).toFixed(2)}</td>
              <td>€{availableGrants.MechanicalVentilationGrant}*</td>
              <td>€{availableGrants.MechanicalVentilationGrant.toFixed(2)}</td>
              <td>€{Math.max(0, (improvementCosts.MechanicalVentilation * MechanicalVentilationQuantity) - availableGrants.MechanicalVentilationGrant).toFixed(2)}</td>
              <td>
                <div className="checkbox-container">
                  <input type="checkbox" id="applyMechanicalVentilation" name="applyMechanicalVentilationGrant"
                         onChange={(e) => handleCheckboxChange(e,
                           'MechanicalVentilation',
                           improvementCosts.MechanicalVentilation * MechanicalVentilationQuantity,
                           availableGrants.MechanicalVentilationGrant)}
                  />
                  <label htmlFor="applyMechanicalVentilation">Select</label>
                </div>
              </td>
            </tr>
            <tr>
              <td>Air Tightness</td>
              <td>{AirTightnessQuantity}</td>
              <td>€{(improvementCosts.AirTightness * AirTightnessQuantity).toFixed(2)}</td>
              <td>€{availableGrants.AirTightnessGrant}*</td>
              <td>€{availableGrants.AirTightnessGrant.toFixed(2)}</td>
              <td>€{Math.max(0, (improvementCosts.AirTightness * AirTightnessQuantity) - availableGrants.AirTightnessGrant).toFixed(2)}</td>
              <td>
                <div className="checkbox-container">
                  <input type="checkbox" id="applyAirTightness" name="applyAirTightnessGrant"
                         onChange={(e) => handleCheckboxChange(e,
                           'AirTightness',
                           improvementCosts.AirTightness * AirTightnessQuantity,
                           availableGrants.AirTightnessGrant)}
                  />
                  <label htmlFor="applyAirTightness">Select</label>
                </div>
              </td>
            </tr>
            <tr className="total-row">
              <td colSpan="2">Total</td>
              <td>€{totalEstimatedCost.toFixed(2)}</td>
              <td>€{totalAvailableGrant}</td>
              <td>€{totalRecalculatedGrant.toFixed(2)}*</td>
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
