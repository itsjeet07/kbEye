import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
* , body{
  box-sizing: border-box;
}
body, html {
  min-width: 100%;
  min-height: 100vh;
  margin: 0;
  height: 100%;
  
}
html {
  background-repeat: no-repeat, repeat;
  //background-image: linear-gradient(to bottom, hsla(210, 20%, 98%, 67%), hsla(210, 20%, 96%, 67%));
  /* background-image: radial-gradient(circle at 55% 1%, #303335, #212427 117%), url(./noise.png); */
}
body {
  font-family: Monorale, Hiragino Sans, "ヒラギノ角ゴシック", Hiragino Kaku Gothic ProN, "ヒラギノ角ゴ ProN W3", Roboto, YuGothic, "游ゴシック", Meiryo, "メイリオ", sans-serif;
  color: hsl(0, 0%, 50%);
}
#root {
  height: 100%;
}
:disabled {
  background: #fafafa;
}
`;

export default GlobalStyle;