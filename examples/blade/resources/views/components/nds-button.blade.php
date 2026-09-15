@props([
    'type' => 'button',
    'variant' => 'primary',
    'size' => 'large',
])

@php
    $variantClass = match ($variant) {
        'secondary' => 'nds-button--secondary',
        'ghost' => 'nds-button--ghost',
        'danger' => 'nds-button--danger',
        default => null,
    };
    $sizeClass = match ($size) {
        'small' => 'nds-button--small',
        'medium' => 'nds-button--medium',
        default => 'nds-button--large',
    };
@endphp

<button {{ $attributes->class(['nds-button', $variantClass, $sizeClass])->merge(['type' => $type]) }}>
    {{ $slot }}
</button>
