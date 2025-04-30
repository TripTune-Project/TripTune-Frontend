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

export const ModalContent = styled.div`
  position: relative;
  width: 503px;
  height: 550px;
  background: #ffffff;
  border-radius: 30px 0 30px 0;
  box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.3);
  overflow: hidden;
`;

export const DeactivateHeader = styled.div`
  position: relative;
  width: 503px;
  height: 72px;
  z-index: 16;
`;

export const Rectangle = styled.div`
  position: absolute;
  width: 503px;
  height: 72px;
  top: 0;
  left: 0;
  background: #ffffff;
  border-radius: 30px 0 0 0;
`;

export const Title = styled.div`
  position: absolute;
  top: 50%;
  left: 37px;
  transform: translate(0, -50%);
  display: flex;
  align-items: center;
`;

export const AccountWithdraw = styled.span`
  margin-left: 10px;
  font-size: 20px;
  font-weight: 400;
  color: #000000;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #000;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 0;
`;

export const Info = styled.div`
  position: relative;
  width: 429px;
  margin: 26px auto;
  font-size: 15px;
  line-height: 18px;
  color: #000000;
`;

export const Card = styled.div`
  position: relative;
  width: 429px;
  height: 155px;
  margin: 14px 0;
  background: rgba(237, 249, 247, 0.3);
  border: 2px solid #76adac;
  border-radius: 10px;
  color: #333333;
  font-size: 11px;
  line-height: 23px;
`;

export const PasswordSection = styled.div`
  position: relative;
  width: 429px;
  margin: 29px auto;
`;

export const PasswordLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 8px;
`;

export const PasswordNotice = styled.div`
  font-size: 10px;
  color: #f86c6c;
  margin-bottom: 10px;
`;

export const PasswordInput = styled.div`
  position: relative;
  width: 429px;
  height: 40px;
  margin-top: 9px;
  border: 1px solid #838282;
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 0 10px;
`;

export const InputField = styled.input`
  width: 100%;
  border: none;
  outline: none;
  font-size: 14px;
`;

export const DeactivateButton = styled.button`
  position: relative;
  width: 429px;
  height: 40px;
  margin: 15px auto;
  cursor: pointer;
  background: #76adac;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  border: none;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #5d8c8b;
  }
`;

export const LitsItem = styled.li`
  margin-top: 12px;
  margin-left: 20px;
  line-height: 1.6;
`;

export const LitsItemLast = styled.div`
  margin-top: 12px;
  margin-left: 35px;
  line-height: 1.6;
`; 