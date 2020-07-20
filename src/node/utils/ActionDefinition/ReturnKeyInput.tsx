import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import { useDispatch } from "react-redux";
import * as NodeActions from "@river_boyne/valid_flow_producer_core/src/nodes/redux/actions";
import { useNode } from "../../hooks";

export interface IReturnKeyInput {
  nodeID: string;
}
export default function ReturnKeyInput(props: IReturnKeyInput) {
  const node = useNode(props.nodeID);
  const dispatch = useDispatch();
  const [useReturnKey, setUseReturnKey] = useState(
    node ? !!node.returnKey : false
  );
  if (!node) {
    return <React.Fragment />;
  }
  let fieldDisplay;
  if (useReturnKey) {
    fieldDisplay = (
      <TextField
        id="return_key"
        label="Return Key"
        onChange={e =>
          dispatch(NodeActions.setReturnKey(props.nodeID, e.target.value))
        }
        value={node.returnKey}
      />
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Save Return Value?</FormLabel>
          <RadioGroup
            aria-label="save_return"
            name="save_return"
            value={useReturnKey ? "yes" : "no"}
            onChange={e => setUseReturnKey(e.target.value === "yes")}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        {fieldDisplay}
      </Grid>
    </Grid>
  );
}
