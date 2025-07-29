import { toast as sonnerToast } from 'sonner';

export function showToast(message: string, type: 'success' | 'error' = 'success') {
    sonnerToast(message, {
        className: '!bg-neutral-800 [&>button]:!bg-neutral-800',
        closeButton: true,
        style: {
            color: '#fff',
            border: type === 'error' ? '1px solid #f87171' : '1px solid #4ade80',
        },
    });
}
