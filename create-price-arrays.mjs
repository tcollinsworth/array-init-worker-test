import { workerData, parentPort } from 'worker_threads'

parentPort.on('message', task => {
  tasks[task.type || 'default'](task)
})

const tasks = {
  createPriceArray: (task) => {
    const sharedArray = new Float32Array(new SharedArrayBuffer(Float32Array.BYTES_PER_ELEMENT * task.samples))
    for (let i=0; i<task.samples; i++) sharedArray[i] = 1234.123
    parentPort.postMessage({task, sharedArray})
    // parentPort.postMessage(new Error('array-init-worker-test'))
  },
  createVolumeArray: (task) => {
    const sharedArray = new Uint32Array(new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT * task.samples))
    for (let i=0; i<task.samples; i++) sharedArray[i] = 123456780
    parentPort.postMessage({task, sharedArray})
  },
  default: (task) => {
    parentPort.postMessage(new Error(`unrecognized task.type ${task.type}`))
  }
}