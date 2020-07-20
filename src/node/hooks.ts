import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as NodeActions from "@river_boyne/valid_flow_producer_core/src/nodes/redux/actions";
import { IAbstractNode } from "@river_boyne/valid_flow_producer_core/src/nodes/AbstractNode";

export function useNodes() {
  const dispatch = useDispatch();
  const nodes = useSelector(state => (state as any).nodeStore);
  const addNode = (node: IAbstractNode) => {
    dispatch(NodeActions.addNode(node));
  };
  return { nodes, addNode };
}

export function useNode<T extends IAbstractNode>(id: string): T {
  const [node, setNode] = useState(null);
  const nodes = useSelector(state => (state as any).nodeStore);
  useEffect(() => {
    setNode(nodes.filter(n => n.id === id));
  }, [id, nodes]);
  return node;
}
