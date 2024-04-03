const express = require('express');
const app = express();
app.use(express.static(__dirname + "/public"));

app.set("views", __dirname + "/views");
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");

const server = app.listen(1337);
const io = require('socket.io')(server);
    

app.get('/',(requset,response)=>{
    response.render('index');
});

//Server variables ----------------------------
var word;
var answer_logs = [];
// ------------------------------------ --------
//Server functions ----------------------------
function random_word() {
    let word_list = ['socket','express','nodejs'];
    let word_guess = ['s _ _ k _ _', 'e _ _ r _ s _', '_ _ _ e _ s'];
    let random = Math.floor(Math.random() * (2-0));
    return {word: word_list[random], guess: word_guess[random]};
}
// --------------------------------------------
io.on('connection',(socket) => {
    //First connection == new user
    socket.emit('new_user',answer_logs);
    word = random_word();
    io.emit('start_event_game',word);
    socket.on('player_guessed',data => {
        answer_logs.push(data.log);
        io.emit('log_answer',data.log); 
        if(data.guess == word.word) {
            console.log(socket.id, ' guessed the word "' + word.word + '".');
            let win_log = '<p class="winner"> ' + data.name + ' won! "' + data.guess + '" is the exact word! </p>';
            io.emit('player_won',win_log);
            answer_logs.push(win_log);
        }
    });
});