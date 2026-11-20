import Navbar from "@/components/shared/Navbar";

const HeroBanner = () => {
  return (
    <section className="relative -mt-[88px] min-h-[calc(85vh+84px)] overflow-hidden md:min-h-[calc(100vh+84px)]">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero.jpeg')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />

      {/* Banner Content */}
      <div className="relative z-10 flex min-h-[calc(85vh+80px)] items-center pt-[80px] md:min-h-[calc(100vh+80px)]">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-12">
          <div className="max-w-2xl">

            <h1 className="font-serif text-3xl font-bold italic leading-tight text-white sm:text-4xl md:text-4xl lg:text-5xl">
              Your Dream Wedding,
              <span className="mt-2 block text-[#F8F3EB]">
                Beautifully Planned
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-white/90 md:text-lg">
              Discover trusted wedding vendors and find everything you need
              to make your special day unforgettable.
            </p>

            <a
              href="/services"
              className="mt-8 inline-flex items-center rounded-full bg-[#F8F3EB] px-7 py-3.5 text-sm font-semibold text-[#76243A] shadow-lg transition duration-300 hover:bg-[#EDE3D8] hover:shadow-xl md:text-base"
            >
              Explore Wedding Services
            </a>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;