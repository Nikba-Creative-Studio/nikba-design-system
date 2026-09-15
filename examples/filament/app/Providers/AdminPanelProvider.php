<?php

namespace App\Providers\Filament;

use Filament\FontProviders\LocalFontProvider;
use Filament\Panel;
use Filament\PanelProvider;

final class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->viteTheme('resources/css/filament/admin/theme.css')
            ->font(
                'Onest',
                url: asset('css/fonts.css'),
                provider: LocalFontProvider::class,
            )
            ->colors([
                'primary' => '#20211f',
                'success' => '#237a57',
                'warning' => '#956b20',
                'danger' => '#b43b3b',
                'info' => '#496a86',
            ])
            ->brandLogo(asset('images/nikba.svg'))
            ->brandLogoHeight('2rem');
    }
}
