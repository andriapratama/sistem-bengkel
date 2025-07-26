import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Product } from '@/types';
import { Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import UserLayout from '../../layouts/user-layout';

export default function Index() {
    const [resProducts, setResProducts] = useState<Product[]>([
        {
            id: 1,
            name: 'Oli Castrol 1L - Matic',
            slug: 'Oli Castrol',
            description: 'Oli Castrol',
            stock: 10,
            quantity: 0,
            cost: 100000,
            price: 200000,
        },
        {
            id: 2,
            name: 'Oli Castrol 1L - Static',
            slug: 'Oli Castrol',
            description: 'Oli Castrol',
            stock: 10,
            quantity: 0,
            cost: 100000,
            price: 400000,
        },
    ]);
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [grandTotal, setGrandTotal] = useState<number>(0);

    const onCalculate = (type: 'increase' | 'decrease', index: number) => {
        const newProducts = [...products];
        let quantity = 0;
        if (type === 'increase') {
            quantity = newProducts[index].quantity + 1;
        } else {
            quantity = newProducts[index].quantity <= 0 ? 0 : newProducts[index].quantity - 1;
        }

        const subtotal = quantity * newProducts[index].price;
        newProducts[index] = {
            ...newProducts[index],
            quantity,
            subtotal,
        };
        setProducts(newProducts);
    };

    useEffect(() => {
        const newProducts: Product[] = [];

        resProducts.map((product) => {
            const tmpProduct = { ...product, subtotal: 0, checked: false };
            newProducts.push(tmpProduct);
        });

        setProducts(newProducts);
    }, [resProducts]);

    useEffect(() => {
        const filter = products.filter((product) => product.checked);
        if (filter.length > 0) {
            const total = filter.reduce((total, item) => {
                return total + item.subtotal;
            }, 0);

            const grandTotal = total;

            setTotal(total);
            setGrandTotal(grandTotal);
        } else {
            setTotal(0);
            setGrandTotal(0);
        }
    }, [products]);

    const formatPrice = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        })
            .format(number)
            .replaceAll(',00', '');
    };

    const onChecked = (index: number) => {
        setProducts((prev) => prev.map((item, i) => (i === index ? { ...item, checked: !item.checked } : item)));
    };

    return (
        <UserLayout>
            <div className="mt-10 flex min-h-[44.5vh] w-full flex-col">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-center">Quantity</TableHead>
                            <TableHead className="w-[12%]">Subtotal</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product, i) => {
                            return (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={product.checked}
                                            onCheckedChange={() => onChecked(i)}
                                            className="border-black dark:border-white"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex aspect-square w-[50px] items-center justify-center overflow-hidden">
                                                <img
                                                    src="/images/oli-castrol.jpg"
                                                    alt="Oli Castrol"
                                                    className="h-full w-full object-cover object-center"
                                                    loading="lazy"
                                                />
                                            </div>

                                            <p className="text-sm font-light text-black dark:text-white">Oli Castrol</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatPrice(product.price)}</TableCell>
                                    <TableCell>
                                        <div className="flex w-full items-center justify-center gap-1">
                                            <Button
                                                typr="button"
                                                className="rounded border-black dark:border-white"
                                                onClick={() => onCalculate('decrease', i)}
                                                variant="outline"
                                            >
                                                <Minus />
                                            </Button>
                                            <div className="flex h-[35px] w-[100px] items-center justify-center rounded border border-solid border-black dark:border-white">
                                                {product.quantity}
                                            </div>
                                            <Button
                                                typr="button"
                                                className="rounded border-black dark:border-white"
                                                onClick={() => onCalculate('increase', i)}
                                                variant="outline"
                                            >
                                                <Plus />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatPrice(product.subtotal)}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                <div className="mt-[100px] flex w-full justify-end">
                    <div className="flex w-[400px] flex-col gap-3 rounded border border-solid border-black px-5 py-6 text-black dark:border-white dark:text-white">
                        <p className="text-lg font-normal">Cart Total</p>
                        <div className="flex w-full items-center justify-between border-b border-solid border-black pb-3 text-sm dark:border-white">
                            <p>Total</p>
                            <p>{formatPrice(total)}</p>
                        </div>
                        <div className="flex w-full items-center justify-between border-b border-solid border-black pb-3 text-sm dark:border-white">
                            <p>Shipping</p>
                            <p>{formatPrice(0)}</p>
                        </div>
                        <div className="flex w-full items-center justify-between text-base font-semibold">
                            <p>Grand Total</p>
                            <p>{formatPrice(grandTotal)}</p>
                        </div>

                        <div className="mt-2 flex w-full items-center justify-center">
                            <Button type="button" className="w-[200px]">
                                Process to Checkout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
