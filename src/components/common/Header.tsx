import { getDictionary } from "@/app/[lang]/dictionaries";
import { auth } from "@/auth";
import ReactQueryProvider from "@/providers/QueryProvider";
import { fetchUserCart, fetchUserWishlist } from "@/utils/headerFetchUtil";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../../public/logo.png";
import HeaderButtons from "./HeaderButtons";
import HeaderContainer from "./HeaderContainer";
import Search from "./Search";

const Header = async ({ lang }: ILang) => {
    const { search, wishlist, cart, account } = await getDictionary(lang);
    const session = (await auth()) as SessionWith_Id;

    const isAdmin = session?.user?.role === "admin";

    const wishlists =
        session?.user?._id && (await fetchUserWishlist(session?.user?._id));
    const cartItems =
        session?.user?._id && (await fetchUserCart(session?.user?._id));

    const headerButtonTexts = {
        search,
        wishlist,
        cart,
        account,
    };

    return (
        <HeaderContainer>
            <div className="container flex items-center justify-between bg-dark">
                <Link href={isAdmin ? `/${lang}/admin-dashboard` : `/${lang}`}>
                    <div className="flex gap-2 items-center">
                        <Image
                            src={Logo}
                            alt="Logo"
                            placeholder="blur"
                            width={150}
                            height={150}
                        />
                    </div>
                </Link>
                <ReactQueryProvider>
                    <Search searchLocale={search} />
                </ReactQueryProvider>
                {/* dont show this buttons if user is admin */}
                {!isAdmin && (
                    <HeaderButtons
                        user={session?.user}
                        headerButtonTexts={headerButtonTexts}
                        wishlists={wishlists ?? []}
                        cartItems={cartItems ?? []}
                    />
                )}
            </div>
        </HeaderContainer>
    );
};
export default Header;
