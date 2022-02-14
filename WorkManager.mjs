import { Worker } from 'worker_threads'

export class WorkManager {
  constructor(workerCount, workCallback) {
    this.workerCount = workerCount
    this.workQueue = []
    this.freeWorkers = []
    // this.busyWorkers = []

    for (let i = 0; i < workerCount; i++) {
      const worker = new Worker('./create-price-arrays.mjs')
      worker.on('message', this._getProxyCallback(this, worker, workCallback.message))
      worker.on('error', this._getProxyCallback(this, worker, workCallback.error))
      this.freeWorkers.push(worker)
    }
  }

  queueWork(task) {
    this.workQueue.push(task)
    this._startWork()
  }

  _startWork() {
    if (this.workQueue.length < 1 || this.freeWorkers.length < 1) return
    const work = this.workQueue.splice(0, 1)[0]
    const worker = this.freeWorkers.splice(0, 1)[0]
    worker.postMessage(work)
  }

  _getProxyCallback(workManager, worker, clientCb) {
    return function proxyCb(message) {
      workManager.freeWorkers.push(worker)
      workManager._startWork()
      clientCb(message)
    }
  }
}