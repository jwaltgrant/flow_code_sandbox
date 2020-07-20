import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AbstractNode, {
  IChildNode
} from "@river_boyne/valid_flow_producer_core/src/nodes/AbstractNode";
import IFieldDef from "@river_boyne/valid_flow_producer_core/src/FieldDef";
import * as Payload from "@river_boyne/valid_flow_producer_core/src/payload/PayloadDefinition";
import IDynamicKey from "@river_boyne/valid_flow_producer_core/src/payload/DynamicKey";
import * as PayloadActions from "@river_boyne/valid_flow_producer_core/src/payload/redux/actions";

/**
 * Hook to get all avaialble payload items
 * @param forNode IChildNode to finnd available items for
 * @param allNodes Nodes to parse through, looking for payload Items
 */
export function useAvailablePayloadItems(
  forNode: IChildNode,
  allNodes: AbstractNode[]
): IFieldDef[] {
  const payloadDef: Payload.IPayloadDefinition = useSelector(
    (state: { payloadStore }) => state.payloadStore
  );
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(Payload.getAvailablePayloadItems(payloadDef, forNode, allNodes));
  }, [forNode, allNodes, payloadDef]);
  return items;
}

export function usePayloadItemsDispatchers() {
  const dispatch = useDispatch();
  const addPayloadItem = (item: IFieldDef) => {
    dispatch(PayloadActions.addItem(item));
  };
  const removePayloadItem = (name: string) => {
    dispatch(PayloadActions.removeItem(name));
  };
  return [addPayloadItem, removePayloadItem];
}

export function useDynamicKeyDispatchers() {
  const dispatch = useDispatch();
  const addDynamicKey = (dynamicKey: IDynamicKey) => {
    dispatch(PayloadActions.addDynamicKey(dynamicKey));
  };
  const removeDynamicKey = (name: string) => {
    dispatch(PayloadActions.removeItem(name));
  };
  return [addDynamicKey, removeDynamicKey];
}

export function usePayloadDef() {
  const payloadDef: Payload.IPayloadDefinition = useSelector(
    (state: any) => state.payload
  );
  const piDispatchers = usePayloadItemsDispatchers();
  const dyDispatchers = useDynamicKeyDispatchers();
  return {
    payloadDef,
    addPayloadItem: piDispatchers[0],
    removePayloadItem: piDispatchers[1],
    addDynamicKey: dyDispatchers[0],
    removeDynamicKey: dyDispatchers[1]
  };
}
