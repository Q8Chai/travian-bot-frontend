import React, { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';

const itemsData = [
  { id: 'wood_fields', name: 'Wood Fields (حقول الخشب)', type: 'dorf1', maxLimit: 10 },
  { id: 'clay_fields', name: 'Clay Fields (حقول الطين)', type: 'dorf1', maxLimit: 10 },
  { id: 'iron_fields', name: 'Iron Fields (مناجم الحديد)', type: 'dorf1', maxLimit: 10 },
  { id: 'crop_fields', name: 'Crop Fields (حقول القمح)', type: 'dorf1', maxLimit: 10 },
  { id: 'main_building', name: 'Main Building (المبنى الرئيسي)', type: 'dorf2', maxLimit: 20 },
  { id: 'wood_sawmill', name: 'Sawmill (معمل قطع الخشب)', type: 'dorf2', maxLimit: 10 },
  { id: 'clay_brickworks', name: 'Brickworks (مصنع الطوب)', type: 'dorf2', maxLimit: 10 },
  { id: 'iron_foundry', name: 'Iron Foundry (مسبك الحديد)', type: 'dorf2', maxLimit: 10 },
  { id: 'grain_mill', name: 'Grain Mill (المطحنة)', type: 'dorf2', maxLimit: 5 },
  { id: 'bakery', name: 'Bakery (المخبز)', type: 'dorf2', maxLimit: 5 },
  { id: 'warehouse', name: 'Warehouse (المخزن)', type: 'dorf2', maxLimit: 20 },
  { id: 'granary', name: 'Granary (مستودع الحبوب)', type: 'dorf2', maxLimit: 20 },
  { id: 'great_warehouse', name: 'Great Warehouse (المخزن الكبير)', type: 'dorf2', maxLimit: 20 },
  { id: 'great_granary', name: 'Great Granary (مستودع الحبوب الكبير)', type: 'dorf2', maxLimit: 20 },
  { id: 'cranny', name: 'Cranny (المخبأ)', type: 'dorf2', maxLimit: 10 },
  { id: 'embassy', name: 'Embassy (السفارة)', type: 'dorf2', maxLimit: 20 },
  { id: 'marketplace', name: 'Marketplace (السوق)', type: 'dorf2', maxLimit: 20 },
  { id: 'trade_office', name: 'Trade Office (المكتب التجاري)', type: 'dorf2', maxLimit: 20 },
  { id: 'rally_point', name: 'Rally Point (نقطة التجمع العسكرية)', type: 'dorf2', maxLimit: 20 },
  { id: 'barracks', name: 'Barracks (الثكنة)', type: 'dorf2', maxLimit: 20 },
  { id: 'great_barracks', name: 'Great Barracks (الثكنة الكبيرة)', type: 'dorf2', maxLimit: 20 },
  { id: 'stables', name: 'Stables (الإسطبل)', type: 'dorf2', maxLimit: 20 },
  { id: 'great_stables', name: 'Great Stables (الإسطبل الكبير)', type: 'dorf2', maxLimit: 20 },
  { id: 'workshop', name: 'Workshop (المصنع/الورشة)', type: 'dorf2', maxLimit: 20 },
  { id: 'academy', name: 'Academy (الأكاديمية)', type: 'dorf2', maxLimit: 20 },
  { id: 'smithy', name: 'Smithy (الحداد)', type: 'dorf2', maxLimit: 20 },
  { id: 'town_hall', name: 'Town Hall (البلدية)', type: 'dorf2', maxLimit: 20 },
  { id: 'palace', name: 'Palace (القصر)', type: 'dorf2', maxLimit: 20 },
  { id: 'residence', name: 'Residence (السكن)', type: 'dorf2', maxLimit: 20 },
  { id: 'heros_mansion', name: 'Hero\'s Mansion (قصر الأبطال)', type: 'dorf2', maxLimit: 20 },
  { id: 'hospital', name: 'Hospital (المستشفى)', type: 'dorf2', maxLimit: 20 },
  { id: 'city_wall', name: 'City Wall (السور / الجدار)', type: 'dorf2', maxLimit: 20 },
  { id: 'tournament_square', name: 'Tournament Square (ساحة البطولة)', type: 'dorf2', maxLimit: 20 },
  { id: 'water_watering_hole', name: 'Water Watering Hole (محطة المياه)', type: 'dorf2', maxLimit: 20 },
  { id: 'brewery', name: 'Brewery (المعصرة)', type: 'dorf2', maxLimit: 10 },
  { id: 'command_center', name: 'Command Center (المستشارية)', type: 'dorf2', maxLimit: 20 },
  { id: 'treasury', name: 'Treasury (خزنة التحف)', type: 'dorf2', maxLimit: 20 },
  { id: 'world_wonder', name: 'World Wonder (معجزة العالم)', type: 'dorf2', maxLimit: 100 }
];

function App() {
  const [config, setConfig] = useState(null);
  const [activeTab, setActiveTab] = useState('dorf1');
  const [saveStatus, setSaveStatus] = useState('');
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('bot_is_logged_in') === 'true';
  });

  const [showModal, setShowModal] = useState(false);
  const [gameUsername, setGameUsername] = useState('');
  const [gamePassword, setGamePassword] = useState('');
  const [serverUrl, setServerUrl] = useState('');

  // 🛡️ دالة احترافية لإضافة الهيدرز لكل طلبات السيرفر
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'user-email': localStorage.getItem('userEmail') || ''
  });

  const fetchConfigFromServer = () => {
    fetch('http://161.35.25.67:5000/api/config', { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => {
        const forcedCleanData = { ...data };
        if (!forcedCleanData.resources) forcedCleanData.resources = { wood: "0", clay: "0", iron: "0", crop: "0" };
        if (!forcedCleanData.status) forcedCleanData.status = {};
        if (!forcedCleanData.queues) forcedCleanData.queues = { dorf1: [], dorf2: [] };
        if (!forcedCleanData.botStates) forcedCleanData.botStates = { dorf1: 'stopped', dorf2: 'stopped' };
        if (!forcedCleanData.pointers) forcedCleanData.pointers = { dorf1: 0, dorf2: 0 };
        itemsData.forEach(item => {
          if (forcedCleanData.status[item.id] === undefined) forcedCleanData.status[item.id] = false;
          if (!forcedCleanData.targets) forcedCleanData.targets = {};
          if (forcedCleanData.targets[item.id] === undefined) forcedCleanData.targets[item.id] = 0;
        });
        setConfig(forcedCleanData);
      })
      .catch(err => console.error("Error connected to server:", err));
  };

  useEffect(() => {
    if (isLoggedIn) fetchConfigFromServer();
  }, [isLoggedIn]);

  const handleLoginSuccess = () => {
    localStorage.setItem('bot_is_logged_in', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('bot_is_logged_in');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
  };

  const handleTargetChange = (id, value, type, maxLimit) => {
    let parsedValue = parseInt(value) || 0;
    if (parsedValue > maxLimit) parsedValue = maxLimit;
    if (parsedValue < 0) parsedValue = 0;
    const updatedConfig = { ...config };
    if (!updatedConfig.targets) updatedConfig.targets = {};
    updatedConfig.targets[id] = parsedValue;
    rebuildSpecificQueue(updatedConfig, type);
  };

  const handleToggleSelect = (id, type) => {
    const updatedConfig = { ...config };
    if (!updatedConfig.status) updatedConfig.status = {};
    updatedConfig.status[id] = !updatedConfig.status[id];
    rebuildSpecificQueue(updatedConfig, type);
  };

  const rebuildSpecificQueue = (updatedConfig, type) => {
    if (!updatedConfig.queues) updatedConfig.queues = { dorf1: [], dorf2: [] };
    const newQueue = [];
    itemsData.filter(item => item.type === type).forEach(item => {
      if (updatedConfig.status[item.id]) {
        newQueue.push({ id: item.id, name: item.name, targetLevel: updatedConfig.targets[item.id] || 0 });
      }
    });
    updatedConfig.queues[type] = newQueue;
    if (newQueue.length === 0) updatedConfig.botStates[type] = 'stopped';
    setConfig(updatedConfig);
  };

  const handleToggleTabBot = (type) => {
    const currentQueue = config.queues?.[type] || [];
    if (currentQueue.length === 0) return;
    const updatedConfig = { ...config };
    updatedConfig.botStates[type] = updatedConfig.botStates[type] === 'running' ? 'stopped' : 'running';
    setSaveStatus(`🔄 Updating ${type === 'dorf1' ? 'Fields' : 'Buildings'} Engine...`);

    fetch('http://161.35.25.67:5000/api/config', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedConfig)
    })
    .then(res => res.json())
    .then(() => {
      setConfig(updatedConfig);
      setSaveStatus('✅ System Matrix updated!');
      setTimeout(() => setSaveStatus(''), 2000);
    });
  };

  const handleLinkAccountSubmit = (e) => {
    e.preventDefault();
    if (!gameUsername || !gamePassword || !serverUrl) return alert("يرجى ملء جميع الحقول!");
    const payload = { gameUsername, gamePassword, serverUrl };
    setSaveStatus('🔗 Connecting...');
    
    fetch('http://161.35.25.67:5000/api/bot/link-account', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setShowModal(false);
        setGameUsername(''); setGamePassword(''); setServerUrl('');
        setSaveStatus('✅ تم الربط بنجاح!');
        fetchConfigFromServer();
      } else {
        alert("❌ فشل الربط: " + data.message);
        setSaveStatus('');
      }
    });
  };

  if (!config && isLoggedIn) return <div style={{textAlign:'center', paddingTop:'150px', color:'#4caf50'}}>🔄 Loading...</div>;
  if (!isLoggedIn) return <AuthScreen onLoginSuccess={handleLoginSuccess} />;

  const filteredItems = itemsData.filter(item => item.type === activeTab);
  const currentQueue = config.queues?.[activeTab] || [];
  const isCurrentBotRunning = config.botStates?.[activeTab] === 'running';
  const isQueueEmpty = currentQueue.length === 0;

  return (
    <div style={{ padding: '20px', maxWidth: '1450px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div style={{ width: '100px' }}></div>
        <h1 style={{ color: '#fff', margin: 0 }}>Travian Strategy Control Panel 🤖</h1>
        <button onClick={handleLogout} style={{ padding: '8px 15px', background: '#333', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🚪 خروج</button>
      </div>
      
      <table style={{ width: '100%', background: '#e0e0e0', padding: '15px', borderRadius: '8px', marginBottom: '30px', borderCollapse: 'collapse', textAlign: 'center' }}>
        <tbody>
          <tr>
            <td style={{ fontSize: '16px', fontWeight: 'bold', color: '#000', width: '25%' }}>🪵 Wood: {config.resources?.wood || 0}</td>
            <td style={{ fontSize: '16px', fontWeight: 'bold', color: '#000', width: '25%' }}>🧱 Clay: {config.resources?.clay || 0}</td>
            <td style={{ fontSize: '16px', fontWeight: 'bold', color: '#0a0b0c', width: '25%' }}>⚔️ Iron: {config.resources?.iron || 0}</td>
            <td style={{ fontSize: '16px', fontWeight: 'bold', color: '#000', width: '25%' }}>🌾 Crop: {config.resources?.crop || 0}</td>
          </tr>
        </tbody>
      </table>

      <table style={{ width: '100%', borderCollapse: 'collapse', alignItems: 'flex-start' }}>
        <tbody>
          <tr>
            <td style={{ width: '200px', verticalAlign: 'top', paddingRight: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => setActiveTab('dorf1')} style={{ padding: '12px', background: activeTab === 'dorf1' ? '#4caf50' : '#1e1e1e', color: '#fff', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', textAlign: 'left' }}>🌾 Resource Fields</button>
                <button onClick={() => setActiveTab('dorf2')} style={{ padding: '12px', background: activeTab === 'dorf2' ? '#4caf50' : '#1e1e1e', color: '#fff', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', textAlign: 'left' }}>🏛️ Village Buildings</button>
                <button onClick={() => setShowModal(true)} style={{ padding: '12px', background: '#008cba', color: '#fff', border: '1px solid #005f73', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', textAlign: 'left', marginTop: '15px' }}>🔗 Link Game Account</button>
              </div>
            </td>
            <td style={{ verticalAlign: 'top', paddingRight: '20px' }}>
              <div style={{ background: '#1e1e1e', borderRadius: '8px', padding: '20px', border: '1px solid #2d2d2d' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#4caf50' }}>{activeTab === 'dorf1' ? '🌾 Resource Fields Control' : '🏛️ Village Buildings Control'}</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#2a2a2a' }}>
                      <th style={{ padding: '12px', color: '#4caf50', textAlign: 'left' }}>Target Name</th>
                      <th style={{ padding: '12px', color: '#4caf50', textAlign: 'left' }}>In-Game Level</th>
                      <th style={{ padding: '12px', color: '#4caf50', textAlign: 'left' }}>Target Level</th>
                      <th style={{ padding: '12px', color: '#4caf50', textAlign: 'left' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #2d2d2d' }}>
                        <td style={{ padding: '12px', color: '#fff' }}>{item.name}</td>
                        <td style={{ padding: '12px', fontWeight: 'bold', color: '#4caf50' }}>{config.currentLevels?.[item.id] || 0}</td>
                        <td style={{ padding: '12px' }}>
                          <input type="number" min="0" max={item.maxLimit} value={config.targets?.[item.id] || 0} onChange={(e) => handleTargetChange(item.id, e.target.value, activeTab, item.maxLimit)} style={{ width: '60px', background: '#2a2a2a', border: '1px solid #555', color: '#fff', padding: '6px', borderRadius: '4px', textAlign: 'center' }} />
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button onClick={() => handleToggleSelect(item.id, activeTab)} style={{ padding: '6px 12px', background: config.status?.[item.id] ? '#e0a800' : '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>{config.status?.[item.id] ? '✓ تم الاختيار' : '➕ اختيار'}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </td>
            <td style={{ width: '340px', verticalAlign: 'top' }}>
              <div style={{ position: 'sticky', top: '20px', background: '#1e1e1e', borderRadius: '8px', padding: '20px', border: '1px solid #2d2d2d' }}>
                <h3 style={{ margin: '0 0 5px 0', color: '#fff' }}>📋 Queue</h3>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {currentQueue.map((queueItem, index) => (
                    <div key={queueItem.id} style={{ background: '#2a2a2a', padding: '10px', marginBottom: '5px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{index + 1}. {queueItem.name}</span>
                      <span style={{ fontWeight: 'bold', color: '#e0a800' }}>لفل {queueItem.targetLevel}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => handleToggleTabBot(activeTab)} disabled={isQueueEmpty} style={{ width: '100%', padding: '15px', marginTop: '10px', background: isCurrentBotRunning ? '#f44336' : '#008cba', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {isCurrentBotRunning ? `🛑 Stop ${activeTab}` : `🚀 Start ${activeTab}`}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ background: '#222', padding: '30px', borderRadius: '12px', width: '400px', color: '#fff' }}>
            <h2>🔗 Link Account</h2>
            <form onSubmit={handleLinkAccountSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Username" value={gameUsername} onChange={(e) => setGameUsername(e.target.value)} style={{ padding: '10px', background: '#333', border: 'none', color: '#fff' }} />
              <input type="password" placeholder="Password" value={gamePassword} onChange={(e) => setGamePassword(e.target.value)} style={{ padding: '10px', background: '#333', border: 'none', color: '#fff' }} />
              <input type="url" placeholder="Server URL" value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} style={{ padding: '10px', background: '#333', border: 'none', color: '#fff' }} />
              <button type="submit" style={{ padding: '12px', background: '#4caf50', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;