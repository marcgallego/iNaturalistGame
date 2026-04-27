import Link from 'next/link'

export default function Navbar() {
    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900 w-full fixed top-0 left-0 z-50" style={{ height: 'var(--navbar-h)' }}>
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto h-full px-4">
                <div className="w-full md:w-auto h-full flex items-center" id="navbar-default">
                    <ul className="font-medium flex flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 m-0 p-0 border-0 bg-transparent h-full items-center">
                        <li>
                            <Link href="/">
                                <span className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Inici</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/explore">
                                <span className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Explora</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/new_test">
                                <span className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Test</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}