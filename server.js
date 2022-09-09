const express = require('express')
const mongoose = require('mongoose')

const bodyParser = require('body-parser')
require('dotenv').config()
const fetch = require('node-fetch')
const ObjectId = require('mongodb').ObjectId

const { Destination } = require('./models/Destination.js')
const app = express()

app.use(express.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.set('view engine', 'ejs')

const connectionString = process.env.MONGODB

app.get('/', async (req, res) => {
    const allDestinations = await Destination.find()
    res.render('index.ejs', { destinations: allDestinations })
})

app.post('/destinations', async (req, res) => {
    const imgUrl = await getRandomImage(req.body.name, req.body.location)
    const newDestination = new Destination({ 
        name: req.body.name,
        location: req.body.location,
        description: req.body.description,
        photo: imgUrl
    })
    await newDestination.save()
    res.redirect('/')
})

app.put('/destinations', async (req, res) => {
    const imgUrl = req.body.changePhoto ? await getRandomImage(req.body.name, req.body.location) : req.body.photo
    await Destination.findOneAndUpdate(
        { _id: ObjectId(req.body._id) },
        {
            name: req.body.name,
            location: req.body.location,
            description: req.body.description,
            photo: imgUrl
        },
        {
            upsert: false
        }
        )
        res.json('Destination updated')
    })
    
    app.delete('/destinations', async (req, res) => {
        const _id = req.body._id
        await Destination.findByIdAndDelete(_id)
        res.json('Destination deleted')
    })
  
    const start = async () => {
        try {
            await mongoose.connect(
                connectionString
            )
            app.listen(process.env.PORT || 8000)
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }
    start()
    
    async function getRandomImage(name, location) {
        const url = `https://api.unsplash.com/search/photos/?client_id=${process.env.API_KEY}&orientation=landscape&query=${encodeURIComponent(`${name} ${location}`)}`
        try {
            let response = await fetch(url)
            let images = await response.json()
            const randomIndex = Math.floor(Math.random() * images.results.length)
            return images.results.length === 0 ? '' : images.results[randomIndex].urls.thumb
        } catch (error) {
            console.log(error)
        }
    }

