var historyArr = [];
var historyStr;
var result = 0;
var tempNumber;
var oldResult;
var keycodeArray = {96: "0", 97:"1", 98:"2", 99:"3", 100:"4", 101:"5", 102:"6", 103:"7", 104:"8", 105:"9", 110:".", 13: "=", 111:"/", 106:"*", 109:"-", 107:"+", 46:"AC", 8:"\u21E6", 48: "0", 49:"1", 50:"2", 51:"3", 52:"4", 53:"5", 54:"6", 55:"7", 56:"8", 57:"9", 190:".", 187: "=", 191:"/", 189:"-"};

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
function buttonClick(input){
	//console.log("input: " + input);
  //console.log(typeof input);
  

  if (input === "AC"){
  	//console.log("Clear button!");
    clearCalculator();
  
  //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  }else if (historyArr.length === 0){//must start with number (1-9) or decimal
  	if (/[1-9]/.test(input) || input === "."){
    	//console.log("input is a number or a period");
      tempNumber = input;
      historyArr.push(input);
      historyStr = historyArr.join("");
      //console.log("history Str: " + historyStr);
      $("#history").append(historyStr);
      //console.log("tempnumber: " + tempNumber);
      //console.log("histArrTest: " + historyArr);
    }else{
    	//console.log("must start with number (1-9) or decimal to begin");
    };
  
  //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  }else if (/\d/.test(input) || input === "."){//input is a number or period
  	oldResult = "";//reset old result to prevent "backspacing a result" check from interferring with backspaces
    
  	if (input=== "." && /\./.test(tempNumber)){//if a decimal point has already been used, then do nothing
    	//console.log("decimal already used...ignore input");
    }else{
    	tempNumber += input;
    
  		if (/\d/.test(historyArr[historyArr.length-1]) || historyArr[historyArr.length-1] === ".") {
    		historyArr.pop();
    	};
      
      historyArr.push(tempNumber);
    };
   
    historyStr = historyArr.join("");
    //console.log(historyArr);
    //console.log("history Str: " + historyStr);
    $("#history").append(historyStr);
  
  //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  }else if (input === "="){//equals sign
  	if (/\d$/.test(historyArr[historyArr.length-1])){//previous was a number and ended with a number
    	//console.log("previous input was a number and will begin calculating!!!");
      //console.log("xxxxxxxx previous input: " + historyArr[historyArr.length-1]);
    }else if (/\.$/.test(historyArr[historyArr.length-1])){//previous input ended with a decimal
    	if (historyArr.length === 1){//decimal without number and equals accidentally clicked
      	//console.log("whoops equals hit with decimal"); 
      }else{//decimal entered in error and is removed
      	historyArr[historyArr.length-1] = historyArr[historyArr.length-1].replace(/\./, "");
      };
    	
    }else{//previous input was an operator
    	//console.log("previous input was NOT a number or decimal and will be removed");
      historyArr.pop();
    };
    
    historyStr = historyArr.join("");
    //console.log("history Str: " + historyStr);
    //console.log(historyArr);
    $("#history").append(historyStr);//appends input before calculation
    
    var result = calculate(historyArr);
    
    if (isNaN(result)){
    	//console.log("result is NAN");
    	$("#result").append("Error");	
      historyArr = [];
      historyStr = "";
      tempNumber = "";
      result = 0;
      oldResult = "";
    }else if ((result.toString()).length > 13){
      //console.log("reached character limit!");
      historyArr = [];
      historyStr = "";
      tempNumber = "";
      result = 0;
      oldResult = "";
      $("#result").append("Error");
      $("#history").empty();
      $("#history").append("Character Limit");
    }else{
    	$("#result").append(result);
      historyArr = [result.toString()];
      tempNumber = "";
      //console.log("tempNumber: " + tempNumber);
      oldResult = result;
    };
  
  //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  }else if(input === "\u21E6"){//backspace
  	//console.log("xxxxx test: ");
    //console.log(historyArr);
    //console.log("Oldresult: " + oldResult);
    
  	if (historyArr.length === 0 || historyArr[0] == oldResult){
    	//console.log("nothing to backspace!");
    }else{
    	//console.log("backspacing!");
      var lastInput = historyArr[historyArr.length-1];
      //console.log("last input: " + lastInput);
      
      if (lastInput.length === 1){
      	//console.log("backspacing operator or lone number/decimal");
        historyArr.pop();
        //console.log(historyArr);
        if (/\d/.test(historyArr[historyArr.length-1])){//if input before lastInput is not an operator, make continuation of tempNumber possible
        	//console.log("xx crurent testt");
          //console.log(historyArr[historyArr.length-1]);
          tempNumber = historyArr[historyArr.length-1];
        }else{
        	tempNumber = "";
        };
        
      }else{
      	//console.log("backspacing from string of numbers");
        historyArr.pop();
        var backspacedInput = lastInput.substring(0, lastInput.length-1);
        //console.log(backspacedInput);
        historyArr.push(backspacedInput);
        tempNumber = backspacedInput; 
      };
      
      //console.log("tempnumber: " + tempNumber);
      
    };
    
    historyStr = historyArr.join("");
    $("#history").append(historyStr);	
 	
  //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  }else if (input == "%"){//percentage clicked
  	oldResult = "";//reset old result to prevent "backspacing a result" check from interferring with backspaces
  	//console.log("PERCENTAGE CLICKED!");
  	var lastInput = historyArr[historyArr.length-1];
    //console.log("lastInput: " + lastInput);
  	//console.log("tempNumber: " + tempNumber);
    
    if (/\d/.test(lastInput) || /\./.test(lastInput)){//not an operator
    	//console.log("last input has numbers or decimals and is not an operator");
      
      if (/\.$/.test(lastInput)){//decimal at end and will be removed
        //console.log("decimal at end will be removed");
        
        if (lastInput.length == 1){
        	//console.log("decimal is by itself");
          historyArr[historyArr.length-1] = 0;
        }else{
          var decimalRemoved = historyArr[historyArr.length-1].replace(/\.$/, "");
          historyArr[historyArr.length-1] = ((decimalRemoved * 0.01).toFixed(2)).toString();
          //console.log("historyArr: " + historyArr);
        };
        
      }else{
        //console.log("old: " + historyArr[historyArr.length-1]);
      	historyArr[historyArr.length-1] = ((historyArr[historyArr.length-1] * 0.01).toFixed(2)).toString();
        //console.log("new: " + historyArr[historyArr.length-1]);
      };
      
    }else{//last input is an operator
			//console.log("last input is an operator, operator will be removed");
      historyArr.pop();
      historyArr[historyArr.length-1] = (historyArr[historyArr.length-1] *0.01).toString();
      
    };
  	
    historyStr = historyArr.join("");
    $("#history").append(historyStr);	
  
  //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  }else{//input is an operator
  	oldResult = "";//reset old result to prevent "backspacing a result" check from interferring with backspaces
    
  	if (historyArr[historyArr.length-1] === input){
    	//console.log("same operator, doing nothing");
    }else if (/\d$/.test(historyArr[historyArr.length-1])){//previous input was a number
    	//console.log("Previous input was a number and new input is an operator");
    	tempNumber = "";
    	historyArr.push(input);
    }else if (/\.$/.test(historyArr[historyArr.length-1])){//previouss input ended in a decimal
    	//console.log("previous input was a decimal");
      
      if (/\d/.test(historyArr[historyArr.length-1])){//if decimal was a mis-click and a number is present
      	//console.log("decimal was a mis-click");
      	historyArr[historyArr.length-1] = historyArr[historyArr.length-1].replace(/\./, "");
        tempNumber = "";
        historyArr.push(input);
      }else{
      	//console.log("cannot start with a decimal and operator");
      }
      
    }else{//previous input was an operator and will be replaced with the new input
    	//console.log("previous input was an operator, replacing with new input");
      historyArr.pop();
      historyArr.push(input);
    };
    
  	historyStr = historyArr.join("");
    //console.log(historyArr);
    //console.log("history Str: " + historyStr);
    $("#history").append(historyStr);	
  };
  
  
}

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
function calculate(inputArr){
	var result;
  var tempOperator;
  $("#result").empty();
  
	//console.log("input: " + inputArr);
  
  for (var i=0; i<inputArr.length; i+=2){
  	var currentNumber = parseFloat(inputArr[i]);
    //console.log("currentNumber: " + currentNumber);
    
    if (i === 0){
    	result = currentNumber;
      
    }else{
    
      switch (inputArr[i-1]){
        case "+":
          //console.log("operator is Plus sign");
          result += currentNumber;
          break;
        case "-":
          //console.log("operator is minus sign");
          result -= currentNumber;
          break;
        case "*":
          //console.log("operator is multiplication sign");
          result *= currentNumber;
          break;
        case "/":
          //console.log("operator is division sign");
          result /= currentNumber;
          break;
        case "%":
          //console.log("operator is percentage sign");
          //console.log("fix later do nothing");
          break;
      };
      
  	};  
    
  };
  //console.log("result: " + result);
  //console.log("result Length: " + (result.toString()).length);
  
  if (/\./.test(result)){//if result has a decimal
  	//console.log("result has a decimal");
    var resultDecimal = (result.toString()).match(/\.\d+/g);
    //console.log("resultDecimal: " + resultDecimal[0]);
    //console.log("resultDecimal length: " + resultDecimal[0].length);
    
    if (resultDecimal[0].length > 3){//used to avoid extra long decimals
    	//console.log("length is too long");
      result = result.toFixed(2);
    };
  };
  
 	return result;
 
};

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
function clearCalculator(){
	$("#result").empty();
	historyArr = [];
  historyStr = "";
  tempNumber = "";
  result = 0;
  oldResult = "";
  $("#result").append(result);
  
	//console.log("working");
  //console.log("historyArr: " + historyArr);
  //console.log("historyStr: " + historyStr);
  //console.log("tempNumber: " + tempNumber);
};


