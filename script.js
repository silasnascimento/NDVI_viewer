// Inicializando o mapa
var map = L.map('map').setView([-15.7801, -47.9292], 4);

// Definindo camadas base
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
});

var googleMaps = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps'
});

var esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri'
});

osm.addTo(map);

// Controle de camadas
var baseMaps = {
    "OpenStreetMap": osm,
    "Google Maps": googleMaps,
    "Esri World Imagery": esri
};

L.control.layers(baseMaps).addTo(map);

// Adicionando ferramenta de desenho
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    },
    draw: {
        polygon: true,
        polyline: false,
        circle: false,
        rectangle: true,
        marker: false,
        circlemarker: false
    }
});

map.addControl(drawControl);

// Função para lidar com a criação do polígono pelo usuário
// Lida com a criação do polígono pelo usuário
map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer;
    drawnItems.addLayer(layer);
    
    // Extraindo coordenadas do polígono desenhado
    var coords = layer.getLatLngs();

    // Busca as datas selecionadas pelo usuário
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // Exibir as coordenadas e simular uma requisição para buscar dados ambientais
    document.getElementById('info').innerHTML = "Buscando dados ambientais para a área desenhada...";
    fetchEnvironmentalData(coords, startDate, endDate);
    fetchNDVITiles(coords, startDate, endDate);
});

// Função para buscar dados ambientais (NDVI médio)
function fetchEnvironmentalData(coords, startDate, endDate) {
    const geojson = {
        type: "Polygon",
        coordinates: [coords[0].map(latlng => [latlng.lng, latlng.lat])]
    };

    fetch('http://3.144.109.155:5000/calculate_ndvi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            roi: geojson,
            start_date: startDate,
            end_date: endDate
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Erro:', data.error);
            document.getElementById('info').innerHTML = "Erro ao buscar o NDVI.";
        } else {
            document.getElementById('info').innerHTML = `<b>Dados Ambientais (${startDate} - ${endDate}):</b>
                <ul>
                    <li>NDVI médio: ${data.ndvi_mean.toFixed(4)}</li>
                    <li>NDVI mínimo: ${data.ndvi_min.toFixed(4)}</li>
                    <li>NDVI máximo: ${data.ndvi_max.toFixed(4)}</li>
                </ul>`;
        }
    })
    .catch(err => {
        console.error('Erro na requisição:', err);
        document.getElementById('info').innerHTML = "Erro ao conectar com o servidor.";
    });
}

// Função para buscar tiles NDVI
function fetchNDVITiles(coords, startDate, endDate) {
    const geojson = {
        type: "Polygon",
        coordinates: [coords[0].map(latlng => [latlng.lng, latlng.lat])]
    };

    fetch('http://3.144.109.155:5000/get_ndvi_tiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            roi: geojson,
            start_date: startDate,
            end_date: endDate
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.tile_url) {
            if (window.ndviLayer) {
                map.removeLayer(window.ndviLayer);
            }

            window.ndviLayer = L.tileLayer(data.tile_url, {
                attribution: 'NDVI - Sentinel-2',
                opacity: 0.7
            });

            map.addLayer(window.ndviLayer);
            baseMaps["NDVI"] = window.ndviLayer;
            L.control.layers(baseMaps).addTo(map);

            document.getElementById('info').innerHTML += "<br>Imagem NDVI carregada com sucesso!";
        } else {
            console.error('Erro:', data.error);
            document.getElementById('info').innerHTML += "<br>Erro ao carregar a imagem NDVI.";
        }
    })
    .catch(err => {
        console.error('Erro ao conectar ao servidor:', err);
        document.getElementById('info').innerHTML += "<br>Erro ao conectar ao servidor.";
    });
}

// Implementação da geocodificação Nominatim
const geocodeButton = document.getElementById('geocodeButton');
geocodeButton.addEventListener('click', function () {
    const address = document.getElementById('address').value;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                map.setView([lat, lon], 12);

                L.marker([lat, lon]).addTo(map).bindPopup(`Endereço: ${address}`).openPopup();
            } else {
                alert('Endereço não encontrado.');
            }
        })
        .catch(err => {
            console.error('Erro ao buscar endereço:', err);
        });
});
