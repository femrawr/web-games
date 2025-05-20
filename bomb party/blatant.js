const core = {};
core.dictionary = [];
core.temp = [];
core.sent = [];
core.invalid = [];
core.index = 0;

try {
	const response = await fetch('https://raw.githubusercontent.com/femrawr/web-games/refs/heads/main/bomb%20party/__dictionary.json');
	if (!response.ok) throw new Error('http error: ' + response.status);

	core.dictionary = await response.json() || [];
} catch(err) { }

const input = document.querySelector('.selfTurn');

setInterval(() => {
	if (input.hasAttribute('hidden'))
		return;

	if (milestone.name === 'seating')
		return;

	const syllable = milestone.syllable.toUpperCase();
	const matches = core.dictionary.filter(
		word => word.includes(syllable) &&
		!core.invalid.includes(syllable) &&
		!core.sent.includes(syllable)
	);

	const sorted = matches.sort((a, b) => {
		if (a.length === 7 && b.length !== 7) return -1;
		if (b.length === 7 && a.length !== 7) return 1;

		return a.length - b.length;
	});

	if (sorted.length === 0)
		return;

	let match = sorted[core.index];

	console.log({ match: match, matches: sorted });
	socket.emit('setWord', match, true);

	core.temp.push(match);
	core.sent.push(match);

	core.index = (core.index + 1) % sorted.length;

	setTimeout(() => {
		if (milestone.playerStatesByPeerId[selfPeerId].wasWordValidated !== true)
			return;

		if (milestone.playerStatesByPeerId[selfPeerId].word !== match)
			return;

		core.temp = core.temp.filter(word => word !== match)

		core.temp.forEach(word => core.invalid.push(word));
		core.temp = [];
	}, 200);
}, 600);