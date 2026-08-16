<?php require __DIR__ . '/inc/api.php';
require __DIR__ . '/inc/icons.php';
require __DIR__ . '/inc/seo.php';

$activePage = 'home';
$transparentHeader = true;
$projects = fetch_projects();
$blogs = fetch_blogs();

$projectCount = count($projects);
$totalUnits = array_sum(array_column($projects, 'totalUnits'));
$locations = array_values(array_unique(array_filter(array_column($projects, 'location'))));
$propertyTypes = array_values(array_unique(array_filter(array_column($projects, 'propertyType'))));
$heroSlides = [
    '/images/banner/sobha-properites.webp',
    '/images/banner/sobhagroup.jpg',
    '/images/banner/sobhaproperties.webp',
];

$cityDefs = [
    ['key' => 'bangalore', 'name' => 'Bangalore', 'image' => '/images/locationsimg/bangalore.jpg'],
    ['key' => 'hyderabad', 'name' => 'Hyderabad', 'image' => '/images/locationsimg/hyderabad.jpg'],
    ['key' => 'mumbai', 'name' => 'Mumbai', 'image' => '/images/locationsimg/mumbai.jpg'],
    ['key' => 'delhi', 'name' => 'Delhi NCR', 'image' => '/images/locationsimg/delhi.jpg'],
    ['key' => 'chennai', 'name' => 'Chennai', 'image' => '/images/locationsimg/chennai.jpg'],
    ['key' => 'dubai', 'name' => 'Dubai', 'image' => '/images/locationsimg/dubai.jpg'],
];

foreach ($projects as &$project) {
    $project['_cityKey'] = null;
    foreach ($cityDefs as $city) {
        if (stripos($project['location'] ?? '', $city['key']) !== false) {
            $project['_cityKey'] = $city['key'];
            break;
        }
    }
}
unset($project);

$locationGroups = [];
foreach ($cityDefs as $city) {
    $count = 0;
    foreach ($projects as $project) {
        if ($project['_cityKey'] === $city['key']) {
            $count++;
        }
    }
    $locationGroups[] = [
        'key' => $city['key'],
        'name' => $city['name'],
        'image' => $city['image'],
        'count' => $count,
    ];
}

$activeProjects = array_values(array_filter($projects, fn($p) => !empty($p['isActive'])));

$seoTitle = 'Sobha Properties | Premium Residential Projects in Bangalore';
$seoDescription = 'Explore ' . $projectCount . '+ premium Sobha residential projects across Bangalore. Browse apartments and plots by location, price, and amenities from an authorized marketing partner.';
$seoImage = !empty($heroSlides[0]) ? site_url($heroSlides[0]) : site_url('/images/why-sobha.png');

$homeItemList = [
    '@context' => 'https://schema.org',
    '@type' => 'ItemList',
    'itemListElement' => array_values(array_map(function ($project, $i) {
        return [
            '@type' => 'ListItem',
            'position' => $i + 1,
            'url' => site_url(project_url($project)),
            'name' => $project['name'] ?? '',
        ];
    }, $projects, array_keys($projects))),
];
?>
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($seoTitle) ?></title>
    <?= seo_meta_tags(['title' => $seoTitle, 'description' => $seoDescription, 'image' => $seoImage]) ?>
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/styles.css">
    <?= json_ld(organization_schema()) ?>
    <?php if (!empty($projects)): ?>
        <?= json_ld($homeItemList) ?>
    <?php endif; ?>
