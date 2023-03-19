import React from "react";
import ChatPage from "./components/ChatPage";
import Header from "./components/Header";
import styled from 'styled-components'

const App = () => {
  return <Container>
    <Header/>
    <ChatPage/>
  </Container>;
};

const Container = styled.div`
border:1px solid red;
height :100vh;
width :80vw;
margin:0 auto;


`

export default App;
