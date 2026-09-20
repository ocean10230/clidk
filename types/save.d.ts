declare interface Metadata {
  title: string
  person: string
  action: string
  seed: number
  hash: string
}

declare interface Data {
  click: number
  money: number
  gem: number
  crypto: number
}

declare interface Upgrade {
  multiplier: number
  friends: number
  auto: number
  botting: number
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

interface GameSaveData {
  metadata: { title: string; person: string; action: string; seed: number; hash: string; confirmed: boolean }
  data: {
    current_tick: bigint;
    click: bigint;
    Gem: number,
    BTC: number,
    Money: bigint
  }
  broken: Breaking
  history: SaveHistory
  upgrade: Upgrade

  prices: {
    Gem: number,
    BTC: number,
    Money: 1
    [key: string]: number
  },
}

interface GameSaveActions {
  addClick: () => void
  buyUpgrade: (key: keyof Upgrade) => void
  addMoney: (money: bigint) => void,
  confirm: () => void

  elapse: () => void

  updateSaveMetadata: (title: string, person: string, desc: string) => void
}

declare interface GameSaveState extends GameSaveData, GameSaveActions {
}