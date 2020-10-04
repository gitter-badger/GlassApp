import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import Button from "../components/base/Button";
import { AppModel } from "../models/app";
import { ACTIVE_COLOR } from "../theme";

export interface GreetingViewProps {
    app: AppModel;
}

const RootDiv = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;

    background-color: white;

    display: flex;
    flex-direction: column;

    max-width: 500px;

    border: solid 2px ${ACTIVE_COLOR};

    transform: translate(-50%, -50%);

    box-shadow: 0px 0px 100px 20px hsla(0, 0%, 0%, 100%);
    border-radius: 32px;
    padding: 32px;

    z-index: 1000;

    h3 {
        margin: 0px;
        margin-bottom: 1em;
    }

    p {
        margin: 0px;
        margin-bottom: 1em;
    }
`;

const Success = styled.p`
    color: green;
    font-weight: bold;
`;

const Failure = styled.p`
    color: red;
    font-weight: bold;
`;

export default observer((props: GreetingViewProps) => {
    const { app } = props;

    // prettier-ignore
    return (
        <RootDiv>
            <h3>Welcome to Glass!</h3>
            <p>
                Glass is a secondary control and monitoring interface for Microsoft Flight Simulator
                2020.
            </p>
            <p>
                On a long flight and wanting to keep an eye on it while in the kitchen? Load up this
                app on a laptop, phone, or other device to keep an eye on the flight progress.
            </p>
            {app.sim.connected && (
                <React.Fragment>
                    <Success>
                        Good job! You seem to be connected to the sim!
                    </Success>
                </React.Fragment>
            )}

            {!app.sim.connected && (
                <React.Fragment>
                    <Failure>
                        You don't seem to be connected to the server.
                    </Failure>
                    <p>
                        You likely aren't running the GlassServer, which is a handy server and require to communicate with Flight Sim. Simply download the server and run it on the same computer as Flight Sim is running on.
                    </p>
                    <p>
                        You can download Glass Server <a href="https://github.com/russleyshaw/GlassServer/releases" rel="noreferrer" target="_blank">here</a>!
                    </p>
                </React.Fragment>
            )}

            <Button onClick={() => app.showGreeting.set(false)}>Dismiss</Button>
        </RootDiv>
    );
});
