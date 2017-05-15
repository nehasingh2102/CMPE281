/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

var credential =  JSON.parse($.ajax({
            url: "../credential.json", 
            async: false,
            dataType: 'json'
        }).responseText)[0];

console.log(credential);



var clientNodeURL = credential["clientIP"];
var serverNodeURL = credential["serverIP"];
var clientDBNodeURL = credential["clientIPDB"];
var wsURL = credential["wsClientURL"];
var orgManager = "";//credential["orgManager"];
var orgName = "";//credential["orgName"];
var senderName = "";//credential["sendName"];
var senderdispName = "";//credential["displayName"];
var senderdispPic = "";//credential["profilePic"];
var currentUser = null;
console.log(clientDBNodeURL);



// Initializes FriendlyChat.
function FriendlyChat() {
  this.checkSetup();
  
  this.websocket = new WebSocket(wsURL);
  // Shortcuts to DOM Elements.
  this.messageList = document.getElementById('messages');
  this.messageForm = document.getElementById('message-form');
  this.messageInput = document.getElementById('message');
  this.submitButton = document.getElementById('submit');
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.signInButton = document.getElementById('sign-in');
  this.logInButton = document.getElementById('log-in');
  this.signOutButton = document.getElementById('sign-out');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');
  
  // Saves message on form submit.
  this.messageForm.addEventListener('submit', this.saveMessage.bind(this));
  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  this.logInButton.addEventListener('click', function(e){
    var loginInemail = "";
    var loginInpassword = "";
    e.preventDefault();
    loginInemail = document.getElementById('login-email').value; 
    loginInpassword = document.getElementById('login-pswd').value;

    $('#login-modal').modal('hide');
    document.getElementById('login-email').value = '';
    document.getElementById('login-pswd').value = '';
    this.signIn(loginInemail,loginInpassword);
  }.bind(this));

  // Toggle for the button.
  var buttonTogglingHandler = this.toggleButton.bind(this);
  this.messageInput.addEventListener('keyup', buttonTogglingHandler);
  this.messageInput.addEventListener('change', buttonTogglingHandler);
  
  
  this.onAuthStateChanged.bind(this);
  this.initFirebase();
  
  //this.receiveMessage.addEventListener(this.websocket.onmessage(), this);
  this.websocket.onmessage = function(evt){
      console.log("from websocket: "+evt.data);
      var msg = JSON.parse(evt.data)

      if((msg.origin == "server") && currentUser){
            if(currentUser.email == orgManager){
                  var k = generateID();          
                  //this.displayMessage(k, msg.name, msg.text, msg.photoUrl, msg.org);
                  var div = document.getElementById(k);
                 // If an element for that message does not exists yet we create it.
                  var msgList = document.getElementById('messages');
                  if (!div) {
                      var container = document.createElement('div'); 
                      var MSG_TEMPLATE =  '<div class="message-container">' +
                                          '<div class="spacing"> <div class="pic"></div></div>' +
                                          '<div class="message"></div>' +
                                          '<div class="name"></div>' +
                                          '<div class="name" id="orgname"></div>'+ 
                                          '</div>'+
                                          '</div>';
                      container.innerHTML = MSG_TEMPLATE;
                      div = container.firstChild;
                      div.setAttribute('id', k);
                      msgList.appendChild(div);
                  }
                 if (msg.photoUrl) {
                      div.querySelector('.pic').style.backgroundImage = 'url(' + msg.photoUrl + ')';
                 }
                 div.querySelector('.name').textContent = msg.name;
                 div.querySelector('#orgname').textContent = msg.org;
                 var msgElement = div.querySelector('.message');
                 if (msg.text) { // If the message is text.
                    msgElement.textContent = msg.text;
                    // Replace all line breaks by <br>.
                    msgElement.innerHTML = msgElement.innerHTML.replace(/\n/g, '<br>');
                 }
                 // Show the card fading-in.
                 setTimeout(function() {div.classList.add('visible')}, 1);
                 msgList.scrollTop = msgList.scrollHeight;
            }    
      }
  }
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
FriendlyChat.prototype.initFirebase = function() {
  // TODO(DEVELOPER): Initialize Firebase.
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// Loads chat messages history and listens for upcoming ones.
FriendlyChat.prototype.loadMessages = function(data) {
  // TODO(DEVELOPER): Load and listens for new messages.
  // Reference to the /messages/ database path.
  //this.messagesRef = this.database.ref('messages');
  // Make sure we remove all previous listeners.
  //this.messagesRef.off();
  
  // Loads the last 12 messages and listen for new ones.
  var setMessage = function(data) {
    var val = data.val();
    console.log("in loadMessage: "+ val);
    this.displayMessage(data.key, val.name, val.text, val.photoUrl, val.org);
  }; 
  
  //this.messagesRef.limitToLast(12).on('child_added', setMessage);
  //this.messagesRef.limitToLast(12).on('child_changed', setMessage);
};

// Saves a new message on the Firebase DB.
FriendlyChat.prototype.saveMessage = function(e) {
  
    // TODO(DEVELOPER): push new message to Firebase.
	e.preventDefault();
        console.log("in save message");
  // Check that the user entered a message and is signed in.
	  if (this.messageInput.value && this.checkSignedInWithMessage()) {
		
		var pic;
		if(currentUser.photoURL){
			pic = currentUser.photoURL;
		}else{
			pic = '/images/profile_placeholder.png';
		}
		var JSONObj = { "origin": "client", "name" : currentUser.displayName, "org"  : orgName, "text": this.messageInput.value, "photoUrl": pic};
		this.websocket.send(JSON.stringify(JSONObj));
		notifyClientServer(JSONObj);
		
                var msg = {name : currentUser.displayName, text : this.messageInput.value, photoUrl : pic, org : orgName};
     
                var k = generateID();          
                this.displayMessage(k, msg.name, msg.text, msg.photoUrl, msg.org);
		
		  FriendlyChat.resetMaterialTextfield(this.messageInput);
		  this.toggleButton();
	  }
};

// Signs-in Friendly Chat.
FriendlyChat.prototype.signIn = function(email,password) {

  // TODO(DEVELOPER): Sign in Firebase with credential from the Google user.
  // Sign in Firebase using popup auth and Google as the identity provider.
   console.log("in signin");
   console.log(email);
   console.log(password);
   if( getAuthentication(email,password) ){
      currentUser = {
          email : email,
          name : senderName,
          photoURL : senderdispPic,
          displayName : senderdispName            
      }
      console.log(currentUser.email);
      this.onAuthStateChanged(currentUser);
   }else{
      currentUser = null;
      // Display a message to the user using a Toast.
	  var data = {
		message: 'Sorry. Not authorized to login',
		timeout: 2000
	  };
	  this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
   }
};

// Signs-out of Friendly Chat.
FriendlyChat.prototype.signOut = function() {
  // TODO(DEVELOPER): Sign out of Firebase.
  currentUser = null;
  this.onAuthStateChanged(currentUser);
  var data = {
	message: 'You are signed out.',
	timeout: 2000
  };
  this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
FriendlyChat.prototype.onAuthStateChanged = function(user) {
   // console.log(loginInemail);

    if (user) { // User is signed in!
	var email = user.email;
	if(email == orgManager){
		var data = {
			message: 'You have successfully signed in. Welcome!',
			timeout: 2000
		  };
		  this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
		// Get profile pic and user's name from the Firebase user object.
		var profilePicUrl = user.photoURL; // Only change these two lines!
		var userName = user.displayName;   // Only change these two lines!

		// Set the user's profile pic and name.
		this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
		this.userName.textContent = userName;

		// Show user's profile and sign-out button.
		this.userName.removeAttribute('hidden');
		this.userPic.removeAttribute('hidden');
		this.signOutButton.removeAttribute('hidden');

		// Hide sign-in button.
		this.signInButton.setAttribute('hidden', 'true');
                console.log("before getRecentMsg");
		// We load currently existing chant messages.
                var msgHistoryList = getRecentMessages();
                if(msgHistoryList){
                      for(var k in msgHistoryList){
                            console.log(k, msgHistoryList[k]);
                            var elem = msgHistoryList[k];
                            //console.log(elem._id.$oid);
                            
                            this.displayMessage(elem._id.$oid, elem.name, elem.text, elem.photoUrl, elem.org);
                      }
                      
                }else{
                      data = {
			message: 'You have successfully signed in. Welcome!',
			timeout: 2000
		     };
                     this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
                 }
                  

		// We save the Firebase Messaging Device token and enable notifications.
		//this.saveMessagingDeviceToken();
	}else{
		// Sign out of Firebase.
		this.signOut();
		// Display a message to the user using a Toast.
		 data = {
			message: 'Please provide valid google credential',
			timeout: 2000
		  };
		this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
		// Hide user's profile and sign-out button.
		this.userName.setAttribute('hidden', 'true');
		this.userPic.setAttribute('hidden', 'true');
		this.signOutButton.setAttribute('hidden', 'true');

		// Show sign-in button.
		this.signInButton.removeAttribute('hidden');
	}
    
  } else { // User is signed out!
	var alertdata = {
		message: 'You are signed out.',
		timeout: 2000
	  };
	 // this.signInSnackbar.MaterialSnackbar.showSnackbar(alertdata);
    // Hide user's profile and sign-out button.
    this.userName.setAttribute('hidden', 'true');
    this.userPic.setAttribute('hidden', 'true');
    this.signOutButton.setAttribute('hidden', 'true');

    // Show sign-in button.
    this.signInButton.removeAttribute('hidden');
  }
};

// Returns true if user is signed-in. Otherwise false and displays a message.
FriendlyChat.prototype.checkSignedInWithMessage = function() {
  /* TODO(DEVELOPER): Check if user is signed-in Firebase. */
	// Return true if the user is signed in Firebase
	
  if (currentUser) {
    if(currentUser.email == orgManager){
         return true;
    }
  }
  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
  return false;
};

// Saves the messaging device token to the datastore.
FriendlyChat.prototype.saveMessagingDeviceToken = function() {
  // TODO(DEVELOPER): Save the device token in the realtime datastore
  firebase.messaging().getToken().then(function(currentToken) {
    if (currentToken) {
      console.log('Got FCM device token:', currentToken);
      // Saving the Device Token to the datastore.
      firebase.database().ref('/fcmTokens').child(currentToken)
          .set(firebase.auth().currentUser.uid);
    } else {
      // Need to request permissions to show notifications.
      this.requestNotificationsPermissions();
    }
  }.bind(this)).catch(function(error){
    console.error('Unable to get messaging token.', error);
  });
};

// Requests permissions to show notifications.
FriendlyChat.prototype.requestNotificationsPermissions = function() {
  // TODO(DEVELOPER): Request permissions to send notifications.
  console.log('Requesting notifications permission...');
  firebase.messaging().requestPermission().then(function() {
    // Notification permission granted.
    this.saveMessagingDeviceToken();
  }.bind(this)).catch(function(error) {
    console.error('Unable to get permission to notify.', error);
  });
};

// Resets the given MaterialTextField.
FriendlyChat.resetMaterialTextfield = function(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
};

// Template for messages.
FriendlyChat.MESSAGE_TEMPLATE =
    '<div class="message-container">' +
      '<div class="spacing"> <div class="pic"></div></div>' +
      '<div class="message"></div>' +
      '<div class="name"></div>' +
      '<div class="name" id="orgname"></div>'+ 
      '</div>'+
    '</div>';

// A loading image URL.
FriendlyChat.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Displays a Message in the UI.
FriendlyChat.prototype.displayMessage = function(key, name, text, picUrl, org){//imageUri, org) {
  var div = document.getElementById(key);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = FriendlyChat.MESSAGE_TEMPLATE;
    div = container.firstChild;
    div.setAttribute('id', key);
    this.messageList.appendChild(div);
  }
  if (picUrl) {
    div.querySelector('.pic').style.backgroundImage = 'url(' + picUrl + ')';
  }
  div.querySelector('.name').textContent = name;
  div.querySelector('#orgname').textContent = org;
  var messageElement = div.querySelector('.message');
  if (text) { // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
  }
  // Show the card fading-in.
  setTimeout(function() {div.classList.add('visible')}, 1);
  this.messageList.scrollTop = this.messageList.scrollHeight;
  this.messageInput.focus();
};

// Enables or disables the submit button depending on the values of the input
// fields.
FriendlyChat.prototype.toggleButton = function() {
  if (this.messageInput.value) {
    this.submitButton.removeAttribute('disabled');
  } else {
    this.submitButton.setAttribute('disabled', 'true');
  }
};

// Checks that the Firebase SDK has been correctly setup and configured.
FriendlyChat.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
};

window.onload = function() {
  window.friendlyChat = new FriendlyChat();
};

function generateID(){
    var timestamp = (new Date().getTime()/1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function(){
           return (Math.random*16|0).toString(16);   
    }).toLowerCase();
}

function getAuthentication(email,password){
       var url = clientDBNodeURL+'authentication';
       console.log(url);
       var resp = $.ajax({
            url: url, 
            async: false,
            contentType: 'application/json',
            method: 'GET'
        }).responseText;
      console.log(resp);

      var cred = {};
      try{
          cred = JSON.parse(resp)[0];
          console.log(cred);
          if(cred){
               orgManager = cred["id"];
               orgName = cred["orgName"];
               senderName = cred["name"];
               senderdispName = cred["displayName"];
               senderdispPic = cred["profilePic"];
          }else
             throw "Error: Credential not obtained from DB";
      }catch(e){
          console.log(e);
          return false;
      }

      var hash = sha224(password);
      if(orgManager == email && hash==cred["password"]){
           return true;
      }
      return false;
}

function getRecentMessages(){
       var url = clientDBNodeURL+'history';
       console.log(url);
       var resp = $.ajax({
            url: url, 
            async: false,
            contentType: 'application/json',
            method: 'GET'
        }).responseText;
      return JSON.parse(resp);
}

function notifyClientServer(param) {
        var oReq = CreateXMLHttpRequest();
        var url = clientDBNodeURL+"insert";
        oReq.open("POST",url,true);
	if(oReq!=null){
		oReq.setRequestHeader('Access-Control-Allow-Origin', '*');
                oReq.setRequestHeader('Content-Type', 'application/json');
		oReq.onreadystatechange = function() {
			if(oReq.readyState == 4 && oReq.status == 200) {
				console.log("sent message");
                                console.log(oReq);
				console.log(oReq.responseText);
			}
		}
		oReq.send(JSON.stringify(param));
		//oReq.send(null);
	} 
 }

function CreateXMLHttpRequest() {
	if (typeof XMLHttpRequest != "undefined") {
		//All modern browsers (IE7+, Firefox, Chrome, Safari, and Opera) uses XMLHttpRequest object
		return new XMLHttpRequest();
	}
	else if (typeof ActiveXObject != "undefined") {
		//Internet Explorer (IE5 and IE6) uses an ActiveX Object
		return new ActiveXObject("Microsoft.XMLHTTP");
	}
	else {
		throw new Error("XMLHttpRequestnot supported");
	}
}

