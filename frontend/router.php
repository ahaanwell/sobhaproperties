<?php
// Dev router for `php -S localhost:PORT router.php`.
// Not used by Apache — .htaccess handles rewriting there.

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

if (preg_match('#^/bangalore/([a-zA-Z0-9-]+)$#', $uri, $m)) {
    $_GET['slug'] = $m[1];
    require __DIR__ . '/project.php';
    return true;
}

if ($uri === '/robots.txt') {
    require __DIR__ . '/robots.php';
    return true;
}

if ($uri === '/sitemap.xml') {
    require __DIR__ . '/sitemap.php';
    return true;
}

if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false;
}

require __DIR__ . '/index.php';
