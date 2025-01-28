// 'use client'

// import { useEffect, useState } from 'react'
// import { Network } from '@capacitor/network'
// import { Wifi, WifiOff } from 'lucide-react'

// export function NetworkStatus() {
//   const [isOnline, setIsOnline] = useState(true)

//   useEffect(() => {
//     Network.getStatus().then(status => setIsOnline(status.connected))

//     const listener = Network.addListener('networkStatusChange', (status) => {
//       setIsOnline(status.connected)
//     })

//     return () => {
//       listener.remove()
//     }
//   }, [])

//   if (isOnline) return null

//   return (
//     <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-destructive text-destructive-foreground px-3 py-2 rounded-md shadow-lg">
//       <WifiOff className="h-4 w-4" />
//       <span className="text-sm font-medium">Offline</span>
//     </div>
//   )
// }



// "use client"

// import { useEffect, useState } from "react"
// import { Network } from "@capacitor/network"
// import { Wifi, WifiOff } from "lucide-react"
// import { toast } from "sonner"
// import { Alert, AlertDescription } from "@/components/ui/alert"

// export function NetworkStatus() {
//   const [isOnline, setIsOnline] = useState(true)
//   const [showOfflineAlert, setShowOfflineAlert] = useState(false)
      
//   useEffect(() => {
//     const checkNetworkStatus = async () => {
//       const status = await Network.getStatus()
//       setIsOnline(status.connected)
//       setShowOfflineAlert(!status.connected)
//     }

//     checkNetworkStatus()

//     const listener = Network.addListener("networkStatusChange", (status) => {
//       setIsOnline(status.connected)
//       if (status.connected) {
//         // toast({
//         //   // title: "Back online",
//         //   description: "Your responses will be synced",
//         //   duration: 2000,
//         // })
//         toast.error("offline ", {
//           description: "connect to internet",
//           className: "error-toast",
//           duration: 3000,
//         });
//         setShowOfflineAlert(false)
//       } else {
//         setShowOfflineAlert(true)
//       }
//     })

//     return () => {
//       listener.remove()
//     }
//   }, [])

//   if (isOnline && !showOfflineAlert) return null

//   return (
//     <>
//       {showOfflineAlert && (
//         <Alert variant="destructive" className="fixed bottom-4 left-4 right-4 z-50">
//           <WifiOff className="h-4 w-4" />
//           <AlertDescription>No internet connection. Your responses will be saved locally.</AlertDescription>
//         </Alert>
//       )}
//       {isOnline && (
//         <Alert variant="default" className="fixed bottom-4 left-4 right-4 z-50">
//           <Wifi className="h-4 w-4" />
//           <AlertDescription>Back online. Your responses will be synced.</AlertDescription>
//         </Alert>
//       )}
//     </>
//   )
// }





// import { useEffect, useState } from "react";
// import { Network } from "@capacitor/network";
// import { Wifi, WifiOff } from "lucide-react";

// const NetworkStatus = () => {
//   const [isOnline, setIsOnline] = useState(true);
//   const [showAlert, setShowAlert] = useState(false);

//   useEffect(() => {
//     const checkNetworkStatus = async () => {
//       const status = await Network.getStatus();
//       setIsOnline(status.connected);
//       setShowAlert(!status.connected);
//     };

//     checkNetworkStatus();

//     const listener = Network.addListener("networkStatusChange", (status) => {
//       setIsOnline(status.connected);
//       setShowAlert(true);
      
//       if (status.connected) {
//         // Auto-hide the online message after 3 seconds
//         setTimeout(() => setShowAlert(false), 3000);
//       }
//     });

//     return () => {
//       listener.remove();
//     };
//   }, []);

//   if (!showAlert) return null;

//   return (
//     <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4">
//       <div className={`
//         flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg
//         ${isOnline 
//           ? 'bg-black/90 text-white' 
//           : 'bg-black/90 text-white'
//         }
//         transform transition-all duration-300 ease-in-out
//         ${showAlert ? 'translate-y-0' : 'translate-y-full'}
//       `}>
//         {isOnline ? (
//           <>
//             <Wifi className="h-4 w-4" />
//             <span>Connected</span>
//           </>
//         ) : (
//           <>
//             <WifiOff className="h-4 w-4" />
//             <span>No Internet connection</span>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NetworkStatus;








