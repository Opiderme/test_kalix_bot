document.getElementById('messageForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const channelId = document.getElementById('channelId').value;
    const message = document.getElementById('message').value;
    
    fetch('/send-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channelID: channelId, message }),
    }).then(response => {
        if (response.ok) {
            alert('Message sent!');
        } else {
            alert('Error sending message');
        }
    });
});
