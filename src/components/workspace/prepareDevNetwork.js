import { DataSet } from "vis-network";

const TD1 = {
  NODES: new DataSet([
    {
      id: "1",
      label: "start",
      final: true,
      x: -184,
      y: -41
    },
    {
      id: "2",
      label: "Node 1",
      final: false,
      x: 11,
      y: -40
    },
    {
      id: "3",
      label: "Node 2",
      final: true,
      x: 215,
      y: -37
    }
  ]),
  EDGES: new DataSet([
    {
      id: "1",
      from: "1",
      to: "2",
      label: "1",
      smooth: { type: "curvedCW", roundness: 0.2 }
    },
    { id: "2", from: "1", to: "1", label: "0" },
    {
      id: "3",
      from: "2",
      to: "1",
      label: "1",
      smooth: { type: "curvedCW", roundness: 0.2 }
    },
    {
      id: "4",
      from: "2",
      to: "3",
      label: "0",
      smooth: { type: "curvedCW", roundness: 0.2 }
    },
    {
      id: "5",
      from: "3",
      to: "2",
      label: "0",
      smooth: { type: "curvedCW", roundness: 0.2 }
    },
    { id: "6", from: "3", to: "3", label: "1" }
  ])
};

// add the new test data in the testDataList
const testDataList = { TD1 };

/**
 * Create a network with some pre built test networks - use for DEV
 *
 * @param {DataSet} nodes network node dataset
 * @param {DataSet} edges network edge daataset
 * @param {String} variant the test network which you want to create
 */
const createTestData = (nodes, edges, variant) => {
  const testData = testDataList[variant];

  if (testData) {
    const testDataNodes = testData.NODES.get();
    const testDataEdges = testData.EDGES.get();

    testDataNodes.forEach(nodes_ => nodes.update(nodes_));
    testDataEdges.forEach(edges_ => edges.update(edges_));
  }
};

export default createTestData;
