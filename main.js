let winePairings = {}; 

window.onload = function(){
    fetch('assets/winePairings.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            winePairings = data;
            console.log('Datos cargados desde JSON:', winePairings); 
            populateFoodSelect(); 
            showPopularPairingsChart();
            updateHistory(); 
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error)); 
};

const foodSelect = document.getElementById('food');
const wineRecommendations = document.getElementById('wineRecommendations');

function populateFoodSelect() {
    if (!foodSelect) {
        console.error('Elemento select no encontrado');
        return;
    }

    Object.keys(winePairings).forEach(food => {
        const option = document.createElement('option');
        option.value = food;
        option.text = food;
        foodSelect.appendChild(option);
    });
}

function concatenar(...args) {
    return args.join(''); 
}

function suggestWine() {
    const food = foodSelect.value;

    let recommendations = winePairings[food];

    if (recommendations && recommendations.length > 0) {
        const recommendationText = concatenar(
            "Para ", 
            food, 
            ", te recomendamos el vino ", 
            `<strong>${recommendations[0].name}</strong>`,
            ": ", 
            recommendations[0].description
        );

        wineRecommendations.innerHTML = `<p>${recommendationText}</p>`;

        const history = JSON.parse(localStorage.getItem('recommendationHistory')) || []; 

        const popularPairings = JSON.parse(localStorage.getItem('popularPairings')) || {};
        const pairingKey = `${food} - ${recommendations[0].name}`; 
        popularPairings[pairingKey] = (popularPairings[pairingKey] || 0) + 1;
        localStorage.setItem('popularPairings', JSON.stringify(popularPairings));

        history.push({
            food: food,
            wine: recommendations[0].name,
            timestamp: new Date().getTime() 
        });
        localStorage.setItem('recommendationHistory', JSON.stringify(history));
        updateHistory();
        showPopularPairingsChart();
    } 
    else {
        wineRecommendations.innerHTML = "No tenemos recomendaciones para esa comida."; 
    }
}

function clearRecommendations() {
    wineRecommendations.innerHTML = ''; 
}

function clearHistory() {
    localStorage.removeItem('recommendationHistory');
    updateHistory(); 
}

function updateHistory() {
    const historyList = document.getElementById('recommendationHistory');
    historyList.innerHTML = ''; 

    const history = JSON.parse(localStorage.getItem('recommendationHistory')) || [];

    if (history.length === 0) {
        historyList.innerHTML = '<li>Aún no hay recomendaciones en tu historial.</li>';
    } else {
        history.forEach(entry => {
            const listItem = document.createElement('li');
            const formattedDate = new Date(entry.timestamp).toLocaleString(); 
            listItem.textContent = `Comida: ${entry.food}, Vino: ${entry.wine}(${formattedDate})`;
            historyList.appendChild(listItem);
        });
    }
}

let myChart; 

function showPopularPairingsChart() {
    if (myChart) {
        myChart.destroy(); 
    }

    const popularPairings = JSON.parse(localStorage.getItem('popularPairings')) || {};
    const pairingsData = Object.entries(popularPairings);
    pairingsData.sort((a, b) => b[1] - a[1]); 

    const chartData = {
        labels: pairingsData.map(entry => entry[0]),
        datasets: [{
            label: 'Maridajes Más Populares',
            data: pairingsData.map(entry => entry[1]),
            backgroundColor: generarColores(pairingsData.length),
            borderColor: generarColores(pairingsData.length, 1),
            borderWidth: 1
        }]
    };

    const chartConfig = {
        type: 'bar',
        data: chartData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const [food, wine] = context.label.split(' - ');
                            const wineInfo = winePairings[food] && winePairings[food].find(w => w.name === wine);
                            return `${food} + <span class="math-inline">\{wine\} \(</span>{wineInfo ? wineInfo.description : ''})`; 
                        }
                    }
                }
            }
        }
    };

    const wineTypeChartCanvas = document.getElementById('wineTypeChart'); 
    myChart = new Chart(wineTypeChartCanvas, chartConfig);
}

function generarColores(cantidad, opacidad = 0.2) {
    const coloresSuaves = [
        'rgba(255, 192, 203, 0.8)',  
        'rgba(135, 206, 250, 0.8)',  
        'rgba(152, 251, 152, 0.8)',  
        'rgba(255, 255, 102, 0.8)', 
        'rgba(250, 128, 114, 0.8)',  
        'rgba(173, 216, 230, 0.8)', 
        'rgba(240, 230, 140, 0.8)',  
        'rgba(210, 105, 30, 0.8)',   
        'rgba(138, 43, 226, 0.8)',   
        'rgba(34, 139, 34, 0.8)',   
        'rgba(255, 160, 122, 0.8)', 
        'rgba(221, 160, 221, 0.8)', 
        'rgba(0, 128, 128, 0.8)'    
    ];

    while (coloresSuaves.length < cantidad) {
        coloresSuaves.push(...coloresSuaves); 
    }

    return coloresSuaves.slice(0, cantidad);
}
