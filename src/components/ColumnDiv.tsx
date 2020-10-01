import styled from "styled-components";
import { flexSpacing } from "../utils/style";

export default styled.div`
    display: flex;
    flex-direction: row;

    ${flexSpacing(4, "row")}

    * {
        flex-grow: 1;
    }
`;
