<?php namespace App\Http\Controllers;
 
use TwitterAPIExchange; 
use App\Http\Requests\SearchRequest;
use Config;

class SearchController extends Controller {

	/*
	|--------------------------------------------------------------------------
	| Search Controller
	|--------------------------------------------------------------------------
	|
	| This controller renders the "marketing page" for the application and
	| is configured to only allow guests. Like most of the other sample
	| controllers, you are free to modify or remove it as you desire.
	|
	*/
	 
	/**
	 * Create a new controller instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		$this->middleware('guest');
	}

	/**
	 * Show the application search screen to the user.
	 *
	 * @return Response
	 */
	public function index()
	{
		return view('search');
	}

	/**
	 * call twitter search/tweets api .
	 *
	 * @return api_response
	 */
	public function api(SearchRequest $request)
	{
		$lat = $request->input('lat');
		$lng = $request->input('lng');
		$count = $request->input('count');
		
		$settings = Config::get('twitter');

		$url = 'https://api.twitter.com/1.1/search/tweets.json';
		$getfield = "?q=&geocode=$lat,$lng,50km&count=$count";
		$requestMethod = 'GET';
		$twitter = new TwitterAPIExchange($settings);
		 
		$api_response = $twitter ->setGetfield($getfield)
		                     ->buildOauth($url, $requestMethod)
		                     ->performRequest();
		 
		header('Content-Type: application/json');
		//return response()->json( $api_response );
		echo $api_response;
	}
}
