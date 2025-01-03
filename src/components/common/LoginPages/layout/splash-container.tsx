// import { motion } from "framer-motion";
// import { SplashScreenProps } from "../../../../types/loginTypes";
// import { LoginImage } from "@/assets/svgs";

// export const SplashScreen = ({ children }: SplashScreenProps) => {
//   return (
//     <div className="relative flex flex-col  w-screen bg-white items-center justify-start">
//       {/* Fading Background */}
//       <motion.div
//         initial={{ backgroundColor: "#FDEDD7" }} // Background is visible at the start
//         animate={{ backgroundColor: "rgba(255, 255, 255, 0)" }} // Background fades out
//         transition={{
//           duration: 2,
//           delay: 1.25,
//           ease: "easeInOut",
//         }}
//         className="fixed h-screen w-screen z-0"
//       ></motion.div>

//       {/* Animated Logo */}
     
//       <motion.div
//         className="relative flex flex-col w-full items-center justify-center z-10"
//         style={{
//           padding: "6%", // Match the padding from HeaderLogo
//         }}
//         initial={{ y: "50vh", scale: 3 }} // Adjust initial animation as needed
//         animate={{ y: 0, scale: 1 }} // Ensure it ends at the correct size and position
//         transition={{
//           duration: 1,
//           delay: 0,
//           ease: "easeInOut",
//         }}
//       >
//         <motion.img
//           src={LoginImage}
//           alt="logo"
//           style={{ width: "22vw", height: "22vh" }} // Match the size from HeaderLogo
//           className="object-contain" // Ensure proper aspect ratio
//         />
//       </motion.div>

//       {/* Content Section (e.g., Login Form) */}
//       <motion.div
//         className="relative  w-full flex flex-col items-center text-neutral-600"
//         initial={{ opacity: 0 }} // Content is initially hidden
//         animate={{ opacity: 1 }} // Content fades in
//         transition={{
//           duration: 1,
//           delay: 0.75, // Content appears after background fades out
//           ease: "easeInOut",
//         }}
//       >
//         {children}
//       </motion.div>
//     </div>
//   );
// };




import { motion } from "framer-motion";
import { SplashScreenProps } from "../../../../types/loginTypes";
import { SsdcLogo_Login } from "@/assets/svgs";
import { useEffect } from "react";

export const SplashScreen = ({ children }: SplashScreenProps) => {
  useEffect(() => {
    // Disable scrolling while splash screen is active
    document.body.style.overflow = "hidden";
    return () => {
      // Re-enable scrolling after splash screen
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed flex flex-col w-screen h-screen bg-white items-center justify-start z-50">
      {/* Fading Background */}
      <motion.div
        initial={{ backgroundColor: "#FDEDD7" }}
        animate={{ backgroundColor: "rgba(255, 255, 255, 0)" }}
        transition={{
          duration: 2,
          delay: 1.25,
          ease: "easeInOut",
        }}
        className="fixed h-screen w-screen z-0"
      ></motion.div>

      {/* Animated Logo */}
      <motion.div
        className="relative flex flex-col w-full items-center justify-center z-10"
        style={{
          padding: "6%", // Matches padding from HeaderLogo
        }}
        initial={{ y: "50vh", scale: 3 }}
        animate={{ y: 0, scale: 1 }}
        transition={{
          duration: 1,
          delay: 0,
          ease: "easeInOut",
        }}
      >
        <motion.img
          src={SsdcLogo_Login}
          alt="logo"
          style={{ width: "22vw", height: "22vh" }} // Matches HeaderLogo size
          className="object-contain"
        />
      </motion.div>

      {/* Content Section */}
      <motion.div
        className="relative w-full flex flex-col items-center text-neutral-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1,
          delay: 0.75,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
