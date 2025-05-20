let dictionary = [];
const usedWords = [];

try {
	const response = await fetch('https://raw.githubusercontent.com/femrawr/web-games/refs/heads/main/bomb%20party/__dictionary.json');
	if (!response.ok) throw new Error('http error: ' + response.status);

	dictionary = await response.json() || [];
} catch(err) { }

setInterval(() => {
	for (const id in milestone.playerStatesByPeerId) {
		const player = milestone.playerStatesByPeerId[id];
		if (player === selfPeerId)
			continue;

		if (player.wasWordValidated === false)
			continue;
	
		const word = player.word.toUpperCase();
		if (dictionary.includes(word))
			continue;

		if (usedWords.includes(word))
			continue;

		usedWords.push(word);
		console.log(word);
	}
}, 500);