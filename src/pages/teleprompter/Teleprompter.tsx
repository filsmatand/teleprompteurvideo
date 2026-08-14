import {
  BarChart3,
  ChevronRight,
  Clock3,
  FileText,
  Home,
  Mic,
  Play,
  Plus,
  Settings,
  Sparkles,
  User,
  Video,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const modules = [
  {
    title: "Script",
    description: "Créer un texte",
    icon: FileText,
    path: "/scripts/new",
  },
  {
    title: "Téléprompteur",
    description: "Lire et enregistrer",
    icon: Mic,
    path: "/teleprompter",
  },
  {
    title: "Enregistrer",
    description: "Créer une vidéo",
    icon: Video,
    path: "/teleprompter",
  },
  {
    title: "Mes vidéos",
    description: "Voir mes créations",
    icon: Play,
    path: "/recordings",
  },
];

const recentScripts = [
  {
    title: "Présentation de mon projet",
    duration: "02:10",
    date: "Aujourd'hui",
  },
  {
    title: "5 conseils pour réussir sur TikTok",
    duration: "01:25",
    date: "Hier",
  },
  {
    title: "Pourquoi apprendre JavaScript ?",
    duration: "01:48",
    date: "Il y a 3 jours",
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#faf9fd] text-[#17131f]">

      {/* =========================
          DESKTOP / MOBILE HEADER
      ========================== */}

      <header className="sticky top-0 z-50 border-b border-[#eee9f3] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* LOGO */}

          <Link
            to="/dashboard"
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7041e8] shadow-[0_6px_20px_rgba(112,65,232,0.2)]">
              <Sparkles
                size={18}
                className="text-white"
              />
            </div>

            <span className="text-lg font-bold tracking-tight">
              Creator
              <span className="text-[#7041e8]">
                Flow
              </span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}

          <nav className="hidden items-center gap-7 md:flex">

            <Link
              to="/dashboard"
              className="text-sm font-semibold text-[#7041e8]"
            >
              Accueil
            </Link>

            <Link
              to="/scripts"
              className="text-sm text-[#77717f] transition hover:text-[#7041e8]"
            >
              Mes scripts
            </Link>

            <Link
              to="/recordings"
              className="text-sm text-[#77717f] transition hover:text-[#7041e8]"
            >
              Mes vidéos
            </Link>

            <Link
              to="/teleprompter"
              className="text-sm text-[#77717f] transition hover:text-[#7041e8]"
            >
              Téléprompteur
            </Link>
          </nav>

          {/* PROFILE */}

          <Link
            to="/profile"
            className="flex items-center gap-3"
          >
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold">
                Fils
              </p>

              <p className="text-[10px] text-[#aaa3b1]">
                Créateur
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eee8ff] text-sm font-bold text-[#7041e8]">
              F
            </div>
          </Link>
        </div>
      </header>

      {/* =========================
          MAIN
      ========================== */}

      <main className="mx-auto max-w-7xl px-4 pb-28 pt-7 sm:px-6 lg:px-8">

        {/* =========================
            WELCOME
        ========================== */}

        <motion.section
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          <p className="text-sm font-medium text-[#7041e8]">
            Bonjour 👋
          </p>

          <div className="mt-1 flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Prêt à devenir
                <br className="sm:hidden" />{" "}
                un meilleur créateur ?
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#817a89]">
                Préparez vos scripts, utilisez le
                téléprompteur et créez vos vidéos
                avec plus de confiance.
              </p>
            </div>

            <Link
              to="/scripts/new"
              className="flex w-fit items-center gap-2 rounded-xl bg-[#7041e8] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(112,65,232,0.2)] transition hover:-translate-y-0.5 hover:bg-[#6133d8]"
            >
              <Plus size={17} />

              Nouveau script
            </Link>
          </div>
        </motion.section>

        {/* =========================
            OBJECTIF DU JOUR
        ========================== */}

        <motion.section
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
          className="mt-7 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#7041e8] to-[#8559ed] p-6 text-white shadow-[0_15px_40px_rgba(112,65,232,0.18)] sm:p-7"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <Sparkles size={21} />
              </div>

              <div>
                <p className="text-xs font-semibold text-white/70">
                  OBJECTIF DU JOUR
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Créez une vidéo aujourd'hui
                </h2>

                <p className="mt-1 text-xs text-white/65">
                  Votre objectif est presque atteint.
                </p>
              </div>
            </div>

            {/* PROGRESS */}

            <div className="flex items-center gap-5">

              <div className="w-32 sm:w-40">
                <div className="mb-2 flex justify-between text-[10px] text-white/70">
                  <span>Progression</span>
                  <span>60%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full w-[60%] rounded-full bg-white" />
                </div>

                <p className="mt-2 text-[10px] text-white/60">
                  3 / 5 vidéos
                </p>
              </div>

              <div className="hidden h-16 w-16 items-center justify-center rounded-full border-4 border-white/20 sm:flex">
                <span className="text-sm font-bold">
                  60%
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* =========================
            CONTINUER
        ========================== */}

        <section className="mt-8">

          <div className="flex items-end justify-between">

            <div>
              <h2 className="text-xl font-bold">
                Continuer l'entraînement
              </h2>

              <p className="mt-1 text-xs text-[#817a89]">
                Reprenez là où vous vous êtes arrêté.
              </p>
            </div>

            <Link
              to="/teleprompter"
              className="hidden items-center gap-1 text-xs font-semibold text-[#7041e8] sm:flex"
            >
              Reprendre
              <ChevronRight size={14} />
            </Link>
          </div>

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
            className="mt-4 flex flex-col justify-between gap-5 rounded-[26px] border border-[#e9e3f1] bg-white p-5 shadow-[0_8px_30px_rgba(50,35,70,0.04)] sm:flex-row sm:items-center sm:p-6"
          >

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eee8ff] text-[#7041e8]">
                <Mic size={24} />
              </div>

              <div>
                <p className="text-sm font-bold">
                  Téléprompteur
                </p>

                <p className="mt-1 text-xs text-[#817a89]">
                  Présentation de mon projet
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <Clock3
                    size={12}
                    className="text-[#aaa3b1]"
                  />

                  <span className="text-[10px] text-[#aaa3b1]">
                    Dernière session : 02:10
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/teleprompter"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#7041e8] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#6133d8]"
            >
              <Play size={15} />
              Reprendre
            </Link>
          </motion.div>
        </section>

        {/* =========================
            MES OUTILS
        ========================== */}

        <section className="mt-8">

          <div>
            <h2 className="text-xl font-bold">
              Mes outils
            </h2>

            <p className="mt-1 text-xs text-[#817a89]">
              Tout ce dont vous avez besoin pour créer.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">

            {modules.map((module, index) => {

              const Icon = module.icon;

              return (
                <motion.div
                  key={module.title}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                  }}
                >
                  <Link
                    to={module.path}
                    className="group block rounded-[22px] border border-[#e9e3f1] bg-white p-4 transition hover:-translate-y-1 hover:border-[#d9cef1] hover:shadow-[0_12px_30px_rgba(70,50,100,0.07)] sm:p-5"
                  >

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eee8ff] text-[#7041e8] transition group-hover:bg-[#7041e8] group-hover:text-white">
                      <Icon size={19} />
                    </div>

                    <h3 className="mt-4 text-sm font-bold">
                      {module.title}
                    </h3>

                    <p className="mt-1 text-[10px] leading-4 text-[#aaa3b1]">
                      {module.description}
                    </p>

                    <div className="mt-4 flex justify-end">
                      <ChevronRight
                        size={14}
                        className="text-[#c3bccb] transition group-hover:translate-x-1 group-hover:text-[#7041e8]"
                      />
                    </div>

                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* =========================
            SCRIPTS RECENTS
        ========================== */}

        <section className="mt-9">

          <div className="flex items-end justify-between">

            <div>
              <h2 className="text-xl font-bold">
                Scripts récents
              </h2>

              <p className="mt-1 text-xs text-[#817a89]">
                Vos dernières créations.
              </p>
            </div>

            <Link
              to="/scripts"
              className="flex items-center gap-1 text-xs font-semibold text-[#7041e8]"
            >
              Voir tout
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="mt-4 overflow-hidden rounded-[26px] border border-[#e9e3f1] bg-white">

            {recentScripts.map((script, index) => (
              <Link
                key={script.title}
                to="/teleprompter"
                className={`group flex items-center justify-between gap-4 p-4 transition hover:bg-[#faf9fd] sm:p-5 ${
                  index !== recentScripts.length - 1
                    ? "border-b border-[#eee9f3]"
                    : ""
                }`}
              >

                <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f0ebff] text-[#7041e8]">
                    <FileText size={18} />
                  </div>

                  <div className="min-w-0">

                    <h3 className="truncate text-xs font-semibold sm:text-sm">
                      {script.title}
                    </h3>

                    <div className="mt-1 flex items-center gap-2 text-[10px] text-[#aaa3b1]">
                      <span>
                        {script.date}
                      </span>

                      <span>•</span>

                      <span>
                        {script.duration}
                      </span>
                    </div>

                  </div>
                </div>

                <ChevronRight
                  size={17}
                  className="shrink-0 text-[#c5becd] transition group-hover:translate-x-1 group-hover:text-[#7041e8]"
                />

              </Link>
            ))}

          </div>
        </section>

        {/* =========================
            STATISTIQUES
        ========================== */}

        <section className="mt-9">

          <div>
            <h2 className="text-xl font-bold">
              Cette semaine
            </h2>

            <p className="mt-1 text-xs text-[#817a89]">
              Votre activité de création.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">

            <div className="rounded-[22px] border border-[#e9e3f1] bg-white p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee8ff] text-[#7041e8]">
                <FileText size={18} />
              </div>

              <p className="mt-5 text-2xl font-bold">
                12
              </p>

              <p className="mt-1 text-xs text-[#817a89]">
                Scripts créés
              </p>
            </div>

            <div className="rounded-[22px] border border-[#e9e3f1] bg-white p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee8ff] text-[#7041e8]">
                <Video size={18} />
              </div>

              <p className="mt-5 text-2xl font-bold">
                8
              </p>

              <p className="mt-1 text-xs text-[#817a89]">
                Vidéos enregistrées
              </p>
            </div>

            <div className="rounded-[22px] border border-[#e9e3f1] bg-white p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee8ff] text-[#7041e8]">
                <Clock3 size={18} />
              </div>

              <p className="mt-5 text-2xl font-bold">
                4h25
              </p>

              <p className="mt-1 text-xs text-[#817a89]">
                Temps de création
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* =========================
          MOBILE BOTTOM NAVIGATION
      ========================== */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#e9e3f1] bg-white/95 px-2 pb-2 pt-2 backdrop-blur-xl md:hidden">

        <div className="mx-auto flex max-w-md items-center justify-around">

          <Link
            to="/dashboard"
            className="flex flex-col items-center gap-1 px-3 py-1 text-[#7041e8]"
          >
            <Home size={19} />

            <span className="text-[9px] font-semibold">
              Accueil
            </span>
          </Link>

          <Link
            to="/scripts"
            className="flex flex-col items-center gap-1 px-3 py-1 text-[#aaa3b1]"
          >
            <FileText size={19} />

            <span className="text-[9px]">
              Scripts
            </span>
          </Link>

          {/* CENTER BUTTON */}

          <Link
            to="/teleprompter"
            className="-mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-[#7041e8] text-white shadow-[0_8px_25px_rgba(112,65,232,0.35)]"
          >
            <Mic size={23} />
          </Link>

          <Link
            to="/recordings"
            className="flex flex-col items-center gap-1 px-3 py-1 text-[#aaa3b1]"
          >
            <BarChart3 size={19} />

            <span className="text-[9px]">
              Vidéos
            </span>
          </Link>

          <Link
            to="/profile"
            className="flex flex-col items-center gap-1 px-3 py-1 text-[#aaa3b1]"
          >
            <User size={19} />

            <span className="text-[9px]">
              Profil
            </span>
          </Link>

        </div>
      </nav>
    </div>
  );
}