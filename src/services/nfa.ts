import { AutomataNode } from "@/components/workspace-canvas/types";

export default class Nfa {

    private _states: Set<AutomataNode>;
    private _startStates: Set<AutomataNode>;
    private _acceptStates: Set<AutomataNode>;
    private _transitions: Map<AutomataNode, Map<string, Set<AutomataNode>>>;

    get states(): Set<AutomataNode> {
        return this._states;
    }

    get startStates(): Set<AutomataNode> {
        return this._startStates;
    }

    get acceptStates(): Set<AutomataNode> {
        return this._acceptStates;
    }

    get transitions(): Map<AutomataNode, Map<string, Set<AutomataNode>>> {
        return this._transitions;
    }

    constructor() {
        this._states = new Set(); // All states
        this._startStates = new Set();  // Start state
        this._acceptStates = new Set(); // Set of accept (final) states
        this._transitions = new Map(); // Map of transitions: {state -> {input -> Set of next states}}
    }

    // Adds a new state
    addState(state: AutomataNode) {
        if (state.isStart) {
            this._startStates.add(state);
        }

        if (state.isFinal) {
            this._acceptStates.add(state);
        }

        this._states.add(state);

        if (!this._transitions.has(state)) {
            this._transitions.set(state, new Map());
        }
    }

    // Adds a transition from one state to another on a specific input symbol
    addTransition(fromState: AutomataNode, inputSymbol: string, toState: AutomataNode) {
        if (!this._transitions.has(fromState)) {
            this.addState(fromState);
        }
        if (!this._transitions.has(toState)) {
            this.addState(toState);
        }
        const transitionsForState: Map<string, Set<AutomataNode>> | undefined = this._transitions.get(fromState);
        if (!transitionsForState?.has(inputSymbol)) {
            transitionsForState?.set(inputSymbol, new Set());
        }
        transitionsForState?.get(inputSymbol)?.add(toState);
    }
}
