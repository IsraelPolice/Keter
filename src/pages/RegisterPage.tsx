import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './RegisterPage.css';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'employee' | 'admin'>('employee');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (role === 'admin' && email !== 'dvir.bareket@gav.co.il') {
      setError('רק dvir.bareket@gav.co.il יכול להירשם כמנהל');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'שגיאה בהרשמה. אנא נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <h1>הרשמה למערכת</h1>
          <p className="register-subtitle">מערכת ניהול הידע של כתר</p>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="fullName">שם מלא</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="הזן שם מלא"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">כתובת אימייל</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@company.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">סיסמה</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="לפחות 6 תווים"
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">תפקיד</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'employee' | 'admin')}
                required
              >
                <option value="employee">עובד</option>
                <option value="admin">מנהל</option>
              </select>
              {role === 'admin' && (
                <p className="role-note">
                  * הרשאת מנהל זמינה רק עבור dvir.bareket@gav.co.il
                </p>
              )}
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={loading} className="register-button">
              {loading ? 'מבצע הרשמה...' : 'הרשמה'}
            </button>

            <div className="login-link">
              כבר יש לך חשבון? <Link to="/login">התחבר כאן</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
