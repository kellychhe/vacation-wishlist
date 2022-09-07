const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const fetch = require('node-fetch')
const ObjectId = require('mongodb').ObjectId
const MongoClient = require('mongodb').MongoClient
const app = express()

dotenv.config()
app.listen(process.env.port || 9000)

const connectionString = process.env.MONGODB

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('vacation-wishlist')
        const destinationsCollection = db.collection('destinations')

        app.listen(8000)

        app.set('views', './view');
        app.set('view engine', 'ejs')

        app.use(express.static('public'))
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.json())

        app.get('/', (req, res) => {
            destinationsCollection.find().toArray()
                .then(results => {
                    res.render('index.ejs', { destinations: results })
                })
                .catch(error => console.error(error))
        })

        app.post('/destinations', async (req, res) => {
            const imgUrl = await getRandomImage(req.body.name, req.body.location)
            destinationsCollection.insertOne({
                    name: req.body.name,
                    location: req.body.location,
                    description: req.body.description,
                    photo: imgUrl
                })
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })

        app.put('/destinations', async (req, res) => {
            const imgUrl = !req.body.changePhoto ? req.body.photo : await getRandomImage(req.body.name, req.body.location)
            destinationsCollection.findOneAndUpdate({ _id: ObjectId(req.body._id) },
                {
                    $set: {
                        name: req.body.name,
                        location: req.body.location,
                        description: req.body.description,
                        photo: imgUrl
                    }
                },
                {
                    upsert: false
                }
            )
            .then(result => {
                res.json('Success')
            })
            .catch(error => console.error(error))
        })

        app.delete('/destinations', (req, res) => {
            destinationsCollection.deleteOne( { _id: ObjectId(req.body._id) })
            .then(result => {
                if (result.deletedCount === 0) {
                    return res.json()
                }
                res.json(`Deleted Destination`)
            })
            .catch(error => console.error(error))
        })
    })
    .catch(error => console.error(error))

    async function getRandomImage(name, location) {
        const url = `https://api.unsplash.com/search/photos/?client_id=${process.env.API_KEY}&orientation=landscape&query=${encodeURIComponent(`${name} ${location}`)}`
        try {
            let response = await fetch(url)
            let images = await response.json()
            const randomIndex = Math.floor(Math.random() * images.results.length)
            return images.results[randomIndex].urls.thumb
        } catch (error) {
            console.log(error)
        }
    }