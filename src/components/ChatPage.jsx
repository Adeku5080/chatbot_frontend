import React, { useEffect, useState } from 'react'
import styled from "styled-components"
import axios from "axios"

const ChatPage = () => {
  const [currentAction, setCurrentAction] = useState('1');
  const [messages, setMessages] = useState([]);
  const [inputIsAction, setInputIsAction] = useState(true);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const BASE_URL = 'https://ali-chatbot-api.onrender.com';
  const startOptions = `
    <ul>
      <li>Type <strong>1</strong> to place an order</li>
      <li>Type <strong>99</strong> to checkout order</li>
      <li>Type <strong>98</strong> to see order history</li>
      <li>Type <strong>97</strong> to see current order</li>
      <li>Type <strong>0</strong> to cancel order</li>
    </ul>
  `;
  let loaded = false;

  const addToMessage = (message, isBot = true) => {
    setMessages((prev) => {
      const allMessages = [
        ...prev,
        {
          isBot,
          body: message,
        }
      ];

      // update message in local storage.
      localStorage.setItem('messages', JSON.stringify(allMessages));

      return allMessages;
    });
  }

  const initiateChat = async() => {
    const deviceId = localStorage.getItem("deviceId")
    if(!deviceId){
     const {data:{device}} = await axios.post(`${BASE_URL}/api/v1/device`,{
      name : 'device'
     })
      localStorage.setItem('deviceId', device._id)
    }
    const storedMessages = localStorage.getItem('messages');

    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    addToMessage(`Welcome, how may I serve you? ${startOptions}`);
  }

  const transformToItemTable = (data) => {
    let table = `
      <table>
        <th>
          <tr>
            <td>Code</td> <td>Name</td> <td>Price</td>
          </tr>
        </th>
    `;

    for (const datum of data) {
      table += `
        <tr>
          <td>${datum.code}</td> <td>${datum.name}</td> <td>${datum.price}</td>
        </tr>
      `;
    }

    table += '</table>';

    return `Select one or more of the items in the table below by typing the product codes and separating with a comma e.g (1,2 or 1):<br>${table}`;
  }

  const transformCurrentOrder = (data) => {
    const prefix = `Your current order with order number <strong>${data.id}</strong> has the following products:`;

    let total = 0;
    let table = `
      <table>
        <th>
          <tr>
            <td>Code</td> <td>Name</td> <td>Price</td>
          </tr>
        </th>
    `;

    for (const datum of data.items) {
      table += `
        <tr>
          <td>${datum.id}</td> <td>${datum.name}</td> <td>${datum.price}</td>
        </tr>
      `;

      total += Number(datum.price);
    }

    table += `
        <tr>
          <td colspan='3'>${total}</td>
        </tr>
      </table>
    `;

    return `${prefix} <br><br> ${table} <br> <br> What more can I do for you? <br> ${startOptions}`;
  }

  const transformOrderHistory = (data) => {
    let message = `You have ${data.length} order(s). They are: <br><ul>`;

    for (const datum of data) {
      message += `<li>${datum.id} - ${datum.items.length} product(s)</li>`;
    }

    message += '</ul>';

    return `${message}<br> <br> What more can I do for you? <br> ${startOptions}`;
  }

  const handleResponse = ({ action, data }) => {
    setCurrentAction(action);

    console.log(action,data)

    let message = 'Welcome, how may I serve you?';

    switch (action) {
      case '1':
        message = (data?.message || message) + startOptions;
        setInputIsAction(true);
        break;
      case '1-res':
        message = transformToItemTable(data);

        setInputIsAction(false);
        setCurrentAction('1-res');
        break;

      case '97-res':
        message = transformCurrentOrder(data);

        setInputIsAction(true);
        setCurrentAction('1');
        break;
      case '98-res':
        message = transformOrderHistory(data);

        setInputIsAction(true);
        setCurrentAction('1');
        break;
      default:
        message += startOptions;
        setInputIsAction(true);
        setCurrentAction('1');
    }

    addToMessage(message);
  }

  /**
   * Todo: replace with actual API call.
   * 
   * @param {Object} body 
   * @returns 
   */
  // const createResponse = (body) => {
  //   const sampleProducts = [
  //     {
  //       id: 1,
  //       name: 'Pounded Yam',
  //       price: 300,
  //     },
  //     {
  //       id: 2,
  //       name: 'Jollof Rice',
  //       price: 400,
  //     },
  //   ];

  //   switch (body.action) {
  //     case '0':
  //       return {
  //         body: {
  //           action: '1',
  //         }
  //       }
  //     case '1':
       
  //       return {
  //         body: {
  //           action: '1-res',
  //           data: sampleProducts,
  //         }
  //       }
  //     case '1-res':
  //       const items = String(body.userInput).split(',');

  //       if (!items.length) {
  //         return {
  //           body: {
  //             action: '1',
  //             data: {
  //               message: 'No order to place. Please, try again by selecting any of the options below:',
  //             }, 
  //           }
  //         }
  //       }

  //       console.log({ items });

  //       return {
  //         body: {
  //           action: '1',
  //           data: {
  //             message: 'Order Created. What more can I do for you?',
  //           },
  //         }
  //       }
  //     case '97':
  //       return {
  //         body: {
  //           action: '97-res',
  //           data: {
  //             id: 1,
  //             items: sampleProducts,
  //           }
  //         }
  //       }
  //     case '98':
  //       return {
  //         body: {
  //           action: '98-res',
  //           data: [
  //             {
  //               id: 1,
  //               items: sampleProducts,
  //             },
  //             {
  //               id: 2,
  //               items: [sampleProducts[0]],
  //             }
  //           ],
  //         }
  //       }
  //     case '99':
  //       return {
  //         body: {
  //           action: '1',
  //           data: {
  //             message: 'Order placed. What more can I do for you?',
  //           },
  //         }
  //       }

  //     default:
  //       return {
  //         body: {
  //           action: '1',
  //         }
  //       }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = `${BASE_URL}/api/v1/chatbot`;
    const body = {
      action: inputIsAction ? textInput : currentAction,
      userInput: textInput,
    };

    // push the message to message-list.
    addToMessage(textInput, false);
    setIsProcessing(true);
    setTextInput('');

    // do API call
    // console.log({ url, body });

      const deviceId = localStorage.getItem("deviceId")

    const response = await axios.post(url,body,{
      headers:{"Authorization":`${deviceId}`}
    });
    
  
    console.log(response.data,'response');
    // await new Promise(resolve => setTimeout(resolve, 2000));
    
    handleResponse(response.data);

    setIsProcessing(false);
  };

  const handleChange = (e) => {
    setTextInput(e.target.value);
  }

  useEffect(() => {
    if (loaded) {
      return;
    }

    loaded = true;
    initiateChat();
  }, []);

  return (
    <Container>
      <MessageContainer>
        {messages.map((message, index) => {
          return (
            <div key={index} className={'message-item ' + (message.isBot ? 'bot' : 'user')}
              dangerouslySetInnerHTML={{ __html: message.body }}></div>
          );
        })}

        <div className={'processing-status ' + (isProcessing ? 'show' : 'hide')}>bot is typing...</div>
      </MessageContainer>

      <InputContainer>
        <input type={inputIsAction ? 'number' : 'text'} placeholder="Type your response here" value={textInput} onChange={handleChange} />
        <button onClick={handleSubmit}>
          <img src="/svg/send.svg" alt="send" width={20} height={20} />
        </button>
      </InputContainer>
    </Container>
  )
}

const Container = styled.div`
  border:1px solid blue;
  width: 60vw;
  margin:0 auto;
  height: calc(100vh - 80px);
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: .5em;
  overflow-y: scroll;
  height: calc(100% - 50px);

  .message-item {
    width: 100%;
    max-width: 300px;
  }

  .message-item.bot {
    background: rgba(0, 0, 0, .5);
    align-self: flex-start;
  }

  .message-item.user {
    background: rgba(0, 0, 200, .5);
    align-self: flex-end;
  }

  .processing-status {
    text-align: center;
  }

  .processing-status.show {
    display: block;
  }

  .processing-status.hide {
    display: none;
  }
`;

const InputContainer = styled.div`
position:absolute;
bottom:10px;
display:flex;

// border:1px solid black;
width :50vw;
height:50px;
margin:0 auto;

input{
    border:1px solid red;
    width:100%;
    height:100%;
    border-radius:12px;
    margin:0 auto;
}

button{
  border:none;
  background:none;
}
`

export default ChatPage