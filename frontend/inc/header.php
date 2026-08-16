<?php
$activePage = $activePage ?? '';
$transparentHeader = $transparentHeader ?? false;
$navItems = [
    ['label' => 'Home', 'href' => '/', 'key' => 'home'],
    ['label' => 'Projects', 'href' => '/#projects', 'key' => 'projects'],
    ['label' => 'Locations', 'href' => '#', 'key' => 'locations'],
    ['label' => 'Blogs', 'href' => '#', 'key' => 'blogs'],
    ['label' => 'About Us', 'href' => '#', 'key' => 'about'],
];
$headerStateClasses = $transparentHeader ? 'bg-transparent' : 'bg-secondary border-b border-white/10';
?>
<header id="siteHeader" data-transparent="<?= $transparentHeader ? 'true' : 'false' ?>" class="fixed top-0 inset-x-0 z-50 transition-all duration-300 <?= $headerStateClasses ?>">
    <div class="container-page">
        <div class="flex h-20 items-center justify-between gap-6">
            <a href="/" class="flex flex-col leading-none text-white no-underline shrink-0">
                <span class="text-2xl font-bold tracking-[0.2em]">SOBHA</span>
                <span class="-mt-0.5 font-serif text-sm italic text-primary-light">Properties</span>
            </a>

            <nav id="navLinksDesktop" class="hidden lg:flex items-center gap-8 mx-auto">
                <?php foreach ($navItems as $item): ?>
                    <a
                        href="<?= e($item['href']) ?>"
                        class="relative py-1.5 text-xs font-medium uppercase tracking-widest transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary-light after:transition-all
                            <?= $activePage === $item['key']
                                ? 'text-white after:w-full'
                                : 'text-white/80 hover:text-white after:w-0 hover:after:w-full' ?>"
                    ><?= e($item['label']) ?></a>
                <?php endforeach; ?>
            </nav>

            <div class="flex items-center gap-4 shrink-0">
                <button type="button" data-modal-heading="Contact Us" data-modal-btn="Send Enquiry" class="open-lead-modal hidden sm:inline-flex cursor-pointer items-center justify-center rounded-full bg-primary-gradient px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-black shadow-md shadow-black/20 transition-all hover:-translate-y-0.5 hover:shadow-lg">Contact Us</button>
                <button id="navToggle" type="button" aria-label="Toggle menu" aria-expanded="false" aria-controls="navLinksMobile" class="lg:hidden flex flex-col justify-center items-center gap-1.5 w-8.5 h-8.5 shrink-0">
                    <span class="nav-toggle-bar block w-5.5 h-0.5 bg-white rounded-full transition-transform duration-300"></span>
                    <span class="nav-toggle-bar block w-5.5 h-0.5 bg-white rounded-full transition-opacity duration-300"></span>
                    <span class="nav-toggle-bar block w-5.5 h-0.5 bg-white rounded-full transition-transform duration-300"></span>
                </button>
            </div>
        </div>
    </div>

    <div id="navOverlay" class="fixed inset-0 z-40 hidden bg-black/50 opacity-0 transition-opacity duration-300 lg:hidden"></div>

    <nav id="navLinksMobile" class="fixed top-0 right-0 z-50 flex h-full w-72 max-w-[80%] translate-x-full flex-col bg-neutral-900 shadow-2xl transition-transform duration-300 lg:hidden">
        <div class="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-6">
            <span class="text-sm font-semibold tracking-widest text-white uppercase">Menu</span>
            <button type="button" id="navClose" aria-label="Close menu" class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white">
                <?= amenity_icon('close', 'h-4 w-4', '2.5') ?>
            </button>
        </div>

        <div class="flex flex-col overflow-y-auto px-6 py-2">
            <?php foreach ($navItems as $item): ?>
                <a
                    href="<?= e($item['href']) ?>"
                    class="block border-b border-white/5 py-3.5 text-sm font-medium tracking-widest uppercase last:border-b-0
                        <?= $activePage === $item['key'] ? 'text-white' : 'text-white/75' ?>"
                ><?= e($item['label']) ?></a>
            <?php endforeach; ?>
        </div>
    </nav>
</header>
