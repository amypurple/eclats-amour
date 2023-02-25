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

function generatePositiveMessage() {
	var cookieImage = new Image();
	cookieImage.crossOrigin = "anonymous";
	cookieImage.onload = function () {
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");

		// Receiver name
		getReceiverName();

		// Draw the canvas
		canvas.width = 512;
		canvas.height = 512;
		context.drawImage(cookieImage, 0, 0);

		// Draw the message text on the canvas
		context.font = "italic " + fontSize + "px 'Brush Script MT', cursive, sans-serif";
		context.textAlign = "center";
		var positiveMessage = getRandomPositiveMessage(receiverName);
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

		// Get the sender name
		getSenderName();
		var senderNameText = "De: " + senderName;

		// Draw the sender name on the canvas
		context.fillStyle = "black";
		context.font = "bold 16px sans-serif";
		context.textAlign = "center";
		context.fillText(senderNameText, cookieImage.width / 2, cookieImage.height - 20);

		// Display the preview image on the web page
		var previewImage = document.getElementById("preview-image");
		previewImage.src = canvas.toDataURL();

		// Update the share button link
		var shareButton = document.getElementById("share-button");
		shareButton.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.href) + "&quote=" + encodeURIComponent(positiveMessage);

		// Share the Positive Message on Facebook
		document.getElementById("share-button").addEventListener("click", function () {
			var dataUrl = canvas.toDataURL();
			console.log("generatePositiveMessage - FB.api");
			FB.api(
				"/me/photos",
				"post",
				{
					url: dataUrl,
				},
				function (response) {
					if (!response || response.error) {
						alert("An error occurred while sharing your positive message on Facebook.");
					} else {
						alert("Your positive message was shared on Facebook.");
					}
				}
			);
		});
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

// Get a random positive message
function getRandomPositiveMessage(name) {
	// Load the positive messages from a JSON file
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "positive_messages.json", false);
	xhr.send();
	var messages = JSON.parse(xhr.responseText);

	// Select a random message and replace the [[name]] token with the user's name
	var message = messages[Math.floor(Math.random() * messages.length)];
	texte = message.message.replace("[[name]]", name);
	return texte;
}

// Add event listener to the preview button
document.getElementById("preview-button").addEventListener("click", function () {
	generatePositiveMessage();
	// To hide the form wrapper and show the preview wrapper:
	formWrapper.style.display = "none";
	previewWrapper.style.display = "block";
});
