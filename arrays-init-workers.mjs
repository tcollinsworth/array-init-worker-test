// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array
// Uint32Array.BYTES_PER_ELEMENT // 4 bytes, 0 to 4294967295
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array
// Float32Array.BYTES_PER_ELEMENT // 4 bytes, -3.4E38 to 3.4E38 and 1.2E-38 min positive number

// rss 31.52 MB
// heapTotal 4.61 MB
// heapUsed 3.92 MB
// external 0.29 MB
// arrayBuffers 0.02 MB

// completed 0.464 sec

// rss 1379.48 MB
// heapTotal 13.87 MB
// heapUsed 6.89 MB
// external 0.28 MB
// arrayBuffers 0.01 MB


import { WorkManager } from "./WorkManager.mjs";

console.log('Started...')

reportMemory()

const startTs = Date.now()

const samples = 16*60*60

const stockCount = 3000

const workerCount = 2

const stocks = {}

const done = {
  promise: undefined,
  resolve: undefined,
  reject: undefined,
}

const state = {
  done
}

done.promise = new Promise((resolve, reject) => {
  done.resolve = resolve
  done.reject = reject
})

// console.log('********', done.promise, 'state', state)

const workCallback = {
  message: (message) => {
    if (message instanceof Error) {
      // console.log(message)
      done.reject()
      return
    }
    stocks[message.task.index] = message.sharedArray
    if (Object.keys(stocks).length == stockCount * 2) {
      done.resolve()
    }
    // console.log(Object.keys(stocks).length, stockCount * 2, Object.keys(stocks).length == stockCount * 2)
    // console.log('workCallback.message', message.task.index, message.task.type, message.task.samples)
  },
  error: (error) => {
    console.log('workCallback.error', error)
  },
  messageerror: (error) => {
    console.log('workCallback.messageerror', error)
  },
  exit: (exitCode) => {
    console.log('workCallback.exit', exitCode)
  },
}

const workManager = new WorkManager(workerCount, workCallback)

// const result = await new Promise((resolve, reject) => {
//   const w = new Worker('./create-price-arrays.mjs', {workerData})
//   w.on('message', resolve)
//   w.on('error', reject)
//   w.on('exit', code => {
//     if (code !== 0) reject(new Error(`worker exited with code: ${code}`))
//   })
// })
//
// if (result instanceof Error) console.log(result)
//
// console.log(JSON.stringify(result, null, '  '))

queueWork()

await done.promise

console.log('completed', (Date.now() - startTs)/1000, 'sec')

// console.log('stocks keys', Object.values(stocks).length)
// console.log('stocks values', stocks[2999])
// console.log('stocks values', stocks[5999])

reportMemory()

process.exit(0)

function reportMemory() {
  const used = process.memoryUsage()
  for (let key in used) {
    console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`)
  }
}

function queueWork() {
  // volume
  for (let i=0; i<stockCount; i++) {
    workManager.queueWork({
      index: i,
      type: 'createVolumeArray',
      samples,
    })
  }

  // price
  for (let i=stockCount; i<stockCount*2; i++) {
    workManager.queueWork({
      index: i,
      type: 'createPriceArray',
      samples,
    })
  }
}
