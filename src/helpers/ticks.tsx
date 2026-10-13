export class GameTick extends EventTarget {
  private tick_count: bigint
  private intervalId: ReturnType<typeof setInterval> | null = null
  private lastFire: number
  private ms: number

  constructor(ms: number, game: GameSaveState) {
    super()
    this.tick_count = game.data.current_tick
    this.ms = ms
    this.lastFire = Date.now()
    this.start()
  }

  private start() {
    this.intervalId = setInterval(() => {
      const now = Date.now()
      const elapsed = now - this.lastFire
      this.lastFire = now
      this.tick_count++

      this.dispatchEvent(new CustomEvent("tick_elapsed", {
        detail: { tick: this.tick_count, elapsedMs: elapsed },
        cancelable: false,
      }))

    }, this.ms)
  }

  stop() {
    if (!this?.intervalId) return
    clearInterval(this.intervalId)
  }
}