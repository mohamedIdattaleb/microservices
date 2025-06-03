const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE ||
    4001;
const mongoose = require("mongoose");
const Commande = require("./Commande");
const axios = require('axios');
//Connexion à la base de données
mongoose.set('strictQuery', true);
mongoose.connect(
    "mongodb://localhost/commandeservice",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
        console.log(`Commande-Service DB Connected`)
);
app.use(express.json());

function prixTotal(produits) {
    let total = 0;
    for (let t = 0; t < produits.length; ++t) {
        total += produits[t].prix;
    }
    console.log("prix total :" + total);
    return total;
}

async function httpRequest(ids) {
    try {
        const URL = "http://localhost:4000/produit/acheter"
        const response = await axios.post(URL, { ids: ids }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return prixTotal(response.data);
    } catch (error) {
        console.error(error);
    }
}
app.post("/commande/ajouter", async (req, res, next) => {
    
    const { ids, email_utilisateur } = req.body;
    httpRequest(req.body.ids).then(total => {
        const newCommande = new Commande({
            produits:ids,
            ids,
            email_utilisateur: email_utilisateur,
            prix_total: total,
        });
        res.
        newCommande.save()
            .then(commande => res.status(201).json(commande))
            .catch(error => res.status(400).json({ error }));
    });
});
app.listen(PORT, () => {
    console.log(`Commande-Service at ${PORT}`);
});