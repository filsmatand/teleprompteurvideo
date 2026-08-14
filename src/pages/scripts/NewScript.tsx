import {
  ArrowLeft,
  Check,
  FileText,
  Mic,
  Play,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewScript() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Présentation");
  const [saved, setSaved] = useState(false);
  const [scripts, setScripts] = useState([]);

  const categories = [
    "Présentation",
    "TikTok",
    "YouTube",
    "Instagram",
    "Publicité",
    "Formation",
    "Storytelling",
    "Autre",
  ];

  /* -------------------------------- */
  /* CHARGER LES SCRIPTS */
  /* -------------------------------- */

  useEffect(() => {
    const savedScripts = localStorage.getItem(
      "creatorflow_scripts"
    );

    if (savedScripts) {
      try {
        setScripts(JSON.parse(savedScripts));
      } catch {
        setScripts([]);
      }
    }
  }, []);

  /* -------------------------------- */
  /* SAUVEGARDER */
  /* -------------------------------- */

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert("Veuillez remplir le titre et le texte.");
      return;
    }

    const script = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      category,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "creatorflow_current_script",
      JSON.stringify(script)
    );

    const existingScripts =
      localStorage.getItem("creatorflow_scripts");

    let currentScripts = [];

    if (existingScripts) {
      try {
        currentScripts = JSON.parse(existingScripts);
      } catch {
        currentScripts = [];
      }
    }

    const updatedScripts = [
      script,
      ...currentScripts.filter(
        (item) => item.id !== script.id
      ),
    ];

    localStorage.setItem(
      "creatorflow_scripts",
      JSON.stringify(updatedScripts)
    );

    setScripts(updatedScripts);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  /* -------------------------------- */
  /* DÉMARRER LA VIDÉO */
  /* -------------------------------- */

  const handleStartVideo = () => {
    if (!content.trim()) {
      alert("Écrivez d'abord votre script.");
      return;
    }

    const script = {
      id: Date.now(),
      title: title.trim() || "Nouveau script",
      content: content.trim(),
      category,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "creatorflow_current_script",
      JSON.stringify(script)
    );

    navigate("/recordings");
  };

  /* -------------------------------- */
  /* EXEMPLE */
  /* -------------------------------- */

  const insertExample = () => {
    setTitle("Présentation de mon projet");

    setContent(
      `Bonjour à tous !

Aujourd'hui, je vais vous présenter mon nouveau projet.

L'objectif est de proposer une solution simple et efficace pour aider les créateurs de contenu à mieux s'exprimer devant une caméra.

Grâce à notre téléprompteur, vous pouvez lire votre texte naturellement tout en enregistrant votre vidéo.

C'est simple, rapide et pensé pour les créateurs.

Merci d'avoir regardé cette vidéo !`
    );
  };

  /* -------------------------------- */
  /* OUVRIR UN SCRIPT */
  /* -------------------------------- */

  const openScript = (script) => {
    setTitle(script.title);
    setContent(script.content);
    setCategory(script.category || "Présentation");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* -------------------------------- */
  /* STATISTIQUES */
  /* -------------------------------- */

  const wordCount = content.trim()
    ? content.trim().split(/\s+/).length
    : 0;

  const characterCount = content.length;

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#151515]">

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

          {/* GAUCHE */}

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
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
              <h1 className="text-sm font-semibold tracking-tight">
                Nouveau script
              </h1>

              <p className="hidden text-[11px] text-gray-400 sm:block">
                Préparez votre prochaine vidéo
              </p>
            </div>
          </div>

          {/* LOGO */}

          <div className="flex items-center gap-2">

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-black
                text-white
                shadow-lg
              "
            >
              <Sparkles size={15} />
            </div>

            <span className="hidden text-sm font-bold sm:block">
              Creator
              <span className="text-[#7041e8]">
                Flow
              </span>
            </span>

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

          <div className="mb-3 flex items-center gap-2">

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

            <span className="text-[11px] text-gray-400">
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
            puis lancez directement votre enregistrement.
          </p>

        </section>


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
                setTitle(event.target.value)
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

            <div className="flex items-center gap-3">

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

                <p className="text-[10px] text-gray-400">
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
              <Sparkles size={13} />
              Avec l'IA
            </button>

          </div>


          {/* TEXTAREA */}

          <textarea
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
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

            <div className="flex items-center gap-4">

              <span className="text-[10px] text-gray-400">
                {characterCount} caractères
              </span>

              <span className="text-[10px] text-gray-400">
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
        {/* CATEGORY */}
        {/* ========================================= */}

        <div className="mt-5 flex flex-wrap items-center gap-2">

          <span
            className="
              mr-1
              text-[10px]
              font-semibold
              uppercase
              tracking-wider
              text-gray-400
            "
          >
            Format
          </span>

          {categories.map((item) => (

            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`
                rounded-full
                px-3
                py-2
                text-[10px]
                font-medium
                transition

                ${
                  category === item
                    ? "bg-black text-white shadow-sm"
                    : "bg-white text-gray-400 hover:text-gray-700"
                }
              `}
            >
              {item}
            </button>

          ))}

        </div>


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
              hover:shadow-[0_16px_35px_rgba(0,0,0,0.20)]
              active:scale-[0.98]
            "
          >

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
                transition
                group-hover:scale-105
              "
            >
              <Play
                size={14}
                fill="currentColor"
                strokeWidth={0}
              />
            </span>

            Démarrer la vidéo

          </button>


          {/* SAVE */}

          <button
            type="button"
            onClick={handleSave}
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
              active:scale-[0.98]
            "
          >

            {saved ? (
              <>
                <Check size={16} />
                Enregistré
              </>
            ) : (
              <>
                <FileText size={16} />
                Sauvegarder
              </>
            )}

          </button>

        </div>


        {/* ========================================= */}
        {/* MES SCRIPTS */}
        {/* ========================================= */}

        {scripts.length > 0 && (

          <section className="mt-14">

            <div
              className="
                mb-5
                flex
                items-end
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-gray-400
                  "
                >
                  Bibliothèque
                </p>

                <h3
                  className="
                    mt-1
                    text-xl
                    font-bold
                    tracking-tight
                  "
                >
                  Mes scripts
                </h3>

              </div>

              <span className="text-[10px] text-gray-400">
                {scripts.length} script
                {scripts.length > 1 ? "s" : ""}
              </span>

            </div>


            <div
              className="
                grid
                gap-3
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >

              {scripts.slice(0, 6).map((script) => (

                <button
                  key={script.id}
                  type="button"
                  onClick={() => openScript(script)}
                  className="
                    group
                    rounded-[22px]
                    border
                    border-black/[0.06]
                    bg-white
                    p-5
                    text-left
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-black/[0.12]
                    hover:shadow-lg
                  "
                >

                  <div className="mb-4 flex items-center justify-between">

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        bg-gray-100
                        text-gray-500
                        transition
                        group-hover:bg-black
                        group-hover:text-white
                      "
                    >
                      <FileText size={15} />
                    </div>

                    <span
                      className="
                        rounded-full
                        bg-gray-100
                        px-2.5
                        py-1
                        text-[9px]
                        font-medium
                        text-gray-400
                      "
                    >
                      {script.category}
                    </span>

                  </div>


                  <h4
                    className="
                      truncate
                      text-sm
                      font-semibold
                    "
                  >
                    {script.title}
                  </h4>


                  <p
                    className="
                      mt-2
                      line-clamp-2
                      text-[11px]
                      leading-5
                      text-gray-400
                    "
                  >
                    {script.content}
                  </p>


                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <span className="text-[9px] text-gray-300">
                      {script.content.trim()
                        ? script.content
                            .trim()
                            .split(/\s+/).length
                        : 0}{" "}
                      mots
                    </span>

                    <span
                      className="
                        text-[10px]
                        font-medium
                        text-gray-300
                        transition
                        group-hover:text-black
                      "
                    >
                      Ouvrir →
                    </span>

                  </div>

                </button>

              ))}

            </div>

          </section>

        )}

      </main>


      {/* ========================================= */}
      {/* MOBILE BOTTOM NAV */}
      {/* ========================================= */}

      <div className="h-4" />

    </div>
  );
}