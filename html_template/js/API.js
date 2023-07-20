// Fonction de récupération des data Naoned
let array = [];
async function dataEvents() {
    const response = await fetch('https://data.nantesmetropole.fr/api/records/1.0/search/?dataset=244400404_agenda-evenements-nantes-nantes-metropole&q=&start=0&sort=-date&facet=emetteur&facet=rubrique&facet=lieu&facet=ville&facet=lieu_quartier&exclude.rubrique=Sport&exclude.rubrique=Dialogue%20Citoyen&exclude.rubrique=Ev%C3%A9nements%20Emploi&exclude.ville=Saint%20Herblain&exclude.ville=Orvault&exclude.ville=Bouguenais&exclude.ville=Rez%C3%A9&exclude.ville=La%20Montagne&exclude.ville=Basse%20Goulaine&exclude.ville=Sainte%20Luce%20sur%20Loire&exclude.ville=Saint%20Sebastien%20sur%20Loire&exclude.ville=Carquefou&exclude.ville=Saint%20Aignan%20de%20Grand%20Lieu&exclude.ville=La%20Chapelle%20sur%20Erdre&exclude.ville%20=Cou%C3%ABron&exclude.emetteur=Eglise%20Notre%20Dame%20de%20Bon%20Port&exclude.emetteur=Eglise%20Saint%20Similien&exclude.emetteur=Temple%20Protestant&exclude.emetteur=Eglise%20Sainte%20Madeleine&exclude.emetteur=Centre%20de%20Formation&exclude.emetteur=Eglise%20Saint%20Jean');
    const infos = await response.json();
    // console.log(infos)
    array.push(infos.records[1].fields.type)
    array.push(infos.records[1].fields.location)
    console.log(infos.records[1])
    return infos
}
dataEvents()
// console.log(array)

//Initialisation de la carte
let carte = L.map('maCarte').setView([47.218371, -1.553621], 13);

//Coordonnées de lieux assez stylés (mais bien couvrir ses verres!)
let places = {
    "Lieu Unique : LU": {"lat": 47.2154659 , "long": -1.5457862},
    "Stereolux": {"lat": 47.20511813 , "long": -1.5634211}
}
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
for(place in places) {
    //on crée le marqueurs et on lui attribut une popup
    let marqueur = L.marker([places[place].lat , places[place].long],
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

//Fonction de récupération des données GPS et mise dans un tableau
// let placeArray = [];
// function gpsPlace (idPlace) {
//     let gpsString = dataEvents().records[idPlace].fields.location ;
//     console.log(gpsString);
//     let gpsNumber = gpsString.split (', ');
//     console.log(gpsNumber[0]);
//     console.log(gpsNumber[1])

// }
// gpsPlace (1)


// function filterArray() {  // théatre, danse, musique, exposition   & filtre date
//     // commencer par vérification format date & validité (si input type date = ok)
//     // filtre en fonction des dates
//     for (activity in infos) {
//         if () {}
//     }
// }