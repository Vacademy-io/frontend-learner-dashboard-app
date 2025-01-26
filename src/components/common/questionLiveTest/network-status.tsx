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



"use client"

import { useEffect, useState } from "react"
import { Network } from "@capacitor/network"
import { Wifi, WifiOff } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineAlert, setShowOfflineAlert] = useState(false)

  useEffect(() => {
    const checkNetworkStatus = async () => {
      const status = await Network.getStatus()
      setIsOnline(status.connected)
      setShowOfflineAlert(!status.connected)
    }

    checkNetworkStatus()

    const listener = Network.addListener("networkStatusChange", (status) => {
      setIsOnline(status.connected)
      if (status.connected) {
        toast({
          title: "Back online",
          description: "Your responses will be synced",
          duration: 2000,
        })
        setShowOfflineAlert(false)
      } else {
        setShowOfflineAlert(true)
      }
    })

    return () => {
      listener.remove()
    }
  }, [])

  if (isOnline && !showOfflineAlert) return null

  return (
    <>
      {showOfflineAlert && (
        <Alert variant="destructive" className="fixed bottom-4 left-4 right-4 z-50">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>No internet connection. Your responses will be saved locally.</AlertDescription>
        </Alert>
      )}
      {isOnline && (
        <Alert variant="default" className="fixed bottom-4 left-4 right-4 z-50">
          <Wifi className="h-4 w-4" />
          <AlertDescription>Back online. Your responses will be synced.</AlertDescription>
        </Alert>
      )}
    </>
  )
}

