const apiKey = config.apiKey
const resource = 'https://api.unsplash.com/photos/random/'
const cardContainer = document.querySelector('.destinations')
const wishList = document.getElementById('wishList')
const form = document.getElementById('vacationForm')

form.addEventListener('submit', submitForm)

async function submitForm(e) {
    e.preventDefault()
    const formData = new FormData(form)

    const name = formData.get('name')
    const location = formData.get('location')
    const description = formData.get('description')

    const randomImage = await getRandomImage(`${name} ${location}`)
    let photoSrc = randomImage ? randomImage : formData.get('photo')
    
    createCard(photoSrc, name, location, description)

    wishList.innerText = 'My WishList'
    for (let i = 1; i < e.target.children.length; i++) {
        e.target.children[i].querySelector('input').value = ''
    }
}

async function getRandomImage(queryString) {
    const url = `${resource}?client_id=${apiKey}&orientation=landscape&query=${encodeURIComponent(queryString)}`
    try {
        let response = await fetch(url)
        let image = await response.json()
        console.log(image.urls.thumb)
        return image.urls.thumb
    } catch (error) {
        console.log(error)
    }
}

function createCard(photoSrc, name, location, description) {
    const card = document.createElement('div')
    card.classList.add('card')
    cardContainer.append(card)

    const image = document.createElement('img')
    image.classList.add('card-img-top')
    image.src = photoSrc
    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    card.append(image, cardBody)

    const nameEl = document.createElement('div')
    nameEl.classList.add('card-title')
    nameEl.innerText = name
    const locationEl = document.createElement('span')
    locationEl.innerText = location
    const descriptionEl = document.createElement('p')
    descriptionEl.innerText = description
    cardBody.append(nameEl, locationEl, descriptionEl, createButtons())
}

function createButtons() {
    const buttonContainer = document.createElement('div')
    buttonContainer.classList.add('d-flex')
    buttonContainer.classList.add('justify-content-between')

    const edit = document.createElement('button')
    edit.classList.add('edit')
    edit.classList.add('btn')
    edit.classList.add('btn-warning')
    edit.innerText = "Edit"
    edit.addEventListener('click', promptEdit)

    const remove = document.createElement('button')
    remove.classList.add('remove')
    remove.classList.add('btn')
    remove.classList.add('btn-danger')
    remove.innerText = "Remove"
    remove.addEventListener('click', removeDestination)

    buttonContainer.append(edit, remove)
    return buttonContainer
}

async function promptEdit(e) {
    const photo = e.target.parentNode.parentNode.parentNode.children[0]
    const name = e.target.parentNode.parentNode.children[0]
    const location = e.target.parentNode.parentNode.children[1]
    const description = e.target.parentNode.parentNode.children[2]

    const newName = prompt('Enter new name')
    const newLocation = prompt('Enter new location')
    const newDescription = prompt('Enter new description')

    newName ? name.innerText = newName : null
    newLocation ? location.innerText = newLocation : null
    newDescription ? description.innerText = newDescription : null

    const newPhoto = await getRandomImage(`${newName} ${newLocation}`)

    if (newPhoto && (newName || newLocation)) {
        photo.src = newPhoto
    } else if (!newName && !newLocation) {
        null
    } else {
        photo.src = '/default.jpeg'
    }
}

function removeDestination(e) {
    e.target.parentNode.parentNode.parentNode.remove()
    if (cardContainer.children.length === 0) {
        wishList.innerText = 'Enter Destination Details'
    }
}