import { useState, useEffect } from 'react';
import { STATS, PARTIES, BOTS } from '../data/electionData.js';

function Dashboard() {
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="panel active" aria-labelledby="dashTitle">
      <div className="live-header">
        <h2 id="dashTitle" className="section-title">
          <span className="live-dot" /> Live Dashboard Overview
        </h2>
        <span className="live-time">Last Sync: {lastUpdated}</span>
      </div>
      
      <div className="stat-grid">
        {STATS.map((stat) => (
          <article key={stat.label} className="stat-card live-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-val">{stat.value}</div>
            <div className="stat-sub">{stat.sub}</div>
          </article>
        ))}
      </div>

      <h3 className="section-title">Party Standings — Lok Sabha 2024</h3>
      <div className="table-responsive">
        <table className="party-table" aria-label="Political party standings">
          <thead>
            <tr>
              <th scope="col">Party</th>
              <th scope="col">Alliance</th>
              <th scope="col">Seats</th>
              <th scope="col">Winning Bar</th>
            </tr>
          </thead>
          <tbody>
            {PARTIES.map((party) => (
              <tr key={party.name}>
                <td>
                  <span className="party-dot" style={{ background: party.color }} aria-hidden="true" />
                  {party.name}
                </td>
                <td className="text-secondary">{party.alliance}</td>
                <td className="font-medium">{party.seats}</td>
                <td className="bar-cell">
                  <div className="win-bar-wrap">
                    <div 
                      className="win-bar" 
                      style={{ width: `${Math.round((party.seats / 543) * 100)}%`, background: party.color }} 
                      role="progressbar" 
                      aria-valuenow={party.seats} 
                      aria-valuemin="0" 
                      aria-valuemax="543"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="section-title">Active Vote Monitoring Bots</h3>
      <div className="bot-grid">
        {BOTS.map((bot) => (
          <article key={bot.name} className="bot-card">
            <div className="bot-name">{bot.name}</div>
            <div className="bot-desc">{bot.desc}</div>
            <span className={`bot-status ${bot.status === 'active' ? 'status-active' : 'status-idle'}`}>
              {bot.status === 'active' ? '● Active' : '○ Idle'}
            </span>
          </article>
        ))}
      </div>

      <h3 className="section-title">Election Overview</h3>
      <div className="overview-grid">
        <article className="overview-card">
          <div className="stat-label">Registered Voters</div>
          <div className="stat-val">96.8 Crore</div>
        </article>
        <article className="overview-card">
          <div className="stat-label">Polling Booths</div>
          <div className="stat-val">10.5 Lakh</div>
        </article>
        <article className="overview-card">
          <div className="stat-label">Phases (2024)</div>
          <div className="stat-val">7 Phases</div>
        </article>
        <article className="overview-card">
          <div className="stat-label">Counting Day</div>
          <div className="stat-val">4 June 2024</div>
        </article>
      </div>
    </section>
  );
}

export default Dashboard;
