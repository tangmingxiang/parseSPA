<template>
  <div id="container" />
</template>

<script>
import { Graph } from '@antv/x6'
import { TreeNode, TreeEdge } from '../AntX6Config'
export default {
  mounted() {
    const graph = new Graph({
      container: document.getElementById('container'),
      async: true,
      frozen: true,
      scroller: true,
      interacting: false,
      sorting: 'approx',
      connecting: {
        anchor: 'orth',
        connector: 'rounded',
        connectionPoint: 'boundary',
        router: {
          name: 'er',
          args: {
            offset: 24,
            direction: 'H'
          }
        }
      }
    })
    graph.on('node:collapse', ({ node }) => {
      node.toggleCollapse()
      const collapsed = node.isCollapsed()
      const run = (pre) => {
        const succ = graph.getSuccessors(pre, { distance: 1 })
        if (succ) {
          succ.forEach((node) => {
            node.toggleVisible(!collapsed)
            if (!node.isCollapsed()) {
              run(node)
            }
          })
        }
      }
      run(node)
    })
    import('../data.json')
      // .then((response) => { console.log(response); return response.json() })
      .then((data) => {
        // const start = new Date().getTime()
        const nodes = data.nodes.map(({ leaf, ...metadata }) => {
          const node = new TreeNode(metadata)
          if (leaf) {
            node.toggleButtonVisibility(leaf === false)
          }
          return node
        })
        const edges = data.edges.map(
          (edge) =>
            new TreeEdge({
              source: edge.source,
              target: edge.target
            })
        )
        graph.resetCells([...nodes, ...edges])
        // graph.unfreeze({
        //   progress({ done }) {
        //     if (done) {
        //       const time = new Date().getTime() - start
        //       console.log(time)
        //       graph.unfreeze({
        //         batchSize: 50
        //       })
        //       graph.zoomToFit({ padding: 24 })
        //     }
        //   }
        // })
      })
  }
}
</script>

<style scoped>
#container {
  min-height: 800px;
}
</style>
