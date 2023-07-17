async function dataEvents() {
    const response = await fetch (`https://data.nantesmetropole.fr/api/records/1.0/search/?dataset=244400404_agenda-evenements-nantes-nantes-metropole&q=&sort=-date&facet=emetteur&facet=rubrique&facet=lieu&facet=ville&facet=lieu_quartier$`);
    const infos = await response.json();
    console.log(infos);
}
dataEvents()