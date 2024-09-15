import { AutomataNode } from "@/components/workspace-canvas/types";
import networkService from "@/services/network-service";
import { FullItem } from "vis-data/declarations/data-interface";
import { DataSet } from "vis-data/peer";
import Nfa from "./nfa";


export interface NfaInput {
    value: string;
}

interface NfaInputResult {
    value: string;
    errors: string[];
}

export interface NfaResult {
    errors: string[];
    results: NfaInputResult[]
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

    public validate(inputs: NfaInput[]): NfaResult {

        const nfa: Nfa = this.getNFA();

        const errorsList = this.isValidNfa(nfa);

        if (errorsList.length) {
            console.log('error')

            return {
                errors: errorsList,
                results: []
            };
        }

        const nfaInputResult: NfaInputResult[] = inputs.map((input: NfaInput): NfaInputResult => {
            // if (!input.value) {
            //     return {
            //         value: input.value,
            //         errors: ["This field cannot be empty"]
            //     }
            // } else 
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
        let currentStates: Set<AutomataNode> = new Set(nfa.startStates);

        for (let symbol of input) {

            const nextStates: Set<AutomataNode> = new Set();
            for (let state of currentStates) {
                if (nfa.transitions.has(state) && nfa.transitions.get(state)?.has(symbol)) {
                    for (let nextState of nfa.transitions.get(state)?.get(symbol) || []) {
                        nextStates.add(nextState);
                    }
                }
            }

            currentStates = nextStates;

            if (currentStates.size === 0) {
                return false; // No possible state to move to
            }
        }

        for (let state of currentStates) {
            if (nfa.acceptStates.has(state)) {
                return true; // If any current state is an accept state, the input is accepted
            }
        }

        return false; // No accept state reached
    }

    private validatex(input: string): string[] | boolean {

        const nfa: Nfa = this.getNFA();

        const errorsList = this.isValidNfa(nfa);

        if (errorsList.length) {
            return errorsList;
        }

        let currentStates: Set<AutomataNode> = new Set(nfa.startStates);

        for (let symbol of input) {

            const nextStates: Set<AutomataNode> = new Set();
            for (let state of currentStates) {
                if (nfa.transitions.has(state) && nfa.transitions.get(state)?.has(symbol)) {
                    for (let nextState of nfa.transitions.get(state)?.get(symbol) || []) {
                        nextStates.add(nextState);
                    }
                }
            }

            currentStates = nextStates;

            if (currentStates.size === 0) {
                return false; // No possible state to move to
            }
        }

        for (let state of currentStates) {
            if (nfa.acceptStates.has(state)) {
                return true; // If any current state is an accept state, the input is accepted
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
}

const instance = new NfaService();

export default instance;
