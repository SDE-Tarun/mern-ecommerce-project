import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../axios";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const { token, user, role } = res.data;

      if (!token || !user?.id || !role) {
        toast.error("Invalid login response");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("name", user.name);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role);

      if (role === "admin") {
        localStorage.setItem("adminId", user.id);
        localStorage.removeItem("userId");

        toast.success(`Welcome, ${user.name}!`);
        window.dispatchEvent(new Event("userUpdated"));

        setEmail("");
        setPassword("");
        navigate("/admin/products");
      } else if (role === "user") {
        localStorage.setItem("userId", user.id);
        localStorage.removeItem("adminId");

        toast.success(`Welcome, ${user.name}!`);
        window.dispatchEvent(new Event("userUpdated"));

        setEmail("");
        setPassword("");
        navigate("/");
      } else {
        localStorage.clear();
        toast.error("Invalid user role");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-shell">
        {/* Left promotional panel */}
        <aside className="auth-visual login-visual">
          <div className="auth-visual-image" />

          <div className="auth-visual-overlay" />

          <Link to="/" className="auth-brand">
            <span className="auth-brand-icon">🛍</span>
            Apna Store
          </Link>

          <div className="auth-visual-content">
            <span className="auth-tag">WELCOME BACK</span>

            <h1>
              Great style.
              <br />
              Great finds.
              <br />
              <span>Just for you.</span>
            </h1>

            <p>
              Your favourites are waiting. Sign in to continue shopping
              and discover something you'll love.
            </p>

            <div className="auth-feature">
              <span className="auth-feature-icon">✓</span>
              <span>A shopping experience made for you</span>
            </div>

            <div className="auth-feature">
              <span className="auth-feature-icon">✓</span>
              <span>Easy cart and order management</span>
            </div>
          </div>

          <p className="auth-image-caption">
            YOUR STYLE. YOUR STORE.
          </p>
        </aside>

        {/* Right login form */}
        <section className="auth-form-panel">
          <div className="auth-form-content">
            <Link to="/" className="auth-mobile-brand">
              🛍 Apna Store
            </Link>

            <div className="auth-form-heading">
              <span className="auth-form-icon">👋</span>
              <p className="auth-eyebrow">NICE TO SEE YOU AGAIN</p>
              <h2>Welcome back</h2>
              <p className="auth-description">
                Enter your details to sign in to your account.
              </p>
            </div>

            <form onSubmit={handleLogin} className="auth-form">
              <div className="auth-field">
                <label htmlFor="login-email">Email address</label>

                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="login-password">Password</label>

                <div className="auth-password-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-button"
                disabled={loading}
              >
                {loading ? "Signing you in..." : "Sign In"}
                {!loading && <span>→</span>}
              </button>
            </form>

            <div className="auth-divider">
              <span>APNA STORE</span>
            </div>

            <p className="auth-switch-text">
              Don't have an account?{" "}
              <Link to="/signup">Create an account</Link>
            </p>

            <Link to="/" className="auth-back-link">
              ← Back to shopping
            </Link>

            <p className="auth-security-note">
              🔒 Your account details are handled securely.
            </p>
          </div>
        </section>
      </section>

      <AuthStyles />
    </main>
  );
};

