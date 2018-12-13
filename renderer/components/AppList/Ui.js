import Styled from 'styled-components/native';

export const Container = Styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: flex-start;
  padding-left: 10px;
  background-color: transparent;
`;

export const List = Styled.FlatList`
  min-width: 100vw;
  min-height: 100vh;
  overflow: visible;
  background-color: transparent;
`;
