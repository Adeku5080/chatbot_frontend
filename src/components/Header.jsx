import React from 'react'
import styled from 'styled-components'

const Header = () => {
  return (
    <Container>
        <div>Restaurant-ChatBot</div>
    </Container>

  )
}

const Container = styled.div`
width:80vw;
height:80px;
background:green;
color:white;
display:flex;
align-items:center;
`
export default Header