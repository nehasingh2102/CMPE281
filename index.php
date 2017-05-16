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
                <a href="#about" onclick=$("#menu-close").click();>About</a>
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
                   <h1>                </h1>
            <h1>CollabOrg Chat</h1>
            <h2>A Community-oriented Social Network Platform</h2>
            <h3>Choose who you are.</h3>
            <br>
            <a href="admin.php" class="btn btn-dark btn-lg">  Admin  </a>
            <a href="moderator.php" class="btn btn-dark btn-lg">Moderator</a>
        </div>
    </header>

         
    <section class="about">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 text-center">
                    
                </div>
            </div>
            <!-- /.row -->
        </div>
        <!-- /.container -->
    </section>
    <!-- About -->
    <section id="about" class="call-to-action bg-primary">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 text-center">
                    
                    <p class="lead"> For this project we are proposing an application for the numerous student organizations like Alpha Kapha Omega, Black Student Union or Indian Student Association to name a few, active at San Jose State University (SJSU).Our application intends at  simplifying communication between these multiple fraternity groups when they collaborate with each other to conduct huge events. These communities serve different purposes which don’t need to interact on a regular basis. However, they do need to share information if there is an event organized in campus. There should also be way to communicate if one group needs assistance from other groups. So, our interconnected community social network platform will provide them a medium to communicate via messages and it will eliminate the hassle of adding each member of the organization to a group chat. This  application has the potential to serve as a community-oriented social network (CSNet) platform which can be used in schools, colleges or different communities in a city.
</p>
                </div>
            </div>
            <!-- /.row -->
        </div>
        <!-- /.container -->
    </section>
          
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

