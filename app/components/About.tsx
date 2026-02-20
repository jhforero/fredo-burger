import Image from "next/image";

export default function About() {
  return (
    <section id="nosotros" className="bg-zinc-900 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              Sobre <span className="text-orange-500">Fredo Burger</span>
            </h2>
            <p className="mb-4 text-zinc-400 leading-relaxed">
              Somos un equipo apasionado por la parrilla y la buena comida.
              Desde nuestros inicios, nos hemos dedicado a ofrecer la mejor
              experiencia gastronómica en eventos de todo tipo.
            </p>
            <p className="mb-6 text-zinc-400 leading-relaxed">
              Cada corte de carne es seleccionado cuidadosamente y preparado con
              técnicas tradicionales de parrilla que garantizan sabor y calidad
              en cada bocado.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-orange-500">500+</p>
                <p className="text-sm text-zinc-400">Eventos</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-orange-500">5k+</p>
                <p className="text-sm text-zinc-400">Clientes</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-orange-500">10+</p>
                <p className="text-sm text-zinc-400">Años</p>
              </div>
            </div>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-800">
            <Image
              src="/about-grill.jpg"
              alt="Parrilla Fredo Burger"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
