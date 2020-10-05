import { observable } from "mobx";
import { observer, useAsObservableSource } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { SimModel } from "../models/sim";
import { filterNil } from "../utils/array";

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
    const [watchedVars] = React.useState(observable.set<string>());

    const defs = filterNil([...watchedVars].map(n => sim.getData(n)));

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
                    <tr>
                        <td>Name</td>
                        <td>Value</td>
                        <td>Text</td>
                        <td>Units</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {defs.map(def => (
                        <tr key={def.name}>
                            <td>{def.name}</td>
                            <td>{def.value.toFixed(5)}</td>
                            <td>{def.text}</td>
                            <td>{def.units}</td>
                            <td>
                                <button onClick={() => watchedVars.delete(def.name)}>X</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </MyTable>
        </React.Fragment>
    );

    function onAddName() {
        watchedVars.add(input);
        setInput("");
    }
});
