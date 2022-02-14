//node --max-old-space-size=10000 arrays-init.mjs

// Started...
// rss 31.45 MB
// heapTotal 4.61 MB
// heapUsed 3.85 MB
// external 0.27 MB
// arrayBuffers 0.01 MB

// completed 22.755 sec

// rss 2709.09 MB
// heapTotal 2707.99 MB
// heapUsed 2640.36 MB
// external 0.26 MB
// arrayBuffers 0.01 MB

console.log('Started...')

reportMemory()

const startTs = Date.now()

const samples = 16*60*60

const stocks = {}

// price
for (let i=3000; i<6000; i++) {
  stocks[i] = Array.from({ length: samples }, () => 123456780)
}

// volume
for (let i=0; i<3000; i++) {
  stocks[i] = Array.from({ length: samples }, () => 1234.123)
}

console.log('completed', (Date.now() - startTs)/1000, 'sec')

reportMemory()

function reportMemory() {
  const used = process.memoryUsage()
  for (let key in used) {
    console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`)
  }
}