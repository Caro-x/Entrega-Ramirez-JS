function calculateTotalCost() {
    let productPrice = parseFloat(document.getElementById('productPrice').value);
    let quantity = parseInt(document.getElementById('quantity').value);
    let discount = parseFloat(document.getElementById('discount').value) || 0;
    let tax = parseFloat(document.getElementById('tax').value);

    if (isNaN(productPrice) || isNaN(quantity) || isNaN(tax)) {
        alert("Por favor, ingrese valores válidos.");
        return;
    }

    let totalCost = productPrice * quantity;

    totalCost -= totalCost * (discount / 100);

    totalCost += totalCost * (tax / 100);

    document.getElementById('result').textContent = "El costo total es: $" + totalCost.toFixed(2);
}
