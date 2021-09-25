loginForm = document.querySelector("form");

addEventListener("submit", e => {
    e.preventDefault();

    body = JSON.stringify({
        "username": document.getElementById("username").value,
        "password": document.getElementById("password").value
    })

    console.log(body);
    
    fetch("/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body
    })
    .then(res => {
        window.location.assign(res.url)
    })
});