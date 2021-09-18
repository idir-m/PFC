function getItems (){
    db.collection("items").get().then((snapshot) => {
        let items = [];
         
        snapshot.docs.forEach((doc) => {
            
                items.push({
                    id: doc.id,
                    ...doc.data()
                })
                console.log('hey');
               
          });
          genItems(items);
    });
}




function addToCart(item) {
    auth.onAuthStateChanged(user =>{
        if (user) {
            let cartItem = db.collection("users-cart").doc(user.uid).collection("cart").doc(item.id);

    cartItem.get().then((doc) => {
        
        if (doc.exists) {
            cartItem.update({
                quantity: doc.data().quantity + 1
            })
        } else {
            cartItem.set({
                image: item.image,
                make: item.make,
                name: item.name,
                rating: item.rating,
                price: item.price,
                quantity: 1
            })
        }
    })
        }
    })
    
    
      
}

const productForm = document.querySelector(".add-product-form");

function addProduct(productForm) {
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (productForm['image'].value !== "" && productForm['name'].value !== "" && productForm['price'].value !== "") {
            db.collection("items").add({
                image: productForm['image'].value,
                name: productForm['name'].value,
                make: productForm['make'].value,
                price: productForm['price'].value,
                rating: productForm['rating'].value
            }).then(() => {
    
            productForm['image'].value = "";
            productForm['name'].value = "" ;
            productForm['make'].value = "" ;
            productForm['price'].value = "" ;
            productForm['rating'].value = "" ;
            location.reload();
            })
        }else{
            alert("please complete all fields");
        }
        
                         
                         
    }) 
}


function del(itemId) {
    db.collection('items').doc(itemId).delete().then(() => {
        
        location.reload();
    });
}



function genItems(items) {
    
    
        items.forEach((item) => {
            
                
            
            let doc = document.createElement("div");
            doc.classList.add("main-product", "mr-5","mt-3");
            doc.innerHTML = `
          <div class="product-img w-48 h-52 bg-white">
                <img class="w-full h-full object-contain p-4" src="${item.image}" alt="product">
             </div>
             <div class="product-name text-gray-700 font-bold mt-2
                                        text-sm">
                                ${item.name}
             </div>
             <div class="product-make text-green-700 font-bold
                                        ">
                                ${item.make}
             </div>
            <div class="product-rating my-1">
                                🌟🌟🌟🌟🌟 ${item.rating}
             </div>
            <div class="product-price font-bold text-gray-700">
                                ${numeral(item.price).format('$0,0.00')}
            </div> 
            
        `
          let addToCartEl = document.createElement("div");
          addToCartEl.classList.add("hover:bg-yellow-600","mb-1", "cursor-pointer", "product-add", "h-8", "w-28", "rounded", "bg-yellow-500", "text-white", "text-md", "flex", "justify-center", "items-center");
          addToCartEl.innerText = "Add to cart" ;

          let itemDelete = document.createElement("div");
          itemDelete.classList.add("hidden","delete-btn","hover:bg-red-700", "cursor-pointer", "product-add", "h-8", "w-28", "rounded", "bg-red-600", "text-white", "text-md", "flex", "justify-center", "items-center");
          itemDelete.setAttribute("data-id",item.id);
          itemDelete.innerText = "Delete item" ;

          addToCartEl.addEventListener('click',() => {
             addToCart(item);
            
          })
        
          doc.appendChild(addToCartEl);
          doc.appendChild(itemDelete);

        

          document.querySelector(".main-section-products").appendChild(doc);
         
        
        
    })
    
    
    
    addProduct(productForm);
    make();
    let deleteBtns = document.querySelectorAll(".delete-btn");
    auth.onAuthStateChanged(user => {
        if(user){
            db.collection('users').doc(user.uid).get().then(doc => {
                if (doc.data().isAdmin) {
                    deleteBtns.forEach(btn => {
                        btn.style.display = 'flex';
                        
                    })
                } 
            })
        }
    })
    
}

function make() {
    let deleteBtns = document.querySelectorAll(".delete-btn");

    deleteBtns.forEach(btn => {
        btn.addEventListener('click',(e) => {
            del(btn.dataset.id);
        })
    })
}




const logout = document.querySelector(".log-out");
logout.addEventListener('click',(e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log("samaikoum")
    })
})

const login = document.querySelector(".log-in");
const userInfo = document.querySelector(".user-info");
const addProductBtn = document.querySelector(".add-product");
const hideFormBtn = document.querySelector(".hide-btn");
const addProductForm = document.querySelector(".add-product-div");


const purchaseDiv = document.querySelector(".main-section-purchases");
const titlePurchase = document.querySelector(".purchase-tite");



//gère l'interface en fonction des client loggé
function setUpUI(user) {
    
    if (user) {

        logout.style.display = 'block';
        login.style.display = 'none';
        purchaseDiv.style.display = 'block' ;
        titlePurchase.style.display = 'block';
        
        db.collection('users').doc(user.uid).get()
        .then(doc => {
            
        if (doc.data().isAdmin) {
            
            addProductBtn.style.display = 'block';
            userInfo.innerText = `Hello ${doc.data().nom} (admin)`;
            
            
            displayAddProductForm(addProductBtn,hideFormBtn);
            
            
        } else {
            userInfo.innerText = `Hello ${doc.data().nom}`;
        }
        
        
        
    })
    } else {
        titlePurchase.style.display = 'none';
        logout.style.display = 'none';
        login.style.display = 'block';
        userInfo.style.display = 'none';
        addProductBtn.style.display = 'none';
        purchaseDiv.style.display = 'none' ;
    }
}


function displayAddProductForm(addBtn, hideBtn) {
    addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addProductForm.style.display = 'block';
    })

    hideBtn.addEventListener('click',(e) => {
        e.preventDefault();
        addProductForm.style.display = 'none';
    })

}



getItems();


let purchaseProduct = document.querySelector(".purchases");


//affiche les produits achetés du client authentifié
function displayPurchases() {
    let purchaseHTML = "";
    auth.onAuthStateChanged(user => {
        if (user) {
                db.collection("users").doc(user.uid).collection("purchases")
                .get().then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        purchaseHTML += `
                    <div class="purchase-product mr-5 mt-3">
                        <div class="product-img w-48 h-52 bg-white">
                            <img class="w-full h-full object-contain p-4" src="${doc.data().image}" alt="product">
                         </div>
                         <div class="product-name text-gray-700 font-bold mt-2
                                                    text-sm">
                                            ${doc.data().name}
                         </div>
                         <div class="product-make text-green-700 font-bold
                                                    ">
                                            ${doc.data().make}
                         </div>
                        <div class="product-rating my-1">
                                            🌟🌟🌟🌟🌟 ${doc.data().rating}
                         </div>
                        <div class="product-price font-bold text-gray-700">
                                            $${doc.data().price}
                        </div>
                    </div>
                        `
                        
                    })
                    purchaseProduct.innerHTML = purchaseHTML ;
                })
            
        } 
        
    })
}

displayPurchases();