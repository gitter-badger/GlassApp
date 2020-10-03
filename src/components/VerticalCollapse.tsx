import * as React from "react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

export interface CollapseHeadingProps {
    title: string;
    defaultCollapsed?: boolean;
    children: React.ReactNode | React.ReactNode[];
}

const MyIcon = styled(FontAwesomeIcon)<{ collapsed?: boolean }>`
    transition: transform 250ms;
    transform: ${p => (p.collapsed ? "rotate(0deg)" : "rotate(90deg)")};
    margin-left: 4px;
`;

const MyHeading = styled.div<{ collapsed?: boolean }>`
    padding: 4px 8px;
    background-color: hsl(0, 0%, 30%);
    color: white;
    user-select: none;
    cursor: pointer;

    border-radius: ${p => (p.collapsed ? "16px 16px 16px 16px" : "16px 16px 2px 2px")};

    :hover {
        background-color: hsl(0, 0%, 50%);
    }

    h3 {
        margin: 0;
        margin-left: 8px;
        padding: 0;
    }

    display: flex;
    flex-direction: row;
    align-items: center;
`;

export default function (props: CollapseHeadingProps): JSX.Element {
    const [collapsed, setCollapsed] = React.useState(props.defaultCollapsed ?? false);

    return (
        <React.Fragment>
            <MyHeading collapsed={collapsed} onClick={() => setCollapsed(p => !p)}>
                <MyIcon collapsed={collapsed} icon={faChevronRight} />
                <h3>{props.title}</h3>
            </MyHeading>
            {renderChildren()}
        </React.Fragment>
    );

    function renderChildren() {
        if (collapsed) return null;
        return props.children;
    }
}
