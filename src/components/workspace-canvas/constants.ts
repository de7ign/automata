import { Options } from "vis-network/peer";

export const NETWORK_DEFAULT_OPTION: Options = {
  layout: {
    randomSeed: '0.7250393187294002:1726417578188' // seed for default example
  },
  nodes: {
    shape: "circle",
    widthConstraint: {
      minimum: 50,
      maximum: 50
    },
    color: {
      border: '#2563eb',
      background: '#D3E0FB',
      highlight: {
        border: '#2563eb',
        background: '#E4ECFC'
      },
      hover: {
        border: '#2563eb',
        background: '#E4ECFC'
      }
    }
  },
  edges: {
    arrows: {
      to: { enabled: true, scaleFactor: 1, type: "arrow" }
    },
    // by default all edges property should be this
    smooth: { enabled: true, type: "curvedCW", roundness: 0.2 },
    color: {
      color:'#2563eb',
      highlight:'#2563eb',
      hover: '#2563eb',
    }
  },
  physics: {
    enabled: false // should I enable it or add a functionality user can enable/disable physics ?
  },
  manipulation: {
    enabled: false
  },
  interaction: {
    selectConnectedEdges: false
  }
};
