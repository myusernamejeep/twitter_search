/*
	Twitter search project.

	
*/

function TwitterSearch() {
 
 	var var_location = new google.maps.LatLng(13.8860,100.57559); // first location of map.
	var var_mapoptions = {
		 zoom: 11
		,center: var_location
		,mapTypeId: google.maps.MapTypeId.ROADMAP
	}; // map config.
	var var_map = new google.maps.Map(document.getElementById("map-container"), var_mapoptions);  // map.
	var lifespan = 60*60*1000; // cache in 1 hour.
 
    var timer;	// timer interval add marker.
    var keyHistory = "history";  // history cache key name.
    var markersArray = [];   // collect all marker.  
	var numOfTweets = 50;    // max number of tweet from api.

    /*
		initialize map
		bind button event
    */
	function map_init() 
	{
 	  
	 	$("#search").click(function(e) {
			e.preventDefault();
		    var city_name = $('#city_name').val();
		     
		    if (city_name) { 
		    	fetchTweetInAddress(city_name, showTweets );
		 	}

		    return false;
		});
	 	 
 		updateHistory();
	} 

 	/*
		fetch address lat,lng
 	*/
	function fetchTweetInAddress(address , handleData)
	{
		var geocoder = new google.maps.Geocoder();
	   	
	   	var self = this;
	   	if (geocoder) {
	   		// get location by city name
	      	geocoder.geocode({ 'address': address }, function (results, status) {
	         	if (status == google.maps.GeocoderStatus.OK) {
	         		var location = results[0].geometry.location; 
	            	var lng = location.lng();
		            var lat = location.lat(); 

		            if (lng && lat) {

		            	// pan map to city
		            	var latLng = new google.maps.LatLng(lat, lng);
        				var_map.panTo(latLng);
 
						var url =  'search?lat='+lat+'&lng='+lng+'&count='+numOfTweets; 
					 	 
		            	// check data in cache
		            	var key = 'tweets@'+ address;
		            	var keyTS = 'ts@'+ address;
		            	var tweets = [];
		      
		            	if (localStorage && (!localStorage.getItem(key) || !localStorage.getItem(keyTS) || parseInt($.now(), 10) - parseInt(localStorage.getItem(keyTS), 10) > lifespan)) {
				          	$.ajax({
				                url: url, 
				                dataType: 'json',
				                success: function (data) {
 
								    $.each(data.statuses, function(){ 
								        if(this.geo != undefined && this.geo.coordinates.length >= 2){
								        	var _tweet = {
								        		lat:this.geo.coordinates[0],
								        		lng:this.geo.coordinates[1],
								        		text:this.text,
								        		photo:this.user.profile_image_url, 
								        		date:this.created_at
								        	}
								            tweets.push(_tweet);
								        }
								    });
								     
								    if (localStorage) {
				                        localStorage.setItem(key, JSON.stringify(tweets));
				                    }  

 									handleData(tweets);	
				                }

				            });

				            localStorage.setItem(keyTS, $.now());
				           
				        }
				        else{
				        	if (localStorage && localStorage.getItem(key)) {
				            	tweets = JSON.parse(localStorage.getItem(key));
				            	handleData(tweets);
					        } 
				        }

				        addHistory(address); 
		            } 
	         	}
	         	else {
	            	console.log("Geocoding failed: " + status);
	         	}
	      	});
	   	}  
	} 
	/*
		add tweet marker in map.
	*/
	function showTweets(tweets)
	{
		clearOverlays();

		//console.log(tweets);
		timer = setInterval(function(){
	        if(tweets.length === 0) {
	            clearTimeout(timer);
	            return;
	        }
	        var tweet = tweets.shift();
	    
	    	addMarker(tweet.lat,tweet.lng,tweet.text,tweet.photo,tweet.date);
	    }, 200); 
	}

	/*
		clear all marker.
	*/
	function clearOverlays() {
	  	for (var i = 0; i < markersArray.length; i++ ) {
	    	markersArray[i].setMap(null);
	  	}
	  	markersArray.length = 0;
	}

	/*
		create marker and info window.
	*/
	function addMarker(lat,lng,text,photo,date)
	{
		var _location = new google.maps.LatLng(lat,lng);
	
		var marker = new google.maps.Marker({
			map:  var_map,
			draggable: false,
			icon: photo,
			position: _location,
			visible: true
		});
		markersArray.push(marker);

		var var_infobox_props = {
			 content: "<strong>"+ text +"</strong><br> <small> "+ date + "</small>"
			,disableAutoPan: false
			,maxWidth: 0
			,pixelOffset: new google.maps.Size(-10, 0)
			,zIndex: null
			,boxClass: "myInfobox"
			,closeBoxMargin: "2px"
			,closeBoxURL: "public/img/close.png"
			,infoBoxClearance: new google.maps.Size(1, 1)
			,visible: true
			,pane: "floatPane"
			,enableEventPropagation: false
		};

		google.maps.event.addListener(marker, "click", function (e) {
			var_infobox.open( var_map, this);
		});


		var var_infobox = new InfoBox(var_infobox_props); 
	}

	/*
		add city history to cache
	*/
	function addHistory(address)
	{ 
		if (localStorage )
		{	
			var histories = getHistory();
			if (histories.indexOf(address) == -1 ){
				histories.push(address);
				localStorage.setItem(keyHistory, JSON.stringify(histories));
			} 
		} 

		updateHistory();
	}

	/*
		get city history from cache
	*/
	function getHistory()
	{ 
		if (localStorage && (localStorage.getItem(keyHistory)))
		{
			var histories = [];
			try{
				histories = JSON.parse(localStorage.getItem(keyHistory));  
			}catch(e)
			{
				console.log(e.message);
			}
			
			return histories; 
		}

		return [];
	}

	/*
		udate ui history list
	*/
	function updateHistory()
	{
		var histories = getHistory();
		var history_list = $('#cd-main-nav ul');
		history_list.empty();
		$.each(histories, function(indx,history){  
			history_list.append('<li><a href="javascript:void(0);" onclick="return ts.fetchTweetInAddress(\''+ history +'\',  ts.showTweets );">'+ history +'</a></li>');					         
	    });
								     
	}


	return {
		map_init:map_init,
		fetchTweetInAddress:fetchTweetInAddress,
		showTweets:showTweets,
		addMarker:addMarker,
		updateHistory:updateHistory,
		addHistory:addHistory,
		getHistory:getHistory,
		clearOverlays:clearOverlays
	}
}
 
 
var ts = new TwitterSearch();
google.maps.event.addDomListener(window, 'load', ts.map_init);		