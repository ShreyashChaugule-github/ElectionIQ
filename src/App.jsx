import { useEffect, useState, useCallback } from 'react';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import ElectionProcess from './pages/ElectionProcess';
import AIAssistant from './pages/AIAssistant';
import Quiz from './pages/Quiz';
import Modal from './components/Modal';
import { 
  LANGUAGE_LABELS, 
  QUIZ, 
  FIRST_VOTE_ROADMAP, 
  FORM_ROADMAPS, 
  BOTS, 
  STATS 
} from './data/electionData.js';

const TABS = ['Dashboard', 'Process', 'AI Assistant', 'Quiz'];

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [language, setLanguage] = useState('en');
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState([]);
  const [apiConnected, setApiConnected] = useState(false);
  const [userApiKey, setUserApiKey] = useState('');
  
  // Modals
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const [modalError, setModalError] = useState('');

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
  }, []);

  const handleConnect = () => {
    setModalError('');
    setApiModalOpen(true);
  };

  const saveApiKey = () => {
    const key = userApiKey.trim();
    if (!/^AIza[A-Za-z0-9_-]{35,}$/.test(key)) {
      setModalError('Invalid key format. Gemini keys start with "AIza" followed by 35+ characters.');
      return;
    }
    setApiConnected(true);
    setApiModalOpen(false);
    setModalError('');
  };

  const handleChatSubmit = async (customPrompt) => {
    const prompt = customPrompt?.trim() ?? chatInput.trim();
    if (!prompt || chatLoading) return;

    if (!apiConnected) {
      setApiModalOpen(true);
      return;
    }

    setChatInput('');
    setChatLoading(true);
    setChatMessages((prev) => [...prev, { role: 'user', text: prompt }]);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-gemini-api-key': userApiKey 
        },
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

  return (
    <div className="app">
      <Topbar 
        language={language} 
        setLanguage={setLanguage} 
        apiConnected={apiConnected} 
        handleConnect={handleConnect} 
      />

      <nav className="tabs" role="tablist">
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
      </nav>

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

      {/* API Key Modal */}
      <Modal
        isOpen={apiModalOpen}
        onClose={() => setApiModalOpen(false)}
        title="Connect Gemini AI"
        footer={
          <div className="modal-btns">
            <button className="mbtn" onClick={() => setApiModalOpen(false)}>Cancel</button>
            <button className="mbtn primary" onClick={saveApiKey}>Connect</button>
          </div>
        }
      >
        <p className="modal-sub">Enter your Google Gemini API key to enable AI responses. Stored in session only — never sent to any server except as a proxy header.</p>
        <input
          type="password"
          className="modal-inp"
          placeholder="AIza…"
          value={userApiKey}
          onChange={(e) => setUserApiKey(e.target.value)}
          aria-label="Gemini API Key"
        />
        <div className="modal-hint">
          Get a free key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">aistudio.google.com</a>
        </div>
        {modalError && <div className="modal-err" role="alert">{modalError}</div>}
      </Modal>

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
