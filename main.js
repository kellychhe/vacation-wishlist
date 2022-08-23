const nameInput = document.getElementById('name')
const locationInput = document.getElementById('location')
const photoInput = document.getElementById('photo')
const descriptionInput = document.getElementById('description')
const cardContainer = document.querySelector('.destinations')
const wishList = document.getElementById('wishList')
const edits = document.querySelectorAll('.edit')
const remove = document.querySelectorAll('.remove')

document.querySelector('form').addEventListener('submit', submitForm)

function submitForm(e) {
    e.preventDefault()
    const card = document.createElement('div')
    card.classList.add('card')

    const image = document.createElement('img')
    image.classList.add('card-img-top')
    image.src = photo.value === '' ? 'default.jpeg' : photoInput.value

    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')

    const name = document.createElement('div')
    name.classList.add('card-title')
    name.innerText = nameInput.value

    const location = document.createElement('span')
    location.innerText = locationInput.value

    const description = document.createElement('p')
    description.innerText = descriptionInput.value

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


    cardContainer.append(card)
    card.append(image, cardBody)
    cardBody.append(name, location, description, buttonContainer)
    buttonContainer.append(edit, remove)

    wishList.innerText = 'My WishList'
    nameInput.value = ''
    locationInput.value = ''
    photoInput.value = ''
    descriptionInput.value = ''
}

function promptEdit(e) {
    const name = e.target.parentNode.parentNode.children[0]
    const location = e.target.parentNode.parentNode.children[1]
    const photo = e.target.parentNode.parentNode.parentNode.children[0]
    const description = e.target.parentNode.parentNode.children[2]

    const newName = prompt('Enter new name')
    const newLocation = prompt('Enter new location')
    const newPhoto = prompt('Enter new photo url')
    const newDescription = prompt('Enter new description')

    newName ? name.innerText = newName : null
    newLocation ? location.innerText = newLocation : null
    newPhoto ? photo.src = newPhoto : null
    newDescription ? description.innerText = newDescription : null

}

function removeDestination(e) {
    e.target.parentNode.parentNode.parentNode.remove()
    if (cardContainer.children.length === 0) {
        wishList.innerText = 'Enter Destination Details'
    }
}