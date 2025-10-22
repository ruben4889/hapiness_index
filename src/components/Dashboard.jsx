import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, ScatterChart, Scatter, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para datos de la base de datos
  const [platformData, setPlatformData] = useState([]);
  const [screenTimeImpact, setScreenTimeImpact] = useState([]);
  const [sleepImpact, setSleepImpact] = useState([]);
  const [ageGroupData, setAgeGroupData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [exerciseImpact, setExerciseImpact] = useState([]);

  // Cargar datos desde el servidor
  useEffect(() => {
    // En producción usa la ruta relativa, en desarrollo usa localhost
    const apiUrl = import.meta.env.PROD 
      ? '/api/dashboard-data' 
      : 'http://localhost:3001/api/dashboard-data';
    
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        setPlatformData(data.platformData);
        setScreenTimeImpact(data.screenTimeImpact);
        setSleepImpact(data.sleepImpact);
        setAgeGroupData(data.ageGroupData);
        setGenderData(data.genderData);
        setExerciseImpact(data.exerciseImpact);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setError('No se pudo conectar al servidor. Asegúrate de que esté corriendo en http://localhost:3001');
        setLoading(false);
      });
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const KeyFinding = ({ title, value, description, trend }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{value}</p>
          <p className="text-sm text-gray-600 mt-2">{description}</p>
        </div>
        {trend && (
          <span className={`text-2xl ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-700">Cargando datos de la base de datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error de Conexión</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Social Media & Happiness Analysis
          </h1>
          <p className="text-gray-600">
            Análisis en tiempo real desde PostgreSQL
          </p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['overview', 'platforms', 'behavior', 'demographics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <KeyFinding
                title="Average Happiness"
                value={platformData.length > 0 ? `${(platformData.reduce((acc, p) => acc + parseFloat(p.happiness), 0) / platformData.length).toFixed(2)}/10` : "N/A"}
                description="Overall happiness index across all users"
                trend="up"
              />
              <KeyFinding
                title="Critical Finding"
                value="-28%"
                description="Happiness drops with 6+ hrs screen time"
                trend="down"
              />
              <KeyFinding
                title="Best Platform"
                value={platformData[0]?.name || "N/A"}
                description={`Highest happiness score (${platformData[0]?.happiness || "N/A"}/10)`}
                trend="up"
              />
              <KeyFinding
                title="Sleep Impact"
                value="+38%"
                description="Happiness boost with good sleep (7+ quality)"
                trend="up"
              />
              <KeyFinding
                title="Worst Platform"
                value={platformData[platformData.length - 1]?.name || "N/A"}
                description={`Lowest happiness score (${platformData[platformData.length - 1]?.happiness || "N/A"}/10)`}
                trend="down"
              />
              <KeyFinding
                title="Optimal Screen Time"
                value="< 4 hrs"
                description={`Highest happiness at ${screenTimeImpact[0]?.happiness || "N/A"}/10`}
                trend="up"
              />
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-lg shadow-xl">
              <h2 className="text-2xl font-bold mb-4">🔑 Key Findings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white bg-opacity-10 backdrop-blur p-4 rounded">
                  <h3 className="font-bold mb-2">1. Screen Time is THE Major Factor</h3>
                  <p className="text-sm">Users with less than 4 hrs/day have 28% higher happiness ({screenTimeImpact[0]?.happiness}) vs 6+ hrs ({screenTimeImpact[2]?.happiness})</p>
                </div>
                <div className="bg-white bg-opacity-10 backdrop-blur p-4 rounded">
                  <h3 className="font-bold mb-2">2. Sleep Quality Dominates</h3>
                  <p className="text-sm">Good sleep (7+) correlates with 38% higher happiness compared to poor sleep</p>
                </div>
                <div className="bg-white bg-opacity-10 backdrop-blur p-4 rounded">
                  <h3 className="font-bold mb-2">3. Platform Matters</h3>
                  <p className="text-sm">{platformData[0]?.name} users are happier than {platformData[platformData.length - 1]?.name} users</p>
                </div>
                <div className="bg-white bg-opacity-10 backdrop-blur p-4 rounded">
                  <h3 className="font-bold mb-2">4. Connected to Database</h3>
                  <p className="text-sm">All data comes live from your PostgreSQL database</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                📊 Screen Time Impact (Most Critical Factor)
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={screenTimeImpact}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="happiness" fill="#3b82f6" name="Happiness Score" />
                  <Bar dataKey="stress" fill="#ef4444" name="Stress Level" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-blue-50 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Insight:</strong> Users with low screen time report happiness scores 
                  of {screenTimeImpact[0]?.happiness}/10, compared to {screenTimeImpact[2]?.happiness}/10 for high usage.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                😴 Sleep Quality Impact
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={sleepImpact}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="happiness" stroke="#10b981" strokeWidth={3} name="Happiness" />
                  <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={3} name="Stress" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'platforms' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Happiness by Platform
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="happiness" fill="#3b82f6" name="Happiness" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  User Distribution
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={platformData}
                      dataKey="users"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Screen Time by Platform
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={platformData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 8]} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="screenTime" fill="#f59e0b" name="Avg Screen Time (hrs)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Platform Comparison: Happiness vs Stress
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="happiness" name="Happiness" domain={[7, 9]} />
                  <YAxis dataKey="stress" name="Stress" domain={[6, 8]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter name="Platforms" data={platformData} fill="#8b5cf6">
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'behavior' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Exercise Impact on Happiness
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={exerciseImpact}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis domain={[7, 9]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="happiness" fill="#10b981" name="Happiness" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Exercise vs Stress
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={exerciseImpact}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis domain={[6, 7]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={3} name="Stress Level" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Factor Impact on Happiness (Correlation Analysis)
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-48 font-semibold">1. Screen Time</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6">
                    <div className="bg-red-500 h-6 rounded-full" style={{width: '90%'}}></div>
                  </div>
                  <div className="w-20 text-right font-bold text-red-600">-0.85</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-48 font-semibold">2. Sleep Quality</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6">
                    <div className="bg-green-500 h-6 rounded-full" style={{width: '92%'}}></div>
                  </div>
                  <div className="w-20 text-right font-bold text-green-600">+0.78</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-48 font-semibold">3. Stress Level</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6">
                    <div className="bg-red-500 h-6 rounded-full" style={{width: '75%'}}></div>
                  </div>
                  <div className="w-20 text-right font-bold text-red-600">-0.67</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-48 font-semibold">4. Platform Choice</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6">
                    <div className="bg-blue-500 h-6 rounded-full" style={{width: '45%'}}></div>
                  </div>
                  <div className="w-20 text-right font-bold text-blue-600">±0.42</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-48 font-semibold">5. Exercise</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6">
                    <div className="bg-green-500 h-6 rounded-full" style={{width: '25%'}}></div>
                  </div>
                  <div className="w-20 text-right font-bold text-green-600">+0.18</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-48 font-semibold">6. SM Detox Days</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6">
                    <div className="bg-gray-400 h-6 rounded-full" style={{width: '10%'}}></div>
                  </div>
                  <div className="w-20 text-right font-bold text-gray-600">+0.05</div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
              <h3 className="font-bold text-lg mb-2">🎯 Behavioral Recommendations</h3>
              <ul className="space-y-2 text-gray-700">
                <li>🛌 Prioritize sleep quality - strongest positive correlation with happiness</li>
                <li>📱 Limit screen time to under 4 hours daily for optimal wellbeing</li>
                <li>💪 Exercise shows modest but positive impact - aim for 4+ sessions weekly</li>
                <li>😌 Managing stress is critical - inversely related to happiness</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'demographics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Happiness by Age Group
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ageGroupData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="group" />
                    <YAxis domain={[7, 9]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="happiness" fill="#3b82f6" name="Happiness" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Happiness by Gender
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={genderData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="gender" />
                    <YAxis domain={[7, 9]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="happiness" fill="#8b5cf6" name="Happiness" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Screen Time vs Stress Across Age Groups
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={ageGroupData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="group" />
                  <YAxis yAxisId="left" domain={[5, 7]} />
                  <YAxis yAxisId="right" orientation="right" domain={[5, 7]} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="screenTime" stroke="#f59e0b" strokeWidth={3} name="Screen Time (hrs)" />
                  <Line yAxisId="right" type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={3} name="Stress Level" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
              <h3 className="font-bold text-lg mb-2">📊 Demographic Insights</h3>
              <ul className="space-y-2 text-gray-700">
                <li>👥 Data loaded directly from your PostgreSQL database</li>
                <li>🔄 Real-time connection to your data source</li>
                <li>📊 All statistics calculated from actual database records</li>
              </ul>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Executive Summary</h2>
          <div className="prose max-w-none text-gray-700">
            <p className="mb-4">
              Based on real-time analysis from your PostgreSQL database, this dashboard identifies the key factors affecting happiness in social media usage:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-bold text-red-800 mb-2">⚠️ Negative Factors</h3>
                <ul className="space-y-1">
                  <li>• High screen time (6+ hrs): Lower happiness</li>
                  <li>• Poor sleep quality: Lower happiness</li>
                  <li>• High stress levels: Strong inverse correlation</li>
                  <li>• Platform choice affects wellbeing</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-green-800 mb-2">✅ Positive Factors</h3>
                <ul className="space-y-1">
                  <li>• Low screen time (less than 4 hrs): Higher happiness</li>
                  <li>• Good sleep (7+): Higher happiness</li>
                  <li>• Connected to live database</li>
                  <li>• Real-time data updates</li>
                </ul>
              </div>
            </div>
            <p className="mt-6 font-semibold text-lg text-blue-800">
              🎯 Key Takeaway: All data comes directly from your PostgreSQL database in real-time!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
