import React, {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';
import TextField from '@material-ui/core/TextField';
import './App.css';


function App() {
  const [state, setState] = useState({message: '', name: ''})
  const [chat, setChat] = useState([])
  const socketRef = useRef()
  const messagesEndRef = useRef(null)

  useEffect(
		() => {
			socketRef.current = io.connect("http://localhost:4000")
			socketRef.current.on("message", ({ name, message }) => {
				setChat([ ...chat, { name, message } ])
			})
			scrollToBottom()
			return () => socketRef.current.disconnect()
		},
		[ chat ]
	)
  
  const scrollToBottom = () => {
	messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const onTextChange = (e) => {
    setState({...state, [e.target.name]: e.target.value})
  }

  const onMessageSubmit = (e) => {
    const {name, message} = state
    socketRef.current.emit('message', {name, message})
    e.preventDefault()
    setState({message: "", name: name})
  }

  const renderChat = () => {
    return chat.map(({name, message}, index) => (

        <h3 key={index}>{name}: <span>{message}</span></h3>

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
