import * as Immutable from "immutable";
import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { SimModel } from "../models/sim";

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
    const [watched, setWatched] = React.useState(Immutable.Map<string, number>());

    return (
        <React.Fragment>
            <h3>Event Triggers</h3>
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
                    <td></td>
                </thead>
                <tbody>
                    {watched.toArray().map(([name, value]) => {
                        return (
                            <tr key={name}>
                                <td>
                                    <button onClick={() => setWatched(p => p.delete(name))}>
                                        X
                                    </button>
                                </td>
                                <td>{name}</td>
                                <td>
                                    <input
                                        value={value}
                                        onChange={e =>
                                            setWatched(p => p.set(name, e.target.valueAsNumber))
                                        }
                                    ></input>
                                </td>
                                <td>
                                    <button onClick={() => sim.sendEvent(name, value)}>Go!</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </MyTable>
        </React.Fragment>
    );

    function onAddName() {
        setWatched(p => p.set(input, 0));
        setInput("");
    }
});
