declare interface Metadata {
  title: string
  person: string
  action: string
  seed: number
  hash: string
  confirmed: boolean
}

declare interface Data {
  current_tick: bigint
  click: number
  money: bigint
  gem: number
  crypto: number
}

declare interface Upgrade {
  multiplier: number
  friends: number
  auto: number
  botting: number
  beo: number
  dos: number
  ddos: number
  crypto: number
  hacking: number
  [key: string]: number
}

declare interface SaveHistory {
  broken_auto: number
  [key: string]: number
}

declare interface Breaking {
  [key: keyof Upgrade]: boolean
}

declare interface TemporaryMultiplier {
  multiplier: number
  expire_at_tick: bigint
}

interface GameSaveData {
  metadata: Metadata
  data: Data
  broken: Breaking
  history: SaveHistory
  upgrade: Upgrade
  multiplier: Record<string, TemporaryMultiplier>
}

interface GameSaveActions {
  addClick: () => void
  buyUpgrade: (key: keyof Upgrade) => void
  addMoney: (money: bigint) => void
  setMultiplier: (name: keyof Upgrade, multiplier: number, expire_at_tick: bigint) => void
  confirm: () => void

  elapse: () => void
  updateSaveMetadata: (title: string, person: string, action: string) => void
}

declare interface GameSaveState extends GameSaveData, GameSaveActions {
}
