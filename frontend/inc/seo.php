<?php

function site_url(string $path = ''): string
{
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $isLocal = $host === 'localhost' || str_starts_with($host, 'localhost:') || str_starts_with($host, '127.0.0.1');

    if ($isLocal) {
        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        return $scheme . '://' . $host . '/' . ltrim($path, '/');
    }

    return 'https://www.sobhaproperties.in/' . ltrim($path, '/');
}

function current_url(): string
{
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    return site_url($path);
}

/**
 * Renders canonical, robots, Open Graph, and Twitter Card tags.
 * Expects: title, description, canonical, image, type, robots (all optional).
 */
function seo_meta_tags(array $opts): string
{
    $title = $opts['title'] ?? 'Sobha Properties';
    $description = $opts['description'] ?? "Sobha Properties is an authorized marketing partner showcasing Sobha Limited's premium residential projects across Bangalore.";
    $canonical = $opts['canonical'] ?? current_url();
    $image = $opts['image'] ?? site_url('/images/why-sobha.png');
    $type = $opts['type'] ?? 'website';
    $robots = $opts['robots'] ?? 'index, follow';

    $tags = [];
    $tags[] = '<link rel="canonical" href="' . e($canonical) . '">';
    $tags[] = '<meta name="robots" content="' . e($robots) . '">';
    $tags[] = '<meta name="description" content="' . e($description) . '">';

    $tags[] = '<meta property="og:site_name" content="Sobha Properties">';
    $tags[] = '<meta property="og:type" content="' . e($type) . '">';
    $tags[] = '<meta property="og:title" content="' . e($title) . '">';
    $tags[] = '<meta property="og:description" content="' . e($description) . '">';
    $tags[] = '<meta property="og:url" content="' . e($canonical) . '">';
    $tags[] = '<meta property="og:image" content="' . e($image) . '">';

    $tags[] = '<meta name="twitter:card" content="summary_large_image">';
    $tags[] = '<meta name="twitter:title" content="' . e($title) . '">';
    $tags[] = '<meta name="twitter:description" content="' . e($description) . '">';
    $tags[] = '<meta name="twitter:image" content="' . e($image) . '">';

    return implode("\n    ", $tags);
}

function json_ld(array $data): string
{
    return '<script type="application/ld+json">' . json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>';
}

function organization_schema(): array
{
    return [
        '@context' => 'https://schema.org',
        '@type' => 'RealEstateAgent',
        'name' => 'Sobha Properties',
        'url' => site_url('/'),
        'logo' => site_url('/favicon.svg'),
        'image' => site_url('/images/why-sobha.png'),
        'telephone' => '+91-9380660766',
        'email' => 'info@sobhaproperties.in',
        'address' => [
            '@type' => 'PostalAddress',
            'addressLocality' => 'Bangalore',
            'addressRegion' => 'Karnataka',
            'addressCountry' => 'IN',
        ],
    ];
}

function breadcrumb_schema(array $items): array
{
    $listItems = [];
    foreach ($items as $i => $item) {
        $listItems[] = [
            '@type' => 'ListItem',
            'position' => $i + 1,
            'name' => $item['name'],
            'item' => $item['url'],
        ];
    }

    return [
        '@context' => 'https://schema.org',
        '@type' => 'BreadcrumbList',
        'itemListElement' => $listItems,
    ];
}

function faq_schema(array $faqList): array
{
    $entities = [];
    foreach ($faqList as $faq) {
        if (empty($faq['question']) || empty($faq['answer'])) {
            continue;
        }
        $entities[] = [
            '@type' => 'Question',
            'name' => $faq['question'],
            'acceptedAnswer' => [
                '@type' => 'Answer',
                'text' => $faq['answer'],
            ],
        ];
    }

    return [
        '@context' => 'https://schema.org',
        '@type' => 'FAQPage',
        'mainEntity' => $entities,
    ];
}

function project_listing_schema(array $project): array
{
    $schema = [
        '@context' => 'https://schema.org',
        '@type' => 'RealEstateListing',
        'name' => $project['name'] ?? '',
        'description' => $project['metadata']['description'] ?? '',
        'url' => site_url(project_url($project)),
    ];

    if (!empty($project['mainImage'])) {
        $schema['image'] = $project['mainImage'];
    }

    if (!empty($project['location'])) {
        $schema['address'] = [
            '@type' => 'PostalAddress',
            'addressLocality' => $project['location'],
            'addressCountry' => 'IN',
        ];
    }

    if (!empty($project['updatedAt'])) {
        $schema['datePosted'] = $project['updatedAt'];
    }

    return $schema;
}
