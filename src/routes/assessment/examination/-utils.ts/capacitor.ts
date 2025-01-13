import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import { Preferences } from '@capacitor/preferences'

export const isNative = Capacitor.isNativePlatform()

export const disableBackButton = async () => {
  if (isNative) {
    await App.addListener('backButton', (data) => {
      data.canGoBack = false
    })
  }
}

export const saveResponse = async (questionId: string, optionId: string) => {
  if (isNative) {
    await Preferences.set({
      key: `response_${questionId}`,
      value: optionId,
    })
  } else {
    localStorage.setItem(`response_${questionId}`, optionId)
  }
}

export const getResponse = async (questionId: string) => {
  if (isNative) {
    const { value } = await Preferences.get({ key: `response_${questionId}` })
    return value
  } else {
    return localStorage.getItem(`response_${questionId}`)
  }
}

