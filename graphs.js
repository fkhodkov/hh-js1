function getParamNames(func) {
  // https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically
  const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  const ARGUMENT_NAMES = /([^\s,]+)/g;
  let fnStr = func.toString().replace(STRIP_COMMENTS, '');
  let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if(result === null)
     result = [];
  return result;
}

const lazyGraph = {
  receiveGraph(graph) {
    let lg = {}
    return Object.assign(
      lg, {graph: graph, values: {}, calcVertex: this.calcVertex.bind(lg)})
  },
  calcVertex(vertex, dependencies=[]) {
    if (!(vertex in this.values)) {
      let newDeps = dependencies.map(x => x)
      newDeps.push(vertex)
      if (!(vertex in this.graph))
        throw new RangeError(
          "Undefined vertex reference " + vertex + " in graph: " + newDeps.join(' => '))
      const i = dependencies.indexOf(vertex)
      if (i >= 0){
        const circular = newDeps.slice(i).join(' => ')
        throw new RangeError("Circular dependencies in graph: " + circular)
      }
      let func = this.graph[vertex]
      let args = getParamNames(func)
      this.values[vertex] = func(...args.map(v => this.calcVertex(v, newDeps)))
    }
    return this.values[vertex]
  }
}

const eagerGraph = {
  receiveGraph(graph) {
    let lg = lazyGraph.receiveGraph(graph)
    Object.keys(graph).forEach(vertex => lg.calcVertex(vertex))
    return lg
  }
}

module.exports = {
  lazyGraph: lazyGraph,
  eagerGraph: eagerGraph
}
