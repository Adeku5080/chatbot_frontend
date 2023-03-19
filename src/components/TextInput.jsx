import React , {useState,useEffect}from 'react'
import styled from 'styled-components'
import axios from 'axios'

const TextInput = ({onButtonClick}) => {
  const [text,setText] = useState('')

  const handleSubmit = async (e)=>{
     e.preventDefault()
      const {data:{menuItems}}   = await axios.post("http://localhost:8080/api/v1/chatbot",{
      action: text
    })
    console.log(menuItems)
  }



  const handleChange = (e)=>{
    setText(e.target.value)
    // console.log(N(text,"adeku")
  }

  return (
    <Container>
        <input type='number' placeholder="Type your response here" value={text} onChange={handleChange}/>
        <button onClick={onButtonClick}>send</button>
    </Container>
  )
}

const Container = styled.div`

`

export default TextInput