import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, PhoneCall } from 'lucide-react';
import UserLayout from '../../layouts/user-layout';

type MessageForm = {
    name: string;
    email: string;
    phone: string;
    message: string;
};

export default function Index() {
    const { data, setData, post, processing } = useForm<Required<MessageForm>>({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const onChangeNumber = (value: string) => {
        const number = value.replaceAll(/[^0-9]/g, '');
        setData('phone', number);
    };

    return (
        <UserLayout>
            <div className="mt-10 flex min-h-[44.5vh] w-full gap-5">
                <div className="flex h-fit w-[30%] flex-col rounded border border-solid border-white p-7">
                    <div className="mb-7 flex w-full flex-col border-b border-solid border-black pb-7 dark:border-white">
                        <div className="mb-5 flex w-full items-center gap-5">
                            <div className="flex aspect-square w-[40px] items-center justify-center rounded-full bg-white text-black">
                                <PhoneCall />
                            </div>
                            <span className="text-xl font-semibold text-black dark:text-white">Call to Us</span>
                        </div>

                        <p className="mb-3 text-sm text-black dark:text-white">We are available 24/7, 7 days a week.</p>
                        <p className="text-sm text-black dark:text-white">Phone: 0893234923</p>
                    </div>
                    <div className="flex w-full flex-col">
                        <div className="mb-5 flex w-full items-center gap-5">
                            <div className="flex aspect-square w-[40px] items-center justify-center rounded-full bg-white text-black">
                                <Mail />
                            </div>
                            <span className="text-xl font-semibold text-black dark:text-white">Write to Us</span>
                        </div>

                        <p className="mb-3 text-sm text-black dark:text-white">Fill out our form and we will contact you within 24 hours.</p>
                        <p className="text-sm text-black dark:text-white">Email: test@mail.com</p>
                    </div>
                </div>

                <form className="flex h-fit flex-1 flex-col gap-5 rounded border border-solid border-white p-7">
                    <div className="flex w-full items-center gap-3">
                        <input
                            id="name"
                            type="type"
                            className="w-full bg-neutral-700 px-2 py-1 font-light text-white outline-none"
                            placeholder="Your name"
                            value={data.name}
                            required
                            disabled={processing}
                            onChange={(e) => setData('name', e.target.value)}
                        />

                        <input
                            id="email"
                            type="email"
                            className="w-full bg-neutral-700 px-2 py-1 font-light text-white outline-none"
                            placeholder="Your email"
                            value={data.email}
                            required
                            disabled={processing}
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <input
                            id="phone"
                            type="text"
                            className="w-full bg-neutral-700 px-2 py-1 font-light text-white outline-none"
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
                            className="min-h-[180px] w-full bg-neutral-700 px-2 py-1 font-light text-white outline-none"
                            placeholder="Your message"
                            value={data.message}
                            required
                            disabled={processing}
                            onChange={(e) => setData('message', e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex w-full justify-end">
                        <Button
                            type="button"
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
