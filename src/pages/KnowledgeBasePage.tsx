import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { KnowledgeArticle } from '../types/database';
import './KnowledgeBasePage.css';

export default function KnowledgeBasePage() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<KnowledgeArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  const categories = [
    { value: 'all', label: 'הכל' },
    { value: 'products', label: 'מוצרים' },
    { value: 'faq', label: 'שאלות נפוצות' },
    { value: 'support', label: 'תמיכה' },
    { value: 'procedures', label: 'נהלים' },
    { value: 'general', label: 'כללי' }
  ];

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [searchQuery, selectedCategory, articles]);

  const loadArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('knowledge_articles')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = [...articles];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.keywords.some(keyword => keyword.toLowerCase().includes(query))
      );
    }

    setFilteredArticles(filtered);
  };

  if (loading) {
    return <div className="loading">טוען מאגר ידע...</div>;
  }

  return (
    <div className="knowledge-base">
      <div className="page-header">
        <h1>מאגר ידע כתר</h1>
        <p>כל המידע שאתה צריך במקום אחד</p>
      </div>

      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="חיפוש במאגר הידע..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat.value}
              className={`category-btn ${selectedCategory === cat.value ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="results-header">
        <p>נמצאו {filteredArticles.length} תוצאות</p>
      </div>

      <div className="articles-grid">
        {filteredArticles.map(article => (
          <div key={article.id} className="article-card card" onClick={() => setSelectedArticle(article)}>
            <div className="article-category badge badge-info">{categories.find(c => c.value === article.category)?.label}</div>
            <h3>{article.title}</h3>
            <p className="article-preview">{article.content.substring(0, 150)}...</p>
            <div className="article-keywords">
              {article.keywords.slice(0, 3).map((keyword, i) => (
                <span key={i} className="keyword-tag">{keyword}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="no-results">
          <p>לא נמצאו תוצאות לחיפוש שלך</p>
        </div>
      )}

      {selectedArticle && (
        <div className="modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedArticle(null)}>×</button>
            <div className="article-category badge badge-info">
              {categories.find(c => c.value === selectedArticle.category)?.label}
            </div>
            <h2>{selectedArticle.title}</h2>
            <div className="article-content">
              {selectedArticle.content.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <div className="article-keywords">
              {selectedArticle.keywords.map((keyword, i) => (
                <span key={i} className="keyword-tag">{keyword}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
