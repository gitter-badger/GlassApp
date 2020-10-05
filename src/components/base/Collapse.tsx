import * as React from "react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled, { css } from "styled-components";

interface BaseCollapseProps {
    header: React.ReactNode;
    collapsed?: boolean;
    onChange?(collapsed: boolean): void;
}

interface CollapsePropsWithNoContentProps extends BaseCollapseProps {
    props?: undefined;
    content(): JSX.Element;
}

interface CollapsePropsWithContentProps<P extends {}> extends BaseCollapseProps {
    props: P;
    content(props: P): JSX.Element;
}

export type CollapseProps<P extends {}> =
    | CollapsePropsWithNoContentProps
    | CollapsePropsWithContentProps<P>;

const CollapseIcon = styled(FontAwesomeIcon)<{ collapsed?: boolean }>`
    transition: transform 250ms;
    transform: ${p => (p.collapsed ? "rotate(0deg)" : "rotate(90deg)")};
    margin-left: 4px;
`;

const HeadingCollapsedStyle = css`
    border-radius: 24px 24px 2px 2px;
`;

const Heading = styled.div<{ collapsed?: boolean }>`
    padding: 8px;
    background-color: hsl(0, 0%, 30%);
    color: white;
    user-select: none;
    cursor: pointer;

    border-radius: 24px;
    ${p => !p.collapsed && HeadingCollapsedStyle}

    :hover {
        background-color: hsl(0, 0%, 50%);
    }

    h3 {
        margin: 0;
        margin-left: 8px;
        padding: 0;
    }

    height: 24px;
    margin-bottom: 8px;

    display: flex;
    flex-direction: row;
    align-items: center;
`;

export default React.memo(<P extends {}>(props: CollapseProps<P>) => {
    const [collapsed, setCollapsed] = React.useState(props.collapsed ?? false);

    // If controlled `collapsed` changes, keep track of it.
    React.useEffect(() => {
        if (props.collapsed == null) return;
        setCollapsed(props.collapsed);
    }, [props.collapsed]);

    // Prefer controlled state.
    const isCollapsed = props.collapsed ?? collapsed;

    const onToggle = React.useCallback(() => {
        props.onChange?.(!isCollapsed);
        setCollapsed(!isCollapsed);
    }, [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        props.onChange,
        isCollapsed,
    ]);

    return (
        <React.Fragment>
            <Heading collapsed={isCollapsed} onClick={onToggle}>
                <CollapseIcon collapsed={isCollapsed} icon={faChevronRight} />
                <h3>{props.header}</h3>
            </Heading>
            {!isCollapsed && <props.content {...(props.props as P)} />}
        </React.Fragment>
    );
});
