const  arr=[]

let params = new URLSearchParams(window.location.search);
let val = params.get('val');
function setLocalStorage(key, value, expiryInDays) {
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + (expiryInDays * 24 * 60 * 60 * 1000) // Convert days to milliseconds
    };
    localStorage.setItem(key, JSON.stringify(item));
    
    console.log("set")
}

function getLocalStorage(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
        return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    return item.value;
}

    // console.log(`${params.get("test")}`)
async function loadProductsPage(page){
    let url;
    // console.log(params.get("search"))
    if(!params.get("search")){
        url=`https://api.everrest.educata.dev/shop/products/all?page_index=${page}&page_size=12`
    }else{

        url=`https://api.everrest.educata.dev/shop/products/search?page_index=${page}&page_size=12&keywords=${params.get("search")}`
    }
    const request =await fetch(url)
    const response=await request.json()
    console.log(response)
    return response.products

}

async function fillProductArr(){

    if(!getLocalStorage("products")){
        let page=1

        let products = await loadProductsPage(page);
        while (products.length !== 0) {
            arr.push(products);
            page++;
            products = await loadProductsPage(page);
        }
        setLocalStorage("products",arr,1)
    }else{
        arr.push(...getLocalStorage("products"))
    }

    loadPage(val?val:0)

}

function loadPage(page){
    const productsContainer=document.getElementById("productsSection");
    const pageNum=document.getElementById("pageNum")
    productsContainer.innerHTML="";
    pageNum.innerHTML="";

    // console.log(productsContainer)
    arr[page].forEach((product)=>{
        productsContainer.innerHTML+=`<div class="product">
        <div class="imageContainer">
            <img src="${product.thumbnail}" alt="product image">
        </div>
        <article>
            <h3>${product.title}</h3>
        
        </article>
    </div>`



    })



    arr.forEach((element, index) => {
        pageNum.innerHTML+=`<a href="${window.location.href.split("?")[0]}?val=${index}&${window.location.href.split("?")[1].split("&")[1]}" style="color:${+val+1===index+1?"red":""}">${index+1}</a>`
    });

    // console.log(` ${window.location.href.split("?")[0]}?val=${+val-1}}${window.location.href.split("?")[1].split("&")[1]}`)


}


function changePage(arg){

    if(arg==='-'&&+val>0){
        window.location.href=`${window.location.href.split("?")[0]}?val=${+val-1}&${window.location.href.split("?")[1].split("&")[1]}`
    }else if(arg==='+'&&+val+1<arr.length){
        window.location.href=`${window.location.href.split("?")[0]}?val=${+val+1}&${window.location.href.split("?")[1].split("&")[1]}`

    }
}


const test=()=>{
    const search=document.getElementById("search")
    if(search.value===""){
        window.location.href=`${window.location.href.split("?")[0]}?val=${0}`
        localStorage.removeItem("products")
        fillProductArr()
    }else{
        window.location.href=`${window.location.href.split("?")[0]}?val=${0}&search=${search.value}`
        localStorage.removeItem("products")
        fillProductArr()
    }

}