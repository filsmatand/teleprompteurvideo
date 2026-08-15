
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================================
     LOGIN EMAIL / PASSWORD
  ========================================= */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setError(
          error.message === "Invalid login credentials"
            ? "Email ou mot de passe incorrect."
            : error.message
        );
        return;
      }

      if (data.user) {
        navigate("/dashboard", {
          replace: true,
        });
      }
    } catch (err) {
      console.error(err);

      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     GOOGLE LOGIN
  ========================================= */

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",

        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setError(error.message);
        setGoogleLoading(false);
      }
    } catch (err) {
      console.error(err);

      setError("Impossible de se connecter avec Google.");

      setGoogleLoading(false);
    }
  };

  /* =========================================
     FORGOT PASSWORD
  ========================================= */

  const handleForgotPassword = async () => {
    setError("");

    if (!email.trim()) {
      setError(
        "Entrez votre adresse email pour réinitialiser votre mot de passe."
      );
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) {
        setError(error.message);
        return;
      }

      setError("Un email de réinitialisation vient d'être envoyé.");
    } catch (err) {
      console.error(err);

      setError("Impossible d'envoyer l'email de réinitialisation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">

      {/* =========================================
          BACKGROUND
      ========================================= */}

      <div className="circle circleLarge" />
      <div className="circle circleSmall" />

      {/* =========================================
          AUTH CARD
      ========================================= */}

      <section className="authCard">

        {/* =======================================
            ILLUSTRATION SVG
        ======================================= */}

        <div className="visualSide">

          <div className="illustration">

            <img
              src="/illustrations/auth1.svg"
              alt="Login illustration"
              className="loginIllustration"
            />

          </div>

        </div>

        {/* =======================================
            FORM
        ======================================= */}

        <div className="formSide">

          <div className="formContainer">

            {/* TITLE */}

            <div className="titleArea">

              <span className="welcomeBadge">
                WELCOME BACK
              </span>

              <h1>
                Login
              </h1>

              <p className="subtitle">
                Connectez-vous pour continuer.
              </p>

            </div>

            {/* ERROR */}

            {error && (
              <div
                className={`messageBox ${
                  error.includes("envoyé")
                    ? "successMessage"
                    : ""
                }`}
              >
                <span>{error}</span>
              </div>
            )}

            {/* FORM */}

            <form onSubmit={handleSubmit}>

              {/* EMAIL */}

              <div className="inputGroup">

                <div className="inputIcon">

                  <svg viewBox="0 0 24 24">
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                    />

                    <path d="m4 7 8 6 8-6" />
                  </svg>

                </div>

                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />

              </div>

              {/* PASSWORD */}

              <div className="inputGroup">

                <div className="inputIcon">

                  <svg viewBox="0 0 24 24">

                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="10"
                      rx="2"
                    />

                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />

                  </svg>

                </div>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="eyeButton"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (

                    <svg viewBox="0 0 24 24">

                      <path d="M3 3l18 18" />

                      <path
                        d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
                      />

                      <path
                        d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6 0 9.5 7 9.5 7a17 17 0 0 1-3.1 3.9"
                      />

                      <path
                        d="M6.2 6.2C3.8 8 2.5 12 2.5 12s3.5 7 9.5 7c1.4 0 2.7-.3 3.8-.8"
                      />

                    </svg>

                  ) : (

                    <svg viewBox="0 0 24 24">

                      <path
                        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
                      />

                      <circle
                        cx="12"
                        cy="12"
                        r="2.8"
                      />

                    </svg>

                  )}

                </button>

              </div>

              {/* REMEMBER + FORGOT */}

              <div className="rememberRow">

                <label className="rememberLabel">

                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) =>
                      setRemember(e.target.checked)
                    }
                  />

                  <span className="customCheck" />

                  <span>
                    Remember me
                  </span>

                </label>

                <button
                  type="button"
                  className="forgotButton"
                  onClick={handleForgotPassword}
                  disabled={loading}
                >
                  Forgot password?
                </button>

              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="submitButton"
                disabled={
                  loading ||
                  googleLoading
                }
              >

                {loading ? (
                  <>
                    <span className="spinner" />
                    Connexion...
                  </>
                ) : (
                  "Sign In"
                )}

              </button>

            </form>

            {/* DIVIDER */}

            <div className="divider">
              <span>OR</span>
            </div>

            {/* GOOGLE */}

            <button
              type="button"
              className="googleButton"
              onClick={handleGoogleLogin}
              disabled={
                googleLoading ||
                loading
              }
            >

              {googleLoading ? (

                <>
                  <span className="spinner dark" />
                  Connexion avec Google...
                </>

              ) : (

                <>

                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >

                    <path
                      fill="#4285F4"
                      d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
                    />

                    <path
                      fill="#34A853"
                      d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.6Z"
                    />

                    <path
                      fill="#FBBC05"
                      d="M6.54 13.68A5.86 5.86 0 0 1 6.23 12c0-.58.1-1.15.31-1.68V7.79H3.3A9.76 9.76 0 0 0 2.25 12c0 1.58.38 3.07 1.05 4.21l3.24-2.53Z"
                    />

                    <path
                      fill="#EA4335"
                      d="M12 6.29c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.38 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53C7.31 8.01 9.46 6.29 12 6.29Z"
                    />

                  </svg>

                  Continuer avec Google

                </>

              )}

            </button>

            {/* REGISTER */}

            <p className="bottomText">

              Vous n'avez pas encore de compte ?{" "}

              <Link to="/register">
                Créer un compte
              </Link>

            </p>

          </div>

        </div>

      </section>

      {/* =========================================
          BRAND
      ========================================= */}

      <div className="brand">
        Luna Creator
        <div />
      </div>

      {/* =========================================
          STYLES
      ========================================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          width: 100%;
          min-height: 100%;
          margin: 0;
        }

        body {
          overflow-x: hidden;
        }

        .page {
          min-height: 100svh;
          width: 100%;
          position: relative;
          overflow: hidden;

          display: flex;
          justify-content: center;
          align-items: center;

          padding: 32px 20px;

          background: #f7f7f7;
          color: #000;

          font-family:
            Inter,
            Arial,
            Helvetica,
            sans-serif;
        }

        /* =========================================
           BACKGROUND
        ========================================= */

        .circle {
          position: absolute;
          border-radius: 50%;
          background: #000;
          pointer-events: none;
        }

        .circleLarge {
          width: min(650px, 70vw);
          height: min(650px, 70vw);

          left: 50%;
          top: 50%;

          transform: translate(-50%, -50%);

          opacity: 0.05;
        }

        .circleSmall {
          width: 38px;
          height: 38px;

          left: 8%;
          top: 10%;

          opacity: 1;
        }

        /* =========================================
           AUTH CARD
        ========================================= */

        .authCard {
          width: min(920px, 100%);
          min-height: 610px;

          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(0, 1fr);

          position: relative;
          z-index: 2;

          overflow: hidden;

          border-radius: 28px;

          background: rgba(255, 255, 255, 0.97);

          border: 1px solid #e5e5e5;

          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.1),
            0 10px 25px rgba(0, 0, 0, 0.05);
        }

        /* =========================================
           VISUAL SIDE
        ========================================= */

        .visualSide {
          min-width: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 30px;
        }

        .illustration {
          width: 390px;
          max-width: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          position: relative;
        }

        .loginIllustration {
          width: 100%;
          max-width: 390px;
          height: auto;

          display: block;

          object-fit: contain;
        }

        /* =========================================
           FORM SIDE
        ========================================= */

        .formSide {
          min-width: 0;

          display: flex;
          justify-content: center;
          align-items: center;

          padding: 35px;
        }

        .formContainer {
          width: 350px;
          max-width: 100%;
        }

        .titleArea {
          margin-bottom: 28px;
        }

        .welcomeBadge {
          display: inline-flex;

          padding: 5px 9px;

          border-radius: 999px;

          background: #f0f0f0;

          color: #777;

          font-size: 8px;
          font-weight: 700;

          letter-spacing: 0.12em;
        }

        h1 {
          margin: 10px 0 0;

          font-size: 42px;
          line-height: 1;

          letter-spacing: -1.5px;

          font-weight: 700;
        }

        .subtitle {
          margin: 10px 0 0;

          color: #777;

          font-size: 14px;

          line-height: 1.5;
        }

        form {
          display: flex;
          flex-direction: column;

          gap: 13px;
        }

        /* =========================================
           INPUT
        ========================================= */

        .inputGroup {
          width: 100%;
          height: 52px;

          display: flex;
          align-items: center;

          border-radius: 15px;

          background: #f2f2f2;

          border: 1px solid transparent;

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .inputGroup:focus-within {
          background: white;

          border-color: #000;

          box-shadow:
            0 0 0 3px rgba(0, 0, 0, 0.05);
        }

        .inputIcon {
          width: 50px;

          display: flex;
          justify-content: center;

          color: #555;

          flex-shrink: 0;
        }

        .inputIcon svg {
          width: 18px;
          height: 18px;

          fill: none;

          stroke: currentColor;

          stroke-width: 1.8;
        }

        .inputGroup input {
          min-width: 0;

          width: 100%;
          height: 100%;

          border: 0;
          outline: none;

          background: transparent;

          color: #111;

          font-size: 14px;

          padding-right: 12px;
        }

        .inputGroup input::placeholder {
          color: #888;
        }

        /* =========================================
           PASSWORD EYE
        ========================================= */

        .eyeButton {
          border: 0;

          background: transparent;

          color: #666;

          padding: 5px;

          margin-right: 12px;

          display: flex;

          cursor: pointer;

          flex-shrink: 0;
        }

        .eyeButton svg {
          width: 18px;
          height: 18px;

          fill: none;

          stroke: currentColor;

          stroke-width: 1.8;
        }

        /* =========================================
           REMEMBER
        ========================================= */

        .rememberRow {
          display: flex;

          justify-content: space-between;

          align-items: center;

          margin:
            2px 2px 10px;

          gap: 12px;
        }

        .rememberLabel {
          display: flex;

          align-items: center;

          gap: 8px;

          color: #777;

          font-size: 10px;

          cursor: pointer;

          white-space: nowrap;
        }

        .rememberLabel input {
          position: absolute;
          opacity: 0;
        }

        .customCheck {
          width: 13px;
          height: 13px;

          border: 1px solid #aaa;

          border-radius: 3px;

          background: white;

          flex-shrink: 0;
        }

        .rememberLabel input:checked
          + .customCheck {
          background: #000;
          border-color: #000;
        }

        .rememberLabel input:checked
          + .customCheck::after {
          content: "";

          display: block;

          width: 6px;
          height: 3px;

          margin: 3px;

          border-left: 2px solid white;
          border-bottom: 2px solid white;

          transform: rotate(-45deg);
        }

        .forgotButton {
          border: 0;

          background: transparent;

          padding: 0;

          color: #555;

          font-size: 10px;

          cursor: pointer;

          white-space: nowrap;
        }

        .forgotButton:hover {
          color: #000;
          text-decoration: underline;
        }

        /* =========================================
           BUTTONS
        ========================================= */

        .submitButton {
          width: 100%;
          min-height: 52px;

          border: 0;

          border-radius: 15px;

          background: #000;

          color: white;

          font-size: 14px;

          font-weight: 600;

          cursor: pointer;

          transition:
            background 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 9px;
        }

        .submitButton:hover {
          background: #222;

          transform: translateY(-1px);

          box-shadow:
            0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .submitButton:disabled {
          cursor: wait;
          opacity: 0.6;
          transform: none;
        }

        /* =========================================
           DIVIDER
        ========================================= */

        .divider {
          display: flex;

          align-items: center;

          gap: 12px;

          margin: 19px 0;

          color: #aaa;

          font-size: 9px;

          font-weight: 600;
        }

        .divider::before,
        .divider::after {
          content: "";

          flex: 1;

          height: 1px;

          background: #e7e7e7;
        }

        /* =========================================
           GOOGLE
        ========================================= */

        .googleButton {
          width: 100%;
          min-height: 52px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 10px;

          border: 1px solid #dedede;

          border-radius: 15px;

          background: white;

          color: #111;

          font-size: 13px;

          font-weight: 600;

          cursor: pointer;

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;

          padding: 0 16px;
        }

        .googleButton svg {
          width: 19px;
          height: 19px;

          flex-shrink: 0;
        }

        .googleButton:hover {
          background: #f8f8f8;

          border-color: #ccc;

          transform: translateY(-1px);

          box-shadow:
            0 6px 18px rgba(0, 0, 0, 0.06);
        }

        .googleButton:disabled {
          cursor: wait;
          opacity: 0.6;
        }

        /* =========================================
           MESSAGE
        ========================================= */

        .messageBox {
          margin-bottom: 15px;

          padding: 11px 13px;

          border-radius: 12px;

          background: #fff1f1;

          border: 1px solid #ffd5d5;

          color: #c62828;

          font-size: 11px;

          line-height: 1.5;

          overflow-wrap: anywhere;
        }

        .successMessage {
          background: #effaf1;

          border-color: #ccebd2;

          color: #26733a;
        }

        /* =========================================
           SPINNER
        ========================================= */

        .spinner {
          width: 15px;
          height: 15px;

          border: 2px solid rgba(255,255,255,0.35);

          border-top-color: white;

          border-radius: 50%;

          animation: spin 0.7s linear infinite;

          flex-shrink: 0;
        }

        .spinner.dark {
          border-color: #ddd;
          border-top-color: #111;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =========================================
           BOTTOM TEXT
        ========================================= */

        .bottomText {
          margin: 20px 0 0;

          text-align: center;

          color: #888;

          font-size: 11px;

          line-height: 1.5;
        }

        .bottomText a {
          color: #000;

          font-weight: 700;

          text-decoration: none;
        }

        .bottomText a:hover {
          text-decoration: underline;
        }

        /* =========================================
           BRAND
        ========================================= */

        .brand {
          position: absolute;

          right: 5%;
          bottom: 25px;

          z-index: 3;

          font-size: 24px;

          color: #222;

          pointer-events: none;
        }

        .brand div {
          width: 80px;
          height: 3px;

          margin-left: auto;
          margin-top: 5px;

          background: #000;
        }

        /* =========================================
           LARGE TABLET
        ========================================= */

        @media (max-width: 950px) {

          .page {
            padding: 25px 16px;
          }

          .authCard {
            width: min(850px, 100%);

            min-height: 580px;
          }

          .visualSide {
            padding: 20px;
          }

          .illustration {
            transform: scale(0.88);
          }

          .formSide {
            padding: 30px;
          }

          .brand {
            display: none;
          }
        }

        /* =========================================
           TABLET
        ========================================= */

        @media (max-width: 800px) {

          .page {
            align-items: flex-start;

            padding:
              35px 18px;
          }

          .authCard {
            width: min(500px, 100%);

            min-height: auto;

            grid-template-columns: 1fr;

            border-radius: 25px;
          }

          .visualSide {
            height: 230px;

            padding: 10px;

            overflow: hidden;
          }

          .illustration {
            transform: scale(0.75);
          }

          .formSide {
            padding:
              10px 30px 35px;
          }

          .formContainer {
            width: 100%;
          }

          .titleArea {
            margin-bottom: 22px;
          }

          h1 {
            font-size: 38px;
          }

          .brand {
            display: none;
          }
        }

        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 600px) {

          .page {
            min-height: 100svh;

            padding:
              18px 12px;
          }

          .circleLarge {
            width: 500px;
            height: 500px;
          }

          .circleSmall {
            width: 25px;
            height: 25px;

            left: 5%;
            top: 5%;
          }

          .authCard {
            width: 100%;

            border-radius: 22px;

            box-shadow:
              0 20px 50px rgba(0, 0, 0, 0.09);
          }

          .visualSide {
            height: 185px;

            padding: 0;
          }

          .illustration {
            transform: scale(0.58);
          }

          .formSide {
            padding:
              5px 20px 28px;
          }

          .formContainer {
            max-width: 100%;
          }

          .titleArea {
            margin-bottom: 20px;
          }

          .welcomeBadge {
            font-size: 7px;

            padding:
              5px 8px;
          }

          h1 {
            font-size: 34px;

            letter-spacing: -1px;
          }

          .subtitle {
            font-size: 13px;

            margin-top: 8px;
          }

          .inputGroup {
            height: 50px;

            border-radius: 14px;
          }

          .inputIcon {
            width: 45px;
          }

          .inputGroup input {
            font-size: 13px;
          }

          .eyeButton {
            margin-right: 8px;
          }

          .rememberRow {
            margin-top: 1px;

            margin-bottom: 8px;
          }

          .rememberLabel,
          .forgotButton {
            font-size: 10px;
          }

          .submitButton,
          .googleButton {
            min-height: 50px;

            border-radius: 14px;
          }

          .googleButton {
            font-size: 12px;
          }

          .bottomText {
            font-size: 10px;

            margin-top: 18px;
          }
        }

        /* =========================================
           SMALL MOBILE
        ========================================= */

        @media (max-width: 380px) {

          .page {
            padding:
              10px 8px;
          }

          .authCard {
            border-radius: 18px;
          }

          .visualSide {
            height: 155px;
          }

          .illustration {
            transform: scale(0.48);
          }

          .formSide {
            padding:
              2px 16px 22px;
          }

          h1 {
            font-size: 30px;
          }

          .subtitle {
            font-size: 12px;
          }

          .inputGroup {
            height: 48px;
          }

          .inputIcon {
            width: 42px;
          }

          .inputIcon svg {
            width: 17px;
            height: 17px;
          }

          .rememberRow {
            flex-wrap: wrap;

            align-items: center;
          }

          .forgotButton {
            margin-left: auto;
          }

          .divider {
            margin: 16px 0;
          }

          .googleButton {
            font-size: 11px;

            gap: 7px;
          }

          .bottomText {
            font-size: 9px;
          }
        }

        /* =========================================
           VERY SMALL DEVICES
        ========================================= */

        @media (max-width: 320px) {

          .visualSide {
            height: 130px;
          }

          .illustration {
            transform: scale(0.40);
          }

          .formSide {
            padding:
              0 13px 18px;
          }

          h1 {
            font-size: 28px;
          }

          .welcomeBadge {
            font-size: 6px;
          }

          .rememberLabel,
          .forgotButton {
            font-size: 9px;
          }

          .googleButton {
            font-size: 10px;
          }
        }

        /* =========================================
           REDUCE MOTION
        ========================================= */

        @media (prefers-reduced-motion: reduce) {

          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

      `}</style>

    </main>
  );
}

