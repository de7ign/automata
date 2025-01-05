import { Options } from "vis-network/peer";

export const NETWORK_VISUALIZE_OPTION: Options = {
  layout: {
    hierarchical: {
      enabled: true,
      direction: 'LR',
      sortMethod: 'directed',
      shakeTowards: 'roots',
    }
  },
  nodes: {
    shape: "circle",
    widthConstraint: {
      minimum: 50,
      maximum: 50
    },
    color: {
      border: '#2563eb',
      background: '#F1F5F9',
      highlight: {
        border: '#2563eb',
        background: '#F1F5F9'
      },
      hover: {
        border: '#2563eb',
        background: '#F1F5F9'
      }
    }
  },
  edges: {
    arrows: {
      to: { enabled: true, scaleFactor: 1, type: "arrow" }
    },
    // by default all edges property should be this
    smooth: { enabled: true, type: "cubicBezier", roundness: 1 },
    color: {
      color:'#2563eb',
      highlight:'#2563eb',
      hover: '#2563eb',
    },
    width: 2
  },
  physics: {
    enabled: false // should I enable it or add a functionality user can enable/disable physics ?
  },
  manipulation: {
    enabled: false
  },
  interaction: {
    selectConnectedEdges: false,
    dragNodes: false
  },
  // autoResize: true
};
