import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { SeededRandom } from './helpers/randomizer'

// Config table
//  for base prices and random seed generation offset
export const UPGRADE_CONFIG: Record<keyof Upgrade, { baseCost: number, seedOffset: number }> = {
  multiplier: { baseCost: 50, seedOffset: 1 },
  auto: { baseCost: 100, seedOffset: 2 },
  friends: { baseCost: 150, seedOffset: 8 },
  botting: { baseCost: 200, seedOffset: 3 },
  dos: { baseCost: 5000, seedOffset: 4 },
  ddos: { baseCost: 7500, seedOffset: 5 },
  crypto: { baseCost: 25000, seedOffset: 6 },
  hacking: { baseCost: 50000, seedOffset: 7 },
}

export const getUpgradeCost = (key: keyof Upgrade, level: number, masterSeed: number): number => {
  const config = UPGRADE_CONFIG[key]
  if (!config) return 0

  // Seed once for the specific upgrade key, not per level
  const rng = new SeededRandom(masterSeed + config.seedOffset)
  
  const baseCostMultiplier = rng.RangedFloat(0.9, 1.05) // Adds overall flavor to this run/key
  const growthRate = rng.RangedFloat(0.95, 1.1)        // Consistent growth rate for this upgrade
  
  const effectiveBase = config.baseCost * baseCostMultiplier
  const finalCost = Math.floor(effectiveBase * Math.pow(growthRate, level))
  
  return Math.max(config.baseCost, finalCost)
}

export const useGameSave = create<GameSaveState>()(
  persist(
    (set, get) => ({
      metadata: {
        title: "Dih",
        person: "Unit01",
        action: "dung an burger nua",
        seed: 123,
        hash: "1eb78c0d780f6e7e3f1c8b9d5a",
        confirmed: false
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

      history: {
        broken_auto: 0,
      },

      broken: {
        auto: false
      },

      confirm: () => set((state) => ({
        metadata: {
          ...state.metadata,
          confirmed: true
        }
      })),

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
      },

      setBreak(item: keyof Breaking, v: boolean) {
        set((prev) => ({
          broken: {
            ...prev.broken,
            [item]: v
          }
        }))
      },

      updateSaveMetadata(title: string, person: string, action: string) {
        set((prev) => ({
          metadata: {
            ...prev.metadata,
            title, person,
            action
          }
        }))
      }
    }),
    {
      name: 'DanhGgym',
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