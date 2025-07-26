import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { ProductComponent } from '../../../components/product';
import UserLayout from '../../../layouts/user-layout';

export default function Index() {
    const [quantity, setQuantity] = useState<number>(0);
    const [variant, setVariant] = useState<string>('');

    const onCalculate = (type: 'increase' | 'decrease') => {
        if (type === 'increase') {
            setQuantity((prev) => prev + 1);
        } else {
            setQuantity((prev) => (prev <= 0 ? 0 : prev - 1));
        }
    };
    return (
        <UserLayout>
            <div className="relative mt-10 flex min-h-[44.5vh] w-full flex-col">
                <div className="relative mx-auto flex w-[90%] gap-[100px]">
                    <div className="relative flex aspect-square w-[50%] items-center justify-center overflow-hidden bg-neutral-700">
                        <img src="/images/oli-castrol.jpg" alt="Oli Castrol" className="h-full w-full object-cover object-center" />
                    </div>

                    <div className="flex w-[50%] flex-col text-black dark:text-white">
                        <div className="mb-7 flex flex-1 flex-col border-b border-solid border-black pb-7 dark:border-white">
                            <h1 className="mb-5 text-2xl font-semibold">Oli Castrol</h1>
                            <p className="mb-5 text-2xl font-normal">Rp 100.000,00</p>
                            <p className="text-sm font-light">
                                Castrol adalah pilihan tepat untuk perawatan mesin kendaraan Anda. Dengan teknologi canggih, oli Castrol membantu
                                melindungi mesin sejak awal, mengurangi gesekan, dan memperpanjang usia pakai kendaraan. Tersedia dalam berbagai tipe
                                dan ukuran sesuai kebutuhan motor atau mobil Anda.
                            </p>
                        </div>

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

                        <div className="mb-5 flex gap-3">
                            <div className="text-lg font-normal">Quantity:</div>
                            <div className="flex flex-1 items-center gap-1">
                                <Button
                                    typr="button"
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
                                    typr="button"
                                    className="rounded border-black dark:border-white"
                                    onClick={() => onCalculate('increase')}
                                    variant="outline"
                                >
                                    <Plus />
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-1 items-center gap-3">
                            <Button type="button" variant="outline" className="w-full !border-black dark:!border-white">
                                Add Cart
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
                        {[1, 2, 3, 4, 5].map((product) => {
                            return <ProductComponent key={product}></ProductComponent>;
                        })}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
