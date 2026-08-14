import {
  ArrowRight,
  Check,
  Play,
  Sparkles,
  Video,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Video,
    title: "Téléprompteur",
    description:
      "Lisez votre script directement pendant que vous enregistrez votre vidéo.",
  },
  {
    icon: Sparkles,
    title: "Créez facilement",
    description:
      "Préparez vos textes et concentrez-vous sur votre façon de parler.",
  },
  {
    icon: Play,
    title: "Enregistrez",
    description:
      "Passez rapidement de votre script à une vidéo prête à être publiée.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#fbfaff] text-[#17131f]">
      {/* NAVBAR */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#eee9f3] bg-white/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7041e8]">
              <Sparkles size={17} className="text-white" />
            </div>

            <span className="text-lg font-bold tracking-tight">
              Creator<span className="text-[#7041e8]">Flow</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-[#77717f] transition hover:text-[#7041e8]"
            >
              Fonctionnalités
            </a>

            <a
              href="#how"
              className="text-sm text-[#77717f] transition hover:text-[#7041e8]"
            >
              Comment ça marche
            </a>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden text-sm font-medium text-[#6f6878] transition hover:text-[#7041e8] sm:block"
            >
              Se connecter
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-[#7041e8] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(112,65,232,0.2)] transition hover:-translate-y-0.5 hover:bg-[#6133d8]"
            >
              Commencer
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-[72px]">
        {/* HERO */}
        <section className="relative overflow-hidden px-5 pb-20 pt-20 sm:px-8 md:pb-28 md:pt-32">
          {/* BACKGROUND GLOW */}
          <div className="pointer-events-none absolute left-1/2 top-10 h-[450px] w-[650px] -translate-x-1/2 rounded-full bg-[#7041e8]/10 blur-[140px]" />

          <div className="relative mx-auto max-w-6xl">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              {/* HERO TEXT */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* BADGE */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e5dcfa] bg-[#f4efff] px-4 py-2 text-xs font-medium text-[#7041e8]">
                  <Sparkles size={14} />
                  Pensé pour les créateurs
                </div>

                {/* TITLE */}
                <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                  Parlez avec
                  <br />
                  <span className="text-[#7041e8]">
                    confiance.
                  </span>
                </h1>

                {/* DESCRIPTION */}
                <p className="mt-7 max-w-xl text-base leading-7 text-[#77717f] sm:text-lg">
                  Écrivez votre script, utilisez le téléprompteur
                  et enregistrez vos vidéos sans avoir besoin de
                  mémoriser chaque mot.
                </p>

                {/* CTA */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/register"
                    className="group flex items-center justify-center gap-2 rounded-xl bg-[#7041e8] px-6 py-3.5 font-semibold text-white shadow-[0_12px_30px_rgba(112,65,232,0.22)] transition hover:-translate-y-0.5"
                  >
                    Commencer gratuitement

                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>

                  <a
                    href="#how"
                    className="flex items-center justify-center gap-2 rounded-xl border border-[#e8e3ef] bg-white px-6 py-3.5 font-semibold text-[#514b59] transition hover:border-[#d8ccf5]"
                  >
                    <Play size={16} />
                    Découvrir
                  </a>
                </div>

                {/* BENEFITS */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-5">
                  {[
                    "Simple à utiliser",
                    "Pas besoin de mémoriser",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-xs text-[#77717f]"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#eee8ff]">
                        <Check
                          size={12}
                          className="text-[#7041e8]"
                        />
                      </span>

                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* PRODUCT PREVIEW */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.15,
                }}
                className="relative"
              >
                <div className="absolute -inset-8 rounded-[40px] bg-[#7041e8]/10 blur-3xl" />

                <div className="relative rounded-[30px] border border-[#e7e1f0] bg-white p-4 shadow-[0_30px_80px_rgba(56,38,85,0.12)] sm:p-5">
                  {/* PREVIEW HEADER */}
                  <div className="flex items-center justify-between px-2 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#7041e8]" />

                      <span className="text-xs font-semibold text-[#38313f]">
                        CreatorFlow
                      </span>
                    </div>

                    <span className="text-[11px] text-[#aaa3b1]">
                      Studio
                    </span>
                  </div>

                  {/* CAMERA */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-br from-[#ede7ff] via-[#f7f4ff] to-[#e7dcff]">
                    <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1.5 text-[10px] font-medium text-[#7041e8] backdrop-blur">
                      Téléprompteur
                    </div>

                    <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#7041e8]/10">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
                        <Video
                          size={30}
                          className="text-[#7041e8]"
                        />
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-4 py-2 text-[10px] font-medium text-[#5c5565] shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      Prêt à enregistrer
                    </div>
                  </div>

                  {/* SCRIPT PREVIEW */}
                  <div className="mt-4 rounded-2xl bg-[#faf9fd] p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7041e8]">
                          Votre script
                        </p>

                        <p className="mt-1 text-[10px] text-[#aaa3b1]">
                          Lecture automatique
                        </p>
                      </div>

                      <span className="rounded-lg bg-white px-2.5 py-1.5 text-[10px] text-[#77717f] shadow-sm">
                        1.0x
                      </span>
                    </div>

                    <p className="text-sm font-medium leading-7 text-[#403a47]">
                      Bonjour à tous ! Aujourd'hui,
                      je vais vous montrer comment
                      créer des vidéos plus facilement
                      grâce à un téléprompteur.
                    </p>

                    <p className="mt-3 text-sm leading-7 text-[#bbb5c1]">
                      Vous n'avez plus besoin de
                      mémoriser votre texte...
                    </p>

                    <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#e8e1f5]">
                      <div className="h-full w-[55%] rounded-full bg-[#7041e8]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section
          id="features"
          className="border-y border-[#eee9f3] bg-white px-5 py-20 sm:px-8 md:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7041e8]">
                Fonctionnalités
              </span>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Créez sans mémoriser.
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#817a89] sm:text-base">
                Tout ce dont vous avez besoin pour préparer
                et enregistrer vos vidéos.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                    }}
                    className="rounded-3xl border border-[#eee9f3] bg-[#fbfaff] p-7 transition hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(80,55,120,0.07)]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eee8ff] text-[#7041e8]">
                      <Icon size={21} />
                    </div>

                    <h3 className="mt-6 text-lg font-bold">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[#817a89]">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how"
          className="px-5 py-20 sm:px-8 md:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7041e8]">
                Comment ça marche
              </span>

              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                Trois étapes.
              </h2>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Écrivez",
                  text: "Préparez le texte de votre prochaine vidéo.",
                },
                {
                  number: "02",
                  title: "Lisez",
                  text: "Placez le téléprompteur près de votre caméra.",
                },
                {
                  number: "03",
                  title: "Enregistrez",
                  text: "Parlez naturellement et créez votre vidéo.",
                },
              ].map((step) => (
                <div
                  key={step.number}
                  className="rounded-3xl border border-[#eee9f3] bg-white p-7"
                >
                  <span className="text-sm font-bold text-[#7041e8]">
                    {step.number}
                  </span>

                  <h3 className="mt-6 text-xl font-bold">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#817a89]">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-5 pb-20 sm:px-8 md:pb-28">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] bg-[#7041e8] px-7 py-14 text-center text-white sm:px-12 md:py-20">
            <Sparkles className="mx-auto" size={28} />

            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
              Prêt à créer votre prochaine vidéo ?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/70">
              Arrêtez de mémoriser. Commencez à créer.
            </p>

            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-[#7041e8] transition hover:-translate-y-0.5"
            >
              Commencer gratuitement
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#eee9f3] bg-white px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link to="/" className="font-bold">
            Creator<span className="text-[#7041e8]">Flow</span>
          </Link>

          <p className="text-xs text-[#aaa3b1]">
            © {new Date().getFullYear()} CreatorFlow
          </p>
        </div>
      </footer>
    </div>
  );
}