import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  /*
   * =====================================================
   * CREER / COMPLETER LE PROFIL
   * =====================================================
   */

  const createProfile = async (
    userId: string,
    userEmail?: string | null,
    userUsername?: string
  ) => {
    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          username: userUsername || null,
          email: userEmail || null,
          mobile: mobile || null,
        },
        {
          onConflict: "id",
        }
      );

    if (error) {
      console.error("Erreur création profil :", error);
      return false;
    }

    return true;
  };

  /*
   * =====================================================
   * VERIFIER SI UN UTILISATEUR EST DEJA CONNECTE
   * =====================================================
   */

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await createProfile(
          session.user.id,
          session.user.email,
          session.user.user_metadata?.username
        );

        navigate("/dashboard", { replace: true });
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (
          (event === "SIGNED_IN" ||
            event === "INITIAL_SESSION") &&
          session?.user
        ) {
          await createProfile(
            session.user.id,
            session.user.email,
            session.user.user_metadata?.username
          );

          navigate("/dashboard", {
            replace: true,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  /*
   * =====================================================
   * INSCRIPTION EMAIL + MOT DE PASSE
   * =====================================================
   */

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      /*
       * VALIDATION
       */

      if (!username.trim()) {
        setError(
          "Veuillez entrer votre nom d'utilisateur."
        );
        return;
      }

      if (!email.trim()) {
        setError(
          "Veuillez entrer votre adresse email."
        );
        return;
      }

      if (!mobile.trim()) {
        setError(
          "Veuillez entrer votre numéro de téléphone."
        );
        return;
      }

      if (!password) {
        setError(
          "Veuillez entrer un mot de passe."
        );
        return;
      }

      if (password.length < 8) {
        setError(
          "Le mot de passe doit contenir au moins 8 caractères."
        );
        return;
      }

      /*
       * VERIFICATION EMAIL
       */

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        setError(
          "Veuillez entrer une adresse email valide."
        );
        return;
      }

      /*
       * =================================================
       * SUPABASE AUTH
       * =================================================
       */

      const {
        data,
        error: signUpError,
      } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username: username.trim(),
            mobile: mobile.trim(),
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!data.user) {
        throw new Error(
          "Impossible de créer le compte."
        );
      }

      /*
       * =================================================
       * CREATION DU PROFIL
       * =================================================
       */

      if (data.session) {
        const profileCreated =
          await createProfile(
            data.user.id,
            data.user.email,
            username.trim()
          );

        if (!profileCreated) {
          throw new Error(
            "Le compte a été créé, mais le profil n'a pas pu être enregistré."
          );
        }

        navigate("/dashboard");
        return;
      }

      /*
       * CONFIRMATION EMAIL
       */

      setSuccess(
        "Votre compte a été créé. Vérifiez votre email pour confirmer votre adresse."
      );
    } catch (err: any) {
      console.error(err);

      if (
        err?.message
          ?.toLowerCase()
          .includes("user already registered")
      ) {
        setError(
          "Cette adresse email est déjà utilisée."
        );
      } else if (
        err?.message
          ?.toLowerCase()
          .includes("invalid email")
      ) {
        setError(
          "Cette adresse email n'est pas valide."
        );
      } else if (
        err?.message
          ?.toLowerCase()
          .includes("password")
      ) {
        setError(
          "Le mot de passe n'est pas suffisamment sécurisé."
        );
      } else {
        setError(
          err?.message ||
            "Une erreur est survenue lors de la création du compte."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * =====================================================
   * GOOGLE
   * =====================================================
   */

  const handleGoogleSignUp = async () => {
    setError("");
    setSuccess("");
    setGoogleLoading(true);

    try {
      const { error } =
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo:
              `${window.location.origin}/register`,
          },
        });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error(err);

      setError(
        err?.message ||
          "Impossible de continuer avec Google."
      );

      setGoogleLoading(false);
    }
  };

  return (
    <main className="page">

      {/* =========================================
          BACKGROUND
      ========================================== */}

      <div className="circle circleLarge" />
      <div className="circle circleSmall" />

      {/* =========================================
          CARD
      ========================================== */}

      <section className="authCard">

        {/* =======================================
            SVG ILLUSTRATION
        ======================================== */}

        <div className="visualSide">
          <div className="illustration">

            <img
              src="/illustrations/auth2.svg"
              alt="Create account illustration"
              className="registerIllustration"
            />

          </div>
        </div>

        {/* =======================================
            FORM
        ======================================== */}

        <div className="formSide">
          <div className="formContainer">

            {/* BRAND */}

            <div className="brandHeader">

              <div className="">
                <span />
                <span />
              </div>

              <img
              src="/images/logo4.png"
              alt="Create account illustration"
              className="registerIllustration"
            />

            </div>

            <h1>Create account</h1>

            <p className="subtitle">
              Create your LunaCreator account.
            </p>

            {/* ERROR */}

            {error && (
              <div className="errorMessage">
                {error}
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="successMessage">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* USERNAME */}

              <div className="inputGroup">

                <div className="inputIcon">
                  <svg viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="8"
                      r="3.5"
                    />

                    <path
                      d="M5 20c.8-3.5 3.2-5.5 7-5.5s6.2 2 7 5.5"
                    />
                  </svg>
                </div>

                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  autoComplete="username"
                  required
                />

              </div>

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

                    <path
                      d="m4 7 8 6 8-6"
                    />
                  </svg>
                </div>

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                  required
                />

              </div>

              {/* MOBILE */}

              <div className="inputGroup">

                <div className="inputIcon">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M7 3.5h3l1.5 4-2 1.5a13 13 0 0 0 5.5 5.5l1.5-2 4 1.5v3c0 1.1-.9 2-2 2C11 19 5 13 5 5.5c0-1.1.9-2 2-2Z"
                    />
                  </svg>
                </div>

                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) =>
                    setMobile(e.target.value)
                  }
                  autoComplete="tel"
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

                    <path
                      d="M8 10V7a4 4 0 0 1 8 0v3"
                    />
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
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="eyeButton"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
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
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 4.4A10.8 10.8 0 0 1 12 4c6 0 9.5 8 9.5 8a17 17 0 0 1-3.1 4.2" />
                      <path d="M6.2 6.2C3.9 8 2.5 12 2.5 12s3.5 8 9.5 8a9.8 9.8 0 0 0 4-.8" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24">
                      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />

                      <circle
                        cx="12"
                        cy="12"
                        r="2.8"
                      />
                    </svg>
                  )}
                </button>

              </div>

              {/* REMEMBER */}

              <div className="rememberRow">

                <label className="rememberLabel">

                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) =>
                      setRemember(
                        e.target.checked
                      )
                    }
                  />

                  <span className="customCheck" />

                  <span>
                    Remember me next time
                  </span>

                </label>

                <button
                  type="button"
                  className={`toggle ${
                    remember
                      ? "toggleActive"
                      : ""
                  }`}
                  onClick={() =>
                    setRemember(!remember)
                  }
                  aria-label="Toggle remember me"
                >
                  <span />
                </button>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="submitButton"
                disabled={
                  isLoading ||
                  googleLoading
                }
              >
                {isLoading ? (
                  <span className="loadingContent">
                    <span className="spinner" />
                    Creating account...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>

            </form>

            {/* GOOGLE */}

            <div className="divider">
              <span />
              <p>OR</p>
              <span />
            </div>

            <button
              type="button"
              className="googleButton"
              onClick={handleGoogleSignUp}
              disabled={
                isLoading ||
                googleLoading
              }
            >
              {googleLoading ? (
                <span className="loadingContent">
                  <span className="spinner darkSpinner" />
                  Connecting...
                </span>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    className="googleIcon"
                  >
                    <path
                      fill="#4285F4"
                      d="M21.35 12.23c0-.79-.07-1.54-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
                    />

                    <path
                      fill="#34A853"
                      d="M12 21.65c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.65Z"
                    />

                    <path
                      fill="#FBBC05"
                      d="M6.54 13.73a5.85 5.85 0 0 1 0-3.72V7.48H3.3a9.74 9.74 0 0 0 0 8.78l3.24-2.53Z"
                    />

                    <path
                      fill="#EA4335"
                      d="M12 5.98c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.05 14.63 2.15 12 2.15a9.74 9.74 0 0 0-8.7 5.33l3.24 2.53 3.24 2.53C7.31 7.7 9.46 5.98 12 5.98Z"
                    />
                  </svg>

                  Continue with Google
                </>
              )}
            </button>

            {/* LOGIN */}

            <p className="bottomText">
              Already have an account?{" "}

              <Link to="/login">
                Sign In
              </Link>
            </p>

          </div>
        </div>
      </section>

      {/* FOOTER */}

      <div className="brandFooter">
        <span>LunaCreator</span>
        <div />
      </div>

      {/* =========================================
          STYLES
      ========================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          width: 100%;
          position: relative;
          overflow: hidden;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 40px 20px;

          background: #f7f7f7;
          color: #000;

          font-family:
            Inter,
            Arial,
            Helvetica,
            sans-serif;
        }

        .circle {
          position: absolute;
          border-radius: 50%;
          background: #000;
          opacity: .04;
          pointer-events: none;
        }

        .circleLarge {
          width: 650px;
          height: 650px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .circleSmall {
          width: 38px;
          height: 38px;
          left: 13%;
          top: 14%;
          background: #000;
          opacity: 1;
        }

        .authCard {
          width: min(920px, 100%);
          min-height: 650px;

          display: grid;
          grid-template-columns: 1fr 1fr;

          position: relative;
          z-index: 2;

          overflow: hidden;
          border-radius: 28px;

          background: rgba(255,255,255,.96);
          border: 1px solid #e5e5e5;

          box-shadow:
            0 30px 80px rgba(0,0,0,.10),
            0 10px 25px rgba(0,0,0,.05);
        }

        /* =====================================
           SVG ILLUSTRATION
        ====================================== */

        .visualSide {
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .illustration {
          width: 100%;
          height: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 40px;
        }

        .registerIllustration {
          display: block;

          width: min(100%, 390px);
          height: auto;

          max-height: 470px;

          object-fit: contain;
        }

        /* =====================================
           FORM
        ====================================== */

        .formSide {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .formContainer {
          width: 350px;
          max-width: calc(100% - 50px);
        }

        .brandHeader {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 22px;
          font-size: 15px;
          font-weight: 700;
        }

        .brandLogo {
          position: relative;
          width: 25px;
          height: 25px;
        }

        .brandLogo span {
          position: absolute;
          display: block;
          width: 9px;
          height: 16px;
          background: #000;
          transform: skew(-14deg);
        }

        .brandLogo span:first-child {
          left: 10px;
          top: 0;
        }

        .brandLogo span:last-child {
          left: 5px;
          top: 9px;
        }

        h1 {
          margin: 0;
          font-size: 40px;
          line-height: 1;
          letter-spacing: -1.5px;
          font-weight: 700;
        }

        .subtitle {
          margin: 10px 0 20px;
          color: #777;
          font-size: 14px;
        }

        .errorMessage {
          margin-bottom: 12px;
          padding: 11px 13px;
          border-radius: 12px;
          background: #fff1f1;
          color: #b42318;
          border: 1px solid #ffd4d4;
          font-size: 12px;
          line-height: 1.4;
        }

        .successMessage {
          margin-bottom: 12px;
          padding: 11px 13px;
          border-radius: 12px;
          background: #effcf3;
          color: #16733a;
          border: 1px solid #c9efd5;
          font-size: 12px;
          line-height: 1.4;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .inputGroup {
          width: 100%;
          height: 50px;

          display: flex;
          align-items: center;

          border-radius: 15px;

          background: #f2f2f2;
          border: 1px solid transparent;

          transition: .2s ease;
        }

        .inputGroup:focus-within {
          background: white;
          border-color: #000;
          box-shadow: 0 0 0 3px rgba(0,0,0,.05);
        }

        .inputIcon {
          width: 50px;
          display: flex;
          justify-content: center;
          color: #555;
        }

        .inputIcon svg {
          width: 18px;
          height: 18px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.8;
        }

        .inputGroup input {
          width: 100%;
          height: 100%;

          border: 0;
          outline: none;

          background: transparent;
          color: #111;

          font-size: 14px;
          padding-right: 10px;
        }

        .inputGroup input::placeholder {
          color: #888;
        }

        .eyeButton {
          border: 0;
          background: transparent;
          color: #666;
          padding: 5px;
          margin-right: 12px;
          display: flex;
          cursor: pointer;
        }

        .eyeButton svg {
          width: 18px;
          height: 18px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.8;
        }

        /* =====================================
           REMEMBER
        ====================================== */

        .rememberRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 1px 2px 5px;
        }

        .rememberLabel {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #777;
          font-size: 10px;
          cursor: pointer;
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
        }

        .rememberLabel input:checked + .customCheck {
          background: #000;
          border-color: #000;
        }

        .rememberLabel input:checked + .customCheck::after {
          content: "";
          display: block;
          width: 6px;
          height: 3px;
          margin: 3px;
          border-left: 2px solid white;
          border-bottom: 2px solid white;
          transform: rotate(-45deg);
        }

        .toggle {
          width: 35px;
          height: 19px;
          padding: 2px;
          border: 0;
          border-radius: 20px;
          background: #d3d3d3;
          cursor: pointer;
        }

        .toggle span {
          display: block;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: white;
          transition: .2s ease;
        }

        .toggleActive {
          background: #000;
        }

        .toggleActive span {
          transform: translateX(16px);
        }

        /* =====================================
           BUTTON
        ====================================== */

        .submitButton {
          width: 100%;
          height: 50px;

          border: 0;
          border-radius: 15px;

          background: #000;
          color: white;

          font-size: 14px;
          font-weight: 600;

          cursor: pointer;
          transition: .2s ease;
        }

        .submitButton:hover:not(:disabled) {
          background: #222;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(0,0,0,.15);
        }

        .submitButton:disabled {
          opacity: .7;
          cursor: not-allowed;
        }

        .loadingContent {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
        }

        .spinner {
          width: 15px;
          height: 15px;

          border: 2px solid rgba(255,255,255,.3);
          border-top-color: white;

          border-radius: 50%;

          animation: spin .7s linear infinite;
        }

        .darkSpinner {
          border-color: rgba(0,0,0,.15);
          border-top-color: #000;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =====================================
           GOOGLE
        ====================================== */

        .divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 17px 0 13px;
        }

        .divider span {
          flex: 1;
          height: 1px;
          background: #e5e5e5;
        }

        .divider p {
          margin: 0;
          color: #999;
          font-size: 9px;
          font-weight: 600;
        }

        .googleButton {
          width: 100%;
          height: 50px;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;

          border: 1px solid #ddd;
          border-radius: 15px;

          background: white;
          color: #222;

          font-size: 13px;
          font-weight: 600;

          cursor: pointer;
          transition: .2s ease;
        }

        .googleButton:hover:not(:disabled) {
          background: #f8f8f8;
          border-color: #bbb;
        }

        .googleButton:disabled {
          opacity: .7;
          cursor: not-allowed;
        }

        .googleIcon {
          width: 18px;
          height: 18px;
        }

        /* =====================================
           LOGIN
        ====================================== */

        .bottomText {
          margin: 18px 0 0;
          text-align: center;
          color: #888;
          font-size: 11px;
        }

        .bottomText a {
          color: #000;
          font-weight: 700;
          text-decoration: none;
        }

        .bottomText a:hover {
          text-decoration: underline;
        }

        /* =====================================
           FOOTER
        ====================================== */

        .brandFooter {
          position: absolute;
          right: 8%;
          bottom: 30px;
          z-index: 3;
          font-size: 28px;
          color: #222;
        }

        .brandFooter div {
          width: 90px;
          height: 3px;
          margin-left: auto;
          margin-top: 5px;
          background: #000;
        }

        /* =====================================
           TABLET
        ====================================== */

        @media (max-width: 850px) {

          .authCard {
            width: 460px;
            grid-template-columns: 1fr;
            padding: 25px 0;
          }

          .visualSide {
            height: 220px;
          }

          .illustration {
            padding: 15px;
          }

          .registerIllustration {
            width: 240px;
            max-height: 210px;
          }

          .formSide {
            padding-bottom: 20px;
          }

          .brandFooter {
            display: none;
          }
        }

        /* =====================================
           MOBILE
        ====================================== */

        @media (max-width: 500px) {

          .page {
            padding: 15px;
          }

          .authCard {
            width: 100%;
            border-radius: 22px;
          }

          .visualSide {
            height: 160px;
          }

          .illustration {
            padding: 10px;
          }

          .registerIllustration {
            width: 190px;
            max-height: 145px;
          }

          .formContainer {
            max-width: calc(100% - 40px);
          }

          h1 {
            font-size: 34px;
          }

          .brandHeader {
            margin-bottom: 18px;
          }
        }

      `}</style>
    </main>
  );
}