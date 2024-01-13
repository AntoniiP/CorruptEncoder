const fs = require('fs')


function seededRandom(seed) {
  // A simple seeded pseudo-random function, this should be improved for more security
  function random() {
    let x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
  }
  
  return {
    next: function() {
      return random()
    }
  }
}

function deterministicSort(array, key) {
  // Convert the key into a seed number
  let seed = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Create a seeded pseudo-random number generator
  const rng = seededRandom(seed);
  
  // Custom sort function that uses the seeded random number generator
  return array
    .map((value, index) => ({ value, sort: rng.next() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function encode(input, key) {
	// key is an unique value that dictates the encryption process
	
	let characters = '';
	
	// Remove unwanted characters in the range from 128 to 159 (\x80 to \x9F) are not included
	// They don't represent visible symbols like letters or numbers, nor do they typically function as whitespace (like a space or newline)
	for (let i = 32; i <= 255; i++) if (i !== 127 && (i < 128 || i > 159)) characters += String.fromCharCode(i);
	const arr = characters.split('')
	const sortedArray = deterministicSort([...(arr)], key);
	
	
	// getCharacter function
	function* getCharacter() {
		for (i = 0; i < sortedArray.length; i++) yield sortedArray[i]
	}
	const gen = getCharacter()
	
	
	// ADD NOISE
	input = input.map(str => {
		let half = Math.floor(str.length / 2);
		str = str.slice(0, half) + (gen.next().value ?? '') + str.slice(half, str.length);
		// There's more string manipulation that could be made to add more noise, adding more values to start and end of the string or 
		// creating more generators for when the generator function has yielded all values.
		return str
	})
	
	// CHANGE LINES
	input.reverse()
	// ^ This implementation is really bad as it only reverses it, ideally each line of the file should change position based on the key
	
	// Create more generators to fit all the characters
	let x = (input.join('').replace(/\r/g, '').length) - sortedArray.length
	const generators = [getCharacter()]
	
	while (x > 0) {
		generators.push(getCharacter())
		x -= sortedArray.length	
	}	
	
	let parsed = input.join('\n').replace(/\r/g, '')
	parsed = parsed.split('').map(character => {
		if (character == '\n') return character
		let randomChar = generators[0].next().value
		if (randomChar === undefined) {
			generators.shift()
			randomChar = generators[0].next().value ?? ''
		}
		return character = randomChar
		
	})
	fs.writeFileSync('./output.txt', parsed.join(''))
	return parsed.join('')
}

function decode(input, key) {
	
}

const file = ['hi hello world']
const key = 'wasd'

console.log(encode(file, key))


const input = '+FÀûø Uìt]y)76®'
decode(file, key)