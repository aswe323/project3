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
// a not-so-dry solution but i really didnt want to start makig reduce and append elements. so yea :P
document.getElementsByTagName('body')[0].addEventListener("click", event =>{validateAllTheThings()});

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

//validator for extravaganius reasons
function validateAllTheThings(){
	console.log('i am working');
	let enableSubmit = true;
	let elementToCheck = null
	console.log('happened');
	//checking name field
	elementToCheck = firstInput;
	if (elementToCheck.value !== "" && isNaN(elementToCheck.value)){
		console.log('a name was given');
	}else if (elementToCheck.value !== "" && isNaN(elementToCheck.value)==false){
		elementToCheck.placeholder = 'REQUIRED:name cant be a number'
		elementToCheck.value="";
		enableSubmit = false;
	}else{
		elementToCheck.placeholder = 'REQUIRED';
		elementToCheck.value="";
		enableSubmit = false;
	};
	//checking mail field
	elementToCheck=document.querySelector('#mail');
	if  (elementToCheck.value.includes('@') && elementToCheck.value.endsWith('.com')){
		console.log('a valid email was given');
	}else{
		elementToCheck.placeholder = 'REQUIRED: a valid email address';
		elementToCheck.value = "";
		enableSubmit = false;
	};
	//checking if an activity was selected
	elementToCheck=document.querySelector('.activities p');
	if (elementToCheck.innerHTML!=='0' && elementToCheck.innerHTML!==""){
		console.log('total cost is: ' + elementToCheck.innerHTML);
	}else{
		elementToCheck.innerHTML='please select an activitie';
		enableSubmit = false;
	}
	//if credit card was selected then check for validity
	if (paymentOptions.value =="credit card"){
		//check for card number field
		elementToCheck=document.querySelector('#cc-num');
		if (elementToCheck.value==""){
			elementToCheck.placeholder ="please enter a valid card";
			elementToCheck.value = "";
			enableSubmit = false;
		}else if (isNaN(elementToCheck.value)){
			elementToCheck.placeholder ="only numbers please";
			elementToCheck.value = "";
			enableSubmit = false;
		}else if(elementToCheck.value.length > 16 || elementToCheck.value.length < 13){
			elementToCheck.placeholder ="out of bounds";
			elementToCheck.value = "";
			enableSubmit = false;
		}
		//check for zip code for
		elementToCheck=document.querySelector('#zip');
		if (isNaN(elementToCheck.value)){
			elementToCheck.placeholder="only numbers";
			elementToCheck.value="";
			enableSubmit = false;
		}else if (elementToCheck.value.length !== 5){
			elementToCheck.placeholder="5 numbers";
			elementToCheck.value="";
			enableSubmit = false;
		}
		//check for cvv field
		elementToCheck=document.querySelector('#cvv');
		if (isNaN(elementToCheck.value)){
			elementToCheck.placeholder="only numebrs";
			elementToCheck.value="";
			enableSubmit = false;
		}else if (elementToCheck.value.length !== 3 ){
			elementToCheck.placeholder="3 numebrs";
			elementToCheck.value="";
			enableSubmit = false;
		}

	}else{}
	isValid(enableSubmit)
}
//takes a true or false value, if true enable submit button if not do nothing
function isValid (bool){
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
} onLoad();

