import { AutomataNode } from "@/components/workspace-canvas/types";
import { Data, DataInterfaceNodes, Network, Options, DataSetEdges } from "vis-network/peer";
import { DataSet } from "vis-data/peer"
class NetworkService {

  private static instance: NetworkService;
  private network: Network | undefined;

  private data: Data | undefined;

  public createNetwork(container: HTMLDivElement, options: Options, data?: Data): Network {
    if (!this.network) {
      this.data = data || {};
      this.network = new Network(container, data || {}, options);
    }

    return this.network;
  }

  public getNetwork(): Network {
    if (!this.network) {
      throw new Error('err');
    }

    return this.network;
  }

  public getNodes(): DataSet<AutomataNode> | undefined {
    return <DataSet<AutomataNode>>this.data?.nodes;
  }

  public getEdges(): DataSetEdges | undefined {
    return <DataSetEdges>this.data?.edges;
  }

  public destroyNetwork(): void {
    if (this.network) {
      this.network.destroy();
      this.network = undefined;
    }
  }

  constructor() {
    if (!NetworkService.instance) {
      this.network = undefined;  // Placeholder for the network instance
      NetworkService.instance = this;
    }

    return NetworkService.instance;
  }
}

const instance = new NetworkService();
//Object.freeze(instance);

export default instance;