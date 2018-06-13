/*
 * TO-ADD:
 *
 *	completed: on page load make the first text field focus
 *	completed:when the 'outer' option is selected in the 'job role' drop down menu, make a text field apper
 *		*set field placeholder to 'you job here'
 *		*set field id to 'outer-title
 *	completed:If the user selects "Theme - JS Puns" then the color menu should only display "Cornflower Blue," "Dark Slate" Grey," and "Gold."
 *
 *	conpleted:If the user selects "Theme - I <3 JS" then the color menu should only display "Tomato," "Steel Blue," and "Dim Grey."
 *
 *	complete:for the activities, disable activities that overlap with the users choices.
 *		*make sure they undisabled when the user regrets his decision :P
 *		*make a total cost field in the buttom
 *
 *	completed:hide the color menu when the desgin isnt selected yet.
 * 	completed:hide payment options that arent selected, and disable he 'select payment option' pre selection text.
 *---> 	completed: form falidation
 * 		1.name field value cant be blank
 * 		2.check for valid email format in email field. (regex? specific strings?)
 * 		3.check for checked boxes in the checkboxes arrey, if one is selected return false.
 * 		4.for payment options
 * 			*credit card return true if between 13 to 16 value long.
 * 			*zip code true if 5 value long
 * 			*cvv true if 3 digit long
 * 	
 *		for each false value, attach a dedicated message, and display it above the corresponding element.
 *		HOWTO: add a global event handeler, that triggeres with every change to the html. 
 *			make short if statements for each check that evaluate to true or false. 
 *			make a function that will add or remove warning messages above the appropriate element.
 *				and disable the submit button.
 *
 *	TODO:make sure to update the lists when  all the current todo's are done 
 * 	KNOWN BUGS:
 *	email validation:
 *		look up how to validate email address.
 *
 *	TO REFACTOR:
 *		TODO:refactor the disableOther function to be more concise. (high order function?)
 * */

//accessing neccesery elements
const firstInput = document.querySelector('input');//first input element
const titleSelect = document.getElementById('title');//job rule menu
const textArea = document.querySelector("#other-title");//text area below job rule menu
//design menu acceses
const designMenu = document.querySelector("#design");// design style menu
const colorMenu = document.querySelector("#color"); // color menu 
// checkboxes in the activities form
const checkBoxes = document.querySelectorAll('.activities input');
//activities form
const checkBoxForm =document.querySelector('.activities');
//labels of check boxes
const checkBoxLabels = document.querySelectorAll(".activities label");
//acces to the payment options menu
const paymentOptions = document.querySelector("#payment");
const paymentOptionsSelectables = paymentOptions.querySelectorAll('option');
//acess to payment divs
const creditCardDiv = document.querySelector('.credit-card');//credit card div
const paymentDivs= paymentOptions.parentNode.querySelectorAll('fieldset>div');//all divs in the payment fieldset
//acces to submit element
const submitButton = document.querySelector('button');
/*-------------------------------------------------|
 *              event listeneers                   |
 *-------------------------------------------------|
 */
var validity = false;
//check for validation on every keyup 
var keyTarget = document.addEventListener('keyup', (event)=>validation(event.target));

//every focus out, check if the value is correct,if not deleting the value to display the placeholder
document.addEventListener('focusout',(event)=>focusOut(event.target , validity));

titleSelect.addEventListener('change', event => {  //if other is selected then display a textarea if its not selected then  hide it
		if (event.target.value === "other"){
			textArea.style.display="";
		}else{
			textAreaHide();
		}
	}
)


var main = false;
checkBoxForm.addEventListener('change', event =>{  //event listener for specific button groups
	const tNineToTwelve = [checkBoxes[1] , checkBoxes[3]];//arrey of checkbox elements, Tusday nine am to 12pm
	const tOneToFour = [checkBoxes[2] , checkBoxes[4]];//arrey of checkboxes elements, tusday one pm to four pm
	disableOther(event.target, tNineToTwelve);	
	disableOther(event.target, tOneToFour);
	//use a reduce function to check if the element is checked if true and pos 0 then add 200, else if true add 100, else, nothing;
	let totalCost = Array.from(checkBoxes).reduce((costSum, box)=>{
		if (box.checked && box == checkBoxes[0]){
			costSum  = costSum + 200;
		}else if (box.checked && box !== checkBoxes[0]){
			costSum  = costSum + 100;
		}		
		return costSum;
	}, 0)
	//adding total cost to the inner html of the p element under the checkboxes
	checkBoxForm.querySelector('p').innerHTML = totalCost;	
	//WARNING: check specific wanted behavior in the site (disable checkboxes or change with out disableing)
	//
}
)