$(document).ready(function(){
	$("#result").append(result);
  $("#history").append(historyStr);
  
	$(".button").hover(
  function() {
    $( this ).addClass( "hover" );
  }, function() {
    $( this ).removeClass( "hover" );
  });
  
  $(".button").click(function(){
  	$("#history").empty();
 		var $buttonValue = $(this).text();
    buttonClick($buttonValue);
  });
  
  //For keyboard entry xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
	var $shift = false;
  
	$(document).keyup(function(e) {
    //console.log("Keystroke: " + e.keyCode);

		if (e.keyCode == 16){
    	$shift = false;
      //console.log("shift: " + $shift);
    }else{
   	
      for (var key in keycodeArray){
    		if (e.keyCode == key && $shift){
        	var $tempKeyStroke = "";
        	switch(e.keyCode){
          	case 187:
              //console.log("keystroke is equal to: +");
              $tempKeyStroke = "+";
              break;
          	case 56:
              //console.log("keystroke is equal to: *");
              $tempKeyStroke = "*";
              break;
            case 53:
              //console.log("keystroke is equal to: %");
              $tempKeyStroke = "%";
              break;
          };
          
          //console.log("test statement after switch");
          $("#history").empty();
        	buttonClick($tempKeyStroke);
          
        }else if(e.keyCode == key){
          //console.log("keystroke is equal to: " + keycodeArray[key]);
          $("#history").empty();
        	buttonClick(keycodeArray[key]);
        };
      };  
    };  
	});
  
  $(document).keydown(function(e){
  	if (e.shiftKey){
    	//console.log("shift has been pressed");
    	$shift = true;	
      //console.log($shift);
  	};
  });
  
})


