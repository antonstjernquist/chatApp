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

	    // LocalStorage
	    Storage.prototype.setObject = function (key, value) {
	        this.setItem(key, JSON.stringify(value));
	    };
	    Storage.prototype.getObject = function (key) {
	        let value = this.getItem(key);
	        return value && JSON.parse(value);
	    };
