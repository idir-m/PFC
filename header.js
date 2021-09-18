function getCartItems() {
    auth.onAuthStateChanged(user => {
        if (user) {
            db.collection("users-cart").doc(user.uid).collection("cart").onSnapshot((snapshot) => {
                let totalCount = 0;
                snapshot.forEach((doc) => {
                    totalCount += doc.data().quantity ;
                });
                setCartCounter(totalCount);
            }) 
        } else {
            setCartCounter(0);
        }
    })
    
}

function setCartCounter(count) {

    document.querySelector(".cart-item-number").innerText = count ;
    
}

getCartItems();