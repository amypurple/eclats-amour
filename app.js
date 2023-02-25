const appID = "734144951415691";

// Draw the message text on the canvas
const fontSize = 42;
const lineHeight = fontSize * 1.5;
const margin = 30;

var senderName = "La Vie";
var receiverName = "Beauté";

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

function generatePositiveMessage(messageIndex, receiverName, senderName) {
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
		context.fillStyle = "black";
		context.font = "bold 16px sans-serif";
		context.textAlign = "center";
		context.fillText(receiverNameText, cookieImage.width / 2, 25);

		// Draw the sender name on the canvas
		var senderNameText = "De: " + senderName;
		context.fillText(senderNameText, cookieImage.width / 2, cookieImage.height - 20);

		// Display the preview image on the web page
		var previewImage = document.getElementById("preview-image");
		previewImage.src = canvas.toDataURL();

		// Update the share button link
		var shareButton = document.getElementById("share-button");
		shareButton.value = window.location.href + "?index=" + messageIndex + "&receiver=" + encodeURIComponent(receiverName) + "&sender=" + encodeURIComponent(senderName);
	};
	cookieImage.src = "paper.png";
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
	generatePositiveMessage(-1, getReceiverName(), getSenderName());
	// To hide the form wrapper and show the preview wrapper:
	formWrapper.style.display = "none";
	previewWrapper.style.display = "block";
});

// Add event listener to the preview button
document.getElementById("retry-button").addEventListener("click", function () {
	// To hide the form wrapper and show the preview wrapper:
	formWrapper.style.display = "flex";
	previewWrapper.style.display = "none";
});

// Add event listener to the share button
document.getElementById("share-button").addEventListener("click", function () {
	sharePicture();
});

export { generatePositiveMessage };
