db1 = firebase.database();

// sessionStorage.setItem("currentEmail1", currentEmail1);
// if(sessionStorage.getItem(currentEmail1)) {
//     console.log("currentEmail1 if = "+sessionStorage.getItem(currentEmail1));
// }
// else {
//     console.log("currentEmail1  1 else = "+sessionStorage.getItem(currentEmail1));
// }

// checkUserInDB();
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      document.getElementById("loginBtn").style.display = "none";
      document.getElementById("logoutBtn").style.display = "block";
      document.getElementById("myMatchBtn").style.display = "block";
      document.getElementById("userWallet").style.display = "block";

        userGoogle = firebase.auth().currentUser;
        if (userGoogle != null) {
            name1 = userGoogle.displayName;
            currentEmail1 = userGoogle.email;
            photoUrl1 = userGoogle.photoURL;

            sessionStorage.setItem("currentEmailOrijinal", currentEmail1);
            currentEmail1 = currentEmail1.replace("@gmail.com","");
            currentEmail1 = currentEmail1.replace(/[^a-z0-9+]+/gi,"");
            sessionStorage.setItem("currentEmail1", currentEmail1);
            console.log("dfdfdfdfdf = > "+sessionStorage.getItem("currentEmail1"));
            
            // if(!sessionStorage.getItem("currentEmail1")){
                checkUserInDB(); 
            // }

        }

    } else {
      // No user is signed in.
      document.getElementById("loginBtn").style.display = "block";
      document.getElementById("logoutBtn").style.display = "none";
      document.getElementById("myMatchBtn").style.display = "none";
      document.getElementById("userWallet").style.display = "none";
    }
});

function userLogin(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // var token = result.credential.accessToken;
        // var user = result.user;
        console.log(result.user);
    }).catch(function(error) {
        alert("Error in login : "+error.message);
        // var email = error.email;
        // var credential = error.credential;
    });
}

function userLogout(){
    firebase.auth().signOut().then(function() {
        sessionStorage.clear();
        // sessionStorage.setItem("null",currentEmail1);
        // sessionStorage.removeItem("currentEmail1");
        // sessionStorage.removeItem("u_Bal1");
        // setTimeout(function(){ 
            console.log("----logout succeess----"+sessionStorage.getItem("currentEmail1")+"-------"+sessionStorage.getItem("u_Bal1"));
            document.getElementById("loginBtn").style.display = "block";
            // window.location = "index.html";
        // }, 1000);
    }).catch(function(error) {
        alert("Error in logout : " + error.message);
        // window.location = "index.html";
    });    
}


function checkUserInDB()
{
    // console.log("---- pppppp ----"+currentEmail1);
    // console.log("currentEmail1 if = "+sessionStorage.getItem(currentEmail1));
    db1.ref("usrs/"+currentEmail1).once("value", function (data){

        console.log("---- pppppp ----"+currentEmail1);
        // console.log("currentEmail1 if = "+sessionStorage.getItem(currentEmail1));

        if(data.val())
        {
            console.log("---- In DB ----");
            console.log(currentEmail1+"----dataaaaaaaaa  1---"+data.val().balance);
            sessionStorage.setItem("u_Bal1",data.val().balance);
        }
        else if(!data.val() && currentEmail1 != null){
        // if(data.val() != null){
            console.log("---- Not In DBb ----"+(data.val()));
            // console.log(currentEmail1+ "----dataaaaaaaaa balance 2---"+data.val().balance);
            db1.ref("usrs/"+currentEmail1).update({
                balance : 100
            });
            sessionStorage.setItem("u_Bal1",100);
        }else{
            console.log("---- else ----");
        }
    });
}