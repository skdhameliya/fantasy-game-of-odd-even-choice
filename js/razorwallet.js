db = firebase.database();

match_Name = "apr_09_2021_mi_rcb_";

currentEmail1 = sessionStorage.getItem("currentEmail1");
// console.log("-->>"+currentEmail1);

document.getElementById("userWallet").onclick = function() { showBalance(); };
function showBalance()
{
    db.ref("usrs/"+currentEmail1).once("value", function (data){
        document.getElementById("userBalance").innerHTML = data.val().balance;
        console.log(data.val().balance+"------ok ko------"+currentEmail1);
    });
}



function loadTotalOddEvenNo(entryFeeRs){
    db.ref(match_Name+entryFeeRs+"rs/").on("value", function (data){
        odd11 = data.child("oddParti").numChildren();
        even11 = data.child("evenParti").numChildren();
        document.getElementById("totalOdd").innerHTML =  odd11;
        document.getElementById("totalEven").innerHTML =  even11;
        // document.getElementById("totalEven").innerHTML =  data.child("evenParti").numChildren();
    });   
    
    document.getElementById("entryFee").innerHTML = entryFeeRs;
    document.getElementById("oddBtn").onclick = function() { userChoice('odd',entryFeeRs); };
    document.getElementById("evenBtn").onclick = function() { userChoice('even',entryFeeRs); };
}


function addMoneyByUser()
        {
            var userEnteredAmount = Number(document.getElementById("userEnteredAmount").value);
            if(userEnteredAmount >= 1)
            {
                var options =   {
                    "key": "rzp_test_0piQdGUrf3AD7X", // Enter the Key ID generated from the Dashboard
                    "amount": userEnteredAmount*100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                    "currency": "INR",
                    "name": "demo che moj karo",
                    "description": "Paying to masterchoice.web.app",
                    "image": "https://example.com/your_logo",
                    //"order_id": "order_9A33XWu170gUtm", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                    "handler": function (response){
                        saveToDBFire(response, userEnteredAmount);
                        // console.log(userEnteredAmount);
                    },
                    "prefill": {
                        "name": "demo che moj karo",
                        "email": "demo che moj karo@demo.demo",
                        "contact": "9999999990"
                    },
                    "notes": {
                        "address": "Razorpay Corporate Office"
                    },
                    "theme": {
                        "color": "#3399cc"
                    }
                };
                var rzp1 = new Razorpay(options);
                rzp1.open();
            }
            else
            {
                alert("Minimum 1 Rs is required");
            }
        }
        function saveToDBFire(response,userEnteredAmount)
        {
            console.log(response);
            // console.log(response.razorpay_payment_id);
            // console.log(response.razorpay_order_id);
            // console.log(response.razorpay_signature)

            db.ref("usrs/"+currentEmail1).once("value", function (data){
                u_bal = data.val().balance;
                
                var balance = u_bal;
                balance = balance+userEnteredAmount;
                document.getElementById("userBalance").innerHTML = balance;
                document.getElementById("userEnteredAmount").placeholder = "Amount";
                sessionStorage.setItem("u_Bal1",balance);

                db.ref("usrs/"+currentEmail1).update({
                    balance : balance
                });
            });   
            
            
        }
// =================================================================================================================================

function userChoice(choice, entryFeeRs)
{
    // var xx = document.getElementById("usrNm").value;
    // var d = new Date();
    // var d1 = d.getTime();

    
    // console.log(currentEmail1);
    // if(currentEmail1)
    if(currentEmail1 && sessionStorage.getItem("u_Bal1"))
    {
        // console.log(sessionStorage.getItem("u_Bal1"));
        var balance1 = Number(sessionStorage.getItem("u_Bal1"));
        // var balance1 = Number(document.getElementById("userBalance").innerHTML);
        if (confirm("Your choice is "+choice+". Are you sure want to pay "+entryFeeRs+" Rs?")) 
        {
            //pressed OK
            balance1 = balance1 - entryFeeRs;
            if(balance1 >= 0)
            {
            
                document.getElementById("userBalance").innerHTML = balance1;

                if(choice == "odd")
                {//equal then 0 

                    var newPostKey = db.ref(match_Name+entryFeeRs+"rs/oddParti/").push();
                    newPostKey.update({
                        uk : currentEmail1
                    });

                    db.ref(match_Name+entryFeeRs+"rs/users/"+currentEmail1).once("value" ,function (data2){
                        if(data2.val()){
                            var s1 = data2.val().oddPartiMatch;
                            s1 = s1 + "@" + newPostKey.key;

                            db.ref(match_Name+entryFeeRs+"rs/users/"+currentEmail1).update({
                                oddPartiMatch : s1
                            });
                        }
                        else{
                            db.ref(match_Name+entryFeeRs+"rs/users/"+currentEmail1).update({
                                oddPartiMatch : newPostKey.key
                            });
                        }
                    });

                    db.ref("usrs/"+currentEmail1).update({
                        balance : balance1
                    });
                    sessionStorage.setItem("u_Bal1", balance1);
                }
                else if(choice == "even"){
                    
                    var newPostKey1 = db.ref(match_Name+entryFeeRs+"rs/evenParti/").push();
                    newPostKey1.update({
                        uk : currentEmail1
                    });

                    db.ref(match_Name+entryFeeRs+"rs/users/"+currentEmail1).once("value" ,function (data1){
                        if(data1.val()){
                            var s1 = data1.val().evenPartiMatch;
                            s1 = s1 + "@" + newPostKey1.key;

                            db.ref(match_Name+entryFeeRs+"rs/users/"+currentEmail1).update({
                                evenPartiMatch : s1
                            });
                        }
                        else{
                            db.ref(match_Name+entryFeeRs+"rs/users/"+currentEmail1).update({
                                evenPartiMatch : newPostKey1.key
                            });
                        }
                    });

                    db.ref("usrs/"+currentEmail1).update({
                        balance : balance1
                    });
                    sessionStorage.setItem("u_Bal1", balance1);

                }
                
                alert("Participation is successfully done. Check my matches section ");
            }
            else{
                balance1 = balance1 + entryFeeRs;
                alert("Insufficient Balance->"+balance1);
            }
            
        }
        else{
            //pressed Cancel
            alert("Cancelled by user.-> "+balance1);
        }
    }
    else
    {
        alert("Please login first");
        // console.log(currentEmail1);
        // console.log(sessionStorage.getItem("u_Bal1"));
    }

}