// Initialize Firebase

var config = {
  apiKey: "AIzaSyAnijz-PUAHdNfVeE5wdbDQyRmta3s1LjQ",
  authDomain: "chatapp-5d41e.firebaseapp.com",
  databaseURL: "https://chatapp-5d41e.firebaseio.com",
  projectId: "chatapp-5d41e",
  storageBucket: "",
  messagingSenderId: "870983683438"
};
firebase.initializeApp(config);
const db = firebase.database();
console.log("Firebase initlialized");


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
  console.log("Window loaded");
  //  localStorage.removeItem('username'); // REMOVES ITEM DEVELOP ONLY
  /*
    if (localStorage.getItem('username') != null) {
      console.log('User is logged in and the username is: ' + localStorage.getItem('username'));
      setupLogout();
    } else {
      setupLogin();
    }
    */
  // Rate eventListeners
  $(document).on('click', '.upvote', function(event) {
    // "THISMESSAGE OBJECT".upvote();""
    const id = $(this).parent().attr('id');
    const votes = $(this).next().text();
    upvote(id, votes);
    // upvote(id, );

  });
  $(document).on('click', '.downvote', function(event) {
    // "THISMESSAGE".downvote();
    const id = $(this).parent().attr('id');
    const votes = $(this).prev().text();
    downvote(id, votes);
  });


  /*
      // Click outside
      if ($('#modal').is(":visible")) {
        $('#modal').click(function(event) {
          if (!$(event.target).closest('#modalContent').length) {
            toggleModal();
          }
        });
      }
  */
  //EventListener for sending message.
  $(document).on('click', '#formBtn', function(event) {
    let message = $('#msgArea').val();
    sendMessage(message);
  });

  //EventListener for center
  $('#msgArea').keyup(function(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      let message = $('#msgArea').val();
      sendMessage(message);
    }
  });

  /* Display Messages */
  let displayedMessages = [];
  db.ref('posts/').on('value', function(snapshot) {
    let data = snapshot.val();
    let firstCheck = true;

    // Get the latest post

    for (let object in data) {
      // console.log('Object: ', object);
      let msgObj = data[object];
      let messageParagraf = document.createElement('p');



      //Last Poster
      let lastPoster = $('main > div:first > div:nth-child(2) > h2').text();


      let messageDiv;
      let createMessage = true;

      if(lastPoster == msgObj.name){
        messageParagraf.innerText = msgObj.message;
        messageParagraf.style.margin = '0px';
        messageParagraf.style.padding = '0px';
          $("main > div:first").append(messageParagraf);
          $("main > div:first > p:first").css('margin', '0');
          //messageDiv.prepend(messageParagraf);
          createMessage = false;
      } else {
        messageParagraf.innerText = msgObj.message;
        messageDiv = $("<div></div>").html(`
          <div class="rating" id="${msgObj.id}"><span class="upvote vote">&#x25b2</span><span class="vote">${msgObj.rating}</span><span class="downvote vote">&#x25b2</span></div>
          <div><h2>${msgObj.name}</h2>
          <p class="time">${msgObj.time}</p></div>`);
          messageDiv.append(messageParagraf);
      }


      if (localStorage.getItem('username') != null && createMessage) {
        if (!displayedMessages.includes(msgObj.id)) { // Om listan inte innehåller id:et. Posta det!
          $('main').prepend(messageDiv);
          // Lägg till id:et i listan för meddelanden som redan visas!
          displayedMessages.push(msgObj.id);
        }
      }
    }
  });
  $('.cross').click(function(event) {
    toggleModal();
  });
  /*
    $('#githubLogin').click(function(event) {
      logIn("github");
    });
    $('#googleLogin').click(function(event) {
      logIn("google");
    });
      */
  $('#loginBtn').on('click', function() {
    toggleModal();
  });
  // EMAIL AND PASSWORD LOGIN/LOGOUT
  // Form input
  const txtEmail = ($('#txtEmail'));
  const txtPassword = ($('#txtPassword'));
  // Events for login and logout
  $('#btnLogin').click(function(event) {
    const email = txtEmail.val()
    const pass = txtPassword.val()
    const auth = firebase.auth();
    // Sign in
    const provider = auth.signInWithEmailAndPassword(email, pass);
    provider.then(data => {
      console.log("You are logged in as " + data.email)
      localStorage.setItem('username', data.email);
    }).catch(event => console.log(event.message));
  });

  $('#btnSignup').click(function(event) {
    const email = txtEmail.val() // todo check for real email
    const pass = txtPassword.val()
    const auth = firebase.auth();
    // Create user
    const provider = auth.createUserWithEmailAndPassword(email, pass);
    provider.then(data => {
      console.log("Account created data = ", data);
      localStorage.setItem('username', data.email);
    }).catch(e => console.log(e.message));
  });
  $('#btnLogout').hide()
  $('#btnLogout').click(function(event) {
    logOut();
  });

  $('#githubLogin').click(function(event) {
    let provider = new firebase.auth.GithubAuthProvider();
    provider.setCustomParameters({ // optional
      'allow_signup': 'true'
    });
    firebase.auth().getRedirectResult().then(function(result) {
        // Om vi har gjort en redirect tidigare,
        // så är result.user !== null
        if (result.user) {
          console.log('Redirect result, success: we have a user.');
          console.log('You are logged in as ' + firebase.auth().currentUser.displayName);
        } else {
          console.log('Redirect result, user is null.');
        }
      })
      .catch(function(error) {
        // Inträffar om vi inte kan få information om en
        // eventuell tidigare redirect
        console.log('Redirect result, error: ' + error.message);
      })
    firebase.auth().signInWithRedirect(provider);
  });

