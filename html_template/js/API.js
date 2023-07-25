// functions recup date / themes
// function askDate() {
//     let startDate = document.querySelector("#start").value;
//     console.log (startDate);
//     let endDate = document.querySelector("#end").value;
//     console.log (endDate);
//     } 

// function askTheme() {
//     let musique = document.querySelector("#musique");
//     let spectacle = document.querySelector("#spectacle");
//     let conference = document.querySelector("#conference");
//     let expo = document.querySelector("#expo");
   
//     dataEvents()
// }

// Fonction de récupération des data Naoned
async function dataEvents() {
    let startDate = document.querySelector("#start").value;
    console.log (startDate);
    let endDate = document.querySelector("#end").value;
    console.log (endDate);

    let musique = document.querySelector("#musique");
    let spectacle = document.querySelector("#spectacle");
    let conference = document.querySelector("#conference");
    let expo = document.querySelector("#expo");


    const response = await fetch('https://data.nantesmetropole.fr/api/records/1.0/search/?dataset=244400404_agenda-evenements-nantes-nantes-metropole&q=&rows=5000&start=0&sort=-date&facet=emetteur&facet=rubrique&facet=lieu&facet=ville&facet=lieu_quartier&exclude.rubrique=Sport&exclude.rubrique=Dialogue%20Citoyen&exclude.rubrique=Ev%C3%A9nements%20Emploi&exclude.ville=Saint%20Herblain&exclude.ville=Orvault&exclude.ville=Bouguenais&exclude.ville=Rez%C3%A9&exclude.ville=La%20Montagne&exclude.ville=Basse%20Goulaine&exclude.ville=Sainte%20Luce%20sur%20Loire&exclude.ville=Saint%20Sebastien%20sur%20Loire&exclude.ville=Carquefou&exclude.ville=Saint%20Aignan%20de%20Grand%20Lieu&exclude.ville=La%20Chapelle%20sur%20Erdre&exclude.ville%20=Cou%C3%ABron&exclude.emetteur=Eglise%20Notre%20Dame%20de%20Bon%20Port&exclude.emetteur=Eglise%20Saint%20Similien&exclude.emetteur=Temple%20Protestant&exclude.emetteur=Eglise%20Sainte%20Madeleine&exclude.emetteur=Centre%20de%20Formation&exclude.emetteur=Eglise%20Saint%20Jean&exclude.emetteur=VILLE%20DE%20SAINT%20AIGNAN%20DE%20GRAND%20LIEU');
    const infos = await response.json();

   
    // filtre par date
    let arrayDate = [];

    for (i in infos.records) {
        if (startDate <= infos.records[i].fields.date && infos.records[i].fields.date <= endDate) {
            arrayDate.push(infos.records[i])
        }
    }

    // filtre par thème
    let arrayTheme = [];
    console.log(arrayDate[0].fields.type.slice(0,3));
    for (i in arrayDate) {
        if(musique.checked && (arrayDate[i].fields.type.slice(0,3) === 'Mus' || arrayDate[i].fields.type.slice(0,3) === 'Cha')) {  // ajouter cd° onclick sous la forme ( onclick && ( .... === ... ou .... === ....))
            arrayTheme.push(arrayDate[i])
        }
        else if (expo.checked && (arrayDate[i].fields.type.slice(0,3) === 'Exp' || arrayDate[i].fields.type.slice(0,10) === 'Enfant,Exp' 
        || arrayDate[i].fields.type.slice(0,10) === 'Enfant,Vis' || arrayDate[i].fields.type.slice(0,3) === 'Vis')) {
            arrayTheme.push(arrayDate[i])
        }

        else if (spectacle.checked && (arrayDate[i].fields.type.slice(0,3) === 'Thé'||arrayDate[i].fields.type.slice(0,3) === 'Cir' || 
        arrayDate[i].fields.type.slice(0,10) === 'Enfant,Hum'|| arrayDate[i].fields.type.slice(0,10) === 'Enfant,Lec'||
        arrayDate[i].fields.type.slice(0,10) === 'Enfant,Mar'|| arrayDate[i].fields.type.slice(0,10) === 'Enfant,Spe'||
        arrayDate[i].fields.type.slice(0,10) === 'Enfant,Thé'|| arrayDate[i].fields.type.slice(0,10) === 'Humour,Mag'||
        arrayDate[i].fields.type.slice(0,10) === 'Humour,Thé'|| arrayDate[i].fields.type.slice(0,10) === 'Enfant,Hum'||
        arrayDate[i].fields.type.slice(0,10) === 'Lecture,,,'|| arrayDate[i].fields.type.slice(0,10) === 'Lecture,Sp'||
        arrayDate[i].fields.type.slice(0,3) === 'Per'|| arrayDate[i].fields.type.slice(0,3) === 'Dan'|| 
        arrayDate[i].fields.type.slice(0,3) === 'Fil')) {
            arrayTheme.push(arrayDate[i])
        }

        else if (conference.checked && (arrayDate[i].fields.type.slice(0,3) === 'Con'|| arrayDate[i].fields.type.slice(0,3) === 'Déb'||
        arrayDate[i].fields.type.slice(0,10) === 'Lecture,Re'|| arrayDate[i].fields.type.slice(0,3) === 'Ren'||
        arrayDate[i].fields.type.slice(0,3) === 'Sal' || arrayDate[i].fields.type.slice(0,3) === 'Ate' ||
        arrayDate[i].fields.type.slice(0,3) === 'For')) {
            arrayTheme.push(arrayDate[i] )
        }
    }
    console.log(arrayTheme)

    //Fonction de récupération des coordonées GPS
    let dicoGPS = {};
    for (i in arrayTheme) {
        let name = arrayTheme[i].fields.lieu ;
        let latLong = arrayTheme[i].fields.location ;
        if (latLong != null) {
            let dicoLatLong = {};
            let splitLatLong = latLong.split(', ');
                dicoLatLong["lat"] = splitLatLong[0];
                dicoLatLong["long"] = splitLatLong[1];
                dicoGPS[name] = dicoLatLong;
        }
    }
    console.log(dicoGPS);



// remettre la page à 0
document.querySelector('#page').innerHTML = ''


//Initialisation de la carte
let carte = L.map('maCarte').setView([47.218371, -1.553621], 13);

let tableauMarqueurs = [];


//Chargement des tuiles
L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    minZoom: 1,
    maxZoom: 20
}).addTo(carte);

