const appID = "734144951415691";

// Draw the message text on the canvas
const fontSize = 48;
const lineHeight = fontSize * 1.5;
const margin = 30;

var senderName = "La Vie";
var receiverName = "Beauté";
var paperName = 0;

var formWrapper = document.getElementById("form-wrapper");
var previewWrapper = document.getElementById("preview-wrapper");

function getSenderName() {
	senderName = document.getElementById("senderName").value;
	return senderName;
}

function getReceiverName() {
	receiverName = document.getElementById("receiverName").value;
	return receiverName;
}

function generatePositiveMessage(paper, messageIndex, receiverName, senderName) {
	var cookieImage = new Image();
	cookieImage.crossOrigin = "anonymous";
	cookieImage.onload = function () {
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");

		// Draw the canvas
		canvas.width = 512;
		canvas.height = 512;
		context.drawImage(cookieImage, 0, 0);

		// Draw the message text on the canvas
		context.font = "italic " + fontSize + "px 'Brush Script MT', cursive, sans-serif";
		context.textAlign = "center";
		if (messageIndex < 0) messageIndex = getRandomIndex();
		var positiveMessage = getPositiveMessage(messageIndex, receiverName);
		var messageLines = getLines(context, positiveMessage, canvas.width - margin);
		context.strokeStyle = "purple";
		context.lineWidth = 5;
		context.lineJoin = "round";
		context.miterLimit = 3;
		context.fillStyle = "white";
		for (var i = 0; i < messageLines.length; i++) {
			var messageLine = messageLines[i];
			var y = cookieImage.height / 2 + lineHeight * (i - (messageLines.length - 1) / 2);
			var x = cookieImage.width / 2;
			context.save();
			context.translate(x, y);
			context.rotate((-20 * Math.PI) / 180);
			context.strokeText(messageLine, 0, 0);
			context.fillText(messageLine, 0, 0);
			context.restore();
		}

		// Draw the receiver name on the canvas
		var receiverNameText = "À: " + receiverName;
		context.strokeStyle = "orchid";
		context.lineWidth = 3;
		context.lineJoin = "round";
		context.miterLimit = 2;
		context.fillStyle = "black";
		context.font = "bold 18px sans-serif";
		context.textAlign = "center";

		context.strokeText(receiverNameText, cookieImage.width / 2, 25);
		context.fillText(receiverNameText, cookieImage.width / 2, 25);

		// Draw the sender name on the canvas
		var senderNameText = "De: " + senderName;
		context.strokeText(senderNameText, cookieImage.width / 2, cookieImage.height - 20);
		context.fillText(senderNameText, cookieImage.width / 2, cookieImage.height - 20);

		// Display the preview image on the web page
		var previewImage = document.getElementById("preview-image");
		previewImage.src = canvas.toDataURL();

		// Update the share button link
		var shareButton = document.getElementById("share-button");
		shareButton.value = window.location.href + "?paper=" + paper + "&index=" + messageIndex + "&receiver=" + encodeURIComponent(receiverName) + "&sender=" + encodeURIComponent(senderName);
	};
	cookieImage.src = "paper" + paper + ".png";
}

function getLines(ctx, text, maxWidth) {
	var words = text.split(" ");
	var lines = [];
	var currentLine = words[0];
	for (var i = 1; i < words.length; i++) {
		var word = words[i];
		var width = ctx.measureText(currentLine + " " + word).width;
		if (width < maxWidth) {
			currentLine += " " + word;
		} else {
			lines.push(currentLine);
			currentLine = word;
		}
	}
	lines.push(currentLine);
	return lines;
}

function getRandomIndex(index, name) {
	// Load the positive messages from a JSON file
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "positive_messages.json", false);
	xhr.send();
	var messages = JSON.parse(xhr.responseText);
	return Math.floor(Math.random() * messages.length);
}

function getPositiveMessage(index, name) {
	// Load the positive messages from a JSON file
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "positive_messages.json", false);
	xhr.send();
	var messages = JSON.parse(xhr.responseText);

	// Select the message at the specified index and replace the [[name]] token with the user's name
	var message = messages[index];
	var text = message.message.replace("[[name]]", name);
	return text;
}

// Add event listener to the preview button
document.getElementById("preview-button").addEventListener("click", function () {
	console.log("preview button is clicked");
	let secret = document.getElementById("secret-button");
	paper = parseInt(secret.dataset.paper) || 0;
	generatePositiveMessage(paper, -1, getReceiverName(), getSenderName());
	// To hide the form wrapper and show the preview wrapper:
	formWrapper.style.display = "none";
	previewWrapper.style.display = "block";
});

// Add event listener to the preview button
document.getElementById("secret-button").addEventListener("click", function () {
	console.log("secret button is clicked");
	let secret = document.getElementById("secret-button");
	paper = 0;
	if (secret.dataset.paper) paper = parseInt(secret.dataset.paper);
	index = secret.dataset.index;
	receiverName = secret.dataset.receiverName;
	senderName = secret.dataset.senderName;
	console.log(paper, index, receiverName, senderName);
	generatePositiveMessage(paper, index, receiverName, senderName);
	// To hide the form wrapper and show the preview wrapper:
	formWrapper.style.display = "none";
	previewWrapper.style.display = "block";
});

// Add event listener to the preview button
document.getElementById("retry-button").addEventListener("click", function () {
	console.log("retry button is clicked");
	// To hide the form wrapper and show the preview wrapper:
	formWrapper.style.display = "flex";
	previewWrapper.style.display = "none";
});

// Add event listener to the share button
document.getElementById("share-button").addEventListener("click", function () {
	sharePicture();
});
