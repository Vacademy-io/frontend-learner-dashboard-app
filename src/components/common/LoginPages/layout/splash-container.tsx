
import { motion } from "framer-motion";
import { SplashScreenProps } from "../../../../types/loginTypes";
import { LoginImage } from "@/assets/svgs";

export const SplashScreen = ({ children }: SplashScreenProps) => {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-white items-center justify-start">
      {/* Fading Background */}
      <motion.div
        initial={{ backgroundColor: "#FDEDD7" }} // Background is visible at the start
        animate={{ backgroundColor: "rgba(255, 255, 255, 0)" }} // Background fades out
        transition={{
          duration: 2,
          delay: 1.25,
          ease: "easeInOut",
        }}
        className="fixed h-screen w-screen z-0"
      ></motion.div>

      {/* Animated Logo */}
      <motion.div
        className="relative p-8 pt-16 flex flex-col w-full items-center justify-center z-10"
        initial={{ y: "50vh", scale: 3 }} // Logo starts from the center
        animate={{ y: 0, scale: 1 }} // Moves to the top and scales down
        transition={{
          duration: 1,
          delay: 0, // No delay, animation starts immediately
          ease: "easeInOut",
        }}
      >
        <motion.img
          src={LoginImage}
          alt="logo"
          className="max-h-80 max-w-80 object-cover"
          style={{ width: "80px", height: "80px" }}
        />
      </motion.div>

      {/* Content Section (e.g., Login Form) */}
      <motion.div
        className="relative pb-10 w-full flex flex-col items-center text-neutral-600"
        initial={{ opacity: 0 }} // Content is initially hidden
        animate={{ opacity: 1 }} // Content fades in
        transition={{
          duration: 1,
          delay: 0.75, // Content appears after background fades out
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
