const core = {};
core.dictionary = [];
core.sent = [];

try {
	const response = await fetch('https://raw.githubusercontent.com/femrawr/web-games/refs/heads/main/bomb%20party/__dictionary.json');
	if (!response.ok) throw new Error('http error: ' + response.status);

	core.dictionary = await response.json() || [];
} catch(err) { }

if (!document.querySelector('#varela-round-font')) {
	const font = document.createElement('link');
	font.id = 'varela-round-font';
	font.rel = 'stylesheet';
	font.href = 'https://fonts.googleapis.com/css2?family=Varela+Round&display=swap';
	document.head.appendChild(font);
}

const notif = (message, duration = 1000 * 100) => {
	const container = document.createElement('div');
	container.style.position = 'fixed';
	container.style.top = '20px';
	container.style.left = '20px';
	container.style.zIndex = '9999';
	container.style.backgroundColor = 'white';
	container.style.border = '1px solid #000';
	container.style.borderRadius = '2px';
	container.style.boxShadow = '0 2px 5px rgba(0,0,0,0.4)';
	container.style.padding = '0';
	container.style.width = '300px';
	container.style.fontFamily = '"Varela Round", sans-serif';
	container.style.fontSize = '14px';

	const textArea = document.createElement('div');
	textArea.style.padding = '15px';
	textArea.style.borderBottom = '1px solid #000';
	textArea.style.fontWeight = '400';
	textArea.textContent = message;
	container.appendChild(textArea);

	const buttonContainer = document.createElement('div');
	buttonContainer.style.display = 'flex';

	const reset = document.createElement('button');
	reset.textContent = 'Reset Text';
	reset.style.flex = '1';
	reset.style.padding = '8px';
	reset.style.border = 'none';
	reset.style.borderRight = '1px solid #000';
	reset.style.backgroundColor = 'white';
	reset.style.cursor = 'pointer';
	reset.style.fontWeight = '500';
	reset.style.transition = 'background-color 0.2s';
	reset.style.fontFamily = '"Varela Round", sans-serif';

	reset.onmouseover = () => {
		reset.style.backgroundColor = '#f0f0f0';
	}

	reset.onmouseout = () => {
		reset.style.backgroundColor = 'white';
	}

	reset.onclick = () => {
		update(milestone.syllable);
	}

	buttonContainer.appendChild(reset);

	const close = document.createElement('button');
	close.textContent = 'Close Notif';
	close.style.flex = '1';
	close.style.padding = '8px';
	close.style.border = 'none';
	close.style.backgroundColor = 'white';
	close.style.cursor = 'pointer';
	close.style.fontWeight = '500';
	close.style.transition = 'background-color 0.2s';
	close.style.fontFamily = '"Varela Round", sans-serif';

	close.onmouseover = () => {
		close.style.backgroundColor = '#f0f0f0';
	}

	close.onmouseout = () => {
		close.style.backgroundColor = 'white';
	}

	close.onclick = () => {
		document.body.removeChild(container);
		clearTimeout(timeoutId);
	}

	buttonContainer.appendChild(close);
	container.appendChild(buttonContainer);

	container.style.opacity = '0';
	container.style.transform = 'translateY(-10px)';
	container.style.transition = 'opacity 0.2s, transform 0.2s';

	document.body.appendChild(container);

	setTimeout(() => {
		container.style.opacity = '1';
		container.style.transform = 'translateY(0)';
	}, 10);

	const timeoutId = setTimeout(() => {
		if (document.body.contains(container)) {
			container.style.opacity = '0';
			container.style.transform = 'translateY(-10px)';

			setTimeout(() => {
				if (document.body.contains(container)) {
					document.body.removeChild(container);
				}
			}, 200);
		}
	}, duration);

	return container;
}

let current;
let notification;

const update = (text) => {
	if (notification)
		notification.remove();

	current = text;

	const matches = core.dictionary.filter(
		word => word.includes(text) &&
		!core.sent.includes(word)
	);

	const match = matches.sort((a, b) => {
		if (a.length === 7 && b.length !== 7) return -1;
		if (b.length === 7 && a.length !== 7) return 1;

		return a.length - b.length;
	})[0];


	console.log({text: text, match: match, matches: matches});

	core.sent.push(match);
	notification = notif(match);
}

setInterval(() => {
	if (milestone.name === 'seating') {
		notification?.remove();
		return;
	}

	if (milestone.syllable === current)
		return;

	update(milestone.syllable.toUpperCase());
}, 1000);