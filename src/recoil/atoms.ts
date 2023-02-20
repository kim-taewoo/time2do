import { atom, AtomEffect } from 'recoil'
import type { Timer, Todo } from '../types'

const syncStorageEffect =
  (targetKey: string): AtomEffect<any> =>
  ({ setSelf, onSet, trigger }) => {
    console.log('TEST')
    if (!chrome?.storage) return
    const loadStorage = async () => {
      const savedValue = await chrome.storage.local.get([targetKey]).then(result => result?.[targetKey])
      console.log(savedValue, targetKey)
      if (savedValue != null) {
        setSelf(savedValue)
      }
    }
    // Initialize atom value to the remote storage state
    if (trigger === 'get') {
      loadStorage()
    }

    onSet((newValue, _, _isReset) => {
      console.log(newValue, '***', targetKey)
      chrome.storage.local.set({
        [targetKey]: newValue,
      })
    })

    // chrome.storage.onChanged.addListener((changes, _namespace) => {
    //   for (const [key, { oldValue: _oldTodos, newValue: newTodos }] of Object.entries(changes)) {
    //     if (key === targetKey) {
    //       setSelf(newTodos)
    //     }
    //   }
    // })

    // // Subscribe to local changes and update the server value
    // onSet((todos: Todo[]) => {
    //   chrome.storage.local.set({
    //     todos,
    //   })
    // })

    // Cleanup remote storage subscription
    // return () => {
    //   myRemoteStorage.onChange(userID, null)
    // }
  }

export const todosAtom = atom<Todo[]>({
  key: 'todosAtom',
  default: [],
  effects: [syncStorageEffect('todos')],
})

export const timerAtom = atom<Timer>({
  key: 'timerAtom',
  default: {
    title: '오늘 무조건 다 끝내본다!!',
    isRunning: false,
    startTimestamp: new Date().getTime(),
  },
  effects: [syncStorageEffect('timer')],
})
