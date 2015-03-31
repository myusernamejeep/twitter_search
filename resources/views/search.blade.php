@extends('app')


@section('scripts')
	 
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAv5HAgJBjBiQEI2vBXNDrM8sWG3G4T6aE"></script>
 
	
  	 
@endsection
 
 
@section('content')
 
	<div class="container">
		<div class="row">
	      	<div id="map-outer" class="col-md-12"> 
	        	<div id="map-container" class="col-md-12"></div>
      		</div> 
	  	</div> 
	 
	  	<div class="row">
		  	<form class="form-horizontal" name="searchform" id="searchform" >
			    <div class="form-group">
			        <div class="col-md-6">
			            <input type="text" class="form-control" id="city_name" name="city_name" placeholder="City Name" value="Bangkok"/>
			        </div> 
			     
			        <div class="col-md-3">
			            <button type="submit" value="search" id="search" class="btn btn-warning pull-right button_wide">Search</button>
			        </div>
			     
			        <!--<div class="col-md-3">
			            <button type="button" value="history" id="history" class="btn btn-primary pull-right button_wide">History</button>
			        </div>-->
			    </div>
			</form>
		</div> 
	</div><!-- /container -->

	<div id="cd-nav" class="is-fixed">
		<a href="#0" class="cd-nav-trigger">Menu<span></span></a>

		<nav id="cd-main-nav">
			<ul>
				<!--<li><a href="#0">Homepage</a></li>-->
			</ul>
		</nav>
	</div>


@endsection
