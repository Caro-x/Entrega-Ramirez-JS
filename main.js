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
            })
            .catch(error => console.error('Error al cargar el archivo JSON:', error)); 
            updateHistory(); 
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
        history.push({
            food: food,
            wine: recommendations[0].name,
            timestamp: new Date().getTime() 
        });
        localStorage.setItem('recommendationHistory', JSON.stringify(history));

        const popularPairings = JSON.parse(localStorage.getItem('popularPairings')) || {};
        const pairingKey = `${food} - ${recommendations[0].name}`; 
        popularPairings[pairingKey] = (popularPairings[pairingKey] || 0) + 1;
        localStorage.setItem('popularPairings', JSON.stringify(popularPairings));

        updateHistory();
        showPopularPairingsChart();
    } 
    else {
        wineRecommendations.innerHTML = "No tenemos recomendaciones para esa comida."; 
    }
}

const popularPairings = JSON.parse(localStorage.getItem('popularPairings')) || {};
popularPairings[food] = (popularPairings[food] || 0) + 1;
localStorage.setItem('popularPairings', JSON.stringify(popularPairings));

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
            listItem.textContent = `Comida: ${entry.food}, Vino: ${entry.wine} (${formattedDate})`;
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
    const pairingsData = Object.entries(JSON.parse(localStorage.getItem('popularPairings')) || {});    
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
                x: {
                    ticks: {
                        callback: function(value, index, values) {
                            if (value.length > 20) {
                                return value.substring(0, 20) + '...';
                            } else {
                                return value;
                            }
                        }
                    }
                },
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
                            return `${food} + ${wine} (${wineInfo ? wineInfo.description : ''})`; 
                        }
                    }
                }
            }
        }
    };

    const wineTypeChartCanvas = document.getElementById('wineTypeChart'); 
    myChart = new Chart(wineTypeChartCanvas, chartConfig);
}

function generarColores(cantidad) {
    const coloresSuaves = [
        'rgba(255, 192, 203, 0.8)',  // Rosa suave
        'rgba(135, 206, 250, 0.8)',  // Azul cielo suave
        'rgba(152, 251, 152, 0.8)',  // Verde claro suave
        'rgba(255, 255, 102, 0.8)',  // Amarillo suave
        'rgba(250, 128, 114, 0.8)',  // Salmón suave
        'rgba(173, 216, 230, 0.8)',  // Azul claro suave
        'rgba(240, 230, 140, 0.8)',  // Amarillo pálido
        'rgba(210, 105, 30, 0.8)',   // Chocolate 
        'rgba(138, 43, 226, 0.8)',   // Azul violeta
        'rgba(34, 139, 34, 0.8)',    // Verde bosque
        'rgba(255, 160, 122, 0.8)',  // Durazno claro
        'rgba(221, 160, 221, 0.8)',  // Ciruela
        'rgba(0, 128, 128, 0.8)'     // Verde azulado
    ];

    while (coloresSuaves.length < cantidad) {
        coloresSuaves.push(...coloresSuaves); 
    }

    return coloresSuaves.slice(0, cantidad); 
}
