function Scheduler(threadHold) {
  this.threadHold = threadHold || 5
  this._running = 0
  this.tasks = []
}

Scheduler.prototype = {
  constructor: Scheduler,
  start() {
    this._check()
  },
  add(task) {
    this.tasks.push(this._wrapper.bind(this, task))
  },

  _wrapper(task) {
    return Promise.resolve().then(_ => {
      return task()
    }).then(_ => {
      this._finish()
      this._check()
    }).catch(_ => {
      console.log(`task error`)
      this._finish()
      this._check()
    })
  },

  _finish() {
    this._running--
    if (this._running <= 0) {
      console.log(`当前任务已经全部完成，待添加新任务`)
    }
  },

  _check() {
    if (this._running < this.threadHold) {
      const task = this.tasks.shift()
      if (task) {
        this._running++
        this._check()
        task()
      }
    }
  }
}

module.exports = Scheduler