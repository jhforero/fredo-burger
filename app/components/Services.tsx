const services = [
  {
    title: "Eventos Corporativos",
    description: "Reuniones de empresa, lanzamientos, team building. Menú personalizado para tu equipo.",
    icon: "🏢",
  },
  {
    title: "Bodas y Celebraciones",
    description: "Hacemos de tu día especial una experiencia culinaria única con carnes premium.",
    icon: "💍",
  },
  {
    title: "Cumpleaños",
    description: "Celebra con la mejor parrilla. Nos encargamos de todo para que disfrutes.",
    icon: "🎂",
  },
  {
    title: "Reuniones Familiares",
    description: "El sabor de la parrilla para reunir a tu familia en torno a la buena mesa.",
    icon: "👨‍👩‍👧‍👦",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="bg-zinc-950 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">
          Nuestros <span className="text-orange-500">Servicios</span>
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-zinc-400">
          Nos adaptamos a cualquier tipo de evento. Desde reuniones íntimas hasta
          grandes celebraciones.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-xl bg-zinc-900 p-6 text-center transition hover:bg-zinc-800"
            >
              <div className="mb-4 text-4xl">{service.icon}</div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {service.title}
              </h3>
              <p className="text-sm text-zinc-400">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
