function getCartItems() {
    auth.onAuthStateChanged(user => {
        if (user) {
            db.collection("users-cart").doc(user.uid).collection("cart").onSnapshot((snapshot) => {
                let cartItems = [];
                snapshot.docs.forEach((doc) => {
                    
                    cartItems.push({
                        id: doc.id,
                      ...doc.data()
                    })
                    
                });
                genCartItems(cartItems,user);
                getTotalCoast(cartItems);
            })
            
        } else {
            genCartItems([]);
            getTotalCoast([]);
        }
             
    })
}

function getTotalCoast(items) {
    let total = 0 ;
    items.forEach((item) => {
        total += (item.price * item.quantity);
    })
    document.querySelector(".total-cost-number").innerText = numeral(total).format('$0,0.00') ;
}


function decreaseCount(itemId,user) {
    let cartItem  = db.collection("users-cart").doc(user.uid).collection("cart").doc(itemId);
    cartItem.get().then((doc) => {
        if (doc.exists) {
            if (doc.data().quantity > 1) {
                cartItem.update({
                    quantity: doc.data().quantity - 1
                })
            }
        }
    })
}

function increaseCount(itemId,user) {
    let cartItem = db.collection("users-cart").doc(user.uid).collection("cart").doc(itemId);
    cartItem.get().then((doc) => {
        if (doc.exists) {
            if (doc.data().quantity > 0) {
                cartItem.update({
                    quantity: doc.data().quantity + 1 
                })
            }
        }
    })
    
}

function deleteItem(itemId,user) {
    db.collection("users-cart").doc(user.uid).collection("cart").doc(itemId).delete();
}

function genCartItems(cartItems,user) {
    let itemsHTML = "";
    if (cartItems.length === 0 && !user) {
        itemsHTML = `<h1 class="text-gray-400 text-bold text-center text-2xl">Login for the cart</h1>`
    } else {
        cartItems.forEach((item) => {
            itemsHTML += `
            <div class="cart-item flex items-center pb-4 border-b
                                    border-gray-200">
                            <div class="cart-item-img w-40 h-24 bg-white p-4
                                        rounded-lg">
                                <img class="w-full h-full object-contain" src="${item.image}" 
                                     alt="cart-img">
                            </div>
                            <div class="cart-item-details flex-grow">
                                <div class="cart-item-title font-bold text-sm text-gray-600">
                                    ${item.name}
                                </div>
                                <div class="cart-item-brand text-sm text-gray-400">
                                    ${item.make}
                                </div>
                            </div>
                            <div class="cart-item-counter w-48 flex items-center">
                                <div data-id="${item.id}" class="chevron-left cursor-pointer text-gray-400 bg-gray-100
                                            rounded h-6 w-6 flex justify-center items-center
                                            hover:bg-gray-200 mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <h4 class="text-gray-400">x${item.quantity}</h4>
                                <div data-id="${item.id}" class="chevron-right cursor-pointer text-gray-400 bg-gray-100
                                            rounded h-6 w-6 flex justify-center items-center
                                            hover:bg-gray-200 ml-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div class="cart-item-total-cost w-48 font-bold text-gray-400">
                                ${numeral(item.price * item.quantity).format('$0,0.00')}  
                            </div>
                            <div data-id="${item.id}" class="cart-item-delete w-10 font-bold text-gray-300 cursor-pointer
                                        hover:text-gray-400">
                                <i class="fas fa-times"></i>
                            </div>
                        </div>
            
            `
        })

    }
    
    document.querySelector(".cart-items").innerHTML = itemsHTML ;
    createEventListeners(user);
}

function createEventListeners(user) {
    let decreaseButtons = document.querySelectorAll(".chevron-left");
    let increaseButtons = document.querySelectorAll(".chevron-right");
    let deleteButtons = document.querySelectorAll(".cart-item-delete");

    decreaseButtons.forEach((button) => {
        
        button.addEventListener('click',() => {
            decreaseCount(button.dataset.id,user);
        })
    })

    increaseButtons.forEach((button) => {
        button.addEventListener('click',() => {
            increaseCount(button.dataset.id,user);
        })
    })

    deleteButtons.forEach((button) => {
        button.addEventListener('click',() => {
            deleteItem(button.dataset.id,user);
        })
    })
}
const login = document.querySelector(".log-in");
const logout = document.querySelector(".log-out");
function setUpUI(user) {
    
    if (user) {
        logout.style.display = 'block';
        login.style.display = 'none';
        
    } else {
        logout.style.display = 'none';
        login.style.display = 'block';
        
    }
}


logout.addEventListener('click',(e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log("samaikoum")
    })
})

getCartItems();


const purchaseBtn = document.querySelector(".compete-order-btn");

//purchase fonction
function purchase() {

    auth.onAuthStateChanged(user => {
        db.collection("users-cart").doc(user.uid).collection("cart")
        .get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
             let purchaseCollection = db.collection("users").doc(user.uid).collection("purchases").doc(doc.id);
                
                if (!purchaseCollection.exists) {
                    purchaseCollection.set({
                        ...doc.data()
                    })
                }

            })
        }).then(() => {
            
            alert(`purchase confirmed, your order will be sent in 1 or 2 days (avec un peu de chance 💁‍♂️)`)
        })
    })
    
}

purchaseBtn.addEventListener('click',() => {
    purchase();
})