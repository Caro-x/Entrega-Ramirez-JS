const winePairings = {
    "Asado": [
        { name: "Syrah", description: "Ofrece sabores de frutas oscuras y especias, ideal para carnes asadas o a la parrilla." }
    ],
    "Lomo con papas rusticas": [
        { name: "Cabernet Sauvignon", description: "Un vino robusto con taninos fuertes que complementa la riqueza de la carne roja." },
    ],
    "Pechuga de pollo al champignon": [
        { name: "Chardonnay", description: "Un vino blanco con cuerpo que se empareja bien con el pollo asado o en salsas cremosas." },
    ],
    "Pollo al spiedo": [
        { name: "Pinot Noir", description: "Un tinto ligero que complementa perfectamente el pollo asado." }
    ],
    "Tagliatelle con salsa bolognesa": [
        { name: "Chianti", description: "Un tinto italiano que se combina bien con platos de pasta en salsa de tomate." },
    ],
    "Pappardelle con salsa parisienne": [
        { name: "Pinot Grigio", description: "Un vino blanco que complementa las pastas en salsas ligeras." }
    ],
    "Tabla de Queso": [
        { name: "Porto", description: "Un vino dulce que se empareja bien con quesos azules o quesos fuertes." },
    ],
    "Mouse de Chocolate amargo": [
        { name: "Zinfandel", description: "Ofrece un perfil afrutado y especiado, ideal para chocolates oscuros." }
    ],
    "Pizza": [
        { name: "Chianti", description: "Un tinto italiano que combina bien con la acidez del tomate y el queso." },
    ],
    "Salmon a la salsa naranja": [
        { name: "Riesling", description: "Un vino blanco aromático que combina bien con el sabor del salmon citrico." }
    ],
};

window.onload = function(){
    const edad = parseInt(prompt("Por favor, ingrese su edad"));

    if(edad<18){
        alert("Debe ser mayor de 18 años para acceder al sitio");
        document.getElementById('pairingForm').style.display = 'none';
        document.getElementById('wineRecommendations').style.display = 'none';
    }
}

Object.keys(winePairings).forEach(food => {
    const option = document.createElement('option');
    option.value = food;
    option.text = food;
    foodSelect.appendChild(option);
});

function concatenar(...args) {
    return args.join(''); 
}

function suggestWine() {
    const food = document.getElementById('food').value;
    const wineRecommendations = document.getElementById('wineRecommendations');

    let recommendations = winePairings[food];

    if (recommendations.length > 0) {
        const recommendationText = concatenar(
            "Para ", 
            food, 
            ", te recomendamos el vino ", 
            `<strong>${recommendations[0].name}</strong>`,
            ": ", 
            recommendations[0].description
        );

        wineRecommendations.innerHTML = `<p>${recommendationText}</p>`;
    } 
    else {
        wineRecommendations.innerHTML = "No tenemos recomendaciones para esa comida."; 
    }
}
/* si quiero cambiar el select por un input
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

foodInput.addEventListener('input', updateSuggestions);*/