const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const { Client, GatewayIntentBits } = require('discord.js');
const { clientID, clientSecret, callbackURL,token  } = require('../config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.login(token).catch(err => console.error("Failed to login:", err));

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour parser les corps de requêtes JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy({
  clientID,
  clientSecret,
  callbackURL,
  scope: ['identify', 'guilds']
}, (accessToken, refreshToken, profile, done) => {
  process.nextTick(() => done(null, profile));
  try {
    console.log('Discord profile:', profile);
    return done(null, profile);
  } catch (error) {
      return done(error);
  }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// Route pour envoyer un message
app.post('/send-message', ensureAuthenticated, (req, res) => {
  const { channelID, message } = req.body;

  if (!channelID || !message) {
      return res.status(400).send('Channel ID and message are required');
  }

  const channel = client.channels.cache.get(channelID);
  if (!channel) {
      return res.status(404).send('Channel not found');
  }

  channel.send(message)
      .then(() => res.status(200).send('Message sent'))
      .catch(error => res.status(500).send(`Error sending message: ${error.message}`));
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

app.get('/dashboard', ensureAuthenticated, async (req, res) => {
  const guilds = req.user.guilds.filter(guild => (guild.permissions & 0x20) === 0x20); // Check if user has 'MANAGE_GUILD' permission
  const channelNameClick = null;
  res.render('dashboard', { user: req.user, guilds: guilds, channelNameClick });
});

app.get('/guilds/:id/channels', ensureAuthenticated, async (req, res) => {
  const guild = await client.guilds.fetch(req.params.id);
  const channels = guild.channels.cache;

  const categories = channels
      .filter(channel => channel.type === 4) // Guild category
      .sort((a, b) => a.rawPosition - b.rawPosition)
      .map(category => ({
          id: category.id,
          name: category.name,
          type: 'category',
          children: []
      }));

  const textChannels = channels
      .filter(channel => channel.type === 0) // Guild text
      .sort((a, b) => a.rawPosition - b.rawPosition)
      .map(channel => ({
          id: channel.id,
          name: channel.name,
          type: 'text',
          parentID: channel.parentId
      }));

  const voiceChannels = channels
      .filter(channel => channel.type === 2) // Guild voice
      .sort((a, b) => a.rawPosition - b.rawPosition)
      .map(channel => ({
          id: channel.id,
          name: channel.name,
          type: 'voice',
          parentID: channel.parentId
      }));

  const organizedChannels = [...categories];

  textChannels.forEach(channel => {
      const category = organizedChannels.find(c => c.id === channel.parentID);
      if (category) {
          category.children.push(channel);
      } else {
          organizedChannels.push(channel);
      }
  });

  voiceChannels.forEach(channel => {
      const category = organizedChannels.find(c => c.id === channel.parentID);
      if (category) {
          category.children.push(channel);
      } else {
          organizedChannels.push(channel);
      }
  });

  res.json(organizedChannels);
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});