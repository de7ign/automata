import { Options } from "vis-network/peer";

export const NETWORK_DEFAULT_OPTION : Options = {
    nodes: {
      shape: "circle",
      //   heightConstraint: {
      //     minimum: 50
      //   },
      widthConstraint: {
        minimum: 50,
        maximum: 50
      }
    },
    edges: {
      arrows: {
        to: { enabled: true, scaleFactor: 1, type: "arrow" }
      },
      // by default all edges property should be this
      smooth: { enabled: true, type: "curvedCW", roundness: 0.5 }
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