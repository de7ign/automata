import { AutomataNode, NetworkEdges, NetworkNodes } from "@/components/workspace-canvas/types";
import networkService from "@/services/network-service";
import { FullItem } from "vis-data/declarations/data-interface";
import { DataSet } from "vis-data/peer";
import Nfa from "./nfa";
import { ATX_LAMBDA } from "@/components/workspace-canvas/constants";
import { Data, DataSetEdges, DataSetNodes } from "vis-network/peer";


export interface NfaInput {
    value: string;
}

export interface NfaInputResult {
    value: string;
    errors: string[];
}

export interface NfaTraceResult {
    value: string;
    errors: string[];
    result: {
        nodes: DataSetNodes;
        edges: DataSetEdges;
    }
}

export interface NfaResult<T> {
    errors: string[];
    results: T[]
}

class NfaService {

    constructor() { }

    isValidNfa(nfa?: Nfa): string[] {
        if (!nfa) {
            nfa = this.getNFA();
        }

        const errorList: string[] = [];

        this.exactOneStartStateRule(nfa, errorList)

        return errorList;
    }

    public validate(inputs: NfaInput[]): NfaResult<NfaInputResult> {

        const nfa: Nfa = this.getNFA();

        const errorsList: string[] = this.isValidNfa(nfa);

        if (errorsList.length) {

            return {
                errors: errorsList,
                results: []
            };
        }

        const nfaInputResult: NfaInputResult[] = inputs.map((input: NfaInput): NfaInputResult => {
            if (this.isInputValid(nfa, input.value)) {
                return {
                    value: input.value,
                    errors: []
                }
            }

            return {
                value: input.value,
                errors: ["The input is not accepted by the FSM"]
            }
        })


        return {
            errors: [],
            results: nfaInputResult
        }
    }

    private isInputValid(nfa: Nfa, input: string): boolean {
        // Start with the lambda closure of the start states
        let currentStates: Set<AutomataNode> = this.getLambdaClosure(nfa, nfa.startStates);

        for (let symbol of input) {
            const nextStates: Set<AutomataNode> = new Set();

            // For each current state, add the states reachable with the current symbol
            for (let state of currentStates) {
                if (nfa.transitions.has(state) && nfa.transitions.get(state)?.has(symbol)) {
                    for (let nextState of nfa.transitions.get(state)?.get(symbol) || []) {
                        nextStates.add(nextState);
                    }
                }
            }

            // Get the lambda closure of all next states after consuming the symbol
            currentStates = this.getLambdaClosure(nfa, nextStates);

            // If no states are reachable after this symbol, reject the input
            if (currentStates.size === 0) {
                return false;
            }
        }

        // After processing all input symbols, check if any current state is an accept state
        for (let state of currentStates) {
            if (nfa.acceptStates.has(state)) {
                return true;
            }
        }

        return false; // No accept state reached
    }

    private exactOneStartStateRule(nfa: Nfa, errorList: string[]) {
        if (nfa.startStates.size === 0) {
            errorList.push("State machine need one start state.")
        } else if (nfa.startStates.size > 1) {
            errorList.push("State machine cannot have more than one start state.")
        }
    }


    private getNFA(): Nfa {

        const nfa: Nfa = new Nfa();

        const nodes: DataSet<AutomataNode> | undefined = networkService.getNodes();

        nodes?.forEach(state => {
            nfa.addState(state);
        })

        networkService.getEdges()?.forEach(transitions => {
            const fromNode: FullItem<AutomataNode, "id"> | null | undefined = nodes?.get(transitions.from || '');
            const toNode: FullItem<AutomataNode, "id"> | null | undefined = nodes?.get(transitions.to || '');

            if (fromNode && toNode) {

                transitions.label?.split(',')?.forEach((label: string) => {
                    nfa.addTransition(fromNode, label.trim(), toNode);
                })

            }
        })

        return nfa;

    }

    private getLambdaClosure(nfa: Nfa, states: Set<AutomataNode>): Set<AutomataNode> {
        const closure: Set<AutomataNode> = new Set(states);

        const stack: AutomataNode[] = [...states];
        while (stack.length > 0) {
            const state = stack.pop();

            // TODO: Move ATX_LAMBDA constants to service constants file
            if (state && nfa.transitions.has(state) && nfa.transitions.get(state)?.has(ATX_LAMBDA)) {
                for (let lambdaState of nfa.transitions.get(state)?.get(ATX_LAMBDA) || []) {
                    if (!closure.has(lambdaState)) {
                        closure.add(lambdaState);
                        stack.push(lambdaState); // Explore further lambda transitions
                    }
                }
            }
        }

        return closure;
    }

