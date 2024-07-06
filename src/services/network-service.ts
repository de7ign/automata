import {Data, Network, Options} from "vis-network/peer";

class NetworkService {

  private static instance: NetworkService;
  private network: Network | undefined;

  public createNetwork(container: HTMLDivElement, options: Options, data?: Data): Network {
    if (!this.network) {
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