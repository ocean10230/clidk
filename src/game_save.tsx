import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { SeededRandom } from './helpers/randomizer'

// Config table
//  for base prices and random seed generation offset
export const UPGRADE_CONFIG: Record<keyof Upgrade, { baseCost: number, seedOffset: number }> = {
  multiplier: { baseCost: 10, seedOffset: 1 },
  auto: { baseCost: 120, seedOffset: 2 },
  botting: { baseCost: 500, seedOffset: 3 },
  dos: { baseCost: 2000, seedOffset: 4 },
  ddos: { baseCost: 7500, seedOffset: 5 },
  crypto: { baseCost: 25000, seedOffset: 6 },
  hacking: { baseCost: 100000, seedOffset: 7 },
  friends: { baseCost: 350, seedOffset: 8 }
}

export const getUpgradeCost = (key: keyof Upgrade, level: number, masterSeed: number): number => {
  const config = UPGRADE_CONFIG[key]
  if (!config) return 0
  const baseExponentialCost = config.baseCost * Math.pow(1.15, level)
  const rng = new SeededRandom(masterSeed + config.seedOffset + level * 1000)
  const varianceMultiplier = rng.RangedFloat(0.95, 1.05)
  const finalCost = Math.floor(baseExponentialCost * varianceMultiplier)
  return Math.max(config.baseCost, finalCost)
}

export const useGameSave = create<GameSaveState>()(
  persist(
    (set, get) => ({
      metadata: {
        title: "Dih",
        person: "UnitC3H6S",
        action: "tập gym",
        seed: 123,
        hash: "1eb78c0d780f6e7e3f1c8b9d5a"
      },

      data: {
        click: 0,
        money: 100,
        gem: 0,
        crypto: 0
      },

      upgrade: {
        multiplier: 1,
        auto: 0,
        botting: 0,
        dos: 0,
        ddos: 0,
        crypto: 0,
        hacking: 0,
        friends: 0
      },

      addClick: () =>
        set((state) => ({
          data: {
            ...state.data,
            click: state.data.click + state.upgrade.multiplier,
            money: state.data.money + state.upgrade.multiplier // fixed spelling
          }
        })),

      buyUpgrade: (key: keyof Upgrade) => {
        const state = get()
        const currentLevel = state.upgrade[key]
        const cost = getUpgradeCost(key, currentLevel, state.metadata.seed)

        if (state.data.money >= cost) {
          set((prev) => ({
            data: {
              ...prev.data,
              money: prev.data.money - cost,
            },
            upgrade: {
              ...prev.upgrade,
              [key]: prev.upgrade[key] + 1,
            },
          }))
        }
      },

      addMoney(money) {
        set((prev) => ({
          data: {
            ...prev.data,
            money: prev.data.money + money,
          }
        }))
      }
    }),
    {
      name: 'game_save',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export const UpgradeItem = ({ upgradeKey }: { upgradeKey: keyof Upgrade }) => {
  const Game = useGameSave()
  const { data, upgrade, metadata } = Game
  const level = upgrade[upgradeKey]
  const cost = getUpgradeCost(upgradeKey, level, metadata.seed)
  const canAfford = data.money >= cost

  return [canAfford, () => Game.buyUpgrade(upgradeKey)]
}