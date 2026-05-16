export function MapEmbed() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
        <iframe
          title="Ubicación BLOQUE — Metro Manquehue"
          src="https://www.google.com/maps?q=Metro+Manquehue,+Las+Condes,+Santiago&output=embed"
          className="aspect-[16/8] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
