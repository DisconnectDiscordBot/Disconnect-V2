# Command Template

This is the general command template.

## All in one

```js
// All in one template
module.exports = {
	config: {
		name: '',
		aliases: [],
	},
	run: async ({}) => {},
};
```

### Example

```js
// All in one example
module.exports = {
	config: {
		name: 'example',
		aliases: ['ex'],
	},
	run: async ({ message }) => {
		return message.channel.send('This is an example!');
	},
};
```

## Separate

```js
// Separate template
module.exports.config = {
	name: '',
	aliases: [],
};

module.exports.run = async ({}) => {};
```

### Example

```js
// Separate example
module.exports.config = {
	name: 'example',
	aliases: ['ex'],
};

module.exports.run = async ({message}) => {
	return message.channel.send('This is an example!');
},
```
