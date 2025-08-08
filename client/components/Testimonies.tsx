export default function Testimonies() {
    return (

        <section id="testimonials" aria-label="What our customers are saying" className="relative bg-background py-20 sm:py-32 overflow-hidden">
            {/* Glowing background elements */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-40 -right-32 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <h2
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                    className="font-orbitron text-2xl font-extrabold tracking-tight mb-12 text-left md:text-3xl xl:text-4xl"
                >
                    Customer <span className="text-red-500">Testimonies</span>
                </h2>

                <ul role="list" className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3">
                    {/* Testimonial 1 */}
                    <li>
                        <figure className="relative rounded-2xl bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 p-6 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/10 hover:ring-blue-200/50 transition-all duration-300">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl opacity-0 group-hover:opacity-50 blur transition-all duration-500"></div>
                            <div className="relative">
                                <svg aria-hidden="true" width="105" height="78" className="absolute left-6 top-6 fill-slate-100 dark:hidden">
                                    <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z"></path>
                                </svg>

                                {/* Star Rating */}
                                <div className="flex mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                        </svg>
                                    ))}
                                </div>

                                <blockquote className="relative">
                                    <p className="text-lg tracking-tight text-foreground dark:text-foreground">"I love the car I rented from this site. The quality is exceptional and the prices are unbeatable. Will definitely rent again!"</p>
                                </blockquote>

                                <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                                    <div>
                                        <div className="font-display text-base text-foreground dark:text-foreground">Sheryl Berge</div>
                                    </div>
                                    <div className="overflow-hidden rounded-full bg-slate-50">
                                        <img alt="" className="h-14 w-14 object-cover" style={{ color: "transparent" }} src="https://randomuser.me/api/portraits/men/15.jpg" />
                                    </div>
                                </figcaption>
                            </div>
                        </figure>
                    </li>

                    {/* Testimonial 2 */}
                    <li>
                        <figure className="relative rounded-2xl bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 p-6 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/10 hover:ring-blue-200/50 transition-all duration-300">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl opacity-0 group-hover:opacity-50 blur transition-all duration-500"></div>
                            <div className="relative">
                                <svg aria-hidden="true" width="105" height="78" className="absolute left-6 top-6 fill-slate-100 dark:hidden">
                                    <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z"></path>
                                </svg>

                                {/* Star Rating */}
                                <div className="flex mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                        </svg>
                                    ))}
                                </div>

                                <blockquote className="relative">
                                    <p className="text-lg tracking-tight text-foreground dark:text-foreground">"The car was in perfect condition and the rental process was seamless. Customer service was exceptional when I had questions."</p>
                                </blockquote>

                                <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                                    <div>
                                        <div className="font-display text-base text-foreground dark:text-foreground">Leland Kiehn</div>
                                    </div>
                                    <div className="overflow-hidden rounded-full bg-slate-50">
                                        <img alt="" className="h-14 w-14 object-cover" style={{ color: "transparent" }} src="https://randomuser.me/api/portraits/women/15.jpg" />
                                    </div>
                                </figcaption>
                            </div>
                        </figure>
                    </li>

                    {/* Testimonial 3 */}
                    <li>
                        <figure className="relative rounded-2xl bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 p-6 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/10 hover:ring-blue-200/50 transition-all duration-300">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl opacity-0 group-hover:opacity-50 blur transition-all duration-500"></div>
                            <div className="relative">
                                <svg aria-hidden="true" width="105" height="78" className="absolute left-6 top-6 fill-slate-100 dark:hidden">
                                    <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z"></path>
                                </svg>

                                {/* Star Rating */}
                                <div className="flex mb-4">
                                    {[1, 2, 3, 4].map((star) => (
                                        <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                        </svg>
                                    ))}
                                    <svg className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                </div>

                                <blockquote className="relative">
                                    <p className="text-lg tracking-tight text-foreground dark:text-foreground">"Great selection of vehicles at competitive prices. The pickup process was quick and easy. Only suggestion would be more late model options."</p>
                                </blockquote>

                                <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                                    <div>
                                        <div className="font-display text-base text-foreground dark:text-foreground">Peter Renolds</div>
                                    </div>
                                    <div className="overflow-hidden rounded-full bg-slate-50">
                                        <img alt="" className="h-14 w-14 object-cover" style={{ color: "transparent" }} src="https://randomuser.me/api/portraits/men/10.jpg" />
                                    </div>
                                </figcaption>
                            </div>
                        </figure>
                    </li>
                </ul>
            </div>
        </section>
    )
}