import { Capacitor } from '@capacitor/core'
import { Network } from '@capacitor/network'
import { Preferences } from '@capacitor/preferences'
import { toast } from '@/components/ui/use-toast'

let isOnline = true

export const initNetworkListeners = () => {
  if (Capacitor.isNativePlatform()) {
    Network.addListener('networkStatusChange', status => {
      if (status.connected && !isOnline) {
        toast({
          title: "Back online",
          description: "Your responses will be synced",
        })
      } else if (!status.connected && isOnline) {
        toast({
          title: "No internet connection",
          description: "Your responses will be saved locally",
          variant: "destructive"
        })
      }
      isOnline = status.connected
    })

    Network.getStatus().then(status => {
      isOnline = status.connected
    })
  }
}

export const saveData = async (key: string, value: any) => {
  try {
    await Preferences.set({
      key,
      value: JSON.stringify(value)
    })
  } catch (error) {
    console.error('Error saving data:', error)
  }
}

export const getData = async (key: string) => {
  try {
    const { value } = await Preferences.get({ key })
    return value ? JSON.parse(value) : null
  } catch (error) {
    console.error('Error getting data:', error)
    return null
  }
}

