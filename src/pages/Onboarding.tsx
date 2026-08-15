import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface StepData {
  id: number;
  title: string;
  description: string;
  image: string;
}

const steps: StepData[] = [
  {
    id: 0,
    title: "Ne perdez plus jamais le fil devant la caméra",
    description:
      "Gardez votre script sous les yeux pendant que vous enregistrez et dites chaque phrase au bon moment.",
    image: "/illustrations/demo.png",
  },
  {
    id: 1,
    title: "Parlez naturellement, sans mémoriser votre script",
    description:
      "Le téléprompteur fait défiler votre texte à votre rythme pour vous aider à rester concentré sur la caméra.",
    image: "/illustrations/pro.png",
  },
  {
    id: 2,
    title: "Créez vos vidéos avec moins de reprises",
    description:
      "Préparez votre script, lancez le téléprompteur et enregistrez. Moins d’oublis, moins de prises, plus de contenu.",
    image: "/illustrations/ree.png",
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      navigate("/login");
    }
  };

  const skip = () => {
    navigate("/dashboard");
  };

  const current = steps[currentStep];

  return (
    <div className="min-h-screen w-full bg-[#EAEFF2] px-4 py-8 font-sans sm:px-6">

      <div className="mx-auto flex min-h-[620px] w-full max-w-[390px] flex-col rounded-[30px] bg-[#F9FAFE] px-7 py-7 shadow-[0_18px_45px_rgba(40,50,60,0.08)]">

        {/* =========================
            PROGRESS DOTS
        ========================== */}
        <div className="flex justify-center gap-[5px] pt-1">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              animate={{
                width: index === currentStep ? 6 : 5,
                height: index === currentStep ? 6 : 5,
                opacity: index === currentStep ? 1 : 0.65,
              }}
              transition={{ duration: 0.2 }}
              className="rounded-full bg-[#171717]"
            />
          ))}
        </div>

        {/* =========================
            CONTENT
        ========================== */}
        <div className="flex flex-1 flex-col justify-center">

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{
                opacity: 0,
                x: 25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -25,
              }}
              transition={{
                duration: 0.35,
                ease: "easeOut",
              }}
              className="flex flex-col items-center text-center"
            >

              {/* =========================
                  ILLUSTRATION
              ========================== */}
              <motion.div
                initial={{
                  scale: 0.92,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  duration: 0.45,
                }}
                className="relative mb-9 flex h-[245px] w-[245px] items-center justify-center"
              >

                {/* Cercle beige derrière l'illustration */}
                <div className="absolute h-[205px] w-[205px] rounded-full bg-[#E8E5DE]" />

                {/* Illustration */}
                <motion.img
                  src={current.image}
                  alt=""
                  className="relative z-10 h-[215px] w-[215px] object-contain"
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

              </motion.div>

              {/* =========================
                  TITLE
              ========================== */}
              <h2 className="max-w-[310px] text-[22px] font-medium leading-[1.25] tracking-[-0.02em] text-[#171717]">
                {current.title}
              </h2>

              {/* =========================
                  DESCRIPTION
              ========================== */}
              <p className="mt-4 max-w-[280px] text-[12px] leading-[1.55] text-[#6F6F6F]">
                {current.description}
              </p>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* =========================
            NAVIGATION
        ========================== */}
        <div className="mt-6 flex items-center justify-between">

          {currentStep < steps.length - 1 ? (
            <>
              {/* SKIP */}
              <button
                onClick={skip}
                className="px-1 text-[10px] font-medium uppercase tracking-wide text-[#171717] transition-opacity hover:opacity-50">
                Skip
              </button>

              {/* NEXT */}
              <button
                onClick={nextStep}
                className="flex h-[36px] w-[76px] items-center justify-center rounded-full bg-[#050505] text-[10px] font-medium uppercase tracking-wide text-white transition-transform hover:scale-[1.03] active:scale-95"
              >
                Next
              </button>
            </>
          ) : (
            /* START */
            <button
              onClick={nextStep}
              className="flex h-[48px] w-full items-center justify-center rounded-full bg-[#050505] text-[10px] font-medium uppercase tracking-wide text-white transition-transform hover:scale-[1.02] active:scale-95"
            >
              Start
            </button>
          )}

        </div>

      </div>
    </div>
  );
}