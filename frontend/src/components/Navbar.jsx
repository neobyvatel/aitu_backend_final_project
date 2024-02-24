import { useState } from "react";

const Header = () => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div className="bg-white-100/30 fixed top-0 z-50 w-full text-gray-200 shadow-sm backdrop-blur-lg backdrop-filter  ">
      <div className="mx-auto flex max-w-screen-xl flex-col px-4 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
        <div className="flex flex-row items-center justify-between p-4">
          <a
            href="#"
            className="focus:shadow-outline flex items-center justify-center gap-1 rounded-lg uppercase tracking-widest  text-gray-200 focus:outline-none"
          >
            SkyCast
          </a>
          <button
            className="focus:shadow-outline rounded-lg focus:outline-none md:hidden"
            onClick={handleToggle}
          >
            <svg fill="currentColor" viewBox="0 0 20 20" className="h-6 w-6">
              {open ? (
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                />
              )}
            </svg>
          </button>
        </div>
        <nav
          className={`${
            open ? "flex" : "hidden"
          } flex-grow flex-col pb-4 md:flex md:flex-row md:justify-end md:pb-0`}
        >
          <a
            className="focus:shadow-outline mt-2 rounded-lg px-4 py-2 text-sm transition-all hover:bg-gray-200  hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 focus:outline-none md:ml-4 md:mt-0 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white"
            href=""
          >
            Weather
          </a>
          <a
            href="#"
            className="focus:shadow-outline mt-2 rounded-lg bg-transparent px-4 py-2 text-sm transition-all hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 focus:outline-none md:ml-4 md:mt-0 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white"
          >
            Profile
          </a>
          <a
            href="#"
            className="focus:shadow-outline mt-2 rounded-lg bg-transparent px-4 py-2 text-sm transition-all hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 focus:outline-none md:ml-4 md:mt-0 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white"
          >
            About
          </a>
          <a
            href="https://github.com/neobyvatel"
            target="_blank "
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all hover:bg-gray-200 hover:text-gray-900 md:ml-4 md:mt-0 md:bg-transparent md:px-0 md:py-0 md:hover:bg-transparent md:hover:text-gray-500 dark:hover:bg-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"
              ></path>
            </svg>
            <span className="md:hidden ">Github</span>
          </a>
        </nav>
      </div>
    </div>
  );
};

export default Header;
