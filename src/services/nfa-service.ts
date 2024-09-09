import { AutomataNode } from "@/components/workspace-canvas/types";
import networkService from "@/services/network-service";
import { FullItem } from "vis-data/declarations/data-interface";
import { DataSet } from "vis-data/peer";
import Nfa from "./nfa";

class NfaService {

    constructor() { }

    isValidNfa(nfa?: Nfa): string[] {
        if (!nfa) {
            nfa = this.getNFA();
        }

        const errorList: string[] = [];

        this.cannotContainMoreThanOneStartStateRule(nfa, errorList)

        return errorList;
    }

    validate(input: string): string[] | boolean {

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

    private cannotContainMoreThanOneStartStateRule(nfa: Nfa, errorList: string[]) {
        if (nfa.startStates.size > 1) {
            errorList.push("State machine cannot have more than one start state.")
        }
    }


    private getNFA(): Nfa {

        const nfa: Nfa = new Nfa();

        const nodes: DataSet<AutomataNode> | undefined = networkService.getNodes();
        console.log("nodes ", nodes?.get());
        
        nodes?.forEach(state => {
            nfa.addState(state);
        })

        networkService.getEdges()?.forEach(transitions => {
            const fromNode: FullItem<AutomataNode, "id"> | null | undefined = nodes?.get(transitions.from || '');
            const toNode: FullItem<AutomataNode, "id"> | null | undefined = nodes?.get(transitions.to || '');

            if (fromNode && toNode) {
                const { id: fromId, ...fromNodeData } = fromNode;
                const { id: toId, ...toNodeData } = toNode;

                transitions.label?.split(',')?.forEach((label: string) => {
                    nfa.addTransition(fromNode, label.trim(), toNode);
                })

            }
        })

        console.log(nfa);

        return nfa;

    }
}

const instance = new NfaService();

export default instance;
