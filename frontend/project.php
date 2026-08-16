<?php require __DIR__ . '/inc/api.php';
require __DIR__ . '/inc/icons.php';
require __DIR__ . '/inc/seo.php';

$activePage = 'projects';
$slug = $_GET['slug'] ?? '';
$project = $slug !== '' ? fetch_project_by_slug($slug) : null;

if (!$project) {
    http_response_code(404);
}

if ($project) {
    $name = $project['name'] ?? '';
    $location = $project['location'] ?? '';
    $mainImage = $project['mainImage'] ?? '';
    $status = $project['status'] ?? '';
    $unitVariant = $project['unitVariant'] ?? '';
    $basePrice = $project['basePrice'] ?? '';
    $totalUnits = $project['totalUnits'] ?? '';
    $totalLandArea = $project['totalLandArea'] ?? '';
    $totalTowers = $project['totalTowers'] ?? '';
    $masterPlanImage = $project['masterPlanImage'] ?? '';
    $masterPlanContent = $project['masterPlanContent'] ?? '';
    $floorPlans = $project['floorPlans'] ?? [];
    $gallery = $project['gallery'] ?? [];
    $faqList = $project['faqList'] ?? [];
    $mapLink = $project['mapLink'] ?? '';
    $overviewContent = $project['overviewContent'] ?? '';
    $locationContent = $project['locationContent'] ?? '';
    $pricePlanContent = $project['pricePlanContent'] ?? '';
    $pricePlans = $project['pricePlans'] ?? [];
    $floorPlanContent = $project['floorPlanContent'] ?? '';

    $richSections = [
        'More About' => $project['moreAbout'] ?? '',
    ];

    $tabs = [
        ['label' => 'Overview', 'target' => 'overview', 'show' => true],
        ['label' => 'Amenities', 'target' => 'amenities', 'show' => true],
        ['label' => 'Price', 'target' => 'price', 'show' => !empty($pricePlanContent) || !empty($pricePlans)],
        ['label' => 'Floor Plans', 'target' => 'floor-plans', 'show' => !empty($floorPlans)],
        ['label' => 'Master Plan', 'target' => 'master-plan', 'show' => !empty($masterPlanImage)],
        ['label' => 'Location', 'target' => 'location', 'show' => !empty($mapLink)],
        ['label' => 'Gallery', 'target' => 'gallery', 'show' => !empty($gallery)],
    ];

    $metadata = $project['metadata'] ?? [];
    $seoTitle = $metadata['title'] ?? ($name . ' | Sobha Properties');
    $seoDescription = $metadata['description'] ?? ('Explore ' . $name . ' in ' . $location . ' by Sobha Properties. View floor plans, pricing, amenities, and location details.');
    $seoImage = $metadata['ogImage'] ?: $mainImage;
    $seoCanonical = site_url(project_url($project));

    $breadcrumbItems = [
        ['name' => 'Home', 'url' => site_url('/')],
        ['name' => 'Projects', 'url' => site_url('/#projects')],
        ['name' => $name, 'url' => $seoCanonical],
    ];
} else {
    $seoTitle = 'Project Not Found | Sobha Properties';
    $seoDescription = 'The project you are looking for could not be found.';
    $seoImage = site_url('/images/why-sobha.png');
    $seoCanonical = current_url();
}
?>
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($seoTitle) ?></title>
    <?= seo_meta_tags([
        'title' => $seoTitle,
        'description' => $seoDescription,
        'canonical' => $seoCanonical,
        'image' => $seoImage,
        'type' => $project ? 'product' : 'website',
        'robots' => $project ? 'index, follow' : 'noindex, nofollow',
    ]) ?>
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/styles.css">
    <?= json_ld(organization_schema()) ?>
    <?php if ($project): ?>
        <?= json_ld(breadcrumb_schema($breadcrumbItems)) ?>
        <?= json_ld(project_listing_schema($project)) ?>
        <?php if (!empty($faqList)): ?>
            <?= json_ld(faq_schema($faqList)) ?>
        <?php endif; ?>
    <?php endif; ?>
