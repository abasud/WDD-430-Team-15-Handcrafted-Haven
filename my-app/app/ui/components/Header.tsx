import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/handcrafted-haven-logo.png";
import { auth, signOut } from "../../../auth";

export default async function Header() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const user = session?.user;

  return (
    <header className="site-header">
      <div className="upper-line">
        <Link href="/" className="logo-link">
          <Image
            className="logo"
            src={logo}
            alt="Handcrafted Haven Logo"
            loading="eager"
            priority
          />
        </Link>

        <nav className="header-nav">
          {!isLoggedIn && (
            <>
              <Link href="/signup" className="nav-link">
                Create Account
              </Link>
              <Link href="/login" className="login-button">
                Sign In
              </Link>
            </>
          )}

          {isLoggedIn && (
            <div className="user-menu">
              <Link href="/account" className="user-info">
                <span className="user-name">{user.name ?? user.email}</span>
                {user.role && (
                  <span className={`role-badge role-badge--${user.role}`}>
                    {user.role}
                  </span>
                )}
              </Link>

              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit" className="login-button logout-button">
                  Logout
                </button>
              </form>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}