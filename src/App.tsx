import React, { useEffect } from "react";
import "./styles.css";
import { createStore } from "redux";
import { combineReducers } from "redux";
import { useSelector } from "react-redux";
import ActionDefinitionView from "./node/utils/ActionDefinition/ActionDefinitionView";
import payloadStore from "@river_boyne/valid_flow_producer_core/src/payload/redux";
import nodeStore from "@river_boyne/valid_flow_producer_core/src/nodes/redux";
import {
  usePayloadItemsDispatchers,
  useDynamicKeyDispatchers
} from "./payloadHooks";
import { IChildNode } from "@river_boyne/valid_flow_producer_core/src/nodes/AbstractNode";
import { useNodes } from "./node/hooks";
import * as NodeActions from "@river_boyne/valid_flow_producer_core/src/nodes/redux/actions";
import { useDispatch, useStore } from "react-redux";

const reducers = combineReducers({ payloadStore, nodeStore });
export const store = createStore(reducers);

const blockSets = [
  {
    blockSetKey: "test",
    blocks: [
      {
        blockKey: "testBlock",
        args: [
          {
            name: "arg"
          }
        ]
      }
    ]
  }
];

const node: IChildNode = {
  parentNodeIDs: ["1"],
  id: "2",
  returnKey: "testKey",
  block: {}
};

const allNodes = [
  {
    id: "1"
  },
  node
];

export default function App() {
  const dispatch = useDispatch();
  const [addPayloadItem, removePayloadItem] = usePayloadItemsDispatchers();
  const [addDynamicKey, removeDynamicKey] = useDynamicKeyDispatchers();
  useEffect(() => {
    addPayloadItem({ name: "item1", type: "any" });
    addPayloadItem({ name: "item2", type: "any" });
    dispatch(NodeActions.addNode(node));
    addDynamicKey({ name: "dKey", type: "any", nodeID: "1" });
  }, []);
  const payloadDef = useSelector(state => (state as any).payloadStore);
  return (
    <div className="App">
      <ActionDefinitionView nodeID={"2"} blockSets={blockSets} />
    </div>
  );
}
