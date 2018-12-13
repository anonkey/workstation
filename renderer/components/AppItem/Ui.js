import Styled from 'styled-components/native';

export const Icon = Styled.Image`
  border-radius: 10px;
  height: 30px;
  width: 30px;
`;

export const Container = Styled.TouchableOpacity`
  background-color: white;
  padding: 5px;
  border-radius: 20px;
  width: 40px;
  margin: 10px 0px 10px 0px;
`;

export const CountBadgeContainer = Styled.View`
  position: absolute;
  overflow: visible;
  z-index: 2;
  top: 0px;
  left: 25px;
`;
