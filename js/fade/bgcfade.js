function addEvent(el, type, func){
	if (el.addEventListener){ //standard way
		el.addEventListener(type, func, false);
	}
	else if (el.attachEvent){ //IE way
		el.attachEvent('on'+type, func);
	}
	else { 
		var origEventHandler = el['on'+type];
		el['on'+type] = function(){
			if (typeof origEventHandler == 'function'){			
				origEventHandler();
			}
			func();
		}
	}
}

function startfade()
	{
		var fadestatus = 0,
			maxcolors = 4,
			fadespeed = 6000,
			element = $("body"); // Set your colors value

		setInterval(function(){

			while(fadestatus == 0) // set these counters
			{
				element.switchClass( "fadeone", "fadetwo", fadespeed, "easeInOutQuad" );
				fadestatus =  Math.floor((1+maxcolors)*Math.random());
			}
			while(fadestatus == 1)
			{
				element.switchClass( "fadetwo", "fadethree", fadespeed, "easeInOutQuad" );
				fadestatus =  Math.floor((1+maxcolors)*Math.random());
			}
			while(fadestatus == 2)
			{
				element.switchClass( "fadethree", "fadefour", fadespeed, "easeInOutQuad" );
				fadestatus =  Math.floor((1+maxcolors)*Math.random());
			}
			while(fadestatus == 3)
			{
				element.switchClass( "fadefour", "fadefive", fadespeed, "easeInOutQuad" );
				fadestatus =  Math.floor((1+maxcolors)*Math.random());
			}
			while(fadestatus == 4)
			{
				element.switchClass( "fadefive", "fadeone", fadespeed, "easeInOutQuad" );
				fadestatus =  Math.floor((1+maxcolors)*Math.random());
			}
			
		}, 1000);
	}

	startfade();


