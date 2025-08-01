import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

import UserLayout from '../../layouts/user-layout';

export default function Index() {
    const [section, setSection] = useState<string>('all');

    const toDetail = (invoice: string) => {
        router.visit(`/my-orders/${invoice}`);
    };

    return (
        <UserLayout>
            <div className="mt-10 flex min-h-[calc(100vh-524px)] w-full flex-col gap-5">
                <div className="flex w-full items-center">
                    {['all', 'pending', 'shipped', 'delivered', 'canceled'].map((item) => {
                        return (
                            <button
                                type="button"
                                className={`mr-5 cursor-pointer border-r border-solid border-black pr-5 text-base text-black capitalize outline-none last:border-none dark:border-white dark:text-white ${
                                    item === section ? 'font-semibold' : 'font-normal'
                                }`}
                                onClick={() => setSection(item)}
                            >
                                {item}
                            </button>
                        );
                    })}
                </div>

                <div className="flex w-full flex-col rounded border border-solid border-black p-5 dark:border-white">
                    <div className="mb-5 flex w-full items-center justify-between">
                        <div className="flex items-center justify-center bg-green-600 px-3 text-base text-white uppercase">delivered</div>
                    </div>

                    <div className="mb-5 flex w-full items-center justify-between border-b border-solid border-black pb-5 text-sm text-black dark:border-white dark:text-white">
                        <div className="flex gap-5">
                            <div className="border-r border-solid border-black pr-5 dark:border-white">04/02/2025, 12.12</div>
                            <div>Invoice No: TRS251030001</div>
                        </div>

                        <div>
                            Total: <span className="text-xl font-semibold">Rp 100.000</span>
                        </div>
                    </div>

                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="flex aspect-square w-[100px] items-center justify-center overflow-hidden bg-neutral-200"></div>

                            <div className="flex flex-col gap-1">
                                <div className="text-base font-semibold">Shockbeker</div>
                                <div>Rp 100.000 x 1</div>
                            </div>
                        </div>

                        <Button type="button" onClick={() => toDetail('asd123123213')}>
                            Order Detail
                        </Button>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
