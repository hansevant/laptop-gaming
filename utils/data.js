const { json } = require('express');
const fs = require('fs')

// cek folder jika tdk ada
const dirPath = './data';
if (!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath);
}

//membuat file json jika blm ada
const dataPath = './data/data.json'
if (!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath, '[]', 'utf-8');
}

// ambil data
const loadData = () => {
    const fileBuffer = fs.readFileSync('data/data.json', 'utf-8')
    const data = JSON.parse(fileBuffer)
    return data
}

// cari
const findData = (laptop) =>{
    const rawData = loadData();
    const data = rawData.find((data) => data.laptop == laptop)
    return data
}

// rewrite
const saveProducts = (products) => {
    fs.writeFileSync('data/data.json', JSON.stringify(products))
}

// add 
const addProduct = (product) =>{
    const data = loadData()
    data.push(product);
    saveProducts(data);
}

// cek laptop duplikat
const cekDuplikat = (laptop) => {
    const data = loadData()
    return data.find((d) => d.laptop === laptop)
}

// hapus
const deleteProduct = (laptop) => {
    const data = loadData()
    const filteredProducts = data.filter((p) => p.laptop !== laptop )

    saveProducts(filteredProducts)
}

// ubah
const updateProduct = (newProduct) => {
    const data = loadData()

    // hapus data yg namanya sama dengan old nama
    const filteredProducts = data.filter((p)=> p.laptop !== newProduct.oldValue)
    // console.log(filteredProducts, '---' , newProduct)
    delete newProduct.oldValue
    filteredProducts.push(newProduct)
    saveProducts(filteredProducts)
}

module.exports = {loadData, findData, addProduct, cekDuplikat, deleteProduct, updateProduct}