let userInputs = document.querySelectorAll('input')
let submitButton = document.querySelector('button')

function verifyInputs() {
    for (userInput of userInputs) {
        if (userInput.value == '') {
            userInput.style.border = '2px solid red'
            submitButton.classList.add('disable')
            submitButton.disabled = true
            break
        } else {
            userInput.style.border = 'none'
            submitButton.disabled = false
            submitButton.classList.remove('disable')
        }
    }
}

verifyInputs()
