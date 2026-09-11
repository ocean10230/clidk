import { Bot, DollarSign, Gem, MousePointer, MoveHorizontal, Plus, Recycle } from "lucide-react"
import { useGameSave, getUpgradeCost } from "./game_save"
import { Format } from "./helpers/format"
import type React from "react"

interface UpgradeJSXProps {
  name: string
  description: string
  icon: React.ReactNode
  upgrade_internal_name: keyof Upgrade
  index: number
}

const Upgrade = ({
  name,
  description,
  index,
  icon,
  upgrade_internal_name,
}: UpgradeJSXProps) => {
  const Game = useGameSave()
  
  // Calculate current price based on upgrade level & seed
  const currentLevel = Game.upgrade[upgrade_internal_name] ?? 0
  const price = getUpgradeCost(upgrade_internal_name, currentLevel, Game.metadata.seed)
  const canAfford = Game.data.money >= price

  return (
    <div className={"p-3 border-y border-accent-bright/30 " + (index % 2 === 0 ? "bg-modalbg" : "bg-modalbg2")}>
      <div className="flex items-center gap-2">
        <div className="relative bg-accent/30 size-8 p-1.25 flex items-center justify-center rounded-md border-accent/20 border">
          {icon}
        </div>
        <p className="font-semibold font-rubik text-xl">{name}</p>
      </div>

      <span>{description}</span>

      <div className="flex justify-between mt-2 bg-accent-bright/20 rounded-md border-accent/50 border p-1 px-2.5">
        <span className="flex font-semibold gap-1 items-center">
          <span>x{currentLevel}</span>
          ·
          <span className="flex items-center text-money">
            <DollarSign className="size-4" /> {Format(price)}
          </span>
        </span>

        <div className="flex gap-1">
          <button className="p-1.25">
            <Recycle className="size-4.5" />
          </button>

          <button
            className="p-1.25 disabled:opacity-50"
            disabled={!canAfford}
            onClick={() => Game.buyUpgrade(upgrade_internal_name)}
          >
            <Plus className="size-4.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Upgrading({ Save }: { Save: GameSaveState }) {
  return (
    <div className="h-full w-full flex flex-col gap-2 justify-between">
      <div className="w-full h-full overflow-auto">
        <Upgrade
          name="Multiplier"
          description={"Cộng thêm tiền kiếm được, số lần kêu " + Save.metadata.person + " " + Save.metadata.action + " nhiều hơn mỗi click nhiều hơn"}
          index={0}
          icon={
            <>
              <MousePointer />
              <MousePointer className="text-white/20 absolute left-0 bottom-0" />
              <MousePointer className="text-white/20 absolute top-0 right-0" />
            </>
          }
          upgrade_internal_name="multiplier"
        />

        <Upgrade
          name="Auto Clicker"
          description={"Một cổ máy kiếm tiền, xài hoài dễ hư. Không kêu " + Save.metadata.person + " " + Save.metadata.action + " được"}
          index={1}
          icon={
            <>
              <Bot/>
            </>
          }
          upgrade_internal_name="auto"
        />

        <Upgrade
          name="Bạn bè"
          description={"Mấy đứa thằng trí cốt vô click phụ, kêu " + Save.metadata.person + " " + Save.metadata.action + " được nhưng tốn mớ tiền để giữ chân"}
          index={1}
          icon={
            <>
              <Bot/>
            </>
          }
          upgrade_internal_name="friends"
        />
      </div>

      <FooterData />
    </div>
  )
}

const FooterData = () => {
  const Game = useGameSave()
  const money = Game.data.money

  return (
    <div className="flex justify-between items-center bg-accent/20 p-2.5 rounded-t-md border-accent-bright/50 border">
      <div className="flex gap-2 items-center font-semibold">
        <div
          key={money}
          className="text-money flex p-2 pr-1 items-center gap-2 font-rubik"
        >
          <DollarSign />
          <span>{Format(money)}</span>
        </div>

        <div className="w-px h-0 bg-white/30 p-px" />

        <div className="text-gem pl-1 flex p-2 items-center gap-2 font-rubik">
          <Gem />
          <span>{Format(Game.data.gem)}</span>
        </div>
      </div>

      <div className="flex gap-0.5 items-center">
        <button>
          <MoveHorizontal />
        </button>
      </div>
    </div>
  )
}