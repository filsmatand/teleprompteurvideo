import React from "react";
import {
  FileText,
  Plus,
  Play,
  MoreHorizontal,
  Clock3,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Script {
  id: number;
  title: string;
  preview: string;
  updatedAt: string;
  duration: string;
}

const scripts: Script[] = [
  {
    id: 1,
    title: "Les 5 langages à apprendre en 2026",
    preview:
      "Si tu veux devenir développeur en 2026, voici les cinq langages...",
    updatedAt: "Aujourd'hui",
    duration: "2 min",
  },
  {
    id: 2,
    title: "Présentation de LunaSpeech",
    preview:
      "Aujourd'hui, je vais vous présenter une application qui va...",
    updatedAt: "Hier",
    duration: "1 min",
  },
  {
    id: 3,
    title: "Pourquoi apprendre React ?",
    preview:
      "React est aujourd'hui l'une des technologies les plus utilisées...",
    updatedAt: "12 août",
    duration: "3 min",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const createScript = () => {
    navigate("/script/new");
  };

  const openScript = (id: number) => {
    navigate(`/script/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#EAEFF2] px-4 py-6 font-sans sm:px-6 lg:px-10">

      <div className="mx-auto max-w-5xl">

        {/* ========================================
            HEADER
        ======================================== */}
        <header className="mb-8 flex items-center justify-between">

          <div>
            <p className="text-xs font-medium text-[#777777]">
              LunaSpeech
            </p>

            <h1 className="mt-1 text-2xl font-medium tracking-tight text-[#171717] sm:text-3xl">
              Tes scripts
            </h1>

            <p className="mt-2 text-sm text-[#777777]">
              Prépare tes textes et lance ton enregistrement.
            </p>
          </div>

          {/* Profile */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-semibold text-[#171717] shadow-sm transition hover:shadow-md"
          >
            FM
          </button>

        </header>


        {/* ========================================
            CREATE SCRIPT
        ======================================== */}
        <section className="mb-8">

          <button
            onClick={createScript}
            className="group flex w-full items-center justify-between overflow-hidden rounded-[28px] bg-[#050505] p-6 text-left text-white shadow-[0_15px_35px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.16)] sm:p-7"
          >

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Plus size={22} />
              </div>

              <div>
                <h2 className="text-lg font-medium">
                  Créer un script
                </h2>

                <p className="mt-1 text-sm text-white/55">
                  Écris ton texte et prépare ton enregistrement.
                </p>
              </div>

            </div>

            <div className="hidden rounded-full bg-white px-5 py-2.5 text-xs font-medium text-[#050505] transition group-hover:px-6 sm:block">
              Nouveau script
            </div>

          </button>

        </section>


        {/* ========================================
            SEARCH
        ======================================== */}
        <div className="mb-6 flex items-center gap-3">

          <div className="relative flex-1">

            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]"
            />

            <input
              type="text"
              placeholder="Rechercher un script..."
              className="h-12 w-full rounded-2xl border border-black/[0.04] bg-white pl-11 pr-4 text-sm text-[#171717] outline-none placeholder:text-[#AAAAAA] focus:border-black/10"
            />

          </div>

        </div>


        {/* ========================================
            SCRIPTS
        ======================================== */}
        <section>

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h2 className="text-base font-medium text-[#171717]">
                Mes scripts
              </h2>

              <p className="mt-1 text-xs text-[#888888]">
                {scripts.length} scripts
              </p>
            </div>

          </div>


          {/* Script list */}
          <div className="space-y-3">

            {scripts.map((script) => (

              <button
                key={script.id}
                onClick={() => openScript(script.id)}
                className="group flex w-full items-center gap-4 rounded-[24px] border border-black/[0.035] bg-[#F9FAFE] p-4 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_30px_rgba(40,50,60,0.07)] sm:p-5"
              >

                {/* Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E8E5DE] text-[#55514A]">
                  <FileText size={20} />
                </div>


                {/* Content */}
                <div className="min-w-0 flex-1">

                  <div className="flex items-center gap-2">

                    <h3 className="truncate text-sm font-medium text-[#171717]">
                      {script.title}
                    </h3>

                  </div>

                  <p className="mt-1 truncate text-xs leading-5 text-[#888888]">
                    {script.preview}
                  </p>


                  <div className="mt-2 flex items-center gap-3 text-[11px] text-[#AAAAAA]">

                    <span className="flex items-center gap-1">
                      <Clock3 size={12} />
                      {script.updatedAt}
                    </span>

                    <span>
                      {script.duration}
                    </span>

                  </div>

                </div>


                {/* Actions */}
                <div className="flex items-center gap-2">

                  {/* Start recording */}
                  <div
                    className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#050505] text-white transition group-hover:scale-105 sm:flex"
                    title="Enregistrer"
                  >
                    <Play size={15} fill="currentColor" />
                  </div>

                  <MoreHorizontal
                    size={19}
                    className="text-[#AAAAAA]"
                  />

                </div>

              </button>

            ))}

          </div>

        </section>


        {/* ========================================
            EMPTY STATE
        ======================================== */}
        {scripts.length === 0 && (

          <div className="rounded-[28px] bg-[#F9FAFE] px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8E5DE] text-[#55514A]">
              <FileText size={23} />
            </div>

            <h3 className="mt-5 text-base font-medium text-[#171717]">
              Aucun script pour le moment
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#888888]">
              Crée ton premier script et prépare ta prochaine vidéo avec
              LunaSpeech.
            </p>

            <button
              onClick={createScript}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#050505] px-6 py-3 text-xs font-medium text-white transition hover:scale-[1.02] active:scale-95"
            >
              <Plus size={15} />
              Créer mon premier script
            </button>

          </div>

        )}

      </div>

    </div>
  );
}