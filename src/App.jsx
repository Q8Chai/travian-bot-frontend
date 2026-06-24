import React, { useState, useEffect } from 'react';
// استدعاء شاشة التحكم بالدخول الزجاجية الجديدة من مكانها الصحيح
import AuthScreen from './components/AuthScreen';

const itemsData = [
  /* --- التبويب الأول: الحقول الخارجية dorf1 --- */
  { id: 'wood_fields', name: 'Wood Fields (حقول الخشب)', type: 'dorf1', maxLimit: 10 },
  { id: 'clay_fields', name: 'Clay Fields (حقول الطين)', type: 'dorf1', maxLimit: 10 },
  { id: 'iron_fields', name: 'Iron Fields (مناجم الحديد)', type: 'dorf1', maxLimit: 10 },
  { id: 'crop_fields', name: 'Crop Fields (حقول القمح)', type: 'dorf1', maxLimit: 10 },

  /* --- التبويب الثاني: مباني البنية التحتية dorf2 --- */
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

  /* --- مباني عسكرية ودفاعية dorf2 --- */
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

  /* --- مباني متقدمة وخاصة dorf2 --- */
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
  
  // نقرأ حالة الدخول السابقة مباشرة من الـ localStorage أول ما يفتح التطبيق
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('bot_is_logged_in') === 'true';
  });

  // --- حالات خاصة بالنافذة المنبثقة لربط الحساب ---
  const [showModal, setShowModal] = useState(false);
  const [gameUsername, setGameUsername] = useState('');
  const [gamePassword, setGamePassword] = useState('');
  const [serverUrl, setServerUrl] = useState('');

  // دالة جلب البيانات من السيرفر السحابي
  const fetchConfigFromServer = () => {
    fetch('http://161.35.25.67:5000/api/config', {
  headers: { 'user-email': localStorage.getItem('userEmail') }
})
      .then(res => res.json())
      .then(data => {
        const forcedCleanData = { ...data };
        if (!forcedCleanData.resources) {
          forcedCleanData.resources = { wood: "0", clay: "0", iron: "0", crop: "0" };
        }
        
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
    fetchConfigFromServer();
  }, []);

  const handleLoginSuccess = () => {
    localStorage.setItem('bot_is_logged_in', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('bot_is_logged_in');
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
        newQueue.push({
          id: item.id,
          name: item.name,
          targetLevel: updatedConfig.targets[item.id] || 0
        });
      }
    });
    updatedConfig.queues[type] = newQueue;
    
    if (newQueue.length === 0) {
      updatedConfig.botStates[type] = 'stopped';
    }
    setConfig(updatedConfig);
  };

  const handleToggleTabBot = (type) => {
    const currentQueue = config.queues?.[type] || [];
    if (currentQueue.length === 0) return;

    const updatedConfig = { ...config };
    if (!updatedConfig.botStates) updatedConfig.botStates = { dorf1: 'stopped', dorf2: 'stopped' };
    updatedConfig.botStates[type] = updatedConfig.botStates[type] === 'running' ? 'stopped' : 'running';
    setSaveStatus(`🔄 Updating ${type === 'dorf1' ? 'Fields' : 'Buildings'} Engine...`);

    fetch('http://161.35.25.67:5000/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    if (!gameUsername || !gamePassword || !serverUrl) {
      alert("يرجى ملء جميع الحقول المطلوبة!");
      return;
    }

    const payload = { gameUsername, gamePassword, serverUrl };
    setSaveStatus('🔗 Connecting and pulling live resources... (Wait 8s)');

    // 🎯 تم تعديل هذا الرابط ليطالع الباك إند السحابي
    fetch('http://161.35.25.67:5000/api/bot/link-account', {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
          'user-email': localStorage.getItem('userEmail') // هذا السطر اللي سوينا له إضافة
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setShowModal(false);
        setGameUsername('');
        setGamePassword('');
        setServerUrl('');

        setTimeout(() => {
          fetchConfigFromServer();
          setSaveStatus('✅ تم تحديث لوحة التحكم بالموارد الحية الحقيقية!');
          setTimeout(() => setSaveStatus(''), 3000);
        }, 8000);

      } else {
        alert("❌ فشل الربط: " + data.message);
        setSaveStatus('');
      }
    })
    .catch(err => {
      console.error("Error linking account:", err);
      alert("❌ حدث خطأ أثناء الاتصال بالسيرفر");
      setSaveStatus('');
    });
  };

  if (!config) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '150px', backgroundColor: '#121212', color: '#4caf50', height: '100vh', fontFamily: 'sans-serif', fontSize: '18px', fontWeight: 'bold' }}>
        🔄 Injecting Strategy Matrices from Cloud...
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  const filteredItems = itemsData.filter(item => item.type === activeTab);
  const currentQueue = config.queues?.[activeTab] || [];
  const isCurrentBotRunning = config.botStates?.[activeTab] === 'running';
  const isQueueEmpty = currentQueue.length === 0;

  return (
    <div style={{ padding: '20px', maxWidth: '1450px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#fff' }}>
      
      {/* هيدر اللوحة مع إضافة زر تسجيل الخروج */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div style={{ width: '100px' }}></div>
        <h1 style={{ color: '#fff', margin: 0 }}>Travian Strategy Control Panel 🤖</h1>
        <button 
          onClick={handleLogout}
          style={{ padding: '8px 15px', background: '#333', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          🚪 خروج
        </button>
      </div>
      
      {/* شريط الموارد العلوي الثابت */}
      <table style={{ width: '100%', background: '#e0e0e0', padding: '15px', borderRadius: '8px', marginBottom: '30px', borderCollapse: 'collapse', textAlign: 'center' }}>
        <tbody>
          <tr>
            <td style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000', width: '25%' }}>🪵 Wood: {config.resources?.wood || 0}</td>
            <td style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000', width: '25%' }}>🧱 Clay: {config.resources?.clay || 0}</td>
            <td style={{ fontSize: '16px', fontWeight: 'bold', color: '#0a0b0c', width: '25%' }}>⚔️ Iron: {config.resources?.iron || 0}</td>
            <td style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000', width: '25%' }}>🌾 Crop: {config.resources?.crop || 0}</td>
          </tr>
        </tbody>
      </table>

      {/* الهيكل الإيجابي النهائي */}
      <table style={{ width: '100%', borderCollapse: 'collapse', alignItems: 'flex-start' }}>
        <tbody>
          <tr>
            
            {/* 1. أقصى اليسار: أزرار التبويبات العمودية */}
            <td style={{ width: '200px', verticalAlign: 'top', paddingRight: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => setActiveTab('dorf1')} style={{ padding: '12px', background: activeTab === 'dorf1' ? '#4caf50' : '#1e1e1e', color: '#fff', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', textAlign: 'left' }}>🌾 Resource Fields</button>
                <button onClick={() => setActiveTab('dorf2')} style={{ padding: '12px', background: activeTab === 'dorf2' ? '#4caf50' : '#1e1e1e', color: '#fff', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', textAlign: 'left' }}>🏛️ Village Buildings</button>
                <button disabled style={{ padding: '12px', background: '#151515', color: '#444', border: '1px solid #222', borderRadius: '6px', cursor: 'not-allowed', fontWeight: 'bold', textAlign: 'left' }}>⚔️ Troops (Soon)</button>
                <button disabled style={{ padding: '12px', background: '#151515', color: '#444', border: '1px solid #222', borderRadius: '6px', cursor: 'not-allowed', fontWeight: 'bold', textAlign: 'left' }}>🦅 Hero (Soon)</button>
                
                <button 
                  onClick={() => setShowModal(true)} 
                  style={{ padding: '12px', background: '#008cba', color: '#fff', border: '1px solid #005f73', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', textAlign: 'left', marginTop: '15px' }}
                >
                  🔗 Link Game Account
                </button>
              </div>
            </td>

            {/* 2. المنتصف: جدول الاختيارات */}
            <td style={{ verticalAlign: 'top', paddingRight: '20px' }}>
              <div style={{ background: '#1e1e1e', borderRadius: '8px', padding: '20px', border: '1px solid #2d2d2d' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#4caf50' }}>
                  {activeTab === 'dorf1' ? '🌾 Resource Fields Control' : '🏛️ Village Buildings Control'}
                </h3>
                
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
                          <input 
                            type="number" 
                            min="0"
                            max={item.maxLimit}
                            value={config.targets?.[item.id] || 0}
                            onChange={(e) => handleTargetChange(item.id, e.target.value, activeTab, item.maxLimit)}
                            style={{ width: '60px', background: '#2a2a2a', border: '1px solid #555', color: '#fff', padding: '6px', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold' }}
                          />
                          <span style={{ display: 'block', fontSize: '11px', color: '#666', marginTop: '2px' }}>الماكس: {item.maxLimit}</span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button 
                            onClick={() => handleToggleSelect(item.id, activeTab)}
                            style={{ padding: '6px 12px', background: config.status?.[item.id] ? '#e0a800' : '#333', color: config.status?.[item.id] ? '#111' : '#ccc', border: '1px solid #555', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', width: '110px' }}
                          >
                            {config.status?.[item.id] ? '✓ تم الاختيار' : '➕ اختيار'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {saveStatus && <div style={{ marginTop: '15px', fontWeight: 'bold', color: '#e0a800', textAlign: 'center' }}>{saveStatus}</div>}
              </div>
            </td>

            {/* 3. أقصى اليمين: القائمة الجانبية الثابتة */}
            <td style={{ width: '340px', verticalAlign: 'top' }}>
              <div style={{ position: 'sticky', top: '20px', background: '#1e1e1e', borderRadius: '8px', padding: '20px', border: '1px solid #2d2d2d', boxShadow: '0 4px 15px rgba(0,0,0,0.6)' }}>
                <h3 style={{ margin: '0 0 5px 0', color: '#fff' }}>📋 {activeTab === 'dorf1' ? 'Fields Queue' : 'Buildings Queue'}</h3>
                <p style={{ fontSize: '12px', color: '#aaa', margin: '0 0 15px 0' }}>مراجعة خطة الأوامر الجانبية:</p>
                
                <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
                  {isQueueEmpty ? (
                    <div style={{ color: '#ff9800', textAlign: 'center', padding: '20px', background: '#222', borderRadius: '6px', fontSize: '13px' }}>
                      القائمة فارغة تماماً. حدد مستويات واضغط "➕ اختيار" من الجدول الأيسر لتعبئتها هنا!
                    </div>
                  ) : (
                    currentQueue.map((queueItem, index) => (
                      <div key={queueItem.id} style={{ background: '#2a2a2a', padding: '12px', marginBottom: '8px', borderRadius: '6px', borderLeft: '5px solid #e0a800', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#fff' }}>{index + 1}. {queueItem.name}</span>
                        <span style={{ background: '#444', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>🎯 لفل {queueItem.targetLevel}</span>
                      </div>
                    ))
                  )}
                </div>

                <button 
                  onClick={() => handleToggleTabBot(activeTab)}
                  disabled={isQueueEmpty}
                  style={{ 
                    width: '100%', 
                    padding: '15px', 
                    background: isQueueEmpty ? '#2a2a2a' : (isCurrentBotRunning ? '#f44336' : '#008cba'), 
                    color: isQueueEmpty ? '#666' : '#fff', 
                    border: 'none', 
                    borderRadius: '6px', 
                    fontSize: '15px', 
                    fontWeight: 'bold', 
                    cursor: isQueueEmpty ? 'not-allowed' : 'pointer', 
                    boxShadow: isQueueEmpty ? 'none' : '0 4px 12px rgba(0,0,0,0.3)'
                  }}
                >
                  {isQueueEmpty 
                    ? '⚠️ يرجى اختيار أوامر أولاً' 
                    : (isCurrentBotRunning ? `🛑 إيقاف أوامر ${activeTab === 'dorf1' ? 'الحقول' : 'المباني'}` : `🚀 كبس لتشغيل وتفعيل المحرك`)}
                </button>
                
                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: isCurrentBotRunning ? '#4caf50' : '#888' }}>
                  حالة المحرك: <strong>{isCurrentBotRunning ? 'LIVE / شغال دائرياً' : 'موقف في انتظار كبستك'}</strong>
                </div>
              </div>
            </td>

          </tr>
        </tbody>
      </table>

      {/* النافذة المنبثقة لربط الحساب */}
      {showModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.glassBox}>
            <h2 style={modalStyles.title}>🔗 ربط حساب لعبة جديد</h2>
            <p style={modalStyles.subtitle}>أدخل بيانات حساب ترافيان ليتمكن محرك البوت من إدارته</p>
            
            <form onSubmit={handleLinkAccountSubmit} style={modalStyles.form}>
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>اسم المستخدم باللعبة:</label>
                <input 
                  type="text" 
                  value={gameUsername} 
                  onChange={(e) => setGameUsername(e.target.value)} 
                  placeholder="مثال: Shamlan_King" 
                  style={modalStyles.input}
                />
              </div>

              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>كلمة المرور:</label>
                <input 
                  type="password" 
                  value={gamePassword} 
                  onChange={(e) => setGamePassword(e.target.value)} 
                  placeholder="••••••••" 
                  style={modalStyles.input}
                />
              </div>

              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>رابط سيرفر اللعبة (URL):</label>
                <input 
                  type="url" 
                  value={serverUrl} 
                  onChange={(e) => setServerUrl(e.target.value)} 
                  placeholder="https://ts1.x2.arabia.travian.com" 
                  style={modalStyles.input}
                />
              </div>

              <div style={modalStyles.actions}>
                <button type="submit" style={modalStyles.btnConfirm}>تأكيد الربط 🚀</button>
                <button type="button" onClick={() => setShowModal(false)} style={modalStyles.btnCancel}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    direction: 'rtl'
  },
  glassBox: {
    width: '420px',
    padding: '30px',
    background: 'rgba(30, 30, 30, 0.85)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)'
  },
  title: {
    margin: '0 0 8px 0',
    color: '#fff',
    fontSize: '22px',
    fontWeight: '600',
    textAlign: 'center'
  },
  subtitle: {
    margin: '0 0 25px 0',
    color: '#aaa',
    fontSize: '13px',
    textAlign: 'center',
    lineHeight: '1.5'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '14px',
    color: '#4caf50',
    fontWeight: 'bold'
  },
  input: {
    padding: '10px',
    background: '#2a2a2a',
    border: '1px solid #555',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '14px'
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '15px'
  },
  btnConfirm: {
    flex: 2,
    padding: '12px',
    background: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  btnCancel: {
    flex: 1,
    padding: '12px',
    background: '#444',
    color: '#ccc',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default App;