function AuthStyles() {
  return (
    <style>{`
      .auth-page,
      .auth-page * {
        box-sizing: border-box;
      }

      .auth-page {
        min-height: 100vh;
        padding: 36px 22px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f0fdf4;
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI",
          sans-serif;
        color: #0f172a;
      }

      .auth-shell {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 0.92fr);
        width: 100%;
        max-width: 1060px;
        min-height: 640px;
        overflow: hidden;
        border-radius: 24px;
        background: #fff;
        box-shadow: 0 24px 75px rgba(15, 23, 42, 0.12);
      }

      .auth-visual {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-width: 0;
        min-height: 640px;
        padding: 32px;
        overflow: hidden;
        color: #fff;
        background: #064e3b;
      }

      .auth-visual-image,
      .auth-visual-overlay {
        position: absolute;
        inset: 0;
      }

      .auth-visual-image {
        background-image: url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85");
        background-size: cover;
        background-position: center;
        transform: scale(1.02);
      }

      .auth-visual-overlay {
        background: linear-gradient(
          180deg,
          rgba(2, 44, 34, 0.68) 0%,
          rgba(2, 44, 34, 0.48) 42%,
          rgba(2, 44, 34, 0.9) 100%
        );
      }

      .auth-brand,
      .auth-visual-content,
      .auth-image-caption {
        position: relative;
        z-index: 1;
      }

      .auth-brand {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        width: fit-content;
        color: #fff;
        text-decoration: none;
        font-size: 22px;
        font-weight: 800;
        letter-spacing: -0.4px;
      }

      .auth-brand-icon {
        display: grid;
        place-items: center;
        width: 42px;
        height: 42px;
        border-radius: 13px;
        background: rgba(255, 255, 255, 0.18);
        font-size: 23px;
      }

      .auth-visual-content {
        margin: 60px 0 40px;
      }

      .auth-tag {
        display: inline-block;
        padding: 8px 11px;
        border: 1px solid rgba(255, 255, 255, 0.38);
        border-radius: 30px;
        color: #d1fae5;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 1.6px;
      }

      .auth-visual-content h1 {
        margin: 22px 0 16px;
        font-size: clamp(34px, 4vw, 47px);
        line-height: 1.12;
        letter-spacing: -1.8px;
        font-weight: 800;
      }

      .auth-visual-content h1 span {
        color: #6ee7b7;
      }

      .auth-visual-content > p {
        max-width: 360px;
        margin: 0 0 26px;
        color: #e2e8f0;
        font-size: 14px;
        line-height: 1.9;
      }

      .auth-feature {
        display: flex;
        align-items: center;
        gap: 11px;
        margin-top: 13px;
        color: #f0fdf4;
        font-size: 13px;
      }

      .auth-feature-icon {
        display: grid;
        place-items: center;
        flex-shrink: 0;
        width: 23px;
        height: 23px;
        border-radius: 50%;
        background: #a7f3d0;
        color: #065f46;
        font-weight: 900;
      }

      .auth-image-caption {
        color: rgba(255, 255, 255, 0.75);
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 2px;
      }

      .auth-form-panel {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 0;
        padding: 48px 42px;
        background: #fff;
      }

      .auth-form-content {
        width: 100%;
        max-width: 360px;
        margin: auto;
      }

      .auth-mobile-brand {
        display: none;
        color: #047857;
        text-decoration: none;
        font-size: 21px;
        font-weight: 850;
        margin-bottom: 35px;
      }

      .auth-form-heading {
        margin-bottom: 30px;
      }

      .auth-form-icon {
        display: grid;
        place-items: center;
        width: 48px;
        height: 48px;
        margin-bottom: 20px;
        border-radius: 15px;
        background: #ecfdf5;
        font-size: 24px;
      }

      .auth-eyebrow {
        margin: 0 0 9px;
        color: #059669;
        font-size: 10px;
        font-weight: 850;
        letter-spacing: 1.6px;
      }

      .auth-form-heading h2 {
        margin: 0 0 10px;
        font-size: 32px;
        line-height: 1.2;
        letter-spacing: -1.1px;
        font-weight: 850;
        color: #0f172a;
      }

      .auth-description {
        margin: 0;
        color: #64748b;
        font-size: 13px;
        line-height: 1.8;
      }

      .auth-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .auth-field {
        display: flex;
        flex-direction: column;
        gap: 9px;
        min-width: 0;
      }

      .auth-field label {
        color: #334155;
        font-size: 12px;
        font-weight: 750;
      }

      .auth-field input {
        width: 100%;
        min-width: 0;
        height: 49px;
        padding: 0 14px;
        border: 1px solid #dbe4e0;
        border-radius: 10px;
        outline: none;
        background: #fff;
        color: #0f172a;
        font-family: inherit;
        font-size: 13px;
        transition: border-color 0.2s, box-shadow 0.2s;
      }

      .auth-field input::placeholder {
        color: #94a3b8;
      }

      .auth-field input:focus {
        border-color: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
      }

      .auth-password-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        min-width: 0;
      }

      .auth-password-wrapper input {
        padding-right: 65px;
      }

      .auth-password-toggle {
        position: absolute;
        right: 12px;
        border: none;
        padding: 6px 2px;
        background: transparent;
        color: #047857;
        font-family: inherit;
        font-size: 11px;
        font-weight: 800;
        cursor: pointer;
      }

      .auth-submit-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
        min-height: 50px;
        margin-top: 5px;
        padding: 12px 16px;
        border: none;
        border-radius: 10px;
        background: #059669;
        color: #fff;
        font-family: inherit;
        font-size: 14px;
        font-weight: 800;
        cursor: pointer;
        transition: background 0.2s, transform 0.2s;
      }

      .auth-submit-button:hover:not(:disabled) {
        background: #047857;
      }

      .auth-submit-button:active:not(:disabled) {
        transform: scale(0.99);
      }

      .auth-submit-button:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }

      .auth-divider {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 27px 0 20px;
        color: #94a3b8;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 2px;
      }

      .auth-divider::before,
      .auth-divider::after {
        content: "";
        flex: 1;
        height: 1px;
        background: #e2e8f0;
      }

      .auth-switch-text {
        margin: 0;
        color: #64748b;
        text-align: center;
        font-size: 12px;
        line-height: 1.8;
      }

      .auth-switch-text a {
        color: #047857;
        font-weight: 800;
        text-decoration: none;
      }

      .auth-switch-text a:hover,
      .auth-back-link:hover {
        text-decoration: underline;
      }

      .auth-back-link {
        display: block;
        width: fit-content;
        margin: 22px auto 0;
        color: #475569;
        text-decoration: none;
        font-size: 12px;
        font-weight: 700;
      }

      .auth-security-note {
        margin: 32px 0 0;
        color: #94a3b8;
        font-size: 10px;
        text-align: center;
      }

      @media (max-width: 850px) {
        .auth-page {
          padding: 24px 16px;
        }

        .auth-shell {
          max-width: 620px;
          grid-template-columns: 1fr;
          min-height: auto;
        }

        .auth-visual {
          min-height: 290px;
          padding: 25px 28px;
        }

        .auth-visual-content {
          margin: 35px 0 20px;
        }

        .auth-visual-content h1 {
          font-size: 34px;
          margin: 15px 0 10px;
        }

        .auth-visual-content > p {
          max-width: 470px;
          margin-bottom: 16px;
        }

        .auth-feature {
          display: none;
        }

        .auth-image-caption {
          margin-top: 0;
        }

        .auth-form-panel {
          padding: 38px 28px;
        }

        .auth-form-content {
          max-width: 440px;
        }
      }

      @media (max-width: 480px) {
        .auth-page {
          display: block;
          min-height: 100vh;
          padding: 0;
          background: #fff;
        }

        .auth-shell {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          border-radius: 0;
          box-shadow: none;
        }

        .auth-visual {
          min-height: 235px;
          padding: 20px 22px;
        }

        .auth-brand {
          font-size: 19px;
        }

        .auth-brand-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          font-size: 20px;
        }

        .auth-visual-content {
          margin: 24px 0 12px;
        }

        .auth-tag {
          padding: 6px 9px;
          font-size: 9px;
        }

        .auth-visual-content h1 {
          font-size: 30px;
          letter-spacing: -1px;
          margin: 12px 0 8px;
        }

        .auth-visual-content > p {
          max-width: 340px;
          margin-bottom: 0;
          font-size: 12px;
          line-height: 1.7;
        }

        .auth-image-caption {
          font-size: 9px;
        }

        .auth-form-panel {
          flex: 1;
          align-items: flex-start;
          padding: 30px 22px 34px;
        }

        .auth-mobile-brand {
          display: none;
        }

        .auth-form-heading {
          margin-bottom: 24px;
        }

        .auth-form-icon {
          width: 42px;
          height: 42px;
          margin-bottom: 15px;
          font-size: 21px;
        }

        .auth-form-heading h2 {
          font-size: 28px;
        }

        .auth-form {
          gap: 17px;
        }

        .auth-field input {
          height: 48px;
        }

        .auth-divider {
          margin-top: 23px;
        }

        .auth-security-note {
          margin-top: 26px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .auth-field input,
        .auth-submit-button {
          transition: none;
        }
      }
    `}</style>
  );
}

export default Login;