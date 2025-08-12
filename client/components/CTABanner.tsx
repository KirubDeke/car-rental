import Link from "next/link";

export function CTABanner() {
  return (
    <section className="relative bg-background py-20 sm:py-32 overflow-hidden">
      {/* Glowing background elements */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-40 -right-32 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-2xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 p-8 sm:p-12 text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <p className="text-red-100 text-lg mb-2">Limited Time Offer</p>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                20% Off All Luxury Rentals
              </h3>
              <p className="text-red-100 max-w-lg">
                Upgrade your ride with our premium selection of luxury vehicles at an exclusive discount.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/rentals"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-red-600 bg-white hover:bg-gray-50 rounded-lg transition-all duration-300 group"
              >
                <span>Book Now</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}