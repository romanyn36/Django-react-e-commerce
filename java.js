// a=[...Array(10).keys()]
// console.log(a)

const carItems= [];
const item ={product:1, qty:1}

// check if the item is already in the cart
const existItem = carItems.find(x => x.product === item.product)
console.log("existItem", existItem);