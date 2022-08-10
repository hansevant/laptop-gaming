const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const {loadData, findData, addProduct, cekDuplikat, deleteProduct, updateProduct} = require('./utils/data')
const {body, validationResult, check} = require('express-validator')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

const morgan = require('morgan')
const app = express()
const port = 8888

// gunakan ejs
app.set('view engine', 'ejs')

// third-pt mw
app.use(expressLayouts)

// app level mw
// app.use((req,res,next) => {
//   console.log('Time: ', Date.now())
//   next()
// })

// built in mw
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))

// config flash
app.use(cookieParser('secret'))
app.use(session({
  cookie: { maxAge:6000},
  secret: 'secret',
  resave: true,
  saveUninitialized:true
}))
app.use(flash())

app.get('/', (req, res) => {
  res.render('index', {
    layout: 'layouts/template',
    title: 'Home',
  })
})

app.get('/about', (req, res, next) => {
  res.render('about', {
    layout: 'layouts/template',
    title: 'About',
  })
})

app.get('/products', (req, res) => {

  const data = loadData()

  res.render('products', {
    layout: 'layouts/template',
    title: 'Products',
    data,
    msg: req.flash('msg')
  })
})

app.get('/product/add', (req, res) => {
  res.render('add_product', {
    title: 'Add Product',
    layout: 'layouts/template',
  })
})

app.post('/product', [body('laptop').custom((value)=>{
  const double = cekDuplikat(value)
  if(double){
    throw new Error('laptop tsb sudah ada')
  }
  return true
})] ,(req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    // return res.status(400).json({errors: errors.array()})
    res.render('add_product',{
      title: 'Add Product',
      layout: 'layouts/template',
      errors: errors.array()
    })
  }else{
    // res.send(req.body)
    addProduct(req.body);
    req.flash('msg', 'Laptop Berhasil ditambahkan')
    res.redirect('/products')
  }
})

app.get('/product/delete/:laptop', (req, res) => {
  const data = findData(req.params.laptop);

  if(!data){
    res.status(404);
    res.send('Fail to delete, data not found')
  }else{
    deleteProduct(req.params.laptop)
    req.flash('msg', 'Laptop Berhasil dihapus')
    res.redirect('/products')
  }
})

app.get('/product/edit/:laptop', (req, res) => {
  const data = findData(req.params.laptop)

  res.render('edit_product', {
    title: 'Edit Product',
    layout: 'layouts/template',
    data
  })
})

app.post('/product/update', [body('laptop').custom((value, {req})=>{
  const double = cekDuplikat(value)
  if(value !== req.body.oldValue && double){
    throw new Error('laptop tsb sudah ada')
  }
  return true
})] ,(req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    // return res.status(400).json({errors: errors.array()})
    res.render('edit_product',{
      title: 'Edit Product',
      layout: 'layouts/template',
      errors: errors.array(),
      data: req.body
    })
  }else{
    // res.send(req.body)
    
    updateProduct(req.body);
    req.flash('msg', 'Laptop Berhasil diubah')
    res.redirect('/products')
  }
})

app.get('/product/:laptop', (req, res) => {

  const data = findData(req.params.laptop)

  res.render('product', {
    layout: 'layouts/template',
    title: 'Detail Product',
    data
  })
})

app.use('/', (req, res) => {
  res.send('404');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})