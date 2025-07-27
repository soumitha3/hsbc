import React, { useEffect, useState } from 'react';
import API from '../api';
import { jwtDecode } from 'jwt-decode';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28'];

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }

    const decoded = jwtDecode(token);
    setRole(decoded.role);
    setUsername(decoded.username);

    API.get('/api/transactions', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setTransactions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          window.location.href = '/';
        }
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  // Common chart data transformations
  const categoryData = Object.values(transactions.reduce((acc, tx) => {
    const cat = tx.category;
    acc[cat] = acc[cat] || { name: cat, value: 0 };
    acc[cat].value += Number(tx.amount);
    return acc;
  }, {}));

  const fraudData = [
    { name: 'Fraud', count: transactions.filter(t => t.fraud).length },
    { name: 'Non-Fraud', count: transactions.filter(t => !t.fraud).length },
  ];

  const merchantData = Object.values(transactions.reduce((acc, tx) => {
    const merchant = tx.merchant;
    acc[merchant] = acc[merchant] || { name: merchant, value: 0 };
    acc[merchant].value += Number(tx.amount);
    return acc;
  }, {}));

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '0'
  };

  const headerStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '20px 0',
    marginBottom: '30px'
  };

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    padding: '25px',
    marginBottom: '25px',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  };

  const titleStyle = {
    color: '#333',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    borderBottom: '3px solid #667eea',
    paddingBottom: '10px',
    display: 'inline-block'
  };

  const statsCardStyle = {
    background: 'linear-gradient(135deg, #ebebebff, #f9f9f9ff)',
    color: '#667eea',
    borderRadius: '15px',
    padding: '20px',
    textAlign: 'center',
    marginBottom: '20px',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px'
  };

  const tableStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
  };

  const loadingStyle = {
    textAlign: 'center',
    padding: '50px',
    color: 'white',
    fontSize: '18px'
  };

  const userInfoStyle = {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '16px',
    fontWeight: '500'
  };

  const roleColor = role === 'admin' ? '#ff6b6b' : role === 'client' ? '#4ecdc4' : '#45b7d1';

  return (
    <div style={containerStyle}>
      <style>
        {`
          .dashboard-button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 15px 35px rgba(255, 107, 107, 0.4) !important;
          }
          .stats-card:hover {
            transform: translateY(-5px) !important;
            box-shadow: 0 20px 40px rgba(102, 126, 234, 0.4) !important;
          }
          .chart-card:hover {
            transform: translateY(-3px) !important;
            box-shadow: 0 25px 50px rgba(0,0,0,0.15) !important;
          }
          .table-row:hover {
            background-color: rgba(102, 126, 234, 0.1) !important;
          }
        `}
      </style>

      {/* Header */}
      <div style={headerStyle}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0', marginBottom: '5px' }}>
                Dashboard
              </h1>
              <p style={userInfoStyle}>
                Welcome back, <strong>{username}</strong> • 
                <span style={{ 
                  backgroundColor: roleColor, 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  marginLeft: '8px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {role.toUpperCase()}
                </span>
              </p>
            </div>
            <button 
              className="dashboard-button"
              style={buttonStyle} 
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {loading ? (
          <div style={loadingStyle}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              border: '4px solid rgba(255,255,255,0.3)', 
              borderTop: '4px solid white', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            Loading your data...
          </div>
        ) : transactions.length === 0 ? (
          <div style={cardStyle}>
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
              <h3>No transactions found</h3>
              <p>Start by adding some transaction data to see your dashboard.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div className="stats-card" style={{ ...statsCardStyle, transition: 'all 0.3s ease' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}></div>
                <h3 style={{ margin: '0', fontSize: '24px' }}>
                  ${transactions.reduce((sum, tx) => sum + Number(tx.amount), 0).toFixed(2)}
                </h3>
                <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Total Amount</p>
              </div>
              <div className="stats-card" style={{ ...statsCardStyle, transition: 'all 0.3s ease' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}></div>
                <h3 style={{ margin: '0', fontSize: '24px' }}>{transactions.length}</h3>
                <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Total Transactions</p>
              </div>
              <div className="stats-card rgba(255, 255, 255, 0.95)" style={{ ...statsCardStyle, transition: 'all 0.3s ease' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}></div>
                <h3 style={{ margin: '0', fontSize: '24px' }}>
                  {transactions.filter(t => t.fraud).length}
                </h3>
                <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Fraud Cases</p>
              </div>
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px', marginBottom: '30px' }}>
              {/* Admin View */}
              {role === 'admin' && (
                <>
                  <div className="chart-card" style={{ ...cardStyle, transition: 'all 0.3s ease' }}>
                    <h5 style={titleStyle}>📈 Total Amount by Category</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cat-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart-card" style={{ ...cardStyle, transition: 'all 0.3s ease' }}>
                    <h5 style={titleStyle}>Fraud Detection Overview</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={fraudData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#ff6361" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}

              {/* Client View */}
              {role === 'client' && (
                <>
                  <div className="chart-card" style={{ ...cardStyle, transition: 'all 0.3s ease' }}>
                    <h5 style={titleStyle}>Total Amount by Merchant</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={merchantData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {merchantData.map((entry, index) => (
                            <Cell key={`merchant-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart-card" style={{ ...cardStyle, transition: 'all 0.3s ease' }}>
                    <h5 style={titleStyle}>🔍 Fraud Overview</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={fraudData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}

              {/* User View */}
              {role === 'user' && (
                <>
                  <div className="chart-card" style={{ ...cardStyle, transition: 'all 0.3s ease' }}>
                    <h5 style={titleStyle}>Spending by Merchant</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={merchantData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart-card" style={{ ...cardStyle, transition: 'all 0.3s ease' }}>
                    <h5 style={titleStyle}>Fraud Detection</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={fraudData}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {fraudData.map((entry, index) => (
                            <Cell key={`fraud-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </div>

            {/* Transactions Table */}
            <div style={cardStyle}>
              <h4 style={titleStyle}>All Transactions</h4>
              <div style={tableStyle}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white' }}>
                      <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>ID</th>
                      <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Customer</th>
                      <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Gender</th>
                      <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Merchant</th>
                      <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Category</th>
                      <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Amount</th>
                      <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Fraud</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, index) => (
                      <tr 
                        key={tx.id} 
                        className="table-row"
                        style={{ 
                          backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'white',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <td style={{ padding: '15px', borderBottom: '1px solid #eee' }}>{tx.id}</td>
                        <td style={{ padding: '15px', borderBottom: '1px solid #eee', fontWeight: '500' }}>
                          {tx.customer?.replace(/['"]/g, '')}
                        </td>
                        <td style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                          <span style={{ 
                            backgroundColor: tx.gender === 'M' ? '#e3f2fd' : '#fce4ec',
                            color: tx.gender === 'M' ? '#1976d2' : '#c2185b',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {tx.gender === 'M' ? '👨 Male' : '👩 Female'}
                          </span>
                        </td>
                        <td style={{ padding: '15px', borderBottom: '1px solid #eee' }}>{tx.merchant}</td>
                        <td style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                          <span style={{
                            backgroundColor: '#f5f5f5',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {tx.category}
                          </span>
                        </td>
                        <td style={{ padding: '15px', borderBottom: '1px solid #eee', fontWeight: '600', color: '#2e7d32' }}>
                          ${Number(tx.amount).toFixed(2)}
                        </td>
                        <td style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                          <span style={{
                            backgroundColor: tx.fraud ? '#ffebee' : '#e8f5e8',
                            color: tx.fraud ? '#d32f2f' : '#2e7d32',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {tx.fraud ? '🚨 Fraud' : '✅ Safe'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;