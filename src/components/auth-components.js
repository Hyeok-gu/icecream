import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 100px;
`;
export const Form = styled.form`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
export const Input = styled.input`
  height: 36px;
  padding: 0 16px;
  border-radius: 24px;
  border: 1px solid #ddd;
  &.createBtn {
    border: none;
    background-color: #222;
    color: #fff;
    border-radius: 24px;
    cursor: pointer;
  }
  &.createBtn:hover {
    background-color: #000;
  }
`;

export const Error = styled.span`
  margin-top: 6px;
  font-weight: 600;
  color: tomato;
`;

export const Switcher = styled.span`
  margin-top: 20px;
  font-size: 12px;
`;
