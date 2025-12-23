import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { HomeHeroCarousel } from "@/components/HomeHeroCarousel";
import { ImpactCounter } from "@/components/ImpactCounter";

export default async function Home() {
  const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });
  const slides = await prisma.homeHeroSlide.findMany({ orderBy: { order: "asc" } });
  const stats = await prisma.stat.findMany({ orderBy: { order: "asc" } });

  const featuredProjects = await prisma.project.findMany({
    where: { isHighlight: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const latestNews = await prisma.news.findMany({
    where: { isHighlight: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const showHero = config?.showHero ?? true;
  const showNews = config?.showNews ?? true;
  const showProjects = config?.showProjects ?? true;
  const showPartners = config?.showPartners ?? true;
  const showStats = config?.showStats ?? true;

  return (
    <div className="flex flex-col gap-16 pb-16 bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Hero Section */}
      {showHero && (
        <div className="animate-in fade-in duration-1000">
          {slides.length > 0 ? (
            <HomeHeroCarousel slides={slides} config={config} />
          ) : (
            <section className="relative bg-indigo-700 text-white min-h-[60vh] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-black/40 z-0"></div>
              <div className="relative z-10 text-center space-y-6 px-4 max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-in slide-in-from-top-10 duration-700">RiseGen</h1>
                <p className="text-xl md:text-2xl font-light text-white/90 max-w-2xl mx-auto animate-in slide-in-from-bottom-5 duration-700">
                  Budujemy społeczność młodych ludzi z regionu, łącząc pokolenia i wspierając rozwój.
                </p>
                <div className="pt-4 animate-in fade-in zoom-in-95 duration-1000 delay-300">
                  <Link
                    href="/zgloszenia"
                    className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-full hover:bg-gray-100 transition shadow-lg inline-block"
                  >
                    Dołącz do nas
                  </Link>
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {/* Stats Section */}
      {showStats && <ImpactCounter stats={stats as any} />}

      {/* Latest News Section */}
      {showNews && (
        <section className="container mx-auto px-4 max-w-6xl space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Aktualności</h2>
            <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 dark:text-gray-400">Bądź na bieżąco z życiem naszego stowarzyszenia.</p>
          </div>

          {latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestNews.map((news) => {
                let imageUrl = null;
                try {
                  const images = JSON.parse(news.images);
                  if (Array.isArray(images) && images.length > 0) {
                    imageUrl = images[0];
                  }
                } catch (e) { }

                return (
                  <div key={news.id} className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col h-full transform hover:-translate-y-1">
                    <div className="h-56 bg-gray-200 dark:bg-gray-800 w-full relative">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">Brak zdjęcia</div>
                      )}
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-3 bg-indigo-50 dark:bg-indigo-900/30 inline-block px-3 py-1 rounded-full w-fit">
                        {new Date(news.createdAt).toLocaleDateString("pl-PL")}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{news.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 flex-grow text-sm leading-relaxed">
                        {news.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                      </p>
                      <Link href={`/aktualnosci/${news.slug}`} className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-800 dark:hover:text-indigo-300 mt-auto inline-flex items-center group/link transition-colors">
                        Czytaj więcej <ArrowRight className="ml-2 h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">Brak aktualności. Wkrótce coś dodamy!</p>
            </div>
          )}
        </section>
      )}

      {/* Featured Projects Section */}
      {showProjects && (
        <section className="container mx-auto px-4 max-w-6xl space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-100">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Nasze Projekty</h2>
            <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 dark:text-gray-400">Działamy aktywnie, realizując inicjatywy ważne dla regionu.</p>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProjects.map((project) => {
                let imageUrl = null;
                try {
                  const images = JSON.parse(project.images);
                  if (Array.isArray(images) && images.length > 0) {
                    imageUrl = images[0];
                  }
                } catch (e) { }

                return (
                  <div key={project.id} className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col h-full transform hover:-translate-y-1">
                    <div className="h-56 bg-gray-200 dark:bg-gray-800 w-full relative">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 font-medium">Projekt RiseGen</div>
                      )}
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 flex-grow leading-relaxed font-light">{project.description ? project.description.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..." : ''}</p>
                      <Link href={`/projekty/${project.slug}`} className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-800 dark:hover:text-indigo-300 mt-auto inline-flex items-center group/link transition-colors">
                        Zobacz szczegóły <ArrowRight className="ml-2 h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">Na razie nie wyróżniliśmy żadnych projektów. Wkrótce się pojawią!</p>
            </div>
          )}
        </section>
      )}

      {showPartners && (
        <PartnersSection />
      )}
    </div>
  );
}
