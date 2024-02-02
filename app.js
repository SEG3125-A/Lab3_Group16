var largeText = false

var products = [
    {
        name: "Bananas",
        vegetarian: true,
        glutenFree: true,
        organic: true,
        price: 1.00,
        category: "Fruits"
    },
    {
        name: "Carrots",
        vegetarian: true,
        glutenFree: true,
        organic: true,
        price: 1.25,
        category: "Vegetables"
    },
    {
        name: "Apples",
        vegetarian: true,
        glutenFree: true,
        organic: true,
        price: 1.50,
        category: "Fruits"
    },

    {
        name: "Corn",
        vegetarian: true,
        glutenFree: true,
        organic: true,
        price: 1.75,
        category: "Vegetables"
    },
    {
        name: "Broccoli",
        vegetarian: true,
        glutenFree: true,
        organic: true,
        price: 1.99,
        category: "Vegetables"
    },
    {
        name: "Beans",
        vegetarian: true,
        glutenFree: true,
        organic: true,
        price: 2.00,
        category: "Vegetables"
    },
    {
        name: "Bread",
        vegetarian: true,
        glutenFree: false,
        organic: false,
        price: 2.35,
        category: ""
    },
    {
        name: "Milk",
        vegetarian: false,
        glutenFree: true,
        organic: true,
        price: 2.50,
        category: "Dairy"
    },
    {
        name: "Eggs",
        vegetarian: false,
        glutenFree: true,
        organic: false,
        price: 3.50,
        category: ""
    },
    {
        name: "Chicken",
        vegetarian: false,
        glutenFree: true,
        organic: false,
        price: 6.00,
        category: "Meats"
    },
    {
        name: "Beef",
        vegetarian: false,
        glutenFree: true,
        organic: false,
        price: 8.50,
        category: "Meats"
    },

    {
        name: "Fish",
        vegetarian: false,
        glutenFree: true,
        organic: false,
        price: 9.50,
        category: "Meats"
    },
    {
        name: "Lamb",
        vegetarian: false,
        glutenFree: true,
        organic: false,
        price: 11.00,
        category: "Meats"
    },
];

var cart = new Map();

document.getElementById('Customer').style.display = 'block';
document.querySelector('button[onclick="openInfo(event, \'Customer\')"]').classList.add("active");

function  populateListProductChoices() {
    filterProducts(products);
}

function filterProducts(prods) {
    console.log("here!")
    let restriction = document.getElementById('dietSelect').value;
    let organic = document.getElementById('organicSelect').checked;

    document.getElementById('displayProduct').innerHTML = "";

    let filteredList = prods.filter(product => {
        if (organic && !product.organic) {
            return false;
        } else {
            return (
                ((product.vegetarian && restriction === 'Vegetarian') ||
                (product.glutenFree && restriction === 'GlutenFree') ||
                (product.category === restriction) ||
                (restriction === 'All'))
            );
        }
    });


    let budgetSliderValue = document.getElementById('budgetSlider').value;
    filteredList = filteredList.filter(product => product.price <= budgetSliderValue);


    displayResults(filteredList)
}

//searching for a product respects the customers preferances
function searchProduct() {
    event.preventDefault();

    let searchText = document.getElementById('searchField').value.toLowerCase().trim();
    if (searchText !== "") {
        let foundProducts = products.filter(product => product.name.toLowerCase().includes(searchText));
        if (foundProducts.length > 0) {
            filterProducts(foundProducts)
            openInfo(event, 'Products');
        } else {
            alert("No products found matching the search term.");
            return false
        }
    } else {
        alert("Please enter a search term.");
        return false
    }
}

function selectedItems() {
    let filtered_products = document.getElementsByClassName("product-qty");

    let c = document.getElementById('displayCart');
    c.innerHTML = "";

    for (let i = 0; i < filtered_products.length; i++) {
        if (filtered_products[i].value > 0) {
            let productName = filtered_products[i].id;
            let quantity = filtered_products[i].value;

            if (cart.has(productName)) {
                let oldQty = cart.get(productName);
                quantity = parseInt(oldQty) + parseInt(quantity);
            }

            cart.set(productName, parseInt(quantity));
        }
    }

    displayCart();
    displayTotalPrice();
}

function displayCart() {
    cart.forEach((qty, productName) => {
        let para = document.createElement("p");
        para.appendChild(document.createTextNode(qty + " " + productName + " - $" + getProductPrice(productName).toFixed(2) + " each"));
        para.appendChild(document.createElement("br"));
        document.getElementById('displayCart').appendChild(para);
    });
}

function getProductPrice(productName) {
    for (let i = 0; i < products.length; i++) {
        if (products[i].name === productName) {
            return products[i].price;
        }
    }
    return 0;
}

function displayTotalPrice() {
    let totalPrice = 0;

    cart.forEach((qty, product) => {
        totalPrice += getProductPrice(product) * qty;
    });

    document.getElementById('totalPrice').innerText = totalPrice.toFixed(2);
}

function openInfo(evt, tabName) {
    document.getElementById("menuDropdown").style.display = "none";
    tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

function toggleMenu() {
    var menu = document.getElementById('menuDropdown');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

function updateBudgetText() {
    let budgetSliderValue = document.getElementById('budgetSlider').value;
    document.getElementById('budgetValue').innerText = "$" + budgetSliderValue;
}

function adjustFontSize() {
    let body = document.querySelector('body');

    largeText = !largeText

    if (largeText) {
        body.classList.add('large-text');
    } else {
        body.classList.remove('large-text');
    }
}

function orderByPrice(products, ascending) {
    return products.slice().sort((a, b) => {
        return ascending ? a.price - b.price : b.price - a.price;
    });
}

function displayResults(results) {
    document.getElementById('displayProduct').innerHTML = "";
    document.getElementById('message').innerHTML = ""

    //sort from lowest to highest
    results.sort((a, b) => {
        return a.price < b.price
    })

    let message = ""
    if (results.length === 0) {
        message = "No products match your search and preferences"
    } else {
        message = "We preselected products based on your preferences."
    }
    document.getElementById('message').appendChild(document.createTextNode(message))

    for (let i = 0; i < results.length; i++) {
        let productName = results[i].name;

        let productCard = document.createElement("div");
        productCard.className = "product-card";

        let productImage = document.createElement("img");
        productImage.src = "images/" + productName.toLowerCase() + ".png";
        productImage.alt = productName;
        productCard.appendChild(productImage);

        let label = document.createElement('label');
        label.htmlFor = productName;
        label.appendChild(document.createTextNode(productName));
        productCard.appendChild(label);

        let priceLabel = document.createElement('p');
        priceLabel.appendChild(document.createTextNode("Price: $" + getProductPrice(productName).toFixed(2)));
        productCard.appendChild(priceLabel);

        let quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.min = "0";
        quantityInput.value = "0";
        quantityInput.className = "product-qty";
        quantityInput.id = productName;
        productCard.appendChild(quantityInput);

        document.getElementById('displayProduct').appendChild(productCard);
    }
}


function filterByCategory(category) {
    document.getElementById('dietSelect').value = category;
    populateListProductChoices();
}


var productsDropdown = document.getElementById("productsDropdown");
document.querySelector('.tablinks:nth-child(2)').addEventListener("mouseover", function() {
    if (productsDropdown.style.display === "block") {
        productsDropdown.style.display = "none";
    } else {
        productsDropdown.style.display = "block";
    }
});
