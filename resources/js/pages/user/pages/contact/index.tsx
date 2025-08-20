import axios from 'axios';
import { LoaderCircle, Mail, PhoneCall } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { showToast } from '@/lib/utils/toast';
import { HomePage } from '@/types';

import UserLayout from '../../layouts/user-layout';

type MessageForm = {
    name: string;
    email: string;
    phone: string;
    message: string;
};

export default function Index() {
    const [home, setHome] = useState<HomePage>();
    const [data, setData] = useState<MessageForm>({ name: '', email: '', phone: '', message: '' });
    const [processing, setProcessing] = useState<boolean>(false);

    const onChangeNumber = (value: string) => {
        const number = value.replaceAll(/[^0-9]/g, '');
        setData((prev) => ({ ...prev, phone: number }));
    };

    const getHomePage = async () => {
        try {
            const rs = await axios.get('/get-home-page');
            const data = rs.data.data;
            setHome(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getHomePage();
    }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setProcessing(true);

            await axios.post('/contact', data);
            showToast('Message has been sent.');
            setData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <UserLayout>
            <div className="mt-10 flex min-h-[44.5vh] w-full gap-5">
                <div className="flex h-fit w-[30%] flex-col rounded border border-solid border-black p-7 dark:border-white">
                    <div className="mb-7 flex w-full flex-col border-b border-solid border-black pb-7 dark:border-white">
                        <div className="mb-5 flex w-full items-center gap-5">
                            <div className="flex aspect-square w-[40px] items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
                                <PhoneCall />
                            </div>
                            <span className="text-xl font-semibold text-black dark:text-white">Call to Us</span>
                        </div>

                        <p className="mb-3 text-sm text-black dark:text-white">We are available 24/7, 7 days a week.</p>
                        <p className="text-sm text-black dark:text-white">Phone: {home?.phone}</p>
                    </div>
                    <div className="flex w-full flex-col text-black dark:text-white">
                        <div className="mb-5 flex w-full items-center gap-5">
                            <div className="flex aspect-square w-[40px] items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
                                <Mail />
                            </div>
                            <span className="text-xl font-semibold">Write to Us</span>
                        </div>

                        <p className="mb-3 text-sm">Fill out our form and we will contact you within 24 hours.</p>
                        <p className="text-sm">Email: {home?.email}</p>
                    </div>
                </div>

                <form className="flex h-fit flex-1 flex-col gap-5 rounded border border-solid border-black p-7 dark:border-white" onSubmit={submit}>
                    <div className="flex w-full items-center gap-3">
                        <input
                            id="name"
                            type="type"
                            className="w-full bg-neutral-100 px-2 py-1 font-light text-black outline-none dark:bg-neutral-700 dark:text-white"
                            placeholder="Your name"
                            value={data.name}
                            required
                            disabled={processing}
                            onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
                        />

                        <input
                            id="email"
                            type="email"
                            className="w-full bg-neutral-100 px-2 py-1 font-light text-black outline-none dark:bg-neutral-700 dark:text-white"
                            placeholder="Your email"
                            value={data.email}
                            required
                            disabled={processing}
                            onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
                        />

                        <input
                            id="phone"
                            type="text"
                            className="w-full bg-neutral-100 px-2 py-1 font-light text-black outline-none dark:bg-neutral-700 dark:text-white"
                            placeholder="Your whatsapp"
                            value={data.phone}
                            required
                            disabled={processing}
                            onChange={(e) => onChangeNumber(e.target.value)}
                        />
                    </div>

                    <div className="flex w-full">
                        <textarea
                            name="message"
                            id="message"
                            className="min-h-[180px] w-full bg-neutral-100 px-2 py-1 font-light text-black outline-none dark:bg-neutral-700 dark:text-white"
                            placeholder="Your message"
                            value={data.message}
                            required
                            disabled={processing}
                            onChange={(e) => setData((prev) => ({ ...prev, message: e.target.value }))}
                        ></textarea>
                    </div>

                    <div className="flex w-full justify-end">
                        <Button
                            type="submit"
                            className="flex h-[50px] w-[250px] cursor-pointer items-center justify-center rounded bg-black text-white dark:bg-white dark:text-black"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Send Message
                        </Button>
                    </div>
                </form>
            </div>
        </UserLayout>
    );
}
