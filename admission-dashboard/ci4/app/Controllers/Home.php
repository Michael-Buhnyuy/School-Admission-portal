<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index(): string
    {
        return view('welcome_message');
    }
    public function about(){
        echo '<h1>About Page</h1>';
    }
    public function profile($id){
        echo $id;
    }

}
