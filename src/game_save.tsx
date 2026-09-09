import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface Metadata {
  title: string
  person: string
  action: string
  seed: number
  hash: string
}

interface Data {
  click: number
  money: number
  gem: number
  crypto: number
}

interface Upgrade {
  multipler: number
  auto: number
  botting: number
  dos: number
  ddos: number
  crypto: number
  hacking: number
}

interface GameSaveState {
  metadata: Metadata
  data: Data
  upgrade: Upgrade
  addClick: () => void
  resetGame: () => void
}

export const useGameSave = create<GameSaveState>()(
  persist(
    (set) => ({
      metadata: {
        title: "Dih",
        person: "UnitC3H6S",
        action: "tập gym",
        seed: 123,
        hash: "1eb78c0d780f6e7e3f1c8b9d5a"
      },

      data: {
        click: 1000,
        money: 0,
        gem: 0,
        crypto: 0
      },

      upgrade: {
        multipler: 1,
        auto: 0,
        botting: 0,
        dos: 0,
        ddos: 0,
        crypto: 0,
        hacking: 0,
      },

      addClick: () =>
        set((state) => ({
          data: {
            ...state.data,
            click: state.data.click + 1,
            money: state.data.money + state.upgrade.multipler
          }
        })),

      resetGame: () => set({
        data: { click: 0, money: 0, gem: 0, crypto: 0 },
        })
    }),
    {
      name: 'dih-game-save',
      storage: createJSONStorage(() => localStorage),
    }
  )
)