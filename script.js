
    document.getElementById('loginForm')?.addEventListener('submit', async function(event){
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try{
    const response = await fetch('http://localhost:5000/login',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password}) 
    });


    const data = await response.json();
    document.getElementById('loginMessage').innerText = data.message;
    }catch(error){
        console.error("error", error);
    }
});

//registration
    document.getElementById("registrationForm")?.addEventListener("submit", async function(event){
        event.preventDefault();

        const username = document.getElementById("registerUsername").value;
        const password = document.getElementById("registerPassword").value;
        
        console.log("Register button clicked!");

        try{
        const response = await fetch("http://localhost:5000/register",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password})
        });
        const data = await response.json();
        document.getElementById("registerMessage").innerText = data.message;
    }catch(error){
       
       console.error("Error:", error);
        document.getElementById("registerMessage").innerText = data.message;
    }
    });