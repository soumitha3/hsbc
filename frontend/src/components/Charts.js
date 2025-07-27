import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

function Charts({ data }) {
  const fraudStats = [
    { name: 'Fraud', value: data.filter(tx => tx.fraud).length },
    { name: 'Legit', value: data.filter(tx => !tx.fraud).length },
  ];

  const COLORS = ['#FF6347', '#00C49F'];

  return (
    <div className="mt-4">
      <h4>Fraud vs Legit</h4>
      <PieChart width={400} height={300}>
        <Pie
          data={fraudStats}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {fraudStats.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default Charts;