</head>
<body class=" text-neutral-900 antialiased">
    <?php if (!$project): ?>
        <?php require __DIR__ . '/inc/header.php'; ?>
        <main class="container-page pt-20">
            <a class="inline-block my-6 text-sm text-neutral-500 hover:text-neutral-900 no-underline transition-colors" href="/">&larr; Back to Projects</a>
            <div class="py-6 text-red-700">Project not found.</div>
        </main>
    <?php else: ?>
        <header class="sticky top-0 z-40 w-full border-b border-gray-200 bg-white" id="projectTabs">
            <div class="mx-auto flex h-16 w-full max-w-285 items-center justify-between gap-4 px-4 md:px-16">
                <a href="<?= e($project['slug']) ?>" class="flex shrink-0 items-center gap-2 no-underline">
                    <img src="/images/logo.webp" alt="Logo" class="h-14">
                </a>

                <nav class="hidden flex-1 items-center justify-center gap-8 md:flex">
                    <?php foreach ($tabs as $tab): ?>
                        <?php if ($tab['show']): ?>
                            <a
                                href="#<?= e($tab['target']) ?>"
                                data-tab-target="<?= e($tab['target']) ?>"
                                class="tab-link relative shrink-0 py-2 text-sm font-medium whitespace-nowrap text-gray-600 no-underline transition-colors hover:text-neutral-900 md:text-[15px]"
                            ><?= e($tab['label']) ?></a>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </nav>

                <div class="flex shrink-0 items-center gap-3">
                    <button type="button" data-modal-heading="Get Brochure" data-modal-btn="Send Brochure" data-project-name="<?= e($name) ?>" class="open-lead-modal hidden cursor-pointer items-center justify-center rounded-full bg-primary-gradient px-6 py-2.5 text-sm font-semibold text-black shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg md:inline-flex">Get Brochure</button>

                    <button id="projectNavToggle" type="button" aria-label="Toggle menu" aria-expanded="false" aria-controls="projectNavMobile" class="flex h-8.5 w-8.5 shrink-0 cursor-pointer flex-col items-center justify-center gap-1.5 md:hidden">
                        <span class="project-nav-toggle-bar block h-0.5 w-5.5 rounded-full bg-neutral-900 transition-transform duration-300"></span>
                        <span class="project-nav-toggle-bar block h-0.5 w-5.5 rounded-full bg-neutral-900 transition-opacity duration-300"></span>
                        <span class="project-nav-toggle-bar block h-0.5 w-5.5 rounded-full bg-neutral-900 transition-transform duration-300"></span>
                    </button>
                </div>
            </div>

            <div id="projectNavOverlay" class="fixed inset-0 z-40 hidden bg-black/50 opacity-0 transition-opacity duration-300 md:hidden"></div>

            <nav id="projectNavMobile" class="fixed top-0 right-0 z-50 flex h-full w-72 max-w-[80%] translate-x-full flex-col bg-white shadow-2xl transition-transform duration-300 md:hidden">
                <div class="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-5">
                    <span class="text-sm font-semibold tracking-widest text-neutral-900 uppercase">Menu</span>
                    <button type="button" id="projectNavClose" aria-label="Close menu" class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-gray-100 hover:text-neutral-900">
                        <?= amenity_icon('close', 'h-4 w-4', '2.5') ?>
                    </button>
                </div>

                <div class="flex flex-col overflow-y-auto px-5 py-2">
                    <?php foreach ($tabs as $tab): ?>
                        <?php if ($tab['show']): ?>
                            <a
                                href="#<?= e($tab['target']) ?>"
                                data-tab-target="<?= e($tab['target']) ?>"
                                class="tab-link block border-b border-gray-100 py-3.5 pl-5 text-sm font-medium text-gray-600 no-underline last:border-b-0"
                            ><?= e($tab['label']) ?></a>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </div>
            </nav>
        </header>

        <section class="relative flex min-h-140 w-full items-start md:h-[calc(100svh-4rem)] md:items-center">
            <img class="absolute inset-0 h-full w-full object-cover" src="<?= e($mainImage) ?>" alt="<?= e($name) ?>">
            <div class="absolute inset-0 bg-linear-to-r from-[#0f1c2e]/85 via-[#0f1c2e]/55 to-[#0f1c2e]/20"></div>

            <button
                type="button"
                data-modal-heading="Download Brochure"
                data-modal-btn="Send Brochure"
                data-project-name="<?= e($name) ?>"
                class="open-lead-modal absolute top-1/2 left-0 z-20 hidden -translate-y-1/2 cursor-pointer items-center gap-2 rounded-r-md bg-primary-gradient px-2 py-4 text-xs font-semibold text-black shadow-lg transition-all hover:pl-3 sm:flex"
                style="writing-mode: vertical-rl;"
            >
                <?= amenity_icon('download', 'h-4 w-4 rotate-90', '2.5') ?>
                Download Brochure
            </button>

            <div class="relative z-10 mx-auto grid w-full max-w-285 grid-cols-1 items-center gap-10 px-6 py-10 md:grid-cols-2 md:px-16">
                <div class="text-white">
                    <h1 class="mb-4 text-3xl leading-tight font-semibold md:text-5xl"><?= e($name) ?></h1>

                    <?php if ($location): ?>
                        <p class="mb-3 w-fit rounded bg-black/50 px-3 py-1 text-lg font-medium text-gray-200 md:text-xl"><?= e($location) ?></p>
                    <?php endif; ?>

                    <?php if ($unitVariant): ?>
                        <p class="mb-3 w-fit rounded bg-black/50 px-3 py-1 text-lg font-medium text-gray-200 md:text-xl"><?= e($unitVariant) ?></p>
                    <?php endif; ?>

                    <?php if ($basePrice): ?>
                        <p class="mb-6 text-2xl font-semibold md:text-3xl">&#8377; <?= e($basePrice) ?></p>
                    <?php endif; ?>

                    <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                        <button type="button" data-modal-heading="Get Cost Sheet" data-modal-btn="Send Cost Sheet" data-project-name="<?= e($name) ?>" class="open-lead-modal inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-primary-gradient px-8 py-3.5 text-sm font-semibold text-black shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl sm:w-auto">Get Cost Sheet</button>
                        <button type="button" data-modal-heading="Download Brochure" data-modal-btn="Send Brochure" data-project-name="<?= e($name) ?>" class="open-lead-modal inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-neutral-900 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl sm:w-auto">
                            <?= amenity_icon('download', 'h-4 w-4', '2.5') ?>
                            Download Brochure
                        </button>
                    </div>

                    <div class="mt-10 flex items-center justify-between gap-4 sm:justify-start sm:gap-14">
                        <?php if ($totalUnits): ?>
                            <div>
                                <p class="text-3xl font-bold text-yellow-500 md:text-4xl"><?= e((string) $totalUnits) ?></p>
                                <p class="text-sm text-gray-300">Total Units</p>
                            </div>
                        <?php endif; ?>
                        <?php if ($totalLandArea): ?>
                            <div>
                                <p class="text-3xl font-bold text-yellow-500 md:text-4xl"><?= e((string) $totalLandArea) ?></p>
                                <p class="text-sm text-gray-300">Area</p>
                            </div>
                        <?php endif; ?>
                        <?php if ($totalTowers): ?>
                            <div>
                                <p class="text-3xl font-bold text-yellow-500 md:text-4xl"><?= e((string) $totalTowers) ?></p>
                                <p class="text-sm text-gray-300">Towers</p>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>

                <div id="lead-form" class="scroll-mt-24 hidden w-full rounded-2xl bg-white p-6 shadow-2xl md:block md:max-w-sm md:justify-self-end md:p-8">
                    <h2 class="text-center text-2xl font-bold text-neutral-900">Book Your Visit</h2>

                    <div id="heroLeadSuccess" class="hidden flex-col items-center py-10 text-center">
                        <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary">&#10003;</div>
                        <h3 class="mb-2 text-lg font-semibold text-neutral-900">Thank You!</h3>
                        <p class="text-sm text-neutral-500">Our team will reach out to you within 24 hours.</p>
                    </div>

                    <div id="heroLeadFormWrap">
                        <form id="heroLeadForm" class="mt-5 flex flex-col gap-3.5">
                            <input type="hidden" name="project" value="<?= e($name) ?>">

                            <div class="group">
                                <label class="mb-1.5 block text-[11px] font-semibold tracking-widest text-neutral-600 uppercase transition-colors group-has-focus:text-primary">Full Name</label>
                                <input type="text" name="name" required placeholder="e.g. Arjun Sharma" class="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10">
                            </div>

                            <div class="group">
                                <label class="mb-1.5 block text-[11px] font-semibold tracking-widest text-neutral-600 uppercase transition-colors group-has-focus:text-primary">Email Address</label>
                                <input type="email" name="email" required placeholder="e.g. arjun@email.com" class="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10">
                            </div>

                            <div class="group">
                                <label class="mb-1.5 block text-[11px] font-semibold tracking-widest text-neutral-600 uppercase transition-colors group-has-focus:text-primary">Phone Number</label>
                                <div class="flex overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 transition-all has-focus:border-primary has-focus:bg-white has-focus:ring-2 has-focus:ring-primary/10">
                                    <select name="countryCode" class="cursor-pointer border-r border-neutral-200 bg-neutral-100 px-2 py-2.5 text-sm text-neutral-700 outline-none">
                                        <option value="+91">&#127470;&#127475; +91</option>
                                        <option value="+1">&#127482;&#127480; +1</option>
                                        <option value="+44">&#127468;&#127463; +44</option>
                                        <option value="+971">&#127462;&#127466; +971</option>
                                        <option value="+65">&#127480;&#127468; +65</option>
                                        <option value="+61">&#127462;&#127482; +61</option>
                                    </select>
                                    <input type="tel" name="phone" required placeholder="e.g. 98765 43210" class="flex-1 bg-transparent px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none">
                                </div>
                            </div>

                            <p id="heroLeadError" class="hidden rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-500"></p>

                            <button type="submit" id="heroLeadSubmit" class="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-full bg-primary-gradient py-3 text-sm font-semibold text-black transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70">
                                <?= amenity_icon('loader-circle', 'h-3.5 w-3.5 animate-spin hidden', '2') ?>
                                <span id="heroLeadSubmitLabel">Submit</span>
                            </button>
                        </form>
                    </div>

                    <p class="mt-4 text-center text-xs text-neutral-500">This enquiry is to book site visit and get best price.</p>
                </div>
            </div>
        </section>

        <main class="container-page">
            <div class="pb-16">
                <section class="scroll-mt-24 mt-10 bg-white" id="overview">
                    <div>
                        <?php if ($overviewContent): ?>
                            <div class="prose prose-neutral prose-a:text-primary-dark prose-headings:text-neutral-900 max-w-none"><?= $overviewContent ?></div>
                        <?php endif; ?>
                    </div>

                    <div class="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
                        <div class="grid divide-gray-200 md:grid-cols-3 md:divide-x">
                            <div class="flex min-w-0 items-start gap-4 p-6">
                                <?= amenity_icon('id-card', 'h-5 w-5 mt-1 shrink-0 text-primary-dark', '2') ?>
                                <div class="min-w-0">
                                    <p class="text-sm text-gray-500">RERA ID:</p>
                                    <p class="font-medium text-[#0F1C2E] wrap-break-word"><?= e((string) ($project['reraId'] ?? '')) ?></p>
                                </div>
                            </div>

                            <div class="flex min-w-0 items-start gap-4 p-6">
                                <?= amenity_icon('layers', 'h-5 w-5 mt-1 shrink-0 text-primary-dark', '2') ?>
                                <div class="min-w-0">
                                    <p class="text-sm text-gray-500">Land Area</p>
                                    <p class="font-medium text-[#0F1C2E]"><?= e((string) $totalLandArea) ?></p>
                                </div>
                            </div>

                            <div class="flex min-w-0 items-start gap-4 p-6">
                                <?= amenity_icon('building', 'h-5 w-5 mt-1 shrink-0 text-primary-dark', '2') ?>
                                <div class="min-w-0">
                                    <p class="text-sm text-gray-500">Number of Units</p>
                                    <p class="font-medium text-[#0F1C2E]"><?= e((string) $totalUnits) ?></p>
                                </div>
                            </div>
                        </div>

                        <div class="border-t border-gray-200"></div>

                        <div class="grid divide-gray-200 md:grid-cols-3 md:divide-x">
                            <div class="flex min-w-0 items-start gap-4 p-6">
                                <?= amenity_icon('calendar', 'h-5 w-5 mt-1 shrink-0 text-primary-dark', '2') ?>
                                <div class="min-w-0">
                                    <p class="text-sm text-gray-500">Possession Time</p>
                                    <p class="font-medium text-[#0F1C2E]"><?= e((string) ($project['possessionTime'] ?? '')) ?></p>
                                </div>
                            </div>

                            <div class="flex min-w-0 items-start gap-4 p-6">
                                <?= amenity_icon('calendar-check', 'h-5 w-5 mt-1 shrink-0 text-primary-dark', '2') ?>
                                <div class="min-w-0">
                                    <p class="text-sm text-gray-500">Status</p>
                                    <p class="font-medium text-[#0F1C2E] capitalize"><?= e($status) ?></p>
                                </div>
                            </div>

                            <div class="flex min-w-0 items-start gap-4 p-6">
                                <?= amenity_icon('home', 'h-5 w-5 mt-1 shrink-0 text-primary-dark', '2') ?>
                                <div class="min-w-0">
                                    <p class="text-sm text-gray-500">Property Type</p>
                                    <p class="font-medium text-[#0F1C2E] capitalize"><?= e((string) ($project['propertyType'] ?? '')) ?></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <?php if ($pricePlanContent || !empty($pricePlans)): ?>
                    <section class="scroll-mt-24 pt-12 pb-16" id="price">
                        <div class="mb-6 text-center">
                            <h2 class="text-xl font-bold md:text-3xl">Price List</h2>
                        </div>

                        <?php if ($pricePlanContent): ?>
                            <div class="prose prose-neutral prose-a:text-primary-dark prose-headings:text-neutral-900 max-w-none"><?= $pricePlanContent ?></div>
                        <?php endif; ?>

                        <?php if (!empty($pricePlans)): ?>
                            <div class="mt-6 overflow-x-auto">
                                <table class="w-full border-collapse border border-gray-300">
                                    <thead class="bg-primary text-white">
                                        <tr>
                                            <th class="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Unit Type</th>
                                            <th class="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Area</th>
                                            <th class="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Starting Price</th>
                                            <th class="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($pricePlans as $plan): ?>
                                            <tr class="hover:bg-gray-50">
                                                <td class="border border-gray-300 px-4 py-4 font-medium text-gray-800"><?= e($plan['unitType'] ?? '') ?></td>
                                                <td class="border border-gray-300 px-4 py-4 text-gray-600"><?= e($plan['area'] ?? '') ?></td>
                                                <td class="border border-gray-300 px-4 py-4 font-semibold text-gray-900"><?= e($plan['price'] ?? '') ?></td>
                                                <td class="border border-gray-300 px-4 py-4 text-center">
                                                    <button type="button" data-modal-heading="<?= e($plan['unitType'] ?? 'Enquire Now') ?>" data-modal-btn="Get Best Price" data-project-name="<?= e($name) ?>" class="open-lead-modal inline-flex cursor-pointer items-center justify-center rounded-full bg-primary-gradient px-4 py-1.5 text-sm font-semibold text-black transition-all hover:shadow-lg">View Details</button>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        <?php endif; ?>
                    </section>
                <?php endif; ?>

                <?php if (!empty($floorPlans)): ?>
                    <section class="scroll-mt-24 mt-10" id="floor-plans">
                        <div class="mb-8 flex items-center justify-center">
                            <h2 class="mx-4 text-xl font-bold md:text-3xl">Floor Plans</h2>
                        </div>

                        <?php if ($floorPlanContent): ?>
                            <div class="prose prose-neutral prose-a:text-primary-dark prose-headings:text-neutral-900 mb-6 max-w-none"><?= $floorPlanContent ?></div>
                        <?php endif; ?>

                        <div class="mb-6 flex flex-wrap justify-center gap-2" id="floorPlanTabs">
                            <?php foreach ($floorPlans as $i => $fp): ?>
                                <button
                                    type="button"
                                    data-plan-index="<?= $i ?>"
                                    class="floorplan-tab rounded-full px-4 py-2 text-sm font-semibold transition-all <?= $i === 0 ? 'active border-2 border-white bg-primary text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100' ?>"
                                ><?= e($fp['unitType'] ?? '') ?></button>
                            <?php endforeach; ?>
                        </div>

                        <?php foreach ($floorPlans as $i => $fp): ?>
                            <div class="floorplan-card mx-auto max-w-3xl overflow-hidden rounded-xl bg-white shadow-md<?= $i === 0 ? '' : ' hidden' ?>" data-plan-index="<?= $i ?>">
                                <div class="flex flex-col md:flex-row">
                                    <div class="relative h-48 md:h-auto md:w-2/5">
                                        <?php if (!empty($fp['floorPlanImage'])): ?>
                                            <img class="h-full w-full object-cover" src="<?= e($fp['floorPlanImage']) ?>" alt="<?= e($fp['unitType'] ?? '') ?>">
                                        <?php endif; ?>
                                        <?php if (!empty($fp['price'])): ?>
                                            <div class="absolute top-2 left-2 rounded bg-primary px-2 py-1 text-xs font-bold text-white"><?= e($fp['price']) ?></div>
                                        <?php endif; ?>
                                    </div>

                                    <div class="p-5 md:w-3/5">
                                        <div class="mb-3 flex items-start justify-between">
                                            <div>
                                                <h3 class="text-lg font-bold text-gray-900"><?= e($fp['unitType'] ?? '') ?></h3>
                                                <p class="text-xs text-gray-500"><?= e($name) ?></p>
                                            </div>
                                            <?php if (!empty($fp['floorPlanImage'])): ?>
                                                <a href="<?= e($fp['floorPlanImage']) ?>" download class="text-primary-dark hover:text-primary" aria-label="Download floor plan">
                                                    <?= amenity_icon('download', 'h-4 w-4', '2') ?>
                                                </a>
                                            <?php endif; ?>
                                        </div>

                                        <?php if (!empty($fp['area'])): ?>
                                            <div class="mb-4 flex items-center gap-4 text-sm text-gray-700">
                                                <span class="flex items-center gap-1">
                                                    <?= amenity_icon('square', 'h-3.5 w-3.5 text-gray-400', '2') ?>
                                                    <?= e($fp['area']) ?>
                                                </span>
                                            </div>
                                        <?php endif; ?>

                                        <div class="flex gap-2">
                                            <button type="button" data-modal-heading="Download Brochure" data-modal-btn="Send Brochure" data-project-name="<?= e($name) ?>" class="open-lead-modal flex flex-1 cursor-pointer items-center justify-center gap-1 rounded bg-primary-gradient px-3 py-2 text-sm font-semibold text-black">
                                                <?= amenity_icon('maximize-2', 'h-3 w-3', '2') ?>
                                                Brochure
                                            </button>
                                            <button type="button" data-modal-heading="Book Site Visit" data-modal-btn="Book Now" data-project-name="<?= e($name) ?>" class="open-lead-modal flex-1 cursor-pointer rounded border-2 border-black px-3 py-2 text-sm font-semibold text-black">
                                                Site Visit
                                            </button>
                                        </div>

                                        <p class="mt-3 text-xs text-gray-400">* Prices exclusive of offers &bull; Contact for best deals</p>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>

                        <div class="mx-auto mt-4 grid max-w-3xl grid-cols-3 gap-3">
                            <?php foreach ($floorPlans as $fp): ?>
                                <div class="rounded-lg bg-white p-2 text-center shadow-sm">
                                    <div class="text-xs font-semibold text-gray-800"><?= e($fp['unitType'] ?? '') ?></div>
                                    <div class="text-[10px] text-gray-500">From <?= e($fp['price'] ?? '') ?></div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </section>
                <?php endif; ?>

                <?php if ($masterPlanImage): ?>
                    <section class="scroll-mt-24 pt-10" id="master-plan">
                        <div class="mb-8 flex items-center justify-center">
                            <h2 class="mx-4 text-xl font-bold md:text-3xl">Master Plan</h2>
                        </div>

                        <?php if ($masterPlanContent): ?>
                            <div class="prose prose-neutral prose-a:text-primary-dark prose-headings:text-neutral-900 max-w-none"><?= $masterPlanContent ?></div>
                        <?php endif; ?>

                        <div class="m-auto flex h-75 w-full items-center justify-center md:h-100 md:w-1/2">
                            <img class="h-full w-full rounded-2xl object-cover" src="<?= e($masterPlanImage) ?>" alt="Master Plan">
                        </div>
                    </section>
                <?php endif; ?>

                <?php if (!empty($gallery)): ?>
                    <section class="scroll-mt-24 pt-10" id="gallery">
                        <div class="mb-8 flex items-center justify-center">
                            <h2 class="mx-4 text-xl font-bold md:text-3xl">Gallery</h2>
                        </div>

                        <div class="grid auto-rows-45 grid-cols-2 gap-4 md:auto-rows-50 md:grid-cols-3 lg:grid-cols-4" id="galleryGrid">
                            <?php foreach ($gallery as $i => $img): ?>
                                <button
                                    type="button"
                                    data-gallery-index="<?= $i ?>"
                                    data-gallery-src="<?= e($img) ?>"
                                    class="gallery-item group relative cursor-pointer overflow-hidden rounded-2xl text-left shadow-md transition-all duration-500 hover:shadow-2xl <?= $i % 5 === 0 ? 'col-span-2' : 'col-span-1' ?>"
                                >
                                    <img class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" src="<?= e($img) ?>" alt="<?= e($name) ?> gallery image" loading="lazy">

                                    <div class="absolute inset-0 bg-linear-to-t from-blue-900/80 via-blue-900/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                                    <div class="absolute right-4 bottom-4 translate-y-10 rounded-full bg-white/95 p-3 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                        <?= amenity_icon('camera', 'h-5 w-5 text-blue-900', '2') ?>
                                    </div>

                                    <div class="absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100">
                                        <?= str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT) ?>
                                    </div>
                                </button>
                            <?php endforeach; ?>
                        </div>

                        <div id="galleryLightbox" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/95">
                            <button type="button" id="lightboxClose" aria-label="Close" class="absolute top-6 right-6 z-10 rounded-full bg-black/30 p-3 text-white/80 backdrop-blur-sm transition-all hover:bg-black/50 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>

                            <button type="button" id="lightboxPrevSide" aria-label="Previous image" class="absolute left-6 rounded-full bg-black/30 p-3 text-white/80 backdrop-blur-sm transition-all hover:bg-black/50 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><path d="M15 18l-6-6 6-6"/></svg>
                            </button>

                            <button type="button" id="lightboxNextSide" aria-label="Next image" class="absolute right-6 rounded-full bg-black/30 p-3 text-white/80 backdrop-blur-sm transition-all hover:bg-black/50 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><path d="M9 18l6-6-6-6"/></svg>
                            </button>

                            <div class="relative max-h-[85vh] max-w-6xl px-4">
                                <img id="lightboxImage" class="h-full w-full rounded-lg object-contain" src="" alt="gallery">

                                <div class="absolute -bottom-16 left-1/2 flex -translate-x-1/2 items-center gap-8 rounded-full bg-black/60 px-8 py-4 text-white shadow-2xl backdrop-blur-md">
                                    <button type="button" id="lightboxPrevPill" aria-label="Previous image" class="transition-colors hover:text-blue-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M15 18l-6-6 6-6"/></svg>
                                    </button>
                                    <span id="lightboxCounter" class="text-sm font-medium">01 / 01</span>
                                    <button type="button" id="lightboxNextPill" aria-label="Next image" class="transition-colors hover:text-blue-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M9 18l6-6-6-6"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                <?php endif; ?>

                <section class="scroll-mt-24 pt-10" id="amenities">
                    <div class="mb-8 flex items-center justify-center">
                        <h2 class="mx-4 text-xl font-bold md:text-3xl">Amenities</h2>
                    </div>

                    <div class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 md:gap-4 lg:grid-cols-6">
                        <?php foreach (amenities_list() as $item): ?>
                            <div class="group cursor-pointer rounded-lg border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                                <div class="flex flex-col items-center">
                                    <div class="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary transition-transform duration-300 group-hover:scale-110">
                                        <?= amenity_icon($item['icon'], 'h-6 w-6 text-white', '1.8') ?>
                                    </div>
                                    <h3 class="text-center text-xs leading-tight font-medium text-gray-700"><?= e($item['name']) ?></h3>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </section>

                <?php if ($mapLink): ?>
                    <section class="scroll-mt-24 pt-10" id="location">
                        <div class="mb-8 flex items-center justify-center">
                            <h2 class="mx-4 text-xl font-bold md:text-3xl">Location &amp; Connectivity</h2>
                        </div>

                        <?php if ($locationContent): ?>
                            <div class="prose prose-neutral prose-a:text-primary-dark prose-headings:text-neutral-900 mb-6 max-w-none"><?= $locationContent ?></div>
                        <?php endif; ?>

                        <div class="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-lg">
                            <div class="relative h-87.5 bg-gray-200 md:h-112.5">
                                <iframe class="h-full w-full border-0" src="<?= e($mapLink) ?>" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
                            </div>
                        </div>
                    </section>
                <?php endif; ?>

                <?php foreach ($richSections as $heading => $html): ?>
                    <?php if ($html): ?>
                        <section class="mt-10 bg-white rounded-xl p-6 shadow-sm">
                            <h2 class="text-[22px] font-bold mb-4 text-neutral-900"><?= e($heading) ?></h2>
                            <div class="prose prose-neutral max-w-none prose-a:text-primary-dark prose-headings:text-neutral-900"><?= $html ?></div>
                        </section>
                    <?php endif; ?>
                <?php endforeach; ?>

                <?php if (!empty($faqList)): ?>
                    <section class="scroll-mt-24 mt-10" id="faqs">
                        <h2 class="text-[22px] font-bold mb-4 text-neutral-900">Frequently Asked Questions</h2>
                        <div class="flex flex-col gap-2.5">
                            <?php foreach ($faqList as $faq): ?>
                                <details class="bg-white rounded-lg px-4.5 py-3.5 shadow-sm">
                                    <summary class="font-semibold text-neutral-900 cursor-pointer"><?= e($faq['question'] ?? '') ?></summary>
                                    <p class="mt-2.5 text-neutral-600 text-sm"><?= e($faq['answer'] ?? '') ?></p>
                                </details>
                            <?php endforeach; ?>
                        </div>
                    </section>
                <?php endif; ?>
            </div>
        </main>

    <?php endif; ?>

    <footer class="mt-10 bg-gray-900 text-gray-300">
        <div class="mx-auto w-full px-6 py-10">
            <div class="mb-6 text-center">
                <h3 class="text-xl font-semibold text-white">SOBHA PROPERTIES</h3>
                <p class="mt-1 text-sm text-gray-400">Authorized Marketing Partner</p>
            </div>

            <div class="my-6 border-t border-gray-700"></div>

            <div class="space-y-4 text-xs leading-relaxed text-gray-400">
                <p>
                    <strong class="text-gray-300">Disclaimer &amp; Privacy Policy:</strong>
                    That the content published on this website is for informational purposes only and may not constitute as an offer or invitation or advice for the purpose of purchase/booking/sale of any project. Please note that this is the official website of an authorized marketing partner.
                </p>

                <p>
                    We do not claim ownership or responsibility for the accuracy, completeness, or reliability of any information sourced from third party website or provided by any third party, and are not responsible for any dealing, negotiations, transactions, etc., whatsoever between the investors and developers connected through our services, including and not limited to any quality assurances, guarantees, schemes, claims, benefits, assured returns etc., given by one party to another in any transaction.
                </p>
            </div>
        </div>

        <div class="border-t border-gray-800 py-4 text-center text-sm text-gray-400">
            &copy; <?= date('Y') ?> Sobha Properties. All Rights Reserved.
        </div>
    </footer>

    <?php include __DIR__ . '/inc/lead-modal.php'; ?>

    <script src="/js/main.js"></script>
</body>
</html>
