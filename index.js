const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const app = express();
const corsConfig = {
  origin: "*", 
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE"] 
};
app.use(cors(corsConfig)); 
app.use(express.json());



const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"] 
  }
});

// io.on('connection', (socket) => {
//   console.log('A user connected', socket.id);

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

const port = process.env.PORT || 3000;



const UserModel = require('./models/User');
const MessageModel = require('./models/Message');
const ConversationModel = require('./models/Conversation');

// const urlDB = "mongodb://localhost:27017/chatApp";
const urlDB ='mongodb+srv://ayoub:Ayoub200go@cluster0.pstwr7i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(urlDB,{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Database connection error", err);
});


app.get('/', (req, res) => {
  res.send("Hello World" );
});


let users = [];

io.on('connection', socket => {
  console.log('User Connected:', socket.id);

  socket.on('addUser', userId => {
    if (!users.some(user => user.userId === userId)) {
      users.push({ userId, socketId: socket.id });
    }
    io.emit('getUsers', users); 
  });

  socket.on('sendMessage', async({ senderId, receiverId, message, conversationId }) => {
    const receiver = users.find(user => user.userId === receiverId);
    const sender = users.find(user => user.userId === senderId);
    if (receiver) {
      const user = await UserModel.findOne({_id : senderId});
      io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
        senderId, message, conversationId, receiverId,user
      });


      //Notifications

      // await MessageModel.countDocuments({ conversationId: conversationId, receiverId: receiverId, isRead: false })
      // .then(count => {
      //   io.to(receiver.socketId).emit('notification', {
      //     unreadCount: count
      //   });
      // })
      // .catch(err => {
      //   console.error('Error counting unread messages for receiver:', err);
      // });

    }
  });

  socket.on('disconnect', () => {
    users = users.filter(user => user.socketId !== socket.id);
    io.emit('getUsers', users);
  });
});

function generateReference() {
  const min = 0;
  const max = 9999999999;
  const reference = Math.floor(Math.random() * (max - min + 1)) + min;
  return reference.toString().padStart(11, '0');
}

app.post('/register', async(req, res) => {
  const { username, email, name , image} = req.body;
  let errors = {};

  if (!username) {
    errors.username = "Username is required.";
  }
  if (!email) {
    errors.email = "Email is required.";
  }
  if (!req.body.password) {
    errors.password = "Password is required.";
  }
  if (!name) {
    errors.name = "Name is required.";
  }
  if(!image){
    errors.image="Image is required";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(404).json({ errors });
  }
  const reference = generateReference();


  if (username && email && req.body.password && name && reference && image) {
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(req.body.password, salt)
    await UserModel.create({ username, email, password, name, reference ,image})
      .then(user => {
        res.status(200).send("User registered successfully!")
      })
      .catch(err => {
        console.log("Error", err);
      })
  }
});




app.post('/login', async (req, res) => {
  const { email } = req.body;
  let errors = {};

  if (!email) {
    errors.email = "Email is required.";
  }
  if (!req.body.password) {
    errors.password = "Password is required.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(404).json({ errors });
  }
  if(email && req.body.password ){
    try {
      const user = await UserModel.findOne({email : email});
      if (user) {
        const correctPassword = await bcrypt.compare(req.body.password, user.password)
        if (correctPassword) {
          res.status(200).json({
            message:'Login successful',
            user:user
          });
        } else {
          res.status(404).json({message:'Invalid password'});
        }
      } else {
        res.status(404).json({message:'User not found'});
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  
});



app.put('/users/:userId/online', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { online } = req.body;
    const update = await UserModel.findByIdAndUpdate(userId, { online });
    if (update) {
      const user = await UserModel.findOne({_id : userId});
      res.status(200).json(user);
      
    }else{
      res.status(404)
    }
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.put('/users/:userId/logout', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { online } = req.body;
    await UserModel.findByIdAndUpdate(userId, { online });
    res.status(200).json('ok')
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.post('/conversation', async(req,res)=>{
  try{
    const {senderId ,receiverId}=req.body;
    const newConversation = new ConversationModel({members: [senderId, receiverId] });
    await newConversation.save();
    res.status(200).send('Conversation created successfully!');
  }catch(error){
    console.log("Error",error);
  }
})

app.get('/conversation/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await ConversationModel.find({ members: { $in: [userId] } });
    const conversationUserData = await Promise.all(conversations.map(async (conversation) => {
      const receiverId = conversation.members.find(member => member !== userId);
      const receiver = await UserModel.findById(receiverId);
      return {
        conversationId: conversation._id,
        receiver: receiver
      };
    }));
    res.status(200).json(conversationUserData);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post('/message', async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId } = req.body;
    if (conversationId === 'new' && receiverId) {
      const newConversation = new ConversationModel({ members: [senderId, receiverId] });
      await newConversation.save();
      const newMessage = new MessageModel({ conversationId: newConversation._id, senderId ,receiverId:receiverId, message});
      await newMessage.save();
      return res.status(200).send('Message sent Successfully');
    } else if (!conversationId && !receiverId) {
      return res.status(400).send('Please provide either a conversation Id or a Receiver Id');
    }
    const newMessage = new MessageModel({ conversationId, senderId ,receiverId:receiverId, message });
    await newMessage.save();
    res.status(200).send('Message sent Successfully');
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




app.get('/message/:conversationId', async (req, res) => {
  try {
    const checkMessages = async(conversationId)=>{
      const messages = await MessageModel.find({ conversationId }); 
      const messageUserData = await Promise.all(messages.map(async (message) => {
        const user = await UserModel.findById(message.senderId);
        return {
          user: user,
          message: message.message,
          conversationId: conversationId
        };
      }));
      res.status(200).json(messageUserData);
    }

    const conversationId = req.params.conversationId;
    if(conversationId === 'new'){
      const checkConversation = await ConversationModel.find({members:{$all: [req.query.senderId , req.query.receiverId]}})
      if(checkConversation.length > 0) {
        checkMessages(checkConversation[0]._id);
      }else{
        return res.status(200).json([]);
      }
      
    }else{
      checkMessages(conversationId)
    }
    
    
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});






app.get('/users', async (req, res) => {
  try {
    const users = await UserModel.find()
    const userData = await Promise.all(users.map(async (user) => {
      return user
    }));
    res.status(200).json(userData)
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get('/users/:userId', async (req, res) => {
  try {
    const userId =  req.params.userId;
    const users = await UserModel.find({_id:{ $ne: userId}})
    const userData = await Promise.all(users.map(async (user) => {
      return user
    }));
    res.status(200).json(userData)
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});










