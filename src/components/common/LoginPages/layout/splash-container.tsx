// import { motion } from "framer-motion";
// import { LanguageDropdown } from "../../localization/language-dropdown";
// import { SplashScreenProps } from "../../../../types/loginTypes";
// // import { LoginImage } from "@/assets/svgs";

// export const SplashScreen = ({ children, isAnimationEnabled }: SplashScreenProps) => {
//     return (
//         <div className="flex min-h-screen w-screen bg-white">
//             <div className="relative flex w-full items-center justify-center bg-primary-100">
//                 <motion.div
//                     initial={
//                         isAnimationEnabled ? { backgroundColor: "#FDEDD7", zIndex: "100" } : {}
//                     }
//                     animate={
//                         isAnimationEnabled
//                             ? { backgroundColor: "rgba(255, 255, 255, 0)", zIndex: "auto" }
//                             : {}
//                     }
//                     transition={{
//                         duration: 1,
//                         delay: 1.25,
//                         ease: "easeInOut",
//                     }}
//                     className="fixed left-0 top-0 h-screen w-screen"
//                 >
//                     <motion.img
//                         src="src\assets\svgs\ssdc_logo.svg"
//                         alt="logo"
//                         initial={
//                             isAnimationEnabled
//                                 ? { x: "35vw", y: "25vh", scale: 1 }
//                                 : { x: 32, y: 32, scale: 0.25 }
//                         }
//                         animate={
//                             isAnimationEnabled
//                                 ? { x: 32, y: 32, scale: 0.25 }
//                                 : { x: 32, y: 32, scale: 0.25 }
//                         }
//                         transition={{
//                             duration: 0.75,
//                             delay: 1,
//                             ease: "easeInOut",
//                         }}
//                         className="left-8 top-8 size-full max-h-80 max-w-80 origin-top-left object-cover"
//                     />
//                 </motion.div>
//                 {/* <img src="/svgs/login/login-image.svg" alt="login image" width={400} height={400} /> */}
//                 {/* <LoginImage /> */}
//             </div>
//             <div className="relative flex w-full items-center justify-center text-neutral-600">
//                 <LanguageDropdown />
//                 <div className="w-[413px] items-center justify-center">{children}</div>
//             </div>
//         </div>
//     );
// };

// import { motion } from "framer-motion";
// // import { LanguageDropdown } from "../../localization/language-dropdown";
// import { SplashScreenProps } from "../../../../types/loginTypes";

// export const SplashScreen = ({
//   children,
//   isAnimationEnabled,
// }: SplashScreenProps) => {
//   return (
//     <div className="flex flex-col min-h-screen w-screen bg-white items-center justify-center">
//       {/* Logo at the top */}

//       {/* <motion.div
//         initial={
//           isAnimationEnabled
//             ? { backgroundColor: "#FDEDD7", zIndex: "100" }
//             : {}
//         }
//         animate={
//           isAnimationEnabled
//             ? { backgroundColor: "rgba(255, 255, 255, 0)", zIndex: "auto" }
//             : {}
//         }
//         transition={{
//           duration: 1,
//           delay: 1.25,
//           ease: "easeInOut",
//         }}
//         className="fixed h-screen w-screen"
//       >
//         <motion.img
//           src="src\assets\svgs\ssdc_logo.svg"
//           alt="logo"
//           initial={
//             isAnimationEnabled
//               ? { x: "35vw", y: "25vh", scale: 1 }
//               : { x: 0, y: 32, scale: 0.25 }
//           }
//           animate={
//             isAnimationEnabled
//               ? { x: "35vw", y: "25vh", scale: 0.25 }
//               : { x: 32, y: 0, scale: 0.25 }
//           }
//           transition={{
//             duration: 0.75,
//             delay: 1,
//             ease: "easeInOut",
//           }}
//           className=" size-full max-h-80 max-w-80 top-0 object-cover"
//         />
//       </motion.div> */}

//       <motion.div className="fixed h-screen w-screen">
//       <motion.img
//         src="src/assets/svgs/ssdc_logo.svg"
//         alt="logo"
//         initial={isAnimationEnabled ? { y: "50vh", scale: 1 } : {}}
//         animate={isAnimationEnabled ? { y: "10vh", scale: 0.5 } : {}}
//         transition={{
//           duration: 1,
//           delay: 1,
//           ease: "easeInOut",
//         }}
//         className="absolute top-0 left-0 right-0 mx-auto max-h-80 max-w-80 object-cover"
//       />
//     </motion.div>
//       {/* Login form */}
//       <div className="relative  w-full items-center justify-center text-neutral-600">
//         {/* <LanguageDropdown /> */}
//         <div className="items-center justify-center">{children}</div>
//       </div>
//     </div>

