const fs = require('fs')

function seededRandom(seed) {
	// A simple seeded pseudo-random function, this should be improved for more security
	function random() {
		let x = Math.sin(seed++) * 10000
		return x - Math.floor(x)
	}

	return {
		next: function () {
			return random()
		}
	}
}

function deterministicSort(array, key) {
	// Convert the key into a seed number
	let seed = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

	// Create a seeded pseudo-random number generator
	const rng = seededRandom(seed)

	// Custom sort function that uses the seeded random number generator
	return array
		.map((value, index) => ({value, sort: rng.next()}))
		.sort((a, b) => a.sort - b.sort)
		.map(({value}) => value)
}
let characters = ''

// Remove unwanted characters in the range from 128 to 159 (\x80 to \x9F)
// They don't represent visible symbols like letters or numbers, nor do they typically function as whitespace (like a space or newline)
for (let i = 32; i <= 255; i++) if (i !== 127 && (i < 128 || i > 159)) characters += String.fromCharCode(i)

function encode(input, key) {
	const sortedArray = deterministicSort([...characters.split('')], key)
	key += parseInt(key, 36)
	const secondArray = deterministicSort([...characters.split('')], key)

	let parsed = input.join('\n').replace(/\r/g, '')

	parsed = parsed.split('').map((character, i) => {
		if (character == '\n') return character
		return (character = sortedArray[secondArray.indexOf(character)])
	})

	return parsed.join('')
}

function decode(input, key) {
	const sortedArray = deterministicSort([...characters.split('')], key)
	key += parseInt(key, 36)
	const secondArray = deterministicSort([...characters.split('')], key)
	let parsed = input.join('\n').replace(/\r/g, '')

	parsed = parsed.split('').map((character) => {
		if (character == '\n') return character
		return (character = secondArray[sortedArray.indexOf(character)])
	})

	return parsed.join('')
}

const file = ['hi hello world']
const key = 'wasd'

console.log(encode(file, key)) // *Ì¾*ºääd¾Àd)äc


const input = ['*Ì¾*ºääd¾Àd)äc']
console.log(decode(input, key)) // hi hello world