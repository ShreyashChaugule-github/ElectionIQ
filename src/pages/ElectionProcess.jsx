import React from 'react';
import { TIMELINE, FORMS } from '../data/electionData.js';

function ElectionProcess({ onFormClick, onRoadmapClick }) {
  return (
    <section className="panel active" aria-labelledby="processTitle">
      <h2 id="processTitle" className="sr-only">Election Roadmap</h2>
      <div className="process-intro">Election roadmap — from announcement to result</div>
      
      <div className="tl-wrap">
        <div className="tl-spine" aria-hidden="true" />
        {TIMELINE.map((item, index) => (
          <article key={item.title} className="tl-item">
            <div className={`tl-node ${item.status}`} aria-hidden="true">
              {item.status === 'done' ? '✓' : item.status === 'cur' ? '→' : index + 1}
            </div>
            <div className="tl-title">
              {item.title}
              <span className={`tl-badge badge-${item.status}`}>{item.badge}</span>
            </div>
            <div className="tl-date">{item.date}</div>
            <div className="tl-desc">{item.description}</div>
          </article>
        ))}
      </div>

      <h3 className="section-title" style={{ marginTop: '2rem' }}>Election Forms — Click to Learn More</h3>
      <div className="form-grid">
        <button 
          type="button" 
          className="form-card form-card-featured" 
          onClick={() => onRoadmapClick('First Vote')}
          aria-label="View First Vote Roadmap"
        >
          <div className="form-card-title">✨ First Vote</div>
          <div className="form-card-sub">Complete roadmap for first-time voters</div>
        </button>
        {FORMS.map((item) => (
          <button 
            key={item.title} 
            type="button" 
            className="form-card" 
            onClick={() => onRoadmapClick(item.title)}
            aria-label={`Learn about ${item.title}`}
          >
            <div className="form-card-title">{item.icon} {item.title}</div>
            <div className="form-card-sub">{item.sub}</div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default ElectionProcess;
