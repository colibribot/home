<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Circuit - Home</title>
    <link rel="icon" type="image/x-icon" href="/assets/images/circuit.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
	<link rel="stylesheet" href="/assets/styles/main.css">
	<link href="/assets/styles/partials/header.css" rel="stylesheet">
	<script src="/assets/scripts/partials/header.js"></script>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
	<body>
    <nav class="circuit-navbar">
    <a class="circuit-navbar-brand" href="/">
        <img src="/assets/images/circuit.png" alt="Logo" class="circuit-logo">
        Circuit
    </a>
		
		    <div class="circuit-navbar-links">
        <a class="circuit-nav-link" href="/premium">Premium</a>
        <a class="circuit-nav-link" href="/docs">Docs</a>
    </div>
		
        <div class="circuit-navbar-profile" id="circuit-navbar-profile">
        </div>
<div class="dropdown-menu" id="dropdown-menu">
    <!-- Upper Section: User Info and Logout -->
    <div class="dropdown-header">
        <img src="" alt="User Avatar" class="user-avatar" id="circuit-dropdown-avatar">
        <div class="user-info">
            <span class="display-name" id="circuit-dropdown-displayname"></span>
            <span class="username" id="circuit-dropdown-username"></span>
        </div>
<button class="logout-btn" id="logout-btn">
    <svg width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
        <path d="M10.5 9a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h5zM10.5 6a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5V6a.5.5 0 0 1 .5-.5h5zM15 4.5a.5.5 0 0 0-.5-.5h-4.5v1h4.5a.5.5 0 0 0 .5-.5zM15 7a.5.5 0 0 0-.5-.5h-4.5v1h4.5a.5.5 0 0 0 .5-.5zM10 0a2 2 0 0 0-2 2v3.5a2 2 0 0 0 2 2h.5v4H6V7h.5a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM9 1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1V1z"></path>
    </svg>
    <span class="logout-tooltip">Logout</span>
</button>
    </div>

    <!-- Lower Section: Links -->
    <div class="dropdown-links">
        <a href="/dashboard" class="dropdown-link">Dashboard</a>
        <a href="/account" class="dropdown-link">Account</a>
    </div>
</div>

    </nav>

