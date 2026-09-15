@props([
    'id',
    'title',
    'description' => null,
    'size' => 'default',
])

@php
    $titleId = $id.'-title';
    $descriptionId = $description ? $id.'-description' : null;
    $sizeClass = match ($size) {
        'small' => 'nds-dialog--small',
        'large' => 'nds-dialog--large',
        default => null,
    };
@endphp

<dialog
    id="{{ $id }}"
    data-nds-dialog
    aria-labelledby="{{ $titleId }}"
    @if ($descriptionId) aria-describedby="{{ $descriptionId }}" @endif
    {{ $attributes->class(['nds-dialog', $sizeClass]) }}
>
    <header class="nds-dialog__header">
        <div>
            <h2 class="nds-dialog__title" id="{{ $titleId }}">{{ $title }}</h2>
            @if ($description)
                <p class="nds-dialog__description" id="{{ $descriptionId }}">{{ $description }}</p>
            @endif
        </div>
    </header>
    <div class="nds-dialog__body">{{ $slot }}</div>
    @isset($footer)
        <footer class="nds-dialog__footer">{{ $footer }}</footer>
    @endisset
</dialog>
