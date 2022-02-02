import {Industry} from "../types/industry";
import React from "react";


// Declaring type of IndustriesList props
export type IndustriesProps = {
    industries: Industry[]
};


// Declaring type of tree node
interface TreeNode {
    key?: string;
    label?: string;
    parentId?: string;
    children?: TreeNode[];
}

// Declaring type of IndustryNode props
export type IndustryNodeProps = {
    node?: TreeNode
};


function IndustryNode({node}: IndustryNodeProps) {

    const children = [];
    if (node && node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
            children.push(<IndustryNode key={i} node={node.children[i]}/>);
        }
    }

    return <>
        <li className="tree-node-item">{!!node ? node.label : ''}
            <ul className="tree-node-group">{
                children
            }</ul>
        </li>
    </>;


}


export default function IndustriesList({industries}: IndustriesProps) {


    function createNode(x: Industry): TreeNode {
        return {key: x.id, label: x.name, parentId: x.parentId, children: []}
    }

    function buildTreeNodes(industries: Industry[]): TreeNode[] {

        const lookup: { [id: string]: TreeNode } = {};

        industries.forEach(x => {
            lookup[x.id] = createNode(x);
        });

        const values = Object.values(lookup);

        for (let i = 0; i < values.length; i++) {
            const item = values[i];
            if (item.parentId) {
                const proposedParent = lookup[item.parentId];
                if (proposedParent) {
                    proposedParent.children = !!proposedParent.children ? proposedParent.children : [];
                    proposedParent.children.push(item);
                }
            }
        }

        return values.filter(value => !value.parentId);
    }

    const nodes = buildTreeNodes(industries);

    return <ul className="tree-node-group">
        {nodes.map((node, i) => <IndustryNode key={i} node={node}/>)}
    </ul>;
}