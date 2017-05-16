<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>CollabOrg Chat</title>

    <!-- Bootstrap Core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="css/stylish-portfolio.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,700,300italic,400italic,700italic" rel="stylesheet" type="text/css">

</head>

<body>
   
    <!-- Navigation -->
    <a id="menu-toggle" href="#" class="btn btn-dark btn-lg toggle"><i class="fa fa-bars"></i></a>
    <nav id="sidebar-wrapper">
        <ul class="sidebar-nav">
            <a id="menu-close" href="#" class="btn btn-light btn-lg pull-right toggle"><i class="fa fa-times"></i></a>
            <li class="sidebar-brand">
                <a href="#top" onclick=$("#menu-close").click();>CollabOrg Chat</a>
            </li>
            <li>
                <a href="#top" onclick=$("#menu-close").click();>Home</a>
            </li>
             
            <li>
                <a href="first.php" onclick=$("#menu-close").click();>Logout</a>
            </li>
            <li>
                <a href="#team" onclick=$("#menu-close").click();>Team</a>
            </li> 
           
        </ul>
    </nav>

     <!-- Header -->
    <header id="top" class="header">
        <div class="text-vertical-center">
           <h1>                </h1>
             <h1>                </h1>
               <h1>                </h1>
                 <h1>                </h1>
            
            <h1>CollabOrg Chat</h1>
            <h2>A Community-oriented Social Network Platform</h2>
            <h3>This is the admin view.</h3>
            <br>
  <?php
			extract( $_POST );	
   
            // build SELECT query
					
            $query = "DELETE FROM nodes WHERE `instkey`='$select'";

            // Connect to MySQL
            if ( !( $database = mysqli_connect( "localhost",
               "root", "","281" ) ) )                           
               die( "Could not connect to database" );
      
            if ( !( $result = mysqli_query($database,$query ) ) ) {
               print( "Could not execute query! <br />" );
               die( mysqli_error() );
            }
         else{
			  print( "node deleted! <br />" );
			 ?>
			  <a href="deleteform.php" class="btn btn-lg btn-dark">Delete another node</a>
                   <a href="test.php" class="btn btn-lg btn-dark">Go Back To Home</a>
                  
			<?php 			 	 
		 }
?>
       </div>
    </header>               
      <section id="team" class="about">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 text-center">
                   <h3>Our Team</h3>
                   <h4>Divyashri Shreedharan Nair</h4>
                     <h4>Salauni Patel</h4>
                      <h4>Vishnu Kulkarni</h4>
                       <h4>Neha Kumar</h4>
                </div>
            </div>
            <!-- /.row -->
        </div>
        <!-- /.container -->
    </section>
     
    <!-- jQuery -->
    <script src="js/jquery.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="js/bootstrap.min.js"></script>

    <!-- Custom Theme JavaScript -->
    <script>
    // Closes the sidebar menu
    $("#menu-close").click(function(e) {
        e.preventDefault();
        $("#sidebar-wrapper").toggleClass("active");
    });
    // Opens the sidebar menu
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#sidebar-wrapper").toggleClass("active");
    });
    // Scrolls to the selected menu item on the page
    $(function() {
        $('a[href*=#]:not([href=#],[data-toggle],[data-target],[data-slide])').click(function() {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top
                    }, 1000);
                    return false;
                }
            }
        });
    });
    //#to-top button appears after scrolling
    </script>

</body>

</html>


