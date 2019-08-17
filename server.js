const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

// icones de cada plataforma, para ser usado como CDN
app.use('/imgs', express.static(__dirname + '/img'));

// Routes
app.get('/api/:plataforma/:nick', async (req, res) => {
    const { plataforma, nick } = req.params;
    var rd = {};

    // resposta da apic TrackerNetwork
    const TRNres = await axios
    .get(`https://api.fortnitetracker.com/v1/profile/${plataforma}/${nick}`,{
        headers: {
            'TRN-Api-Key': process.env.TRN_Api_Key
        }
    });

    // os dados vem na variavel.data
    const data = TRNres.data;

    // Configurando dados para retorno da API
    rd.nickName = data.epicUserHandle;
    rd.platformName = data.platformName;
    rd.iconURL = `${process.env.CDN_URL}/imgs/${data.platformName}.png`;
    rd.matchesPlayed = data.lifeTimeStats[7].value;
    rd.wins = data.lifeTimeStats[8].value
    rd.winRate = data.lifeTimeStats[9].value;
    rd.kills = data.lifeTimeStats[10].value;
    rd.kdr = data.lifeTimeStats[11].value;

    // Envia os dados formatados
    res.json(rd);
});

const port = process.env.PORT || 3000;
app.listen(port, console.log(`Server running on: http://localhost:${port}`));