//event listener for the select menu in the payment option
paymentOptions.addEventListener('change', event =>{
	let indexValue=0;
	let selected = paymentOptionsSelectables.forEach((x,index)=>{
		if(x.value == event.target.value){indexValue = index};
	});
	if (indexValue === 0){return}else{};
	paymentDivs.forEach(x=>hideElement(x));
	paymentDivs.item(indexValue-1).style.display = '';
	//show the selected div
})

designMenu.addEventListener('change', event =>{  //desgin event listener, updates the color menu on change,
	if (designMenu.value == "Select Theme"){
		hideElement(colorMenu.parentNode)

	}else{
		showElement(colorMenu.parentNode)
	};
	hideColors();
	colorMenu.value = "";
	if (event.target.value === 'js puns'){
		colorMenu.children[0].style.display="";
		colorMenu.children[1].style.display="";
		colorMenu.children[2].style.display="";
	}else if (event.target.value == 'heart js'){
		colorMenu.children[3].style.display="";
		colorMenu.children[4].style.display="";
		colorMenu.children[5].style.display="";
	}

})

/*-------------------------------------------------|
 *              function that are used             |
 *-------------------------------------------------|
 */
//function to call every focusout, that wil delete the content of a field if not valid
function focusOut(target, validity){
	if (!validty){
		target.value="";
	}
}

var activityValidation = null;
var ccvValidation = null;
var paymentValidity= null;
var zipValidation = null;
var creditNumberValidation = null; 
var emailValidation = null;
var nameValidation = null;
//a function that takes keyTarget and validates the element
function validation(keyTarget){
	//checks if the keyTarget is the first element

	if (keyTarget === firstInput){
		if (keyTarget.value == ""){
			keyTarget.placeholder ="you name please";	
			hideElement(submitButton);
			return
		}else if (isNaN(keyTarget.value) == false){
			keyTarget.placeholder ="no numbers please";		
			hideElement(submitButton);
			return
		}else{
			console.log('name is good');
			keyTarget.placeholder="";
			nameValidation = true;}
			validity = true;
	}
	//checks if the target is the email element
	if(keyTarget === document.querySelector('#mail')){
		if(keyTarget.value == ""){
			keyTarget.placeholder="required";
			hideElement(submitButton);
			return
		}else if(keyTarget.value.includes('@')=== false || keyTarget.value.includes('.com') === false ){
			keyTarget.placeholder="invalid email address";
			hideElement(submitButton);
			return
		}else{
			console.log('email is good');
			keyTarget.placeholder="";
			emailValidation = true;
			validity = true;
		}
	}
	//if the chosen payment mathod is credit card
	if (paymentOptions.value == "credit card"){
		//check if the target is the cc-num field
		if (keyTarget === document.querySelector('#cc-num')){
			if (keyTarget.value.length > 16){
				keyTarget.placeholder="number is too long";
				hideElement(submitButton);
				return
			}else if (keyTarget.value.length < 13){
				keyTarget.placeholder="number is too short";
				hideElement(submitButton);
				return
			}else if (keyTarget.value==""){
				keyTarget.placeholder="required";
				hideElement(submitButton);
				return	
			}else if (isNaN(keyTarget.value)){
				keyTarget.placeholder="numbers only";
				hideElement(submitButton);
				return	
			}else{
				console.log('credit number is good');
				keyTarget.placeholder="";
				creditNumberValidation=true;
				validity = true;
			}
		}

		//check if the target is the zip code field
		if (keyTarget === document.querySelector('#zip')){
			if (keyTarget.value === ""){
				keyTarget.placeholder="requried";
				hideElement(submitButton);
				return	
			}else if (keyTarget.value.length < 5 || keyTarget.value.length > 5){
				keyTarget.placeholder="invalid";
				hideElement(submitButton);
				return	 
			}else if (isNaN(keyTarget.value)){
				keyTarget.placeholder="numbers only";
				hideElement(submitButton);
				return	 
			}else{ 
				console.log('zip is good');
				keyTarget.placeholder="";
				zipValidation = true;
				validity = true;
			}
		}
		//check if target is ccv field
		if (keyTarget === document.querySelector('#cvv')){
			if (keyTarget.value == ""){
				keyTarget.placeholder="required";
				hideElement(submitButton);
				return
			}else if(isNaN(keyTarget.value)){
				keyTarget.placeholder="numbers";
				hideElement(submitButton);
				return
			}else if (keyTarget.value.length < 3||keyTarget.value.length > 3){
				console.log('NotInRange');
				keyTarget.placeholder="invalid";
				hideElement(submitButton);
				return
			}else{
				console.log('cvv is good');
				keyTarget.placeholder="";
				ccvValidation = true;
				validity = true;
		}
	}
	}
	if (ccvValidation && creditNumberValidation && zipValidation){
		var paymentValidity = true;
	}
	if (paymentOptions.value == "paypal"|| paymentOptions.value == "bitcoin"){
		var paymentValidity= true;
	}
	//check if there is at lest one check box checked	
	checkBoxes.forEach(x=>{
		if(x.checked){activityValidation = true}
		}
	);

	if (activityValidation && paymentValidity && nameValidation && emailValidation){showElement(submitButton)};

}



