import React, { useEffect, useRef } from 'react';
import { AI_SUGGESTIONS } from '../data/electionData.js';

function AIAssistant({ chatMessages, chatInput, setChatInput, handleChatSubmit, chatLoading, handleSuggestion }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <section className="panel active" aria-labelledby="aiTitle">
      <h2 id="aiTitle" className="sr-only">AI Assistant</h2>
      <div className="chat-box">
        <div 
          id="chatMsgs" 
          className="chat-msgs" 
          role="log" 
          aria-live="polite" 
          aria-label="Chat messages"
        >
          {chatMessages.map((message, index) => (
            <article key={index} className={`msg ${message.role}`}>
              {message.role === 'ai' && (
                <div className="msg-av ai" aria-hidden="true">EQ</div>
              )}
              <div className="msg-content">
                <div className={`msg-bbl ${message.role}`}>
                  {message.text}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="msg-av user" aria-hidden="true">You</div>
              )}
            </article>
          ))}
          {chatLoading && (
            <div className="msg ai">
              <div className="msg-av ai" aria-hidden="true">EQ</div>
              <div className="msg-content">
                <div className="msg-bbl ai thinking">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        
        <div className="chips" aria-label="Suggested questions">
          {AI_SUGGESTIONS.map((chip) => (
            <button 
              key={chip} 
              type="button" 
              className="chip" 
              onClick={() => handleSuggestion(chip)}
            >
              {chip}
            </button>
          ))}
        </div>

        <form 
          className="input-row" 
          onSubmit={(e) => { e.preventDefault(); handleChatSubmit(); }}
        >
          <textarea
            id="chatInp"
            className="chat-inp"
            placeholder="Ask about voting, elections, registration…"
            rows={1}
            value={chatInput}
            onChange={(event) => setChatInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleChatSubmit();
              }
            }}
            aria-label="Type your message"
          />
          <button 
            className="send-btn" 
            type="submit" 
            disabled={!chatInput.trim() || chatLoading} 
            aria-label="Send message"
          >
            {chatLoading ? (
              <span className="loader" aria-hidden="true" />
            ) : (
              <svg viewBox="0 0 14 14" fill="none">
                <path d="M12 7L2 2l2.5 5L2 12z" fill="white" />
              </svg>
            )}
          </button>
        </form>

        <footer className="chat-footer">
          <span className="text-secondary">Official ECI Links:</span>
          <a href="https://voters.eci.gov.in" target="_blank" rel="noopener noreferrer">Voter Portal</a>
          <a href="https://electoralsearch.eci.gov.in" target="_blank" rel="noopener noreferrer">Search Electoral Roll</a>
          <a href="https://www.eci.gov.in" target="_blank" rel="noopener noreferrer">ECI Website</a>
        </footer>
      </div>
    </section>
  );
}

export default AIAssistant;
