import {
  ArrowLeft,
  Check,
  FileText,
  Loader2,
  Mic,
  Play,
  WandSparkles,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { supabase } from "../../lib/supabase";

interface Script {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function NewScript() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = Boolean(id);

  /* ================================================= */
  /* STATE */
  /* ================================================= */

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingScript, setIsLoadingScript] = useState(
    isEditing
  );

  const [error, setError] = useState("");

  /* ================================================= */
  /* CHARGER LE SCRIPT SI MODIFICATION */
  /* ================================================= */

  useEffect(() => {
    if (id) {
      loadScript(id);
    }
  }, [id]);

  /* ================================================= */
  /* LOAD SCRIPT */
  /* ================================================= */

  const loadScript = async (scriptId: string) => {
    setIsLoadingScript(true);
    setError("");

    try {
      /* --------------------------------------------- */
      /* UTILISATEUR */
      /* --------------------------------------------- */

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      /* --------------------------------------------- */
      /* SCRIPT */
      /* --------------------------------------------- */

      const {
        data,
        error: scriptError,
      } = await supabase
        .from("scripts")
        .select(
          "id, user_id, title, content, created_at, updated_at"
        )
        .eq("id", scriptId)
        .eq("user_id", user.id)
        .single();

      if (scriptError) {
        throw scriptError;
      }

      if (!data) {
        throw new Error(
          "Script introuvable."
        );
      }

      setTitle(data.title || "");
      setContent(data.content || "");

    } catch (err: any) {
      console.error(
        "Erreur chargement script :",
        err
      );

      setError(
        err?.message ||
          "Impossible de charger ce script."
      );
    } finally {
      setIsLoadingScript(false);
    }
  };

  /* ================================================= */
  /* SAVE SCRIPT */
  /* ================================================= */

  const handleSave = async () => {
    setError("");
    setSaved(false);

    /* --------------------------------------------- */
    /* VALIDATION */
    /* --------------------------------------------- */

    if (!title.trim()) {
      setError(
        "Veuillez entrer un titre."
      );
      return;
    }

    if (!content.trim()) {
      setError(
        "Veuillez écrire votre script."
      );
      return;
    }

    setIsLoading(true);

    try {
      /* --------------------------------------------- */
      /* USER */
      /* --------------------------------------------- */

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      /* --------------------------------------------- */
      /* UPDATE */
      /* --------------------------------------------- */

      if (id) {
        const {
          error: updateError,
        } = await supabase
          .from("scripts")
          .update({
            title: title.trim(),
            content: content.trim(),
            updated_at:
              new Date().toISOString(),
          })
          .eq("id", id)
          .eq("user_id", user.id);

        if (updateError) {
          throw updateError;
        }

      }

      /* --------------------------------------------- */
      /* INSERT */
      /* --------------------------------------------- */

      else {
        const {
          error: insertError,
        } = await supabase
          .from("scripts")
          .insert({
            user_id: user.id,
            title: title.trim(),
            content: content.trim(),
          });

        if (insertError) {
          throw insertError;
        }
      }

      /* --------------------------------------------- */
      /* SUCCESS */
      /* --------------------------------------------- */

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);

    } catch (err: any) {
      console.error(
        "Erreur sauvegarde :",
        err
      );

      setError(
        err?.message ||
          "Impossible de sauvegarder le script."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ================================================= */
  /* START VIDEO */
  /* ================================================= */

  const handleStartVideo = async () => {
    setError("");

    if (!content.trim()) {
      setError(
        "Écrivez d'abord votre script."
      );
      return;
    }

    /*
      Avant de lancer l'enregistrement,
      on sauvegarde automatiquement le script.
    */

    setIsLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      let scriptId = id;

      /* --------------------------------------------- */
      /* SI SCRIPT EXISTANT */
      /* --------------------------------------------- */

      if (id) {
        const {
          error: updateError,
        } = await supabase
          .from("scripts")
          .update({
            title:
              title.trim() ||
              "Nouveau script",
            content: content.trim(),
            updated_at:
              new Date().toISOString(),
          })
          .eq("id", id)
          .eq("user_id", user.id);

        if (updateError) {
          throw updateError;
        }
      }

      /* --------------------------------------------- */
      /* NOUVEAU SCRIPT */
      /* --------------------------------------------- */

      else {
        const {
          data,
          error: insertError,
        } = await supabase
          .from("scripts")
          .insert({
            user_id: user.id,
            title:
              title.trim() ||
              "Nouveau script",
            content: content.trim(),
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        scriptId = data.id;
      }

      /* --------------------------------------------- */
      /* ENREGISTREMENT */
      /* --------------------------------------------- */

      navigate(
        `/recordings?script=${scriptId}`
      );

    } catch (err: any) {
      console.error(
        "Erreur démarrage vidéo :",
        err
      );

      setError(
        err?.message ||
          "Impossible de démarrer l'enregistrement."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ================================================= */
  /* EXEMPLE */
  /* ================================================= */

  const insertExample = () => {
    setTitle(
      "Présentation de mon projet"
    );

    setContent(
      `Bonjour à tous !

Aujourd'hui, je vais vous présenter mon nouveau projet.

L'objectif est de proposer une solution simple et efficace pour aider les créateurs de contenu à mieux s'exprimer devant une caméra.

Grâce à notre téléprompteur, vous pouvez lire votre texte naturellement tout en enregistrant votre vidéo.

C'est simple, rapide et pensé pour les créateurs.

Merci d'avoir regardé cette vidéo !`
    );

    setError("");
  };

  /* ================================================= */
  /* STATISTICS */
  /* ================================================= */

  const wordCount = content.trim()
    ? content
        .trim()
        .split(/\s+/)
        .length
    : 0;

  const characterCount =
    content.length;

  /* ================================================= */
  /* LOADING SCRIPT */
  /* ================================================= */

  if (isLoadingScript) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#f5f5f5]
        "
      >
        <div className="flex flex-col items-center">

          <Loader2
            size={28}
            className="animate-spin"
          />

          <p
            className="
              mt-4
              text-sm
              text-gray-400
            "
          >
            Chargement du script...
          </p>

        </div>
      </div>
    );
  }

  /* ================================================= */
  /* RENDER */
  /* ================================================= */

  return (
    <div
      className="
        min-h-screen
        bg-[#f5f5f5]
        text-[#151515]
      "
    >

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <header
        className="
          sticky
          top-0
          z-40
          border-b
          border-black/[0.05]
          bg-[#f5f5f5]/85
          backdrop-blur-2xl
        "
      >

        <div
          className="
            mx-auto
            flex
            h-[72px]
            max-w-6xl
            items-center
            justify-between
            px-4
            sm:px-6
            lg:px-8
          "
        >

          {/* LEFT */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <button
              type="button"
              onClick={() =>
                navigate("/dashboard")
              }
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-black/[0.07]
                bg-white
                text-gray-500
                shadow-sm
                transition
                hover:-translate-x-0.5
                hover:text-black
              "
            >
              <ArrowLeft size={18} />
            </button>

            <div>

              <h1
                className="
                  text-sm
                  font-semibold
                  tracking-tight
                "
              >
                {isEditing
                  ? "Modifier le script"
                  : "Nouveau script"}
              </h1>

              <p
                className="
                  hidden
                  text-[11px]
                  text-gray-400
                  sm:block
                "
              >
                Préparez votre prochaine vidéo
              </p>

            </div>

          </div>

          {/* LOGO */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <img
              src="/images/logo.png"
              alt="LunaCreator"
              className="
                h-8
                w-auto
                object-contain
              "
            />

          </div>

        </div>

      </header>

      {/* ========================================= */}
      {/* MAIN */}
      {/* ========================================= */}

      <main
        className="
          mx-auto
          max-w-5xl
          px-4
          pb-32
          pt-8
          sm:px-6
          sm:pt-12
        "
      >

        {/* ========================================= */}
        {/* INTRO */}
        {/* ========================================= */}

        <section className="mb-8">

          <div
            className="
              mb-3
              flex
              items-center
              gap-2
            "
          >

            <span
              className="
                rounded-full
                bg-black
                px-3
                py-1
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-white
              "
            >
              Script
            </span>

            <span
              className="
                text-[11px]
                text-gray-400
              "
            >
              {wordCount} mots
            </span>

          </div>

          <h2
            className="
              text-3xl
              font-bold
              tracking-[-0.04em]
              sm:text-4xl
            "
          >
            Donnez vie à votre idée.
          </h2>

          <p
            className="
              mt-2
              max-w-xl
              text-sm
              leading-6
              text-gray-400
            "
          >
            Écrivez votre script, sauvegardez-le,
            puis lancez directement votre
            enregistrement.
          </p>

        </section>

        {/* ========================================= */}
        {/* ERROR */}
        {/* ========================================= */}

        {error && (
          <div
            className="
              mb-5
              rounded-2xl
              border
              border-red-100
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-600
            "
          >
            {error}
          </div>
        )}

        {/* ========================================= */}
        {/* TITLE */}
        {/* ========================================= */}

        <section className="mb-4">

          <label
            className="
              mb-2
              block
              text-[11px]
              font-semibold
              uppercase
              tracking-wider
              text-gray-400
            "
          >
            Titre
          </label>

          <div className="relative">

            <FileText
              size={17}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="Ex : Présentation de mon projet"
              className="
                w-full
                rounded-[20px]
                border
                border-black/[0.07]
                bg-white
                py-4
                pl-11
                pr-4
                text-sm
                font-medium
                shadow-sm
                outline-none
                transition
                placeholder:text-gray-300
                focus:border-black/20
                focus:ring-4
                focus:ring-black/[0.03]
              "
            />

          </div>

        </section>

        {/* ========================================= */}
        {/* EDITOR */}
        {/* ========================================= */}

        <section
          className="
            overflow-hidden
            rounded-[28px]
            border
            border-black/[0.07]
            bg-white
            shadow-[0_15px_50px_rgba(0,0,0,0.05)]
          "
        >

          {/* TOOLBAR */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-black/[0.05]
              px-5
              py-4
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-gray-100
                  text-gray-700
                "
              >
                <Mic size={16} />
              </div>

              <div>

                <p className="text-xs font-semibold">
                  Votre script
                </p>

                <p
                  className="
                    text-[10px]
                    text-gray-400
                  "
                >
                  Écrivez naturellement
                </p>

              </div>

            </div>

            {/* AI */}

            <button
              type="button"
              onClick={() =>
                alert(
                  "L'assistant IA sera bientôt disponible."
                )
              }
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-[#7041e8]/10
                bg-[#7041e8]/[0.06]
                px-3
                py-2
                text-[10px]
                font-semibold
                text-[#7041e8]
                transition
                hover:bg-[#7041e8]/10
              "
            >
              <WandSparkles size={13} />
              Avec l'IA
            </button>

          </div>

          {/* TEXTAREA */}

          <textarea
            value={content}
            onChange={(event) =>
              setContent(
                event.target.value
              )
            }
            placeholder={`Commencez à écrire votre script...

Bonjour à tous !

Aujourd'hui, je vais vous présenter...

Votre texte sera ensuite affiché
sur le téléprompteur.`}
            className="
              min-h-[440px]
              w-full
              resize-none
              border-0
              bg-white
              px-6
              py-6
              text-[16px]
              leading-8
              text-[#242424]
              outline-none
              placeholder:text-gray-300
              sm:min-h-[500px]
              sm:px-8
              sm:py-8
            "
          />

          {/* FOOTER */}

          <div
            className="
              flex
              items-center
              justify-between
              border-t
              border-black/[0.05]
              px-5
              py-3
            "
          >

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              <span
                className="
                  text-[10px]
                  text-gray-400
                "
              >
                {characterCount} caractères
              </span>

              <span
                className="
                  text-[10px]
                  text-gray-400
                "
              >
                {wordCount} mots
              </span>

            </div>

            <button
              type="button"
              onClick={insertExample}
              className="
                flex
                items-center
                gap-1.5
                rounded-full
                px-3
                py-1.5
                text-[10px]
                font-semibold
                text-gray-400
                transition
                hover:bg-gray-100
                hover:text-gray-700
              "
            >
              <WandSparkles size={12} />
              Exemple
            </button>

          </div>

        </section>

        {/* ========================================= */}
        {/* ACTIONS */}
        {/* ========================================= */}

        <div
          className="
            mt-8
            flex
            flex-col
            gap-3
            sm:flex-row
          "
        >

          {/* START VIDEO */}

          <button
            type="button"
            onClick={handleStartVideo}
            disabled={isLoading}
            className="
              group
              flex
              flex-1
              items-center
              justify-center
              gap-3
              rounded-[22px]
              bg-black
              px-6
              py-4
              text-sm
              font-semibold
              text-white
              shadow-[0_12px_30px_rgba(0,0,0,0.16)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#171717]
              disabled:cursor-not-allowed
              disabled:opacity-60
              active:scale-[0.98]
            "
          >

            {isLoading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Enregistrement...
              </>
            ) : (
              <>
                <span
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-black
                  "
                >
                  <Play
                    size={14}
                    fill="currentColor"
                    strokeWidth={0}
                  />
                </span>

                Démarrer la vidéo
              </>
            )}

          </button>

          {/* SAVE */}

          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-[22px]
              border
              border-black/[0.07]
              bg-white
              px-7
              py-4
              text-sm
              font-semibold
              text-gray-700
              shadow-sm
              transition
              hover:border-black/15
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-60
              active:scale-[0.98]
            "
          >

            {saved ? (
              <>
                <Check size={16} />
                Enregistré
              </>
            ) : isLoading ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Sauvegarde...
              </>
            ) : (
              <>
                <FileText size={16} />
                Sauvegarder
              </>
            )}

          </button>

        </div>

      </main>

    </div>
  );
}