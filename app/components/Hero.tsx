import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center justify-center bg-zinc-900"
    >
      {/* Background image */}
      <Image
        src="/hero-bg.jpg"
        alt="Carnes a la parrilla"
        fill
        className="object-cover opacity-40"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/60 via-zinc-900/20 to-zinc-900" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <h1 className="mb-4 text-5xl font-extrabold leading-tight text-white md:text-7xl">
          Carnes a la <span className="text-orange-500">Parrilla</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-300 md:text-xl">
          Catering especializado en parrilla para tus eventos. Convertimos cada
          reunión en una experiencia gastronómica inolvidable.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/cotizar"
            className="rounded-full bg-orange-600 px-8 py-3 text-lg font-bold text-white transition hover:bg-orange-700"
          >
            Cotiza tu Evento
          </Link>
          <a
            href="#menu"
            className="rounded-full border-2 border-zinc-500 px-8 py-3 text-lg font-bold text-white transition hover:border-orange-500"
          >
            Ver Menú
          </a>
        </div>
      </div>
    </section>
  );
}
