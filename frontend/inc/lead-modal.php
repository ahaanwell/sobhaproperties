<?php
$leadCompanyEmail = 'info@searchmyspace.in';
$leadContactNumber = '918317452005';
?>
<div id="leadModal" class="fixed inset-0 z-50 hidden items-center justify-center bg-transparent px-4 transition-all duration-300">
    <div id="leadModalCard" class="relative w-full max-w-md translate-y-6 scale-95 overflow-hidden bg-white opacity-0 shadow-2xl transition-all duration-500">
        <div class="h-1 w-full bg-primary"></div>

        <button type="button" id="leadModalClose" aria-label="Close" class="absolute top-3.5 right-3.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-stone-100 text-stone-400 transition-colors hover:bg-stone-200 hover:text-stone-700">
            <?= amenity_icon('close', 'h-3.5 w-3.5', '2.5') ?>
        </button>

        <div id="leadModalSuccess" class="hidden flex-col items-center px-8 py-14 text-center">
            <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary">&#10003;</div>
            <h3 class="mb-2 text-2xl font-semibold text-stone-800">Thank You!</h3>
            <p class="text-sm leading-relaxed text-stone-500">Our team will reach out to you within 24 hours.</p>
        </div>

        <div id="leadModalFormWrap">
            <div class="flex items-start gap-4 border-b border-stone-100 px-7 pt-7 pb-5">
                <div class="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <?= amenity_icon('arrow-right', 'h-4.5 w-4.5', '2') ?>
                </div>
                <div>
                    <p id="leadModalProjectName" class="mb-1 hidden text-[10px] font-semibold tracking-widest text-stone-400 uppercase"></p>
                    <h2 id="leadModalHeading" class="text-2xl leading-snug font-semibold text-stone-800">Enquire Now</h2>
                </div>
            </div>

            <div class="px-7 pt-6 pb-7">
                <form id="leadModalForm" class="space-y-4">
                    <input type="hidden" name="project" value="">

                    <div class="group">
                        <label class="mb-1.5 block text-[11px] font-semibold tracking-widest text-stone-600 uppercase transition-colors group-has-focus:text-primary">Full Name</label>
                        <input
                            type="text" name="name" required placeholder="e.g. Arjun Sharma"
                            class="w-full rounded-sm border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder-stone-500 transition-all duration-200 outline-none hover:border-stone-300 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                        >
                    </div>

                    <div class="group">
                        <label class="mb-1.5 block text-[11px] font-semibold tracking-widest text-stone-600 uppercase transition-colors group-has-focus:text-primary">Email Address</label>
                        <input
                            type="email" name="email" required placeholder="e.g. arjun@email.com"
                            class="w-full rounded-sm border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder-stone-500 transition-all duration-200 outline-none hover:border-stone-300 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                        >
                    </div>

                    <div class="group">
                        <label class="mb-1.5 block text-[11px] font-semibold tracking-widest text-stone-600 uppercase transition-colors group-has-focus:text-primary">Phone Number</label>
                        <div class="flex overflow-hidden rounded-sm border border-stone-200 bg-stone-50 transition-all duration-200 has-focus:border-primary has-focus:bg-white has-focus:ring-2 has-focus:ring-primary/10">
                            <select name="countryCode" class="cursor-pointer border-r border-stone-200 bg-stone-100 px-2 py-3 text-sm text-stone-700 outline-none">
                                <option value="+91">&#127470;&#127475; +91</option>
                                <option value="+1">&#127482;&#127480; +1</option>
                                <option value="+44">&#127468;&#127463; +44</option>
                                <option value="+971">&#127462;&#127466; +971</option>
                                <option value="+65">&#127480;&#127468; +65</option>
                                <option value="+61">&#127462;&#127482; +61</option>
                            </select>
                            <input
                                type="tel" name="phone" required placeholder="e.g. 98765 43210"
                                class="flex-1 bg-transparent px-4 py-3 text-sm text-stone-800 placeholder-stone-500 outline-none"
                            >
                        </div>
                    </div>

                    <p id="leadModalError" class="hidden rounded-sm border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-500"></p>

                    <button
                        type="submit"
                        id="leadModalSubmit"
                        class="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary py-3.5 text-sm font-medium tracking-wide text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <?= amenity_icon('loader-circle', 'h-3.5 w-3.5 animate-spin hidden', '2') ?>
                        <span id="leadModalSubmitLabel">Submit Enquiry</span>
                        <?= amenity_icon('arrow-right', 'h-3.5 w-3.5', '2') ?>
                    </button>
                </form>

                <div class="my-5 flex items-center gap-3">
                    <div class="h-px flex-1 bg-stone-100"></div>
                    <span class="text-[10px] font-medium tracking-widest text-stone-300 uppercase">or reach us directly</span>
                    <div class="h-px flex-1 bg-stone-100"></div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <a
                        href="tel:+<?= e($leadContactNumber) ?>"
                        class="flex items-center justify-center gap-2 rounded-sm border border-blue-100 bg-blue-50 py-2.5 text-sm font-medium text-blue-600 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-md"
                    >
                        <?= amenity_icon('phone', 'h-3.5 w-3.5', '2') ?>
                        Call Now
                    </a>
                    <a
                        href="https://wa.me/<?= e($leadContactNumber) ?>"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex items-center justify-center gap-2 rounded-sm border border-green-100 bg-green-50 py-2.5 text-sm font-medium text-green-600 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-100 hover:shadow-md"
                    >
                        <?= amenity_icon('message-circle', 'h-3.5 w-3.5', '2') ?>
                        WhatsApp
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
