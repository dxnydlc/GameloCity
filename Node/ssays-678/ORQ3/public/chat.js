
const socket = io('https://ssays-orquesta.com:8444/');

// DOM elementos
let message 	= document.getElementById('message');
let username 	= document.getElementById('username');
let send 		= document.getElementById('send');
let output 		= document.getElementById('output');
let actions 	= document.getElementById('actions');


send.addEventListener('click', function(){
	console.log('>>>>>>> mandando chat!');
	socket.emit('chat:message',{
		message: message.value,
		username: username.value,
		dni: $dniU, 'idU': $idU,moduloU:$moduloU,appU:$appU
	});
});

message.addEventListener('keypress',function(){
	socket.emit('chat:typing',username.value);
});

socket.on('chat:message', function( data ){
	actions.innerHTML = '';
	output.innerHTML += `<p>
		<strong>${data.username}</strong> ${data.message}
	</p>`;
});


socket.on('chat:typing', function( data ){
	actions.innerHTML = `<p><em>${data} esta escribiendo...</em></p>`;
});

