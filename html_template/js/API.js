//Fonction de récupération des data Naoned
// async function dataEvents() {
//     const response = await fetch (`https://data.nantesmetropole.fr/api/records/1.0/search/?dataset=244400404_agenda-evenements-nantes-nantes-metropole&q=&sort=-date&facet=emetteur&facet=rubrique&facet=lieu&facet=ville&facet=lieu_quartier$`);
//     const infos = await response.json();
//     console.log(infos);
// }
// dataEvents()

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

