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
        updateHistory();
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
            listItem.textContent = `Comida: ${entry.food}, Vino: ${entry.wine} (${formattedDate})`;
            historyList.appendChild(listItem);
        });
    }
}
