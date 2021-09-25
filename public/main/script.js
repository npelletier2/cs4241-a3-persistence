//create cookies object
const cookies = {};
const cookieArr = document.cookie.split(";");
cookieArr.forEach((value, i, arr) => {
    cookieArr[i] = decodeURI(value).trim().split("=");
    cookies[cookieArr[i][0]] = cookieArr[i][1];
})

const user = cookies.user.split(" ")[0];

//set title bar text
const titleBar = document.getElementsByClassName("title-bar-text").item(0);
titleBar.innerText = `Orders: ${user}`;

const orderBox = document.getElementsByClassName("order-box").item(0);

let body = JSON.stringify({user});

fetch("/user-orders", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body
})
.then(response => response.json())
.then((orders) => {
    orderBox.innerText = "Click on an order to edit it:";
    orders.forEach((order) => {
        orderBox.append(createOrderNode(order));
    })
})

//helper to create a node from order info
function createOrderNode(order){
    const orderHTML = 
        `<h4>Order Number: ${order.num}</h4>
        <p><em>Flavor:</em> ${order.flavor}</p>
        <p><em>Toppings:</em> ${order.toppings}</p>
        <p><em>Cone:</em> ${order.cone}</p>
        <p><em>Notes:</em> ${order.notes}</p>`

    orderNode = document.createElement("div");
    orderNode.setAttribute("class", "order");
    orderNode.setAttribute("id", `order-${order.num}`);
    orderNode.innerHTML = orderHTML;

    return orderNode;
}