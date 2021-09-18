const signUpForm = document.querySelector("#sign-up-form")


signUpForm.addEventListener('submit',(e) => {
    e.preventDefault();
    

    const email = signUpForm['email'].value;
    const password = signUpForm['password'].value;

    auth.createUserWithEmailAndPassword(email, password).then((cred) => {

        return db.collection("users").doc(cred.user.uid).set({
            nom: signUpForm['name'].value,
            adress: signUpForm['adress'].value,
            isAdmin: false
        })
        
    }).then(() => {
        signUpForm.reset();
        document.location.href = "index.html";
    })
})



