import React, {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';
import TextField from '@material-ui/core/TextField';
import './App.css';
import randomColor from 'randomcolor';

function App() {
  const [state, setState] = useState({message: '', name: '', color: ''})
  const [chat, setChat] = useState([])
  const socketRef = useRef()
  const messagesEndRef = useRef(null)

  useEffect(
		() => {
			socketRef.current = io.connect("http://localhost:4000")
			socketRef.current.on("message", ({ name, message, color }) => {
				setChat([ ...chat, { name, message, color } ])
			})
			scrollToBottom()
			return () => socketRef.current.disconnect()
		},
		[ chat ]
	)
  
  const scrollToBottom = () => {
	messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const onTextChange = async(e) => {
	setState({...state, [e.target.name]: e.target.value});
  }

 
  const onMessageSubmit = (e) => {
	var currentColor = state.color;
    const {name, message} = state
	if (currentColor === '') {
		currentColor = randomColor({luminosity: 'dark'});
		
	}
    socketRef.current.emit('message', {name: name, message: message, color: currentColor})
    e.preventDefault()
    setState({message: "", name: name, color: currentColor})
  }

  const renderChat = () => {
    return chat.map(({name, message, color}, index) => (
		
        <h3 className="chat-message" style={message.includes("@" + state.name) ? {backgroundColor: "#9147FF", color: "white"} : {color: color}} key={index}>{name}: <span style={message.includes("@" + state.name) ? {color: "white"} : {color: "black"}}>{message}</span></h3>

    ))
  }


  return (
		<div className="card">		
			<div className="chat">
			<h1 className="title">Chat Log</h1>
			<div className="render-chat">
				
				{renderChat()}
				<div ref={messagesEndRef} />
			</div>
			<form onSubmit={onMessageSubmit}>
				<div className="message-field">
					<TextField variant="outlined" size="small" name="name" onChange={(e) => onTextChange(e)} value={state.name} label="Name" />
				</div>
				<div className="message-field">
					<TextField
						name="message"
						onChange={(e) => onTextChange(e)}
						value={state.message}
						id="outlined-multiline-static"
						variant="outlined"
						label="Message"
						size="small"
					/>
				</div>
				<button>Send Message</button>
			</form>	
			</div>
		</div>
	)
}

export default App;