//     // <div className="flex flex-col min-h-screen w-screen bg-white items-center justify-center">
//     //   {/* Logo animation */}
//     //   <motion.div
//     //     initial={{ backgroundColor: "#FDEDD7" }}
//     //     animate={{ backgroundColor: "rgba(255, 255, 255, 0)" }}
//     //     transition={{
//     //       duration: 1,
//     //       delay: 1.25,
//     //       ease: "easeInOut",
//     //     }}
//     //     className="fixed h-screen w-screen"
//     //   >
//     //     <motion.img
//     //       src="src/assets/svgs/ssdc_logo.svg"
//     //       alt="logo"
//     //       initial={isAnimationEnabled ? { y: "50vh", scale: 1 } : { y: 0, scale: 1 }}
//     //       animate={isAnimationEnabled ? { y: "10vh", scale: 0.5 } : {}}
//     //       transition={{
//     //         duration: 0.75,
//     //         delay: 1,
//     //         ease: "easeInOut",
//     //       }}
//     //       // className="absolute top-0 left-0 right-0 mx-auto max-h-80 max-w-80 object-cover"
//     //     />
//     //   </motion.div>

//     //   {/* Login form */}
//     //   <div className="relative w-full items-center justify-center text-neutral-600">
//     //     <div className="items-center justify-center">{children}</div>
//     //   </div>
//     // </div>

//   );
// };

// import { motion } from "framer-motion";
// import { SplashScreenProps } from "../../../../types/loginTypes";

// export const SplashScreen = ({
//   children,
//   // isAnimationEnabled,
// }: SplashScreenProps) => {
//   return (
//     <div className="flex flex-col min-h-screen w-screen bg-white items-center justify-start">
//       {/* Fading Background */}
//       <motion.div
//         initial={{ backgroundColor: "#FDEDD7" }} // Background is visible at the start
//         animate={{ backgroundColor: "rgba(255, 255, 255, 0)" }} // Background fades out
//         transition={{
//           duration: 1,
//           delay: 1.25,
//           ease: "easeInOut",
//         }}
//         className="fixed h-screen w-screen z-0"
//       ></motion.div>

//       {/* Animated Logo */}
//       <motion.div
//         className="fixed top-5 w-full flex items-center justify-center z-10"
//         initial={{ y: "50vh", scale: 2 }} // Image is visible from the start
//         animate={{ y: 5, scale: 1 }} // Moves to the top with scaling
//         transition={{
//           duration: 1,
//           delay: 0, // No delay, so it's visible from the start
//           ease: "easeInOut",
//         }}
//       >
//         <motion.img
//           src="src/assets/svgs/ssdc_logo.svg"
//           alt="logo"
//           className="max-h-80 max-w-80 object-cover"
//         />
//       </motion.div>

//       {/* Content Section (e.g., Login Form) */}
//       <div className="relative pt-20 pb-10 w-full flex flex-col items-center text-neutral-600">
//         {children}
//       </div>
//     </div>
//   );
// };

// import { motion } from "framer-motion";
// import { SplashScreenProps } from "../../../../types/loginTypes";

// export const SplashScreen = ({ children }: SplashScreenProps) => {
//   return (
//     <div className="flex flex-col min-h-screen w-screen bg-white items-center justify-start">
//       {/* Fading Background */}
//       <motion.div
//         initial={{ backgroundColor: "#FDEDD7" }} // Background is visible at the start
//         animate={{ backgroundColor: "rgba(255, 255, 255, 0)" }} // Background fades out
//         transition={{
//           duration: 1,
//           delay: 1.25,
//           ease: "easeInOut",
//         }}
//         className="fixed h-screen w-screen z-0"
//       ></motion.div>

//       {/* Animated Logo */}
//       <motion.div
//         className="relative p-8 flex flex-col w-full items-center justify-center z-10"
//         initial={{ y: "50vh", scale: 3 }} // Image is visible from the start
//         animate={{ y: 0, scale: 1.5 }} // Moves to the top with scaling
//         transition={{
//           duration: 1,
//           delay: 0, // No delay, so it's visible from the start
//           ease: "easeInOut",
//         }}
//       >
//         <motion.img
//           src="src/assets/svgs/ssdc_logo.svg"
//           alt="logo"
//           className="max-h-80 max-w-80 object-cover"
//         />
//       </motion.div>