let marqueurs = L.markerClusterGroup();

//Personnalisation marqueur
let icone = L.icon({
    iconUrl: "images/cartes-et-drapeaux.png",
    iconSize: [50,50],
    //Ancre en haut à gauche de l'îcone
    iconAnchor: [25,50],
    popupAnchor: [0, -50]
})

//Boucle pour les marqueurs
for(place in dicoGPS) {
    //on crée le marqueurs et on lui attribut une popup
    let marqueur = L.marker([dicoGPS[place].lat , dicoGPS[place].long],
    {icon: icone});//.addTo(carte); ==> Inutile lors de l'utilisation des clusters
    marqueur.bindPopup("<p>"+place+"</p>");
    marqueurs.addLayer(marqueur); //on ajoute le marqueur au groupe
    tableauMarqueurs.push(marqueur); //on ajoute le marqueur au tableau
}
//on regroupe les marqueurs dans un groupe Leaflet
let groupe = new L.featureGroup(tableauMarqueurs);

//on adapte le zoom au groupe
carte.fitBounds(groupe.getBounds().pad(0.5));

carte.addLayer(marqueurs);

for (i in arrayTheme) {
    // dateFormatFr = Date.parse(arrayTheme[i].fields.date).toLocaleString("fr-FR") marche pas 
    document.querySelector('#description').innerHTML += `<label><b>${arrayTheme[i].fields.lieu}
    <br>${arrayTheme[i].fields.date} à ${arrayTheme[i].fields.heure_debut}
    <br>${arrayTheme[i].fields.type}
    <br>${arrayTheme[i].fields.url_site}
    <br>${arrayTheme[i].fields.description}<label>`

}

    return infos
}














// //Fonction récupération des noms
// let arrayName = [];
// for (i in arrayTheme) {
//     let name = arrayTheme[i].fields.lieu ;
//     arrayName.push(name);
// }
// console.log(typeof(arrayName))
    
// //Fonction récupération des coordonnées
// let arrayLatLong = [];
// let arrayLong = [];
// let arrayLat = [];
// for (i in arrayTheme) {
//     let latLong = arrayTheme[i].fields.location ;
//     arrayLatLong.push(latLong);
//     console.log(typeof(latLong));
//     if (latLong != null) {
//         let splitLatLong = latLong.split(', ');
//         arrayLat.push(splitLatLong[0]);
//         arrayLong.push(splitLatLong[1]);
//     }
// }

//Coordonnées de lieux 
// let dicoGPS = {
//     "Lieu Unique : LU": {"lat": 47.2154659 , "long": -1.5457862},
//     "Stereolux": {"lat": 47.20511813 , "long": -1.5634211}
// }




// recup infos pour description evenement
// let dicoDescription = {};
// for (i in arrayTheme) {
//     // type d'evenement (retirer le virgules à la fin)
//     let type = arrayTheme[i].fields.type ;
//     dicoDescription.push(type);

//     let dateEvenement = arrayTheme[i].fields.date ;
//     dicoDescription.push(dateEvenement);

//     let heureDebut = arrayTheme[i].fields.heure_debut ;
//     dicoDescription.push(heureDebut);

//     if (arrayTheme[i].fields.heure_fin) {
//         let heureFin = arrayTheme[i].fields.heure_fin ;
//         dicoDescription.push(heureFin);
//     }

//     let lieu = arrayTheme[i].fields.lieu;
//     dicoDescription.push(lieu); 
    
//     let description = arrayTheme[i].fields.description;
//     dicoDescription.push(description);

//     let URL = arrayTheme[i].fields.url_site ;
//     dicoDescription.push(URL);
// }
// console.log(dicoDescription)