import axios from 'axios';
import { ChevronLeft, ChevronRight, Image } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category, HomePage, Product, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

import { ProductComponent } from '../../components/product';
import UserLayout from '../../layouts/user-layout';

export default function Index() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const initialCategory = new URLSearchParams(window.location.search).get('category') || '';

    const [search, setSearch] = useState<string>('');
    const [category, setCategory] = useState<string>(initialCategory);
    const [home, setHome] = useState<HomePage>();
    const [isHeroError, setIsHeroError] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);

    const [productPage, setProductPage] = useState<number>(1);
    const [products, setProducts] = useState<Product[]>([]);
    const [productTotalPage, setProductTotalPage] = useState<number>(1);
    const [productPageActive, setProductPageActive] = useState<number>(1);
    const [productPaginations, setProductPaginations] = useState<number[]>([]);

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
            const rs = await axios.get('/get-all-categories');
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
            if (search) queryParams.push(`search=${search}`);
            if (category) queryParams.push(`category=${category}`);
            queryParams.push(`limit=${12}`);
            const rs = await axios.get(`/get-all-products?${queryParams.join('&')}`);

            if (rs.data.success) {
                const data = rs.data.products;
                setProducts(data.data);
                setProductTotalPage(data.last_page);
                setProductPageActive(data.current_page);

                const newPaginations: number[] = [];
                for (let i = 1; i <= data.last_page; i++) {
                    newPaginations.push(i);
                }
                setProductPaginations(newPaginations);
            }
        } catch (error) {
            console.log(error);
        }
    }, [productPage, search, category]);

    useEffect(() => {
        getAllProducts();
    }, [getAllProducts]);

    useEffect(() => {
        if (category) {
            const params = new URLSearchParams(window.location.search);
            params.set('category', category);

            const newUrl = `${window.location.pathname}?${params.toString()}`;
            window.history.replaceState({}, '', newUrl);
        }
    }, [category]);

    return (
        <UserLayout>
            <div className="mt-10 flex min-h-[44.5vh] w-full flex-col gap-10">
                <div className="flex aspect-[22/6] w-full items-center justify-center overflow-hidden bg-neutral-100 dark:bg-neutral-900">
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

                <div className="flex w-full items-center justify-start gap-5">
                    <div className="w-[300px]">
                        <Input
                            id="search"
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setProductPage(1);
                                setCategory('');
                            }}
                            placeholder="Search product"
                            className="!border-black dark:!border-white"
                        />
                    </div>

                    <div className="w-[300px]">
                        <Select
                            onValueChange={(e) => {
                                setCategory(e);
                                setProductPage(1);
                                setSearch('');
                            }}
                            value={String(category)}
                        >
                            <SelectTrigger className="w-full !border-black dark:!border-white">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={String(category.slug)}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        type="button"
                        onClick={() => {
                            setSearch('');
                            setCategory('');
                        }}
                    >
                        Clear
                    </Button>
                </div>

                <div className="flex w-full flex-col">
                    <div className="grid w-full grid-cols-4 gap-9">
                        {products.map((product) => {
                            return <ProductComponent key={product.id} product={product} user={auth.user}></ProductComponent>;
                        })}
                    </div>
                </div>

                {productTotalPage > 1 ? (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <Button
                                    type="button"
                                    onClick={() => setProductPage((prev) => prev - 1)}
                                    disabled={productPage <= 1}
                                    className="border-black dark:border-white"
                                    variant="outline"
                                >
                                    <ChevronLeft />
                                </Button>
                            </PaginationItem>
                            {productPaginations.map((item) => {
                                const isActive = item === productPageActive ? true : false;
                                return (
                                    <PaginationItem key={item}>
                                        <Button
                                            type="button"
                                            onClick={() => setProductPage(item)}
                                            variant={isActive ? 'outline' : 'ghost'}
                                            className="border-black dark:border-white"
                                        >
                                            {item}
                                        </Button>
                                    </PaginationItem>
                                );
                            })}
                            <PaginationItem>
                                <Button
                                    type="button"
                                    onClick={() => setProductPage((prev) => prev + 1)}
                                    disabled={productPage >= productTotalPage}
                                    className="border-black dark:border-white"
                                    variant="outline"
                                >
                                    <ChevronRight />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                ) : null}
            </div>
        </UserLayout>
    );
}
