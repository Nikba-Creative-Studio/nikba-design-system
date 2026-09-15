<x-layouts.app title="Account settings">
    <main class="nds-container nds-stack" id="main">
        <section class="nds-card nds-card--large">
            <div class="nds-card__body">
                <h1 class="nds-card__title">Account settings</h1>
                <p class="nds-card__description">This Blade view composes public Nikba classes and thin application components.</p>
            </div>
            <div class="nds-card__footer">
                <x-nds-button variant="danger" data-nds-dialog-open="delete-account-dialog">Delete account</x-nds-button>
            </div>
        </section>
    </main>

    <x-nds-dialog
        id="delete-account-dialog"
        title="Delete account?"
        description="Your profile and projects will be permanently removed."
        size="small"
    >
        <p>This action cannot be undone.</p>
        <x-slot:footer>
            <x-nds-button variant="secondary" data-nds-dialog-close data-nds-dialog-initial-focus>Keep account</x-nds-button>
            <x-nds-button variant="danger" data-nds-dialog-close="delete">Delete account</x-nds-button>
        </x-slot:footer>
    </x-nds-dialog>
</x-layouts.app>
