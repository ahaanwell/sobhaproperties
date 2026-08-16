<?php require __DIR__ . '/inc/api.php';
require __DIR__ . '/inc/seo.php';

$projects = fetch_projects();

header('Content-Type: application/xml; charset=utf-8');

function sitemap_date(?string $value): string
{
    if (!$value) {
        return date('Y-m-d');
    }
    $timestamp = strtotime($value);
    return $timestamp ? date('Y-m-d', $timestamp) : date('Y-m-d');
}
?>
<?= '<?xml version="1.0" encoding="UTF-8"?>' ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc><?= e(site_url('/')) ?></loc>
        <lastmod><?= date('Y-m-d') ?></lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <?php foreach ($projects as $project): ?>
        <?php if (empty($project['isActive'])) continue; ?>
        <url>
            <loc><?= e(site_url(project_url($project))) ?></loc>
            <lastmod><?= sitemap_date($project['updatedAt'] ?? null) ?></lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>
    <?php endforeach; ?>
</urlset>
