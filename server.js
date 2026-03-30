let express = require('express')

let app = express()

let bodyParser = require('body-parser')

var session = require('express-session')


app.use(session({
  secret: 'azerty',
  resave: false,
  saveUninitialized: true,
  cookie: function (req) {
    var match = req.url.match(/^\/([^/]+)/);
    return {
      path: match ? '/' + match[1] : '/',
      httpOnly: false,
      secure: false,
      maxAge: 60000
    }
  }
}))

app.use(require('./middlewares/flash'))

//Nos Middleware

app.use(bodyParser.urlencoded())

app.use(bodyParser.json())

app.use('/assets', express.static('public'))

// Mon moteur engine

app.set('view engine', 'ejs')


// Mes routes


app.get('/', (request, response) => {
  let Message = require('./models/message');

  Message.all(function (messages) {
    if (!messages) {
      messages = [];
    }
    try {
      response.render('pages/index', { messages: messages });
    } catch (err) {
      response.send("Erreur template: " + err.message);
    }
  });
});


app.get('/messages/:id', (request, response) =>{

    let Message = require('./models/message')

    Message.find(request.params.id, function(message){

      response.render('messages/show', {message: message})

    })

})



app.post('/', (request, response) => {

  if (request.body.message === undefined || request.body.message === "") {

    request.flash('error', "Vous n'avez pas poster de message")

    response.redirect('/')


  } else {
    let Message = require('./models/message')

    Message.create(request.body.message);
    request.flash('success', "Merci pour votre message!!");
    response.redirect('/');
  }

})

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;