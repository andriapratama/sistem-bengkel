import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export function ProductComponent() {
    return (
        <div className="flex w-full flex-col gap-1 overflow-hidden rounded shadow-2xl">
            <Link href={`/products/${1}`} className="flex aspect-square w-full items-center justify-center overflow-hidden bg-neutral-800">
                <img src="/images/oli-castrol.jpg" alt="Oli Castrol" className="h-full w-full object-cover object-center" />
            </Link>
            <p className="line-clamp-1 text-sm font-semibold text-white">Oli Castrol</p>
            <div className="flex items-center gap-3 text-base font-bold">
                <p>Rp. 50.000</p>
                <p className="text-sm text-neutral-400 line-through">Rp. 100.000</p>
            </div>
            <Button
                type="button"
                className="mt-2 flex w-full cursor-pointer items-center justify-center bg-white py-2 text-sm font-semibold text-black"
            >
                Add Cart
            </Button>
        </div>
    );
}
