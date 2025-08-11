import axios from 'axios';
import { Image, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Product, SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';

import { showToast } from '../../../../../lib/utils/toast';
import { ProductComponent } from '../../../components/product';
import UserLayout from '../../../layouts/user-layout';

type PageProps = {
    product: Product;
    reccomendations: Array<Product>;
};

export default function Index() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const { product, reccomendations } = usePage<PageProps>().props;

    const [quantity, setQuantity] = useState<number>(0);
    const [variant, setVariant] = useState<string>('');
    const [processing, setProcessing] = useState<boolean>(false);
    const [isImageError, setIsImageError] = useState<boolean>(false);

    const onCalculate = (type: 'increase' | 'decrease') => {
        if (type === 'increase') {
            setQuantity((prev) => prev + 1);
        } else {
            setQuantity((prev) => (prev <= 0 ? 0 : prev - 1));
        }
    };

    const formatPrice = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        })
            .format(number)
            .replaceAll(',00', '');
    };

    const onAddCart = async () => {
        if (!auth.user) {
            router.visit('/login');
            return;
        }

        if (quantity < 1) {
            showToast('Quantity must be more than 1', 'error');
            return;
        }

        try {
            setProcessing((prev) => !prev);
            await axios.post(route('carts.store'), {
                quantity: quantity,
                product_id: product.id,
                user_id: auth.user.id,
                variant_id: null,
            });
            showToast('Cart saved.');
        } catch (error: any) {
            console.log(error.response);
            showToast('Server Error', 'error');
        } finally {
            setProcessing((prev) => !prev);
        }
    };
    return (
        <UserLayout>
            <div className="relative mt-10 flex min-h-[44.5vh] w-full flex-col">
                <div className="relative mx-auto flex w-[90%] gap-[100px]">
                    <div className="relative flex aspect-square w-[50%] items-center justify-center overflow-hidden bg-neutral-300 dark:bg-neutral-800">
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className={`h-full w-full object-cover object-center ${isImageError ? 'opacity-0' : 'opacity-100'}`}
                            onLoad={() => {
                                setIsImageError(false);
                            }}
                            onError={() => {
                                setIsImageError(true);
                            }}
                        />
                        <Image className={`absolute size-[100px] text-black dark:text-white ${isImageError ? 'opacity-100' : 'opacity-0'}`} />
                    </div>

                    <div className="flex h-fit w-[50%] flex-col text-black dark:text-white">
                        <div className="mb-7 flex flex-1 flex-col border-b border-solid border-black pb-7 dark:border-white">
                            <h1 className="mb-5 text-2xl font-semibold">{product.name}</h1>
                            <p className="mb-5 text-2xl font-normal">{formatPrice(product.price)}</p>
                            {product.description ? <p className="text-sm font-light">{product.description}</p> : null}
                        </div>

                        {product.has_variant ? (
                            <div className="mb-5 flex gap-3">
                                <div className="text-lg font-normal">Variants:</div>
                                <div className="flex flex-1 flex-wrap gap-3">
                                    {['1L - Full Sintetik', '4L - Full Sintetik', '1L - Matic', '4L - Matic'].map((item) => {
                                        return (
                                            <Button
                                                key={item}
                                                type="button"
                                                className={`rounded border-black dark:border-white ${item === variant ? 'bg-black text-white dark:bg-white dark:text-black' : ''}`}
                                                variant="outline"
                                                onClick={() => setVariant(item)}
                                            >
                                                {item}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : null}

                        <div className="mb-5 flex gap-3">
                            <div className="text-lg font-normal">Quantity:</div>
                            <div className="flex flex-1 items-center gap-1">
                                <Button
                                    type="button"
                                    className="rounded border-black dark:border-white"
                                    onClick={() => onCalculate('decrease')}
                                    variant="outline"
                                >
                                    <Minus />
                                </Button>
                                <div className="flex h-[35px] w-[150px] items-center justify-center rounded border border-solid border-black dark:border-white">
                                    {quantity}
                                </div>
                                <Button
                                    type="button"
                                    className="rounded border-black dark:border-white"
                                    onClick={() => onCalculate('increase')}
                                    variant="outline"
                                >
                                    <Plus />
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-1 items-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full !border-black dark:!border-white"
                                disabled={processing}
                                onClick={onAddCart}
                            >
                                {processing ? 'Loading ...' : 'Add Cart'}
                            </Button>
                            <Button type="button" className="w-full">
                                Buy Now
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-32 flex w-full flex-col gap-10">
                    <h2 className="text-2xl font-bold text-white">Reccomendation Products</h2>
                    <div className="grid w-full grid-cols-5 gap-4">
                        {reccomendations.map((product) => {
                            return <ProductComponent key={product.id} product={product} user={auth.user}></ProductComponent>;
                        })}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
