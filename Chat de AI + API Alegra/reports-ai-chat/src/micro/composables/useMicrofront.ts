import { useSessionStore } from 'app_alegra_commons/session'
import { useAppStore } from 'app_alegra_commons/app'
import { getDictonaryFromObject } from 'app_alegra_commons/utils'

export default function () {
  const SESSION = useSessionStore()
  const APP = useAppStore()

  const loadUserInfo = async (dictionary: object): Promise<void> => {
    await SESSION.getUser(dictionary)
  }

  const reloadUserInfo = async (): Promise<void> => {
    await SESSION.reloadUserInfo()
  }

  const addToDictionary = (dictionary: object) => {
    const d = getDictonaryFromObject(dictionary, APP.userLenguage, APP.appVersion)
    APP.addToDictionary(d)
  }

  return {
    addToDictionary,
    loadUserInfo,
    reloadUserInfo,
  }
}
