const { eagerGraph, lazyGraph } = require('./graphs')

const myAmazingGraph = {
  n: (xs) => xs.length,
  m: (xs, n) => xs.reduce((store, item) => item + store, 0) / n,
  m2: (xs, n) => xs.reduce((store, item) => item * store, 1) / n,
  v: (m, m2) => m*m - m2,
  xs: () => [1, 2, 3]
}

const myNotSoAmazingGraph = {
  n: (a) => a,
  b: (n) => n,
  z: (y) => y,
  y: (c, x) => c + x,
  c: () => "Hello, world!",
  x: (z) => z,
}

const lgAmazing = lazyGraph.receiveGraph(myAmazingGraph)
const egAmazing = eagerGraph.receiveGraph(myAmazingGraph)
const lgNotAmazing = lazyGraph.receiveGraph(myNotSoAmazingGraph)

function evalVertex(graph, vertex) {
  try {
    console.log(graph.calcVertex(vertex))
  } catch (e) {
    console.log(e.message)
  }
}

evalVertex(lgAmazing, 'm2')
evalVertex(egAmazing, 'v')
evalVertex(lgNotAmazing, 'b')
evalVertex(lgNotAmazing, 'x')
evalVertex(lgNotAmazing, 'c')
