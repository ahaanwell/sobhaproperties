<?php require __DIR__ . '/inc/seo.php';

header('Content-Type: text/plain; charset=utf-8');
?>
User-agent: *
Allow: /

Sitemap: <?= site_url('/sitemap.xml') ?>