//       {/* Content Section (e.g., Login Form) */}
//       <div className="relative  pb-10 w-full flex flex-col items-center text-neutral-600">
//         {children}
//       </div>
//     </div>
//   );
// };

// import { motion } from "framer-motion";
// import { SplashScreenProps } from "../../../../types/loginTypes";

// export const SplashScreen = ({ children }: SplashScreenProps) => {
//   return (
//     <div className="flex flex-col min-h-screen w-screen bg-white items-center justify-start">
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
//         className="relative p-8 flex flex-col w-full items-center justify-center z-10"
//         initial={{ y: "50vh", scale: 3 }} // Image is visible from the start
//         animate={{ y: 0, scale: 1.5 }} // Moves to the top with scaling
//         transition={{
//           duration: 1,
//           delay: 0, // No delay, so it's visible from the start
//           ease: "easeInOut",
//         }}
//       >
//         <motion.img
//           src="src/assets/svgs/ssdc_logo.svg"
//           alt="logo"
//           className="max-h-80 max-w-80 object-cover"
//         />
//       </motion.div>

//       {/* Content Section (e.g., Login Form) */}
//       <motion.div
//         className="relative pb-10 w-full flex flex-col items-center text-neutral-600"
//         initial={{ opacity: 0 }} // Form is initially hidden
//         animate={{ opacity: 1 }} // Form fades in
//         transition={{
//           duration: 1,
//           delay: 0.75, // Delay to appear after background fades out
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
        className="relative p-8 pt-16 flex flex-col w-full items-center justify-center z-10" // Added pt-12 to increase top padding by 4px
        initial={{ y: "50vh", scale: 3 }} // Image is visible from the start
        animate={{ y: 0, scale: 1 }} // Moves to the top with scaling
        transition={{
          duration: 1,
          delay: 0, // No delay, so it's visible from the start
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
        initial={{ opacity: 0 }} // Form is initially hidden
        animate={{ opacity: 1 }} // Form fades in
        transition={{
          duration: 1,
          delay: 0.75, // Delay to appear after background fades out
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};



// import { motion } from "framer-motion";
// import { SplashScreenProps } from "../../../../types/loginTypes";
// import { LoginImage } from "@/assets/svgs";
// import { useEffect, useState } from "react";
// import { useAnimationStore } from "@/stores/login/animationStore";

// export const SplashScreen = ({ children }: SplashScreenProps) => {
//   const { hasSeenAnimation, setHasSeenAnimation } = useAnimationStore();
//   const [isAnimationEnabled, setAnimationEnabled] = useState(!hasSeenAnimation);

//   useEffect(() => {
//     if (!hasSeenAnimation) {
//       setTimeout(() => {
//         setHasSeenAnimation();
//         setAnimationEnabled(false); // Disable animation after it's shown
//       }, 8000); // Adjust duration to match the animation time
//     }
//   }, [hasSeenAnimation, setHasSeenAnimation]);

//   if (!isAnimationEnabled) {
//     // Skip the splash screen entirely if the animation is disabled
//     return <>{children}</>;
//   }

//   return (
//     <div className="flex flex-col min-h-screen w-screen bg-white items-center justify-start">
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
//         className="relative p-8 pt-16 flex flex-col w-full items-center justify-center z-10"
//         initial={{ y: "50vh", scale: 3 }} // Image is visible from the start
//         animate={{ y: 0, scale: 1 }} // Moves to the top with scaling
//         transition={{
//           duration: 1,
//           delay: 0,
//           ease: "easeInOut",
//         }}
//       >
//         <motion.img
//           src={LoginImage}
//           alt="logo"
//           className="max-h-80 max-w-80 object-cover"
//           style={{ width: "80px", height: "80px" }}
//         />
//       </motion.div>

//       {/* Content Section (e.g., Login Form) */}
//       <motion.div
//         className="relative pb-10 w-full flex flex-col items-center text-neutral-600"
//         initial={{ opacity: 0 }} // Form is initially hidden
//         animate={{ opacity: 1 }} // Form fades in
//         transition={{
//           duration: 1,
//           delay: 0.75, // Delay to appear after background fades out
//           ease: "easeInOut",
//         }}
//       >
//         {children}
//       </motion.div>
//     </div>
//   );
// };
