# CorruptEncoder
Encode a string or a file and make it look like it was corrupted.

Given a string key, it generates a deterministic array with Unicode characters ranging from 32 to 255 to replace the characters on the input file (an array broken into new lines).

```javascript
const file = ['hi hello world']
const key = 'wasd'

console.log(encode(file, key)) // *Ì¾*ºääd¾Àd)äc

const input = ['*Ì¾*ºääd¾Àd)äc']
console.log(decode(input, key)) // hi hello world
```

TODO: 
- Increase security to avoid key predictability.
- Add further encoding layers
