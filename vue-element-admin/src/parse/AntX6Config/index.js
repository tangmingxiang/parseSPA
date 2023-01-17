import { Node, Shape, Edge } from '@antv/x6'
// 定义节点
class TreeNode extends Node {
  collapsed = false
  postprocess() {
    this.toggleCollapse(false)
  }
  isCollapsed() {
    return this.collapsed
  }
  toggleButtonVisibility(visible) {
    this.attr('buttonGroup', {
      display: visible ? 'block' : 'none'
    })
  }
  toggleCollapse(collapsed) {
    const target = collapsed == null ? !this.collapsed : collapsed
    if (!target) {
      this.attr('buttonSign', {
        d: 'M 1 5 9 5 M 5 1 5 9',
        strokeWidth: 1.6
      })
    } else {
      this.attr('buttonSign', {
        d: 'M 2 5 8 5',
        strokeWidth: 1.8
      })
    }
    this.collapsed = target
  }
}

TreeNode.config({
  zIndex: 2,
  markup: [
    {
      tagName: 'g',
      selector: 'buttonGroup',
      children: [
        {
          tagName: 'rect',
          selector: 'button',
          attrs: {
            'pointer-events': 'visiblePainted'
          }
        },
        {
          tagName: 'path',
          selector: 'buttonSign',
          attrs: {
            fill: 'none',
            'pointer-events': 'none'
          }
        }
      ]
    },
    {
      tagName: 'rect',
      selector: 'body'
    },
    {
      tagName: 'text',
      selector: 'label'
    }
  ],
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
      strokeWidth: 1,
      fill: '#EFF4FF',
      stroke: '#5F95FF'
    },
    label: {
      textWrap: {
        ellipsis: true,
        width: -10
      },
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
      refX: '50%',
      refY: '50%',
      fontSize: 12
    },
    buttonGroup: {
      refX: '100%',
      refY: '50%'
    },
    button: {
      fill: '#5F95FF',
      stroke: 'none',
      x: -10,
      y: -10,
      height: 20,
      width: 30,
      rx: 10,
      ry: 10,
      cursor: 'pointer',
      event: 'node:collapse'
    },
    buttonSign: {
      refX: 5,
      refY: -5,
      stroke: '#FFFFFF',
      strokeWidth: 1.6
    }
  }
})

// 定义边
class TreeEdge extends Shape.Edge {
  isHidden() {
    const node = this.getTargetNode()
    return !node || !node.isVisible()
  }
}

TreeEdge.config({
  zIndex: 1,
  attrs: {
    line: {
      stroke: '#A2B1C3',
      strokeWidth: 1,
      targetMarker: null
    }
  }
})

// 注册
Node.registry.register('tree-node', TreeNode, true)
Edge.registry.register('tree-edge', TreeEdge, true)

export {
  TreeNode,
  TreeEdge
}
