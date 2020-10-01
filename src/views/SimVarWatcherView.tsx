import { observer } from "mobx-react";
import * as React from "react";
import BoolSimToggle from "../components/SimVarToggle";
import SimKeyValue from "../components/SimKeyValue";
import { SimModel } from "../models/sim";
import { arrRange, filterNil } from "../utils/common";
import * as Immutable from "immutable";
import styled from "styled-components";

export interface WatcherViewProps {
    sim: SimModel;
}

const MyTable = styled.table`
    tr {
        border: 1px solid black;
    }
`;

export default observer((props: WatcherViewProps) => {
    const { sim } = props;

    const [input, setInput] = React.useState("");
    const [watchedVars, setWatchedVars] = React.useState(Immutable.Set<string>());

    const defs = filterNil(watchedVars.toArray().map(n => sim.getData(n)));

    return (
        <React.Fragment>
            <h3>Watcher</h3>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Add simvar name to watch..."
                type="text"
            />
            <button onClick={onAddName}>+</button>
            <MyTable>
                <thead>
                    <td>Name</td>
                    <td>Value</td>
                    <td>Text</td>
                    <td>Units</td>
                    <td></td>
                </thead>
                <tbody>
                    {defs.map(def => (
                        <tr key={def.name}>
                            <td>{def.name}</td>
                            <td>{def.value.toFixed(5)}</td>
                            <td>{def.text}</td>
                            <td>{def.units}</td>
                            <td>
                                <button onClick={() => setWatchedVars(p => p.remove(def.name))}>
                                    X
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </MyTable>
        </React.Fragment>
    );

    function onAddName() {
        setWatchedVars(p => p.add(input));
        setInput("");
    }
});
