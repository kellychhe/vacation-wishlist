const editButton = document.getElementsByClassName('edit')
const removeButton = document.getElementsByClassName('remove')

Array.from(editButton).forEach(function(element) {
    element.addEventListener('click', (e) => {
        const cardBody = e.target.parentNode.parentNode
        const _id = cardBody.parentNode.id
        const newName = prompt('Enter new name')
        const newLocation = prompt('Enter new location') 
        const newDescription = prompt('Enter new description') 
        const changePhoto = newName || newLocation ? true : false

        fetch('destinations', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                '_id': _id,
                'name': newName || cardBody.children[0].innerText,
                'location': newLocation || cardBody.children[1].innerText,
                'description': newDescription || cardBody.children[2].innerText,
                'photo': cardBody.parentNode.children[0].src,
                'changePhoto': changePhoto
            })
        })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            
            window.location.reload(true)
        })
        .catch(error => { console.error(error) })
    })
})


Array.from(removeButton).forEach(function (button) {
    button.addEventListener('click', (e) => {
        const _id = e.target.parentNode.parentNode.parentNode.id
    
        fetch('destinations', {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                '_id': _id,
            })
        })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            window.location.reload(true)
        })
        .catch(error => { console.error(error) })
    })
})