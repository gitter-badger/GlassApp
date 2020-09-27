import * as React from "react";
import styled from "styled-components";
import { mapIfExists } from "../utils/common";

export interface Tab {
    key: string;
    name: string;
    render(): JSX.Element;
}

export interface TabsProps {
    tabs: Tab[];
    activeTab?: string;
    onTabSelect(key: string): void;
}

const TabButtonDiv = styled.div`
    display: flex;
    flex-direction: row;
`;

export default function Tabs(props: TabsProps) {
    const activeTab = mapIfExists(props.activeTab, key => props.tabs.find(tab => tab.key === key));

    return (
        <React.Fragment>
            <TabButtonDiv>
                {props.tabs.map(tab => (
                    <button
                        disabled={tab.key === props.activeTab}
                        key={tab.key}
                        onClick={() => props.onTabSelect(tab.key)}
                    >
                        {tab.name}
                    </button>
                ))}
            </TabButtonDiv>
            {activeTab?.render()}
        </React.Fragment>
    );
}
