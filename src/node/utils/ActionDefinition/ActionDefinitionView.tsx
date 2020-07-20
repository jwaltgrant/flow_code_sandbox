import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as PayloadActions from "@river_boyne/valid_flow_producer_core/src/payload/redux/actions";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import ActionNode from "@river_boyne/valid_flow_producer_core/src/nodes/action/ActionNode";
import BlockSet from "@river_boyne/valid_flow_producer_core/src";
import ReturnKeyInput from "./ReturnKeyInput";
import { IBlockDef } from "@river_boyne/valid_flow_producer_core/src/BlockDef";
import { IArgInstance } from "@river_boyne/valid_flow_producer_core/src/ArgInstance";
import { IArgDef } from "@river_boyne/valid_flow_producer_core/src/ArgDef";
import AbstractNode, {
  IChildNode
} from "@river_boyne/valid_flow_producer_core/src/nodes/AbstractNode";
import {
  usePayloadDef,
  useDynamicKeyDispatchers,
  useAvailablePayloadItems
} from "../../../payloadHooks";
import { useNodes, useNode } from "../../hooks";
import { IActionNode } from "../../../core/src/nodes/action/ActionNode";

export interface IActionDefinitionView {
  nodeID: string;
  blockSets: BlockSet[];
}

export default function ActionDefinitionView(props: IActionDefinitionView) {
  const node = useNode<IActionNode>(props.nodeID);

  const [funcState, setFuncState] = useState(() => {
    if (node && node.block) {
      return { ...node.block };
    } else {
      return {
        blockSetKey: "",
        blockKey: "",
        args: [],
        returnType: "any"
      };
    }
  });
  if (!node) {
    return <React.Fragment />;
  }

  const validateState = () => {};

  const save = () => {
    validateState();
  };

  return (
    <div>
      <ActionPanel
        blockSetKey={""}
        blockKey={""}
        args={[]}
        blockSets={props.blockSets}
        onBlockSetChagned={key =>
          setFuncState({ ...funcState, blockSetKey: key })
        }
        onBlockChanged={key => setFuncState({ ...funcState, blockKey: key })}
        node={node}
      />
      <Divider />
      <ReturnKeyInput nodeID={props.nodeID} />
      <Button onClick={e => save()}>Save</Button>
    </div>
  );
}

interface IActionPanel {
  blockSets: BlockSet[];
  onBlockSetChagned: (blockSetKey: string) => void;
  blockSetKey: string;
  blockKey: string;
  onBlockChanged: (blockKey: string) => void;
  args: IArgInstance[];
  node: IChildNode;
}

function ActionPanel(props: IActionPanel) {
  const [blockSetKey, setBlockSetKey] = useState(
    props.blockSetKey || props.blockSets[0].blockSetKey
  );
  const [blockKey, setBlockKey] = useState(props.blockKey);
  const onBlockSetSelected = option => {
    setBlockSetKey(option.value);
    props.onBlockSetChagned(option.value);
  };
  const onBlockKeySelected = option => {
    setBlockKey(option.value);
    props.onBlockChanged(option.value);
  };
  const blockSetOptions = props.blockSets.map(set => {
    return { value: set.blockSetKey, label: set.blockSetKey };
  });
  const blockOptions = () => {
    const blockSet = props.blockSets.find(
      set => set.blockSetKey === blockSetKey
    );
    return blockSet.blocks.map(block => {
      return {
        value: block.blockKey,
        label: block.uiString || block.blockKey
      };
    });
  };
  const blockDef = () => {
    const blockSet = props.blockSets.find(
      set => set.blockSetKey === blockSetKey
    );
    if (blockSet) {
      return blockSet.blocks.find(block => block.blockKey === blockKey);
    }
    return null;
  };
  return (
    <React.Fragment>
      <Select
        options={blockSetOptions}
        value={blockSetOptions.find(option => option.value === blockSetKey)}
        onChange={onBlockSetSelected}
      />
      <Select
        options={blockOptions()}
        value={blockOptions().find(option => option.value === blockKey)}
        onChange={onBlockKeySelected}
      />
      <ArgumentPanel
        blockDef={blockDef()}
        args={props.args}
        node={props.node}
      />
    </React.Fragment>
  );
}

interface IArgumentPanel {
  blockDef: IBlockDef;
  args: IArgInstance[];
  node: IChildNode;
}

function ArgumentPanel(props: IArgumentPanel) {
  if (!props.blockDef) {
    return <React.Fragment />;
  }
  const argDefSelects = () => {
    return props.blockDef.args.map(arg => {
      return (
        <ArgSelect
          argDef={arg}
          argInstance={props.args.find(_arg => _arg.name === arg.name)}
          node={props.node}
        />
      );
    });
  };
  return <React.Fragment>{argDefSelects()}</React.Fragment>;
}

interface IArgSelect {
  argDef: IArgDef;
  argInstance?: IArgInstance;
  node: IChildNode;
}

function ArgSelect(props: IArgSelect) {
  const { nodes } = useNodes();
  const payloadItems = useAvailablePayloadItems(props.node, nodes);
  const [argState, setArgState] = useState(() => {
    if (props.argInstance) {
      return { ...props.argInstance };
    } else {
      return {
        value: null,
        payloadElement: true
      };
    }
  });

  const input = () => {
    if (argState.payloadElement) {
      return (
        <Select
          options={payloadItems.map(item => {
            return { value: item.name, label: item.name };
          })}
        />
      );
    } else {
      return <input />;
    }
  };
  return (
    <React.Fragment>
      <input
        key={props.node.id}
        type="checkbox"
        value={argState.payloadElement ? "checked" : ""}
        onChange={e =>
          setArgState({ ...argState, payloadElement: !argState.payloadElement })
        }
      />
      {input()}
    </React.Fragment>
  );
}
