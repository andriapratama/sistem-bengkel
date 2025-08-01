import axios from 'axios';
import { Image } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Product, User } from '@/types';
import { Link, router } from '@inertiajs/react';

import { showToast } from '../../../lib/utils/toast';

interface ProductComponentProps {
    product?: Product;
    user?: User;
}

export function ProductComponent({ product, user }: ProductComponentProps) {
    const [processing, setProcessing] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const formatPrice = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        })
            .format(number)
            .replaceAll(',00', '');
    };

    const onAddCart = async () => {
        if (!user || !product) {
            router.visit('/login');
            return;
        }

        if (product.hasVariant) {
            router.visit(`/products/${product.slug}`);
            return;
        }

        try {
            setProcessing((prev) => !prev);
            await axios.post(route('carts.store'), {
                quantity: 1,
                product_id: product.id,
                user_id: user.id,
                checked: false,
                variant_id: null,
            });
            setProcessing((prev) => !prev);
            showToast('Cart saved.');
        } catch (error) {
            console.log(error);
            showToast('Server Error', 'error');
        }
    };

    if (!product) return null;
    return (
        <div className="flex w-full flex-col gap-1 overflow-hidden rounded shadow-2xl">
            <Link
                href={`/products/${product.slug}`}
                className="flex aspect-square w-full items-center justify-center overflow-hidden bg-neutral-200 dark:bg-neutral-800"
            >
                <img
                    src={product.image_url}
                    alt={product.name}
                    onLoad={() => {
                        setIsError(false);
                    }}
                    onError={() => {
                        setIsError(true);
                    }}
                    className={`h-full w-full object-cover object-center ${isError ? 'opacity-0' : 'opacity-100'}`}
                />
                <Image className={`absolute size-[70px] text-black dark:text-white ${isError ? 'opacity-100' : 'opacity-0'}`} />
            </Link>
            <div className="flex w-full flex-col px-2">
                <p className="line-clamp-1 text-sm font-semibold text-black dark:text-white">{product.name}</p>
                <div className="flex items-center gap-3 text-base font-bold text-black dark:text-white">
                    <p>{formatPrice(product.price)}</p>
                    {/* <p className="text-sm text-neutral-400 line-through">Rp. 100.000</p> */}
                </div>
            </div>
            <Button
                type="button"
                className="mt-2 flex w-full cursor-pointer items-center justify-center bg-black py-2 text-sm font-semibold text-white dark:bg-white dark:text-black"
                onClick={onAddCart}
                disabled={processing}
            >
                {processing ? 'Loading...' : 'Add Cart'}
            </Button>
        </div>
    );
}
