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

interface GameSaveData {
  metadata: { title: string; person: string; action: string; seed: number; hash: string }
  data: { click: number; money: number; gem: number; crypto: number }
  upgrade: Upgrade
}

interface GameSaveActions {
  addClick: () => void
  buyUpgrade: (key: keyof Upgrade) => void
  addMoney: (money: number) => void
}

declare interface GameSaveState extends GameSaveData, GameSaveActions {
}