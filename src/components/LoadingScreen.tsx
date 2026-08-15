import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black">

      {/* LOGO AU CENTRE */}
      <motion.div
        className="flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.9,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <img
          src="/logo1.png"
          alt="Luna Creator Logo"
          className="block h-[60px] w-[60px] object-contain"
          draggable={false}
        />
      </motion.div>

      {/* NOM DE L'APPLICATION — FOOTER */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.3,
          ease: "easeOut",
        }}
      >
        <img
          src="/images/logo4.png"
          alt="Luna Creator Logo"
          className="block  h-[90px] w-[90px] object-contain"
          draggable={false}
        />
      </motion.div>

    </div>
  );
}