    public traceTransitions(inputs: NfaInput[]): NfaResult<NfaTraceResult> {

        const nfa: Nfa = this.getNFA();

        const errorsList = this.isValidNfa(nfa);

        if (errorsList.length) {

            return {
                errors: errorsList,
                results: []
            };
        }

        const nfaTraceResult: NfaTraceResult[] = inputs.map((input: NfaInput): NfaTraceResult => {

            return {
                errors: [],
                value: input.value,
                result: this.traceTransitionsUtil(nfa, input.value)
            }
        })


        return {
            errors: [],
            results: nfaTraceResult
        }
    }

    private traceTransitionsUtil(nfa: Nfa, input: string): { nodes: DataSet<any>, edges: DataSet<any> } {
        const nodes: NetworkNodes = new DataSet();
        const edges: NetworkEdges = new DataSet();
    
        // Initial state, with a unique ID for root state representation
        let currentStates: Set<{ state: AutomataNode, nodeId: string }> = new Set(
            Array.from(nfa.startStates).map(state => ({ state, nodeId: `root-${state.id}` }))
        );
    
        let stepCounter = 0;
    
        // Add root nodes to represent start states
        currentStates.forEach(({ state, nodeId }) => {
            nodes.add({
                id: nodeId, 
                label: `Start: ${state.label}`,
                isStart: state.isStart,
                isFinal: state.isFinal
            });
        });
    
        // Apply initial lambda closure on start states
        currentStates = this.getTracedLambdaClosure(nfa, currentStates, nodes, edges);
    
        // Process each symbol in the input string
        for (let symbol of input) {
            const nextStates: Set<{ state: AutomataNode, nodeId: string }> = new Set();
    
            // Process transitions for the current set of states
            currentStates.forEach(({ state, nodeId }) => {
                const stateTransitions = nfa.transitions.get(state)?.get(symbol) || new Set();

                stateTransitions.forEach(nextState => {
                    const nextNodeId = `step-${stepCounter}-${state.id}-to-${nextState.id}`;
                    
                    // Add node for the next state in the transition tree
                    nodes.add({
                        id: nextNodeId,
                        label: `${nextState.label} (via ${symbol})`,
                        isStart: false, // even if we returning back to start nodes, do not have the start-node arrow
                        isFinal: nextState.isFinal || false
                    });
    
                    // Add the edge to represent the transition
                    edges.add({
                        from: nodeId,
                        to: nextNodeId,
                        label: symbol,
                        color: { color: 'blue' },
                    });
    
                    nextStates.add({ 
                        state: nextState, 
                        nodeId: nextNodeId
                     });
                });
            });
    
            // Get lambda closure for all resulting next states and move to the next level
            currentStates = this.getTracedLambdaClosure(nfa, nextStates, nodes, edges);
            stepCounter++;
        }
    
        return { nodes, edges };
    }
    

    // Calculates lambda closure for each state in the set, propagating branches as necessary
    private getTracedLambdaClosure(nfa: Nfa, states: Set<{ state: AutomataNode, nodeId: string }>, nodes: NetworkNodes, edges: NetworkEdges): Set<{ state: AutomataNode, nodeId: string }> {
        const closure = new Set(states);
        const stack = Array.from(states);
    
        while (stack.length) {
            const { state, nodeId } = stack.pop()!;
            const lambdaTransitions = nfa.transitions.get(state)?.get(ATX_LAMBDA) || new Set();
    
            lambdaTransitions.forEach(lambdaState => {
                const lambdaNodeId = `lambda-${lambdaState.id}-${nodeId}`; // Ensure uniqueness per lambda transition
    
                if (!Array.from(closure).some(s => s.state === lambdaState)) {
                    closure.add({ state: lambdaState, nodeId: lambdaNodeId });
                    stack.push({ state: lambdaState, nodeId: lambdaNodeId });
    
                    // Add node and edge for the lambda transition in the visualization
                    nodes.add({
                        id: lambdaNodeId,
                        label: `${lambdaState.label} (via λ)`,
                    });
                    edges.add({
                        from: nodeId,
                        to: lambdaNodeId,
                        label: "λ",
                        color: { color: 'gray' },
                    });
                }
            });
        }
    
        return closure;
    }
    
}

const instance = new NfaService();

export default instance;
