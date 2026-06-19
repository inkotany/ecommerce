import { useAppearance } from '@/hooks/use-appearance';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeSwitcherProps {
    className?: string;
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
    const { appearance, resolvedAppearance, updateAppearance } = useAppearance();

    const themes = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' },
    ] as const;

    return (
        <div className={cn('flex items-center gap-1 rounded-lg bg-muted p-1', className)}>
            {themes.map(({ value, icon: Icon, label }) => (
                <Button
                    key={value}
                    variant="ghost"
                    size="sm"
                    onClick={() => updateAppearance(value)}
                    className={cn(
                        'h-8 w-8 p-0 rounded-md transition-all',
                        appearance === value
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                    title={label}
                >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{label}</span>
                </Button>
            ))}
        </div>
    );
}
