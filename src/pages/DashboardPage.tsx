import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './DashboardPage.css';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    articles: 0,
    procedures: 0,
    scripts: 0,
    simulations: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [articles, procedures, scripts, simulations] = await Promise.all([
      supabase.from('knowledge_articles').select('id', { count: 'exact', head: true }),
      supabase.from('procedures').select('id', { count: 'exact', head: true }),
      supabase.from('conversation_scripts').select('id', { count: 'exact', head: true }),
      supabase.from('simulations').select('id', { count: 'exact', head: true })
    ]);

    setStats({
      articles: articles.count || 0,
      procedures: procedures.count || 0,
      scripts: scripts.count || 0,
      simulations: simulations.count || 0
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>דף הבית</h1>
        <p>ברוכים הבאים למערכת מנהלת הידע של כתר</p>
      </div>

      <div className="stats-grid">
        <Link to="/knowledge" className="stat-card">
          <div className="stat-icon">📚</div>
          <h3>מאגר ידע</h3>
          <div className="stat-number">{stats.articles}</div>
          <p>מאמרים במערכת</p>
        </Link>

        <Link to="/procedures" className="stat-card">
          <div className="stat-icon">📋</div>
          <h3>נהלים</h3>
          <div className="stat-number">{stats.procedures}</div>
          <p>נהלים פעילים</p>
        </Link>

        <Link to="/scripts" className="stat-card">
          <div className="stat-icon">💬</div>
          <h3>תסריטי שיחה</h3>
          <div className="stat-number">{stats.scripts}</div>
          <p>תסריטים זמינים</p>
        </Link>

        <Link to="/simulations" className="stat-card">
          <div className="stat-icon">🎯</div>
          <h3>סימולציות</h3>
          <div className="stat-number">{stats.simulations}</div>
          <p>מבחני הדרכה</p>
        </Link>
      </div>

      <div className="quick-access">
        <h2>גישה מהירה</h2>
        <div className="quick-links">
          <div className="quick-link-card card">
            <h3>מוצרי כתר</h3>
            <p>מידע מפורט על מגוון מוצרי כתר</p>
            <Link to="/knowledge?category=products" className="btn btn-primary">
              צפייה במוצרים
            </Link>
          </div>
          <div className="quick-link-card card">
            <h3>שאלות נפוצות</h3>
            <p>תשובות לשאלות הנפוצות ביותר</p>
            <Link to="/knowledge?category=faq" className="btn btn-primary">
              צפייה בשאלות
            </Link>
          </div>
          <div className="quick-link-card card">
            <h3>הדרכה והסמכה</h3>
            <p>עבור למבחני ההסמכה והדרכה</p>
            <Link to="/simulations" className="btn btn-primary">
              התחל הדרכה
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