import { useEffect, useState } from "react";
import { Network } from "@capacitor/network";
import { Wifi, WifiOff } from "lucide-react";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const checkNetworkStatus = async () => {
      const status = await Network.getStatus();
      setIsOnline(status.connected);
      setShowAlert(!status.connected);
    };

    checkNetworkStatus();

    const listener = Network.addListener("networkStatusChange", (status) => {
      setIsOnline(status.connected);
      setShowAlert(true);
      
      // Auto-hide the online notification after 5 seconds
      if (status.connected) {
        setTimeout(() => setShowAlert(false), 2000);
      }
    });

    return () => {
      listener.remove();
    };
  }, []);

  if (!showAlert) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-start justify-center">
      <div 
        className={`
          mt-4 flex items-center gap-3 rounded-lg px-4 py-2
          transform transition-all duration-300 ease-in-out
          ${isOnline 
            ? 'bg-[#0f0f0f] text-white' 
            : 'bg-[#0f0f0f] text-white'
          }
          ${showAlert ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        `}
      >
        <div className="flex items-center gap-3">
          {isOnline ? (
            <>
              <Wifi className="h-5 w-5 text-green-500" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Back online</span>
                <span className="text-xs text-gray-400">Your network connection was restored</span>
              </div>
            </>
          ) : (
            <>
              <WifiOff className="h-5 w-5 text-red-500" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">No Internet connection</span>
                <span className="text-xs text-gray-400">Check your network settings</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus;



// import { useEffect, useState } from "react";
// import { Network } from "@capacitor/network";
// import { Wifi, WifiOff } from "lucide-react";

// const NetworkStatus = () => {
//   const [isOnline, setIsOnline] = useState(true);
//   const [showAlert, setShowAlert] = useState(false);
//   const [hasShownOnlineMessage, setHasShownOnlineMessage] = useState(false);

//   useEffect(() => {
//     const checkNetworkStatus = async () => {
//       const status = await Network.getStatus();
//       setIsOnline(status.connected);
//       setShowAlert(!status.connected);
//     };

//     checkNetworkStatus();

//     const listener = Network.addListener("networkStatusChange", (status) => {
//       setIsOnline(status.connected);
      
//       if (status.connected) {
//         // Only show the online message if we haven't shown it before
//         if (!hasShownOnlineMessage) {
//           setShowAlert(true);
//           setHasShownOnlineMessage(true);
//           // Hide after 2 seconds
//           setTimeout(() => setShowAlert(false), 2000);
//         }
//       } else {
//         // Reset the flag when we go offline
//         setHasShownOnlineMessage(false);
//         setShowAlert(true);
//       }
//     });

//     return () => {
//       listener.remove();
//     };
//   }, [hasShownOnlineMessage]);

//   if (!showAlert) return null;

//   return (
//     <div className="fixed inset-x-0 top-0 z-50 flex items-start justify-center">
//       <div 
//         className={`
//           mt-4 flex items-center gap-3 rounded-lg px-4 py-2
//           transform transition-all duration-300 ease-in-out
//           ${isOnline 
//             ? 'bg-[#0f0f0f] text-white' 
//             : 'bg-[#0f0f0f] text-white'
//           }
//           ${showAlert ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
//         `}
//       >
//         <div className="flex items-center gap-3">
//           {isOnline ? (
//             <>
//               <Wifi className="h-5 w-5 text-green-500" />
//               <div className="flex flex-col">
//                 <span className="text-sm font-medium">Back online</span>
//                 <span className="text-xs text-gray-400">Your network connection was restored</span>
//               </div>
//             </>
//           ) : (
//             <>
//               <WifiOff className="h-5 w-5 text-red-500" />
//               <div className="flex flex-col">
//                 <span className="text-sm font-medium">No Internet connection</span>
//                 <span className="text-xs text-gray-400">Check your network settings</span>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NetworkStatus;