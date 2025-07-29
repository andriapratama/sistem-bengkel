import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Cart } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import UserLayout from '../../layouts/user-layout';

interface PageProps {
    carts: Cart[];
}

export default function Index() {
    const { carts } = usePage().props as PageProps;
    const [cartList, setCartList] = useState<Cart[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [grandTotal, setGrandTotal] = useState<number>(0);

    const onCalculate = (type: 'increase' | 'decrease', index: number) => {
        const newCartList = [...cartList];
        let quantity = 0;
        if (type === 'increase') {
            quantity = newCartList[index].quantity + 1;
        } else {
            quantity = newCartList[index].quantity <= 0 ? 0 : newCartList[index].quantity - 1;
        }

        const subtotal = quantity * newCartList[index].product.price;
        newCartList[index] = {
            ...newCartList[index],
            quantity,
            subtotal,
        };
        setCartList(newCartList);
    };

    useEffect(() => {
        const newCarts: Cart[] = [];

        carts.map((cart) => {
            const subtotal = cart.quantity * cart.product.price;
            const tmpCart = { ...cart, subtotal };
            newCarts.push(tmpCart);
        });

        setCartList(newCarts);
    }, [carts]);

    useEffect(() => {
        const filter = cartList.filter((cart) => cart.checked);
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
    }, [cartList]);

    const formatPrice = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        })
            .format(number)
            .replaceAll(',00', '');
    };

    const onChecked = async (index: number) => {
        setCartList((prev) => prev.map((item, i) => (i === index ? { ...item, checked: !item.checked } : item)));
        const newCart = { ...cartList[index] };
        newCart.checked = !newCart.checked;

        try {
            await axios.put(`/carts/${cartList[index].id}`, newCart);
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
        }
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
                        {cartList.map((cart, i) => {
                            return (
                                <TableRow key={cart.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={cart.checked}
                                            onCheckedChange={() => onChecked(i)}
                                            className="border-black dark:border-white"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex aspect-square w-[50px] items-center justify-center overflow-hidden">
                                                <img
                                                    src={`/storage/${cart.product.image}`}
                                                    alt={cart.product.name}
                                                    className="h-full w-full object-cover object-center"
                                                    loading="lazy"
                                                />
                                            </div>

                                            <p className="text-sm font-light text-black dark:text-white">{cart.product.name}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatPrice(cart.product.price)}</TableCell>
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
                                                {cart.quantity}
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
                                    <TableCell>{formatPrice(cart.subtotal)}</TableCell>
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
                            <Link href="/billing-detail" className="text-2xl font-bold text-white">
                                <Button type="button" className="w-[200px]">
                                    Process to Checkout
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