</head>
<body class="bg-neutral-100 text-neutral-900 antialiased">
    <?php require __DIR__ . '/inc/header.php'; ?>

    <section id="hero" class="relative overflow-hidden bg-secondary pt-28 pb-14 lg:pt-32 lg:pb-20">
        <?php foreach ($heroSlides as $i => $slide): ?>
            <img
                src="<?= e($slide) ?>"
                alt=""
                class="hero-slide absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 <?= $i === 0 ? 'opacity-100' : 'opacity-0' ?>"
            >
        <?php endforeach; ?>
        <div class="absolute inset-0 bg-linear-to-t from-black via-black/55 to-black/25"></div>
        <div class="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent"></div>

        <div class="container-page relative">
            <span class="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-primary-light">Premium Real Estate</span>
            <h1 class="max-w-xl text-4xl leading-[1.15] font-semibold text-white sm:text-5xl">
                Where Luxury Finds Its <span class="font-serif text-primary-light italic">Home</span>
            </h1>
            <p class="mt-5 max-w-md text-base text-white/70">
                Premium 1, 2, 3 &amp; 4 BHK residences crafted with uncompromising attention to details
            </p>

            <div class="mt-8 flex flex-wrap gap-4">
                <a href="#projects" class="inline-flex items-center justify-center rounded-full bg-primary-gradient px-8 py-3 text-xs font-semibold uppercase tracking-widest text-black shadow-lg shadow-black/30 transition-all hover:-translate-y-0.5 hover:shadow-xl">View All Projects</a>
                <button type="button" data-modal-heading="Download Brochure" data-modal-btn="Send Brochure" class="open-lead-modal inline-flex cursor-pointer items-center justify-center rounded-full border border-primary-light/70 px-8 py-3 text-xs font-semibold uppercase tracking-widest text-primary-light transition-all hover:bg-white/10">Download Brochure</button>
            </div>

            <?php if ($projectCount > 0): ?>
                <div class="mt-10 flex flex-wrap items-center gap-6 border-t border-white/15 pt-6 text-white sm:gap-10">
                    <div>
                        <div class="text-2xl font-bold"><?= $projectCount ?>+</div>
                        <div class="mt-1 text-xs uppercase tracking-widest text-white/60">Projects</div>
                    </div>
                    <div class="hidden h-8 w-px bg-white/20 sm:block"></div>
                    <div>
                        <div class="text-2xl font-bold"><?= number_format($totalUnits) ?>+</div>
                        <div class="mt-1 text-xs uppercase tracking-widest text-white/60">Total Units</div>
                    </div>
                    <div class="hidden h-8 w-px bg-white/20 sm:block"></div>
                    <div>
                        <div class="text-2xl font-bold"><?= count($locations) ?></div>
                        <div class="mt-1 text-xs uppercase tracking-widest text-white/60">Locations</div>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </section>

    <main>
        <?php if (!empty($locationGroups)): ?>
            <section class="bg-white py-10 md:py-12">
                <div class="mx-auto w-full max-w-285 px-6 md:px-16">
                    <h2 class="text-center text-3xl font-bold text-neutral-900">Projects by <span class="text-primary-dark">Location</span></h2>

                    <div class="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
                        <?php foreach ($locationGroups as $loc): ?>
                            <button
                                type="button"
                                class="location-card group relative block aspect-4/3 overflow-hidden rounded-2xl text-left"
                                data-city="<?= e($loc['key']) ?>"
                            >
                                <img class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" src="<?= e($loc['image']) ?>" alt="<?= e($loc['name']) ?>" loading="lazy">
                                <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/15 to-transparent"></div>
                                <div class="absolute inset-x-0 bottom-0 p-4">
                                    <div class="text-lg font-bold text-white"><?= e($loc['name']) ?></div>
                                </div>
                            </button>
                        <?php endforeach; ?>
                    </div>
                </div>
            </section>
        <?php endif; ?>

        <section class="scroll-mt-20 bg-[#fff6f6] py-10" id="projects">
            <h2 class="text-center text-3xl font-bold text-neutral-900">Featured Projects</h2>

            <?php if (empty($activeProjects)): ?>
                <p class="py-6 text-center text-red-700">Failed to load projects. Please try again later.</p>
            <?php else: ?>
                <div class="mx-auto w-full max-w-285 px-6 md:px-16">
                    <div class="relative mt-6">
                        <button
                            id="carouselPrev"
                            type="button"
                            aria-label="Previous projects"
                            class="absolute top-1/2 -left-5 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition hover:bg-neutral-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                        <button
                            id="carouselNext"
                            type="button"
                            aria-label="Next projects"
                            class="absolute top-1/2 -right-5 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition hover:bg-neutral-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><path d="M9 18l6-6-6-6"/></svg>
                        </button>

                        <p id="noResults" class="hidden py-6 text-center text-neutral-500">No projects match your search. Try different filters.</p>

                        <div class="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto" id="projectsGrid">
                            <?php foreach ($activeProjects as $project): ?>
                                <div
                                    class="project-card min-w-85 shrink-0 snap-start overflow-hidden bg-white shadow-md transition hover:shadow-lg"
                                    data-location="<?= e($project['location'] ?? '') ?>"
                                    data-property-type="<?= e($project['propertyType'] ?? '') ?>"
                                    data-city="<?= e($project['_cityKey'] ?? '') ?>"
                                >
                                    <div class="relative h-45 md:h-50">
                                        <img class="h-full w-full object-cover" src="<?= e($project['mainImage'] ?? '') ?>" alt="<?= e($project['name'] ?? '') ?>" loading="lazy">
                                        <?php if (!empty($project['status'])): ?>
                                            <div class="absolute top-4 left-0">
                                                <span class="rounded-r-full bg-primary px-4 py-1 text-xs font-semibold text-white shadow-md"><?= e($project['status']) ?></span>
                                            </div>
                                        <?php endif; ?>
                                    </div>

                                    <div class="p-5">
                                        <h3 class="mb-1 text-lg font-semibold text-gray-800"><?= e($project['name'] ?? '') ?></h3>

                                        <p class="mb-2 text-sm text-gray-500">
                                            <?= e($project['location'] ?? '') ?>
                                            <?php if (!empty($project['unitVariant'])): ?>
                                                &nbsp;|&nbsp;<?= e($project['unitVariant']) ?>
                                            <?php endif; ?>
                                        </p>

                                        <?php if (!empty($project['basePrice'])): ?>
                                            <p class="mb-4 text-lg font-semibold text-gray-900"><?= e($project['basePrice']) ?></p>
                                        <?php endif; ?>

                                        <div class="flex gap-3">
                                            <a href="<?= e(project_url($project)) ?>" class="flex-1 cursor-pointer rounded-3xl border border-gray-300 py-2 text-center text-sm no-underline text-neutral-900 transition hover:bg-neutral-100">View Details</a>
                                            <button type="button" data-modal-heading="Get Cost Sheet" data-modal-btn="Send Cost Sheet" data-project-name="<?= e($project['name'] ?? '') ?>" class="open-lead-modal flex-1 cursor-pointer rounded-3xl bg-primary-gradient py-2 text-center text-sm font-semibold text-white transition hover:shadow-lg">Get Cost Sheet</button>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            <?php endif; ?>
        </section>

        <?php
            $whySobha = [
                'Backward Integration Model',
                'World-Class Quality',
                'High Resale Value',
                'On-Time Delivery',
                'Premium Amenities',
            ];
        ?>
        <?php if (!empty($whySobha)): ?>
            <section class="mb-8 bg-[#fff6f6] py-4">
                <div class="mx-auto w-full max-w-285 px-4 md:px-16">
                    <div class="grid items-center gap-10 md:grid-cols-2">
                        <div>
                            <h2 class="mb-6 text-[32px] font-semibold text-[#1a2b49]">Why Sobha?</h2>

                            <ul class="space-y-3">
                                <?php foreach ($whySobha as $i => $item): ?>
                                    <li class="flex items-center gap-3<?= $i < count($whySobha) - 1 ? ' border-b pb-3' : '' ?>">
                                        <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c9a646] text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3"><path d="M20 6 9 17l-5-5"/></svg>
                                        </span>
                                        <span class="text-[15px] text-gray-700"><?= e($item) ?></span>
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                        </div>

                        <div class="relative h-[280px] w-full md:h-[300px]">
                            <img class="absolute inset-0 h-full w-full object-cover" src="/images/why-sobha.png" alt="Why Sobha">
                            <div class="absolute inset-0 bg-linear-to-r from-[#f4f4f4] via-transparent to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>
        <?php endif; ?>

        <section class="bg-white py-4">
            <div class="mx-auto w-full max-w-295 px-4 md:px-16">
                <h2 class="text-center text-3xl font-bold text-neutral-900">Lifestyle &amp; Amenities</h2>

                <div class="my-10 grid grid-cols-3 gap-8 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
                    <?php foreach (amenities_list() as $item): ?>
                        <div class="flex flex-col items-center">
                            <div class="mb-3 flex h-17.5 w-full items-center justify-center rounded-xl bg-white shadow-md transition hover:shadow-lg">
                                <?= amenity_icon($item['icon'], 'h-7 w-7 text-yellow-600', '3') ?>
                            </div>
                            <p class="text-center text-sm leading-tight font-medium text-gray-700"><?= e($item['name']) ?></p>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>

        <?php if (!empty($blogs)): ?>
            <section class="bg-[#fff6f6] py-8">
                <div class="mx-auto w-full max-w-285 px-4 md:px-16">
                    <h2 class="text-center text-3xl font-bold text-neutral-900">Sobha Market Insights</h2>

                    <div class="relative mt-4">
                        <button
                            id="blogPrev"
                            type="button"
                            aria-label="Previous articles"
                            class="absolute top-1/2 -left-5 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition hover:bg-neutral-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                        <button
                            id="blogNext"
                            type="button"
                            aria-label="Next articles"
                            class="absolute top-1/2 -right-5 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition hover:bg-neutral-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><path d="M9 18l6-6-6-6"/></svg>
                        </button>

                        <div class="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth" id="blogGrid">
                            <?php foreach ($blogs as $blog): ?>
                                <?php
                                    $blogTitle = $blog['title'] ?? '';
                                    $blogTitleShort = truncate_text($blogTitle, 30);
                                    $blogUrl = '#';
                                ?>
                                <div class="w-72.5 shrink-0 snap-start md:w-82.5">
                                    <div class="overflow-hidden bg-white shadow-md transition duration-300 hover:shadow-lg">
                                        <div class="relative h-37.5 w-full">
                                            <img class="h-full w-full object-cover" src="<?= e($blog['thumbnail'] ?? '') ?>" alt="<?= e($blogTitle) ?>" loading="lazy">
                                        </div>

                                        <div class="p-5">
                                            <h3 class="mb-4 text-[17px] leading-snug font-semibold text-[#1a2b49]"><?= e($blogTitleShort) ?></h3>

                                            <div class="flex items-center justify-between">
                                                <a href="<?= e($blogUrl) ?>" class="flex items-center gap-1 text-sm text-gray-600 no-underline hover:text-[#1a2b49]">
                                                    Learn More
                                                    <span class="text-lg leading-none">&rsaquo;</span>
                                                </a>
                                                <a href="<?= e($blogUrl) ?>" class="rounded-3xl bg-primary px-4 py-2 text-sm text-white no-underline shadow-md transition hover:bg-primary/90">Read More</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </section>
        <?php endif; ?>
    </main>

    <?php require __DIR__ . '/inc/footer.php'; ?>

    <?php include __DIR__ . '/inc/lead-modal.php'; ?>

    <script src="/js/main.js"></script>
</body>
</html>
