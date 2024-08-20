const winePairings = {
    "Carne Roja": [
        { name: "Cabernet Sauvignon", description: "Un vino robusto con taninos fuertes que complementa la riqueza de la carne roja." },
        { name: "Syrah", description: "Ofrece sabores de frutas oscuras y especias, ideal para carnes asadas o a la parrilla." }
    ],
    "Pollo": [
        { name: "Chardonnay", description: "Un vino blanco con cuerpo que se empareja bien con el pollo asado o en salsas cremosas." },
        { name: "Pinot Noir", description: "Un tinto ligero que complementa perfectamente el pollo asado." }
    ],
    "Pescado": [
        { name: "Sauvignon Blanc", description: "Un vino blanco fresco y ácido, perfecto para pescados y mariscos." },
        { name: "Chablis", description: "Un vino blanco seco que realza los sabores delicados del pescado." }
    ],
    "Pasta": [
        { name: "Chianti", description: "Un tinto italiano que se combina bien con platos de pasta en salsa de tomate." },
        { name: "Pinot Grigio", description: "Un vino blanco que complementa las pastas en salsas ligeras." }
    ],
    "Queso": [
        { name: "Porto", description: "Un vino dulce que se empareja bien con quesos azules o quesos fuertes." },
        { name: "Sauvignon Blanc", description: "Un vino blanco que combina bien con quesos frescos y cremosos." }
    ],
    "Chocolate": [
        { name: "Merlot", description: "Un tinto suave con notas de frutas que complementa los sabores del chocolate." },
        { name: "Zinfandel", description: "Ofrece un perfil afrutado y especiado, ideal para chocolates oscuros." }
    ]
};
window.onload = function(){
    const edad = parseInt(prompt("Por favor, ingrese su edad"));

    if(edad<18){
        alert("Debe ser mayor de 18 años para acceder al sitio");
        document.getElementById('pairingForm').style.display = 'none';
        document.getElementById('wineRecommendations').style.display = 'none';
    }
}

const foodInput = document.getElementById('food');
const foodSuggestions = document.getElementById('foodSuggestions');

function suggestWine() {
    const food = document.getElementById('food').value;
    const wineRecommendations = document.getElementById('wineRecommendations');

    let recommendations = winePairings[food];
    let recommendationList = `<ul>`;
    recommendations.forEach(wine => {
        recommendationList += `<li><strong>${wine.name}:</strong> ${wine.description}</li>`;
    });
    recommendationList += `</ul>`;

    wineRecommendations.innerHTML = recommendationList;
}

function updateSuggestions(){
    const inputValue = foodInput.value.toLowerCase();
    foodSuggestions.innerHTML='';

    const matchingFoods = Object.keys(winePairings).filter(food => food.toLowerCase().includes(inputValue));

    matchingFoods.forEach(food =>{
        const option = document.createElement('option');
        option.value = food;
        foodSuggestions.appendChild(option);
    });
}

foodInput.addEventListener('input', updateSuggestions);