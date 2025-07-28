import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import UserLayout from '../../layouts/user-layout';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <UserLayout>
            <form className="mt-10 flex w-full items-center justify-between" onSubmit={submit}>
                <div className="h-auto w-[60%]">
                    <img src="/images/engine.jpg" alt="Enging" className="h-auto w-full object-contain object-center" />
                </div>

                <div className="flex w-[35%] flex-col">
                    <div className="text-[40px] text-white">Create an account</div>
                    <p className="mb-10 text-base text-white">Enter your detail below</p>

                    <div className="mb-10 flex w-full flex-col">
                        <input
                            id="name"
                            type="text"
                            className="w-full border-b border-solid border-neutral-600 px-1 py-1 text-white outline-none focus:border-white"
                            placeholder="Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="mb-10 flex w-full flex-col">
                        <input
                            type="email"
                            className="w-full border-b border-solid border-neutral-600 px-1 py-1 text-white outline-none focus:border-white"
                            placeholder="Email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mb-10 flex w-full flex-col">
                        <input
                            type="password"
                            className="w-full border-b border-solid border-neutral-600 px-1 py-1 text-white outline-none focus:border-white"
                            placeholder="Password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mb-10 flex w-full flex-col">
                        <input
                            type="password"
                            className="w-full border-b border-solid border-neutral-600 px-1 py-1 text-white outline-none focus:border-white"
                            placeholder="Confirm Password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    <div className="mb-5 w-full">
                        <Button
                            type="submit"
                            className="flex h-[40px] w-full cursor-pointer items-center justify-center rounded bg-white font-semibold text-black"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Create Account
                        </Button>
                    </div>

                    <div className="flex w-full items-center justify-center gap-1 text-sm">
                        Allready have account?
                        <TextLink href={route('login')} tabIndex={5}>
                            Login
                        </TextLink>
                    </div>
                </div>
            </form>
        </UserLayout>
    );
}
