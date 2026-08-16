<?php
require_once __DIR__ . '/api.php';
require_once __DIR__ . '/icons.php';

$footerProjects = array_slice(fetch_projects(), 0, 5);

$quickLinks = [
    ['label' => 'Home', 'href' => '/'],
    ['label' => 'Projects', 'href' => '/#projects'],
    ['label' => 'Locations', 'href' => '#'],
    ['label' => 'Market Insights', 'href' => '#'],
    ['label' => 'About Us', 'href' => '#'],
    ['label' => 'Contact Us', 'href' => '#'],
];

$socialLinks = [
    ['key' => 'facebook', 'label' => 'Facebook', 'hover' => 'hover:bg-blue-600'],
    ['key' => 'instagram', 'label' => 'Instagram', 'hover' => 'hover:bg-pink-600'],
    ['key' => 'x', 'label' => 'X (Twitter)', 'hover' => 'hover:bg-neutral-600'],
    ['key' => 'youtube', 'label' => 'YouTube', 'hover' => 'hover:bg-red-600'],
];
?>
<footer class="bg-[#0f1c2e] pt-14 pb-6 text-gray-300">
    <div class="mx-auto w-full max-w-285 px-4 md:px-16">
        <div class="grid gap-10 md:grid-cols-4">
            <div>
                <a href="/" class="flex flex-col leading-none text-white no-underline">
                    <span class="text-2xl font-semibold tracking-[4px]">SOBHA</span>
                    <span class="mt-1 font-serif text-xs tracking-[3px] text-primary-light italic">Properties</span>
                </a>

                <p class="mt-3 text-sm leading-6 text-gray-400">
                    Sobha Realty is one of India's most trusted real estate developers delivering premium residential projects with world-class craftsmanship.
                </p>
            </div>

            <div>
                <h3 class="mb-4 text-lg font-semibold text-white">Quick Links</h3>
                <ul class="space-y-2 text-sm">
                    <?php foreach ($quickLinks as $link): ?>
                        <li><a href="<?= e($link['href']) ?>" class="text-gray-300 no-underline transition-colors hover:text-white"><?= e($link['label']) ?></a></li>
                    <?php endforeach; ?>
                </ul>
            </div>

            <div>
                <h3 class="mb-4 text-lg font-semibold text-white">Projects in Bangalore</h3>
                <ul class="space-y-2 text-sm">
                    <?php foreach ($footerProjects as $project): ?>
                        <li><a href="<?= e(project_url($project)) ?>" class="text-gray-300 no-underline transition-colors hover:text-white"><?= e($project['name'] ?? '') ?></a></li>
                    <?php endforeach; ?>
                </ul>
            </div>

            <div>
                <h3 class="mb-4 text-lg font-semibold text-white">Contact Us</h3>

                <div class="mb-6 space-y-3 text-sm">
                    <div class="flex items-start gap-2">
                        <?= amenity_icon('map-pin', 'mt-1 h-4 w-4 shrink-0 text-gray-400') ?>
                        <p>Bangalore, Karnataka, India</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <?= amenity_icon('phone', 'h-4 w-4 shrink-0 text-gray-400') ?>
                        <p>+91 9380660766</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <?= amenity_icon('mail', 'h-4 w-4 shrink-0 text-gray-400') ?>
                        <p>info@sobhaproperties.in</p>
                    </div>
                </div>

                <div class="flex gap-3">
                    <?php foreach ($socialLinks as $social): ?>
                        <a href="#" aria-label="<?= e($social['label']) ?>" class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-white transition <?= e($social['hover']) ?>">
                            <?= social_icon($social['key'], 'h-4 w-4') ?>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>

        <div class="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
            &copy; <?= date('Y') ?> Sobha Properties. All rights reserved.
        </div>
    </div>
</footer>
