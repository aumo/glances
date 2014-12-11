<!DOCTYPE HTML><html ng-app="glances">
<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Glances</title>

<link rel="stylesheet" type="text/css" href="normalize.css" />
<link rel="stylesheet" type="text/css" href="style.css" />

<script src="modernizr.custom.js"></script>
<script src="angular.min.js"></script>
<script src="glancesapp.js"></script>
<script type="text/javascript">
  angular.module('glances').constant('glancesConfig', {
    refreshTime: {{refresh_time}} * 1000
  });

</script>
</head>

<body>

<header>
  <glc-plugin name="system"></glc-plugin>
  <glc-plugin name="uptime"></glc-plugin>
</header>

<div id="newline"></div>

<section>
  <glc-plugin name="cpu"></glc-plugin>
  <glc-plugin name="load"></glc-plugin>
  <glc-plugin name="mem"></glc-plugin>
  <glc-plugin name="memswap"></glc-plugin>
</section>

<div id="newline"></div>

<div>
  <aside id="leftstats">
    <glc-plugin name="network"></glc-plugin>
    <glc-plugin name="diskio"></glc-plugin>
    <glc-plugin name="fs"></glc-plugin>
    <glc-plugin name="sensors"></glc-plugin>
  </aside>

  <section id="rightstats">
    <glc-plugin name="alert"></glc-plugin>
    <glc-plugin name="processcount"></glc-plugin>
    <glc-plugin name="monitor"></glc-plugin>
    <glc-plugin name="processlist"></glc-plugin>
  </section>
</div>

<div id="newline"></div>

</body>
<footer>
</footer>
</html>
