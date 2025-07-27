import { Button } from '@/components/ui/button';
import { type Product } from '@/types';
import { Link } from '@inertiajs/react';

interface ProductComponentProps {
    product?: Product;
}

export function ProductComponent({ product }: ProductComponentProps) {
    if (!product) return null;

    const formatPrice = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        })
            .format(number)
            .replaceAll(',00', '');
    };

    return (
        <div className="flex w-full flex-col gap-1 overflow-hidden rounded shadow-2xl">
            <Link href={`/products/${product.slug}`} className="flex aspect-square w-full items-center justify-center overflow-hidden bg-neutral-800">
                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover object-center" />
            </Link>
            <p className="line-clamp-1 text-sm font-semibold text-white">{product.name}</p>
            <div className="flex items-center gap-3 text-base font-bold">
                <p>{formatPrice(product.price)}</p>
                {/* <p className="text-sm text-neutral-400 line-through">Rp. 100.000</p> */}
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
