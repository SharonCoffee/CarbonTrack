// TODO
// 1. Replace the placeholder URLs with your actual backend endpoints
// 2. Adjust the data structure and rendering logic to match your actual data
// 3. Customize the appearance and layout of the dashboard components
// 4. Import graphing libraries or components as needed
// 5. Add any additional features or functionality required for your policy insights dashboard

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useParams } from 'react-router-dom';
import Papa from 'papaparse';

const Dashboard = () => {
  const { county } = useParams();
  const [data, setData] = useState({}); // State to hold your dashboard data

  const [retrofitData, setRetrofitData] = useState([]);

  const energyRatingColors = {
    A1: '#008000',
    A2: '#008000',
    A3: '#008000',
    B1: '#3fc43f',
    B2: '#3fc43f',
    B3: '#3fc43f',
    C1: '#eeec20',
    C2: '#eeec20',
    C3: '#eeec20',
    D1: '#FFC300', // Amber, using hex color code
    D2: '#FFC300', // Amber, using hex color code
    E1: '#e7ac4a',
    E2: '#e7ac4a',
    F: '#ee8908',
    G: '#cc0000'
  };

  useEffect(() => {
    if (data === 0) {
      return;
    }
    // Function to fetch data based on the county
    const fetchDataForCounty = async () => {
      // Replace with your actual data fetching logic
      const response = await fetch(`/api/data/${county}`);
      const data = await response.json();
      setData(data);
    };

    fetchDataForCounty(); // Call the function without .then()

    const fetchLeitrimData = async () => {
      const response = await fetch('/data/data_leitrim.csv');
      const reader = response.body.getReader();
      const result = await reader.read(); // raw array
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value); // the csv text
      const parsedData = Papa.parse(csv, { header: true });

      const energyRatingsCount = {};
      parsedData.data.forEach(item => {
        const rating = item.EnergyRating;
        if (rating) {
          energyRatingsCount[rating] = (energyRatingsCount[rating] || 0) + 1;
        }
      });

      const chartData = Object.keys(energyRatingsCount).map(rating => ({
        name: rating,
        count: energyRatingsCount[rating]
      }));

      setRetrofitData(chartData);
    };

    fetchLeitrimData(); // Call the function without .then()
  }, [county]);

  const renderRetrofitProgress = () => {
    return (
            <BarChart width={600} height={300} data={retrofitData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(energyRatingColors).map(key => (
                    <Bar key={key} dataKey="count" fill={energyRatingColors[key]} name={`Energy Rating ${key}`} />
                ))}
            </BarChart>
    );
  };

  return (
      <>
        <div>
          <h1>{county} Dashboard</h1>
          {/* Render your dashboard UI here using the fetched data */}
        </div>
        <div>
            <h2>Retrofitting Overview</h2>
            {renderRetrofitProgress()}
        </div>
      </>

  );
};

export default Dashboard;