// GOOGLE LOGIN
  $('#googleLogin').click(function(event) {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    provider.setCustomParameters({ // optional
      'allow_signup': 'true'
    });
    firebase.auth().getRedirectResult().then(function(result) {
        if (result.user) {
          console.log('Redirect result, success: we have a user.');
          console.log('You are logged in as ' + firebase.auth().currentUser.displayName);
        } else {
          console.log('Redirect result, user is null.');
        }
      })
      .catch(function(error) {
        // Inträffar om vi inte kan få information om en
        // eventuell tidigare redirect
        console.log('Redirect result, error: ' + error.message);
      })

    // Start a sign in process for an unauthenticated user.

    firebase.auth().signInWithRedirect(provider);
  })

  // Realtime user auth listener
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      console.log(user);
      $('#btnLogout').show();
      $('#btnLogin').hide();
      $('#btnSignup').hide();
      if (user.displayName != null) {
        setInfo(user.displayName, user.photoURL, user.email);
        $('#logStatus').text(`Whalecum ${user.displayName} <3`);
      }else {
        setInfo(user.email);
        $('#logStatus').text(`Whalecum ${user.email} <3`);
      }

    } else {
      console.log("Not logged in");
      $('#formBtn').prop("disabled", true);
      $('#msgArea').prop("disabled", true);
      $('#formBtn').text('Log in to send message');
    }
  })


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
  // Delete the message in the DOM and In the DB
  removeMessage() {
    db.ref(`posts/${this.id}`).remove();
  }
}




/*  switch (logInProvider) {
    case "github":
      var provider = new firebase.auth.GithubAuthProvider();
      provider.addScope('repo');
      break;
    case "google":
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      break;
    case "email":

      break;
*/

// Using a popup.
/*
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a GitHub Access Token.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    setInfo(user.displayName, user.photoURL);
    console.log(user.photoURL); // https://avatars2.githubusercontent.com/u/8511394?v=4
    location.reload(); //<-- Vad är detta :PPP efter man loggat in så reloadar det sidan.
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    if (errorCode === 'auth/account-exists-with-different-credential') {
      alert('You have signed up with a different provider for that email.');
      // Handle linking here if your app allows it.
    } else {
      console.error(error);
    }
  });
}
*/
// Switch statement depending on which login provider the user chooses



// Logga ut den autentiserade användaren
function logOut() {
  firebase.auth().signOut()
    .then(function(result) {
      // Utloggning lyckades
      console.log("Utloggad");
      localStorage.removeItem('username');
      location.reload();
    })
    .catch(function(error) {
      // Utloggning misslyckades
      console.log("Utloggningen misslyckades");
    });
}

/* Functions */

//Scroll Function
(function($) {
    $.fn.goTo = function() {
        $('html, body').animate({
            scrollTop: ($(this).offset().top - 15) + 'px'
        }, 'fast');
        return this; // for chaining...
    }
})(jQuery);

function sendMessage(message) {
  // Make some checks for the message before creating it.
  if (message.length < 3) {
    console.log('Meddelandet är för kort.');
  } else if (message.length > 2048) {
    console.log('Meddelandet är för långt.');
  } else if (message == undefined) {
    console.log('Inget meddelandet har specificerats.');
  } else {

    // Skapa meddelande
    new Message(message);
    // Rensa inputfältet.
    $('#msgArea').val('');
    // Scrolla lite
    $('#msgArea').goTo();
  }
}

// Rösta +1
function upvote(id, votes) {
  db.ref('ratings/' + id).once('value', function(snapshot) {
    let data = snapshot.val();
    let username = localStorage.getItem('username');
    let voted = false;
    db.ref('ratings/' + id).push(username);

    if (data != null) { // Det finns något
      for (let obj in data) { // Gå igenom användarna som röstat på posten
        if (data[obj] === username) { // Om användarnamnet hittas. Sätt röstat till sant
          voted = true;
        }

        console.log(obj); // idet
        console.log(msgObj); // namnet
      }

      if (voted) {
        console.log("Du kan inte rösta på detta meddelande igen!");
      } else {
        db.ref('posts/' + id + "/rating").set(parseInt(votes) + 1);
        db.ref('ratings/' + id).push(username);
      }
    }
  });
}



// Rösta -1
function downvote(id, votes) {

  if (ratedUsers.includes(localStorage.getItem('username'))) {
    console.log("You can't rate again");
  } else {
    db.ref('posts/' + id + "/rating").set(parseInt(votes) - 1);
    ratedUsers.push(localStorage.getItem('username'));
  }
}



function toggleModal() {
  $('#modal').fadeToggle("fast", "linear");
}
/*
function addModalListeners() {
  $('#saveBtn').on('click', function(event) {
    let name = $('#namnInput').val();

    setUsername(name);
    toggleModal();
    console.log("Username has been set to: " + name);
    setTimeout(function() {
      location.reload();
    }, 100)

  });
}
*/

function setInfo(name, photoURL) {
  localStorage.setItem('username', name);
  $('#userImage').attr("src", photoURL);
}

function updateUserStatus() {

}
/*
function setupLogin() {
  $('#logStatus').text("Du är INTE inloggad!");
  $('#loginBtn').text('Logga In');
}

function setupLogout() {
  $('#logStatus').text(`Välkommen ${localStorage.getItem('username')} <3`);
  $('#loginBtn').text('Logga Ut');
  $('#loginBtn').on('click', function() {
    logOut();
  });
}
*/
