import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { SeededRandom } from '@/helpers/randomizer'

// Config table
//  for base prices and random seed generation offset
export const UPGRADE_CONFIG: Record<keyof Upgrade, { baseCost: number, seedOffset: number }> = {
  multiplier: { baseCost: 100, seedOffset: 102 },
  auto: { baseCost: 150, seedOffset: 52 },
  friends: { baseCost: 200, seedOffset: 58 },
  botting: { baseCost: 250, seedOffset: 33 },
  dos: { baseCost: 5000, seedOffset: 42 },
  ddos: { baseCost: 7500, seedOffset: 53 },
  crypto: { baseCost: 25000, seedOffset: 66 },
  hacking: { baseCost: 50000, seedOffset: 17 },
}

export const getUpgradeCost = (key: keyof Upgrade, level: number, masterSeed: number): number => {
  const config = UPGRADE_CONFIG[key]
  if (!config) return 0

  const rng = new SeededRandom(masterSeed + config.seedOffset)
  const baseCostMultiplier = rng.RangedFloat(0.9, 1.5)
  const growthRate = rng.RangedFloat(0.95, 1.1)
  
  const effectiveBase = config.baseCost * baseCostMultiplier
  const finalCost = Math.floor(effectiveBase * Math.pow(growthRate, level))
  
  return Math.max(config.baseCost, finalCost)
}

const storage = createJSONStorage(() => localStorage, {
  reviver: (_, value) => {
    if (typeof value === 'string' && /^\d+n$/.test(value)) {
      return BigInt(value.slice(0, -1))
    }
    return value
  },
  replacer: (_, value) =>
    typeof value === 'bigint' ? `${value.toString()}n` : value,
})

export const useGameSave = create<GameSaveState>()(
  persist(
    (set, get) => ({
      metadata: {
        title: "Dih",
        person: "Khoi Nguyen",
        action: "di tap gym",
        seed: 123,
        hash: "1eb78c0d780f6e7e3f1c8b9d5a",
        confirmed: false
      },

      data: {
        click: 0,
        money: 1200n,
        gem: 0,
        crypto: 0,

        current_tick: 0n
      },

      upgrade: {
        multiplier: 1,
        auto: 0,
        botting: 0,
        dos: 0,
        ddos: 0,
        beo: 0,
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

      multiplier: {
        click: {
          multiplier: 1,
          expire_at_tick: 0n
        }
      },

      setMultiplier: (name: keyof Upgrade, multiplier: number, expire_at_tick: bigint) => set(state => ({
        multiplier: {
          ...state.multiplier,
          [name]: { multiplier, expire_at_tick }
        }
      })),

      confirm: () => set((state) => ({
        metadata: {
          ...state.metadata,
          confirmed: true
        }
      })),

      addClick: () => set((state) => ({
        data: {
          ...state.data,
          click: state.data.click + state.upgrade.multiplier,
          money: state.data.money + BigInt(state.upgrade.multiplier)
        }
      })),

      buyUpgrade: (key: keyof Upgrade) => {
        const state = get()
        const currentLevel = state.upgrade[key]
        const cost = BigInt(getUpgradeCost(key, currentLevel, state.metadata.seed))

        if (state.data.money >= cost) {
          set((prev) => ({
            data: {
              ...prev.data,
              money: BigInt(prev.data.money - cost),
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
            money: prev.data.money + BigInt(money),
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
      },

      elapse() { set((p) => ({ data: {...p.data,current_tick:p.data.current_tick} })) }
    }),
    {
      name: 'DanhGgym',
      storage
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
