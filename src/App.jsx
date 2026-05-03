import { useEffect, useState } from 'react';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import ElectionProcess from './pages/ElectionProcess';
import AIAssistant from './pages/AIAssistant';
import Quiz from './pages/Quiz';
import Modal from './components/Modal';
import { 
  LANGUAGE_LABELS, 
  FIRST_VOTE_ROADMAP, 
  FORM_ROADMAPS
} from './data/electionData.js';

import { useAuth } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';

const TABS = ['Dashboard', 'Process', 'AI Assistant', 'Quiz'];

function App() {
  const { user, loading: authLoading, authError, loginWithGoogle, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [language, setLanguage] = useState('en');
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState([]);
  
  // Roadmap logic
  const handleRoadmap = (formType = 'First Vote') => {
    if (formType === 'First Vote') {
      setModalTitle('First Vote - Complete Roadmap');
      setModalData(FIRST_VOTE_ROADMAP);
    } else {
      const roadmap = FORM_ROADMAPS[formType];
      if (roadmap) {
        setModalTitle(`${formType} - Detailed Guide`);
        setModalData(roadmap);
      } else {
        // Fallback for forms without specific roadmaps
        setModalTitle(`${formType} Information`);
        setModalData([{ step: 1, title: 'Learn More', details: [`Please consult ECI guidelines for ${formType}.`] }]);
      }
    }
    setShowModal(true);
  };

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Initialize Welcome Message
  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          role: 'ai',
          text: "Hello! I'm ElectionIQ — your AI guide for Indian elections. 🗳️ Ask me anything about voter registration, how EVMs work, election timelines, or your voting rights. I support multiple languages — change language above.",
        },
      ]);
    }
  }, [chatMessages.length]);

  const handleChatSubmit = async (customPrompt) => {
    const prompt = customPrompt?.trim() ?? chatInput.trim();
    if (!prompt || chatLoading) return;

    setChatInput('');
    setChatLoading(true);
    setChatMessages((prev) => [...prev, { role: 'user', text: prompt }]);

    try {
      const headers = { 
        'Content-Type': 'application/json',
      };
      
      if (user) {
        const token = await user.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          prompt, 
          language: LANGUAGE_LABELS[language] 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      setChatMessages((prev) => [...prev, { role: 'ai', text: data.text }]);
    } catch (error) {
      setChatMessages((prev) => [...prev, { role: 'ai', text: `⚠ ${error.message}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSuggestion = (prompt) => {
    setActiveTab(2); // Switch to AI Assistant tab
    handleChatSubmit(prompt);
  };

  // Show blank loading screen while Firebase checks auth state
  if (authLoading) {
    return (
      <div className="auth-init-screen">
        <div className="auth-init-logo">
          <svg viewBox="0 0 14 14" fill="none" width="40" height="40">
            <path d="M7 1.5L11 4.5V9.5L7 12.5L3 9.5V4.5L7 1.5Z" stroke="#7EA8E8" strokeWidth="1.2" fill="none" />
            <circle cx="7" cy="7" r="2" fill="#7EA8E8" />
          </svg>
        </div>
        <div className="auth-init-spinner" />
        <p className="auth-init-text">ElectionIQ</p>
      </div>
    );
  }

  // Show landing page if not logged in
  if (!user) {
    return <LandingPage onLogin={loginWithGoogle} loading={authLoading} authError={authError} />;
  }

  return (
    <div className="app">
      {authError && (
        <div className="auth-error-banner">
          ⚠️ {authError}
        </div>
      )}
      <Topbar 
        language={language} 
        setLanguage={setLanguage} 
        user={user}
        login={loginWithGoogle}
        logout={logout}
      />

      <div className="tabs" role="tablist" aria-label="Application Tabs">
        {TABS.map((tab, index) => (
          <button
            key={tab}
            type="button"
            className={`tab ${activeTab === index ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === index}
            aria-controls={`panel-${index}`}
            id={`tab-${index}`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>

      <main className="panels">
        <div 
          id="panel-0" 
          role="tabpanel" 
          aria-labelledby="tab-0" 
          hidden={activeTab !== 0}
        >
          {activeTab === 0 && <Dashboard />}
        </div>

        <div 
          id="panel-1" 
          role="tabpanel" 
          aria-labelledby="tab-1" 
          hidden={activeTab !== 1}
        >
          {activeTab === 1 && (
            <ElectionProcess 
              onFormClick={handleSuggestion} 
              onRoadmapClick={handleRoadmap} 
            />
          )}
        </div>

        <div 
          id="panel-2" 
          role="tabpanel" 
          aria-labelledby="tab-2" 
          hidden={activeTab !== 2}
        >
          {activeTab === 2 && (
            <AIAssistant 
              chatMessages={chatMessages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              handleChatSubmit={handleChatSubmit}
              chatLoading={chatLoading}
              handleSuggestion={handleSuggestion}
            />
          )}
        </div>

        <div 
          id="panel-3" 
          role="tabpanel" 
          aria-labelledby="tab-3" 
          hidden={activeTab !== 3}
        >
          {activeTab === 3 && <Quiz />}
        </div>
      </main>

      {/* Roadmap Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        footer={
          <button className="mbtn primary" onClick={() => setShowModal(false)}>Close</button>
        }
      >
        <div className="first-vote-content">
          {modalData.map((item) => (
            <section key={item.step} className="roadmap-step">
              <div className="step-header">
                <div className="step-number">{item.step}</div>
                <h3 className="step-title">{item.title}</h3>
              </div>
              <ul className="step-details">
                {item.details.map((detail, idx) => <li key={idx}>{detail}</li>)}
              </ul>
            </section>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default App;
