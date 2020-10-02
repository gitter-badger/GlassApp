import * as React from "react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

export interface CollapseHeadingProps {
    defaultCollapsed?: boolean;
    width: number;
    children: React.ReactNode | React.ReactNode[];
}

const RootDiv = styled.div`
    display: grid;
    grid-template-columns: 32px 1fr;
    transition: width 500ms;
`;

const MyIcon = styled(FontAwesomeIcon)<{ collapsed?: boolean }>`
    transform: ${p => (p.collapsed ? "rotate(180deg)" : "rotate(0deg)")};
    margin-left: 4px;
`;

const ContentDiv = styled.div<{ dragging?: boolean }>`
    overflow: hidden;
    resize: horizontal;

    ${p => !p.dragging && "transition: transform 250ms"};
`;

const MyHeading = styled.div<{ collapsed?: boolean }>`
    padding: 4px 8px;
    background-color: hsl(0, 0%, 30%);
    color: white;

    border-radius: 16px 0px 0px 16px;

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
    const [width, setWidth] = React.useState(props.width);

    return (
        <RootDiv>
            <MyHeading collapsed={collapsed} onClick={() => setCollapsed(p => !p)}>
                <MyIcon collapsed={collapsed} icon={faChevronRight} />
            </MyHeading>
            <ContentDiv style={{ width: collapsed ? 0 : Math.ceil(width) }}>
                {props.children}
            </ContentDiv>
        </RootDiv>
    );
}
