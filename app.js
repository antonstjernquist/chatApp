// Initialize Firebase
var config = {
  apiKey: "AIzaSyAnijz-PUAHdNfVeE5wdbDQyRmta3s1LjQ",
  authDomain: "chatapp-5d41e.firebaseapp.com",
  databaseURL: "https://chatapp-5d41e.firebaseio.com",
  projectId: "chatapp-5d41e",
  storageBucket: "",
  messagingSenderId: "870983683438"
};
/*
-där besökaren kan skriva in sitt namn och bli ihågkommen --CHECK
-webbsidan kan glömma bort namnet, "logga ut"
-besökaren kan skriva ett chattmeddelande
-alla som besöker chatsidan kan se nya meddelanden så fort databasen uppdateras
-sidan ska ha ett enkelt och intuitivt gränssnitt
-inte genererar några JavaScript-fel när man använder den (kontrollera i konsolen!)

--För väl godkänt ska ni göra en webbsida
-som uppfyller kraven för godkänt
-där besökaren kan gilla/ogilla meddelanden
-alla besökare kan se gilla/ogilla-markeringar så fort databasen uppdateras
-som är redovisad före deadline.
*/

// Firebase intitliazination
firebase.initializeApp(config);
const db = firebase.database();


console.log("Firebase initlialized");

// LocalStorage
Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
};
Storage.prototype.getObject = function(key) {
  let value = this.getItem(key);
  return value && JSON.parse(value);
};
// https://oscarotero.com/jquery/  Jquery cheatsheet
$(window).on('load', function() {
  localStorage.removeItem('username');
  if (localStorage.getItem('username') != null) {
    console.log('User is logged in and the username is: ' + localStorage.getItem('username'));
    setupLogout();
  } else {
    setupLogin();

    toggleModal();
    /* Add addEventListener for modal */
    addModalListeners();
  }

  // Click outside
  if ($('#modal').is(":visible")) {
    $('#modal').click(function(event) {
      if (!$(event.target).closest('#modalContent').length) {
        toggleModal();
      }
    });
  }

}); // End of callback

// Classes
class Message {
  constructor(message) {
    const date = new Date().toLocaleTimeString('en-US', {
      hour12: false
    }) + " " + new Date().toLocaleDateString('it-IT');
    const newPostKey = db.ref().child('posts').push().key;
    this.name = localStorage.getItem('username');
    this.message = message;
    this.time = date;
    this.id = newPostKey;
    this.rating = 0;
    this.ratedUsers = [];
    db.ref(`posts/${newPostKey}`).set(this);
  }
  removeMessage() {
    // Delete the message in the DOM and In the DB
    db.ref(`posts/${this.id}`).remove();
  }
  upvote() {
    if (true) {
      console.log("You can't rate again");
      return false;
    } else {
      this.rating++;
      this.ratedUsers.push(this.name);
    }
  }
  downvote() {
    this.rating--;
  }
}


/* let myMessage = new Message(message)*/

// Ska vi testa lägga till ett meddelande direkt i databasen? under posts/

/* Display Messages */
db.ref('posts/').on('value', function(snapshot) {

  let data = snapshot.val();

  for (let object in data) {

    // console.log('Object: ', object);

    let msgObj = data[object];


    const messageDiv = $("<div></div>").html(`
      <div><h2>${msgObj.name}</h2>
      <p class="time">${msgObj.time}</p></div>
      <p>Meddelande: ${msgObj.message}</p>`);

    // Vad ska det vara här?
    $('main').append(messageDiv);
  }
});




/* Functions */
function toggleModal() {
  $('#modal').fadeToggle("fast", "linear");
}

function addModalListeners() {
  $('#saveBtn').on('click', function(event) {
    let name = $('#namnInput').val();

    setUsername(name);
    toggleModal();

    console.log("Username has been set to: " + name);
  });
}


function setUsername(name) {
  localStorage.setItem('username', name);
}

function logoutUser() {
  localStorage.removeItem('username');
}

function setupLogin() {

  $('#loginBtn').text('Logga In');
  console.log("Logged in");

  $('#loginBtn').on('click', function() {
    toggleModal();
  });
}

function setupLogout() {

  $('#loginBtn').text('Logga Ut');
  console.log("Logged out");

  $('#loginBtn').on('click', function() {
    logoutUser();

    $('#loginBtn').text('Logga In');
  });
}
