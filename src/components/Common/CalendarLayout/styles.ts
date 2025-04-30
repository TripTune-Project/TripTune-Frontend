import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  position: relative;
  width: 800px;
  background: #ffffff;
  border-radius: 30px 0 30px 0;
  padding: 20px;
  box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.3);
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #000;
`;

export const DetailTitle = styled.h2`
  display: flex;
  align-items: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

export const InputGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 16px;
    color: #333;
  }
`;

export const InputField = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #76adac;
  }
`;

export const DatePickerContainer = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: center;
`;

export const ConfirmButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #76adac;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #5d8c8b;
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`; 