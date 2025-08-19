import axios from 'axios';
import { ArrowLeft, ArrowRight, Image } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { showToast } from '@/lib/utils/toast';
import { Category, HomePage, Product, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

import { ProductComponent } from '../../components/product';
import UserLayout from '../../layouts/user-layout';

type PageProps = {
    bestSeller: Product[];
    success?: string;
};

export default function Index() {
    const { bestSeller, success } = usePage<PageProps>().props;

    const page = usePage<SharedData>();
    const { auth } = page.props;
    const [home, setHome] = useState<HomePage>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isHeroError, setIsHeroError] = useState<boolean>(false);
    const [productPage, setProductPage] = useState<number>(1);
    const [products, setProducts] = useState<Product[]>([]);
    const [productTotalPage, setProductTotalPage] = useState<number>(1);

    useEffect(() => {
        if (success) {
            showToast(success);
        }
    }, [success]);

    const getHomePage = async () => {
        try {
            const rs = await axios.get('/get-home-page');
            const data = rs.data.data;
            setHome(data);
        } catch (error) {
            console.log(error);
        }
    };

    const getCategories = async () => {
        try {
            const rs = await axios.get('/get-categories');
            const data = rs.data.data;
            setCategories(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getHomePage();
        getCategories();
    }, []);

    const getAllProducts = useCallback(async () => {
        try {
            const queryParams: string[] = [];

            if (productPage) queryParams.push(`page=${productPage}`);
            queryParams.push(`limit=${8}`);
            const rs = await axios.get(`/get-all-products?${queryParams.join('&')}`);

            if (rs.data.success) {
                const data = rs.data.products;
                setProducts(data.data);
                setProductTotalPage(data.last_page);
            }
        } catch (error) {
            console.log(error);
        }
    }, [productPage]);

    useEffect(() => {
        getAllProducts();
    }, [getAllProducts]);

    const onChangeProductPage = async (type: 'increase' | 'decrease') => {
        if (type === 'increase') {
            setProductPage((prev) => (prev < productTotalPage ? prev + 1 : prev));
        } else {
            setProductPage((prev) => (prev > 1 ? prev - 1 : prev));
        }

        await getAllProducts();
    };

    return (
        <UserLayout>
            <div className="flex w-full gap-10">
                <div className="flex w-[220px] flex-col border-r border-solid border-neutral-600 pt-10 pr-5">
                    {categories.map((category) => {
                        return (
                            <TextLink
                                key={category.id}
                                href="/products"
                                className="cursor-pointer border-none px-2 py-1 text-start text-sm font-normal text-black dark:text-white"
                            >
                                {category.name}
                            </TextLink>
                        );
                    })}
                </div>

                <div className="flex flex-1 justify-center pt-10">
                    <div className="flex aspect-[22/6] w-[95%] items-center justify-center overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                        <img
                            src={`/storage/${home?.hero}`}
                            alt="Hero"
                            onLoad={() => {
                                setIsHeroError(false);
                            }}
                            onError={() => {
                                setIsHeroError(true);
                            }}
                            className={`h-full w-full object-cover object-center ${isHeroError ? 'opacity-0' : 'opacity-100'}`}
                        />
                        <Image className={`absolute size-[70px] text-black dark:text-white ${isHeroError ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                </div>
            </div>

            <div className="mt-20 flex w-full flex-col gap-10">
                <div className="flex w-full items-center justify-between">
                    <h2 className="text-3xl font-bold text-black dark:text-white">Best Selling Product</h2>
                    <Button
                        type="button"
                        className="flex h-[50px] w-[150px] cursor-pointer items-center justify-center rounded-[8px] bg-black text-sm font-semibold text-white dark:bg-white dark:text-black"
                    >
                        View All
                    </Button>
                </div>

                <div className="grid w-full grid-cols-4 gap-9">
                    {bestSeller.map((product) => {
                        return <ProductComponent key={product.id} product={product} user={auth.user}></ProductComponent>;
                    })}
                </div>
            </div>

            <div className="relative mt-20 flex aspect-[22/9] w-full overflow-hidden bg-neutral-800">
                <img src="/images/garage.jpg" alt="Garage" className="absolute top-0 left-0 h-full w-full object-cover object-center grayscale" />

                <div className="relative z-10 flex h-full w-full items-center bg-black/80 pr-10 pb-5 pl-28">
                    <div className="flex w-[50%] flex-col">
                        <p className="text-[50px] leading-[70px] font-semibold text-white">Trust Your Vehicle Service to the Experts</p>
                        <Button type="button" className="mt-5 w-fit rounded bg-green-500 px-7 py-3 text-lg font-semibold text-white">
                            Book Now
                        </Button>
                    </div>

                    <div className="flex-1">
                        <img src="images/mechanics.png" alt="Mechanics" className="h-full w-auto object-contain object-center" loading="lazy" />
                    </div>
                </div>
            </div>

            <div className="mt-20 flex w-full flex-col gap-10">
                <div className="flex w-full items-center justify-between">
                    <h2 className="text-3xl font-bold text-black dark:text-white">Explore Out Products</h2>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full bg-neutral-300 text-black dark:bg-neutral-800 dark:text-white"
                            onClick={() => onChangeProductPage('decrease')}
                            disabled={productPage <= 1}
                        >
                            <ArrowLeft />
                        </Button>
                        <Button
                            type="button"
                            className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full bg-neutral-300 text-black dark:bg-neutral-800 dark:text-white"
                            onClick={() => onChangeProductPage('increase')}
                            disabled={productPage >= productTotalPage}
                        >
                            <ArrowRight />
                        </Button>
                    </div>
                </div>

                <div className="grid w-full grid-cols-4 gap-9">
                    {products.map((product) => {
                        return <ProductComponent key={product.id} product={product} user={auth.user}></ProductComponent>;
                    })}
                </div>

                <div className="flex w-full justify-center">
                    <Link href="/products">
                        <Button
                            type="button"
                            className="flex h-[50px] w-[180px] cursor-pointer items-center justify-center rounded-[8px] bg-black text-sm font-semibold text-white dark:bg-white dark:text-black"
                        >
                            View All Products
                        </Button>
                    </Link>
                </div>
            </div>
        </UserLayout>
    );
}
