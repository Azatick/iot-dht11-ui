import { css } from "@emotion/core";
import styled from "@emotion/styled";

export const Button = styled.button`
  border: none;
  background: none;
  outline: none;
  font-size: 14px;
  padding: 8px 16px;
  color: white;
  line-height: 1;
  transition: background 0.5s;
  cursor: pointer;
  ${({ theme }) => css`
    background: ${theme.primary};
    &:hover {
      background: ${theme.light};
    }
  `}
  ${({ active, theme }) =>
    active &&
    css`
      background: ${theme.light};
    `}
`;

export const ButtonGroup = styled.div`
  & > button {
    margin-right: 1px;
  }
  button:first-child {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  button:last-child {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
`;

export default Button;