//takes a true or false value, if true enable submit button if not do nothing
function isValid (bool){
	console.log(enableSubmit);
	if (bool) { 
		submitButton.removeAttribute('disabled' , 'true');
		submitButton.style.color = "";
	}else{
		disableSubmit();
	}

}

//cost of activities
function totalCostElement(){
//create a p element and add it to the end of the activities field
	const sumElement = document.createElement('p');
	checkBoxForm.appendChild(sumElement);
}



//toggle function for disabled and enabled groups of two elements
function disableOther (checkbox, arrey){
	//if the check box is disabled then enable it
	if(arrey.includes(checkbox)){}else{return};
	if (arrey[1].hasAttribute('disabled', 'true')|| arrey[0].hasAttribute('disabled', 'true')){
		arrey.splice(arrey.indexOf(checkbox),1);
		arrey[0].removeAttribute('disabled');
		arrey[0].parentNode.style.background = '';
		return;
	//otherwise if the arrey has the target element, disable the outer element in the arrey
	}else if (arrey.includes(checkbox)){
		arrey.splice(arrey.indexOf(checkbox),1);
		arrey[0].checked = false;
		arrey[0].setAttribute('disabled', 'true');
		arrey[0].parentNode.style.background = 'grey';
		return;
	}	
}

//on start settings for pamet options
function paymentSettings (){
	paymentOptionsSelectables[0].remove();
	paymentOptions.value ="credit card";
	//hide all divs then show creditcard div
	paymentDivs.forEach((x)=>hideElement(x));
	showElement(creditCardDiv);
}


//hiding a given element.
function hideElement(element){
	return element.style.display ="none";
}

//showing the given element 
function showElement(element){
	return element.style.display="";
}

//undisplaying the options in the color menu
function hideColors(){
	colorMenu.querySelectorAll('option').forEach((color)=>hideElement(color)); 
}

//on page load (when the js is loaded i gues?) make the first textfield focus
function setFocus (){
	firstInput.setAttribute('autofocus', 'true');
}

//hide the textfield
function textAreaHide(){
	textArea.style.display="none";
}

//fucntion that disables the submit buttona nd set its color to grey
function disableSubmit (){
	submitButton.setAttribute('disabled', 'true');
	submitButton.style.color = "grey";
}


//wha will happen when the js is loaded
function onLoad(){
	setFocus();
	textAreaHide();
	hideColors();
	paymentSettings();
	hideElement(colorMenu.parentNode);
	totalCostElement();
	disableSubmit();
}
onLoad();
