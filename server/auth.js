/*const passport = require('passport');
const axios = require('axios');
const { Strategy: DiscordStrategy } = require('passport-discord');
const express = require('express');
const session = require('express-session');
const { clientID, clientSecret, callbackURL,token } = require('../config.json');
const BOT_TOKEN = token; // Remplacez par le token de votre bot


const router = express.Router();

passport.use(new DiscordStrategy({
    clientID,
    clientSecret,
    callbackURL,
    scope: ['identify', 'email', 'guilds']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Discord profile:', profile);
        return done(null, profile);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

router.use(session({
    secret: 'some secret key',
    resave: false,
    saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());

router.get('/auth/discord', (req, res, next) => {
    console.log('Starting authentication process');
    next();
}, passport.authenticate('discord'));

router.get('/auth/discord/callback', (req, res, next) => {
    console.log('Received callback from Discord');
    next();
}, passport.authenticate('discord', {
    failureRedirect: '/'
}), (req, res) => {
    console.log('Authentication successful');
    res.redirect('/dashboard');
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/dashboard', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    const user = req.user;
    const userGuilds = user.guilds || [];

    try {
        // Récupérer les guilds où le bot est présent
        const botGuildsResponse = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`
            }
        });
        const botGuilds = botGuildsResponse.data;

        // Filtrer les guilds où l'utilisateur a les permissions nécessaires et où le bot est présent
        const filteredGuilds = userGuilds.filter(userGuild => {
            const isBotInGuild = botGuilds.some(botGuild => botGuild.id === userGuild.id);
            const hasManageGuildPermission = (userGuild.permissions & (1 << 5)) !== 0; // 1 << 5 corresponds to MANAGE_GUILD permission
            return isBotInGuild || hasManageGuildPermission;
        });

        // Générer la page HTML avec les guilds filtrés
        const guildList = filteredGuilds.map(guild => {
            const iconURL = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : '';
            return `<li><img src="${iconURL}" alt="${guild.name} icon" width="32" height="32"> ${guild.name} ${guild.channels}</li>`;
        }).join('');

        const html = `
            <h1>Bienvenue, ${user.username}!</h1>
            <h2>Vos serveurs Discord:</h2>
            <ul>${guildList}</ul>
            <a href="/logout">Se déconnecter</a>
        `;
        res.send(html);
    } catch (error) {
        console.error('Failed to fetch bot guilds:', error);
        res.status(500).send('Une erreur est survenue lors de la récupération des serveurs.');
    }
});


module.exports = router;*/
