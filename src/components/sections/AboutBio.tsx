import Image from "next/image";

type AboutBioProps = {
  title: string;
  bio: string;
  photoUrl: string | null;
};

export default function AboutBio({ title, bio, photoUrl }: AboutBioProps) {
  return (
    <section className="flex flex-col lg:flex-row gap-12 items-start max-w-5xl mx-auto">
      <div className="flex-shrink-0 mx-auto lg:mx-0">
        <div className="relative w-64 h-64 rounded-card overflow-hidden glass-card">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt="Mathieu Souli"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-offwhite/30 text-xs font-mono text-center px-4">
              Photo à ajouter depuis le backoffice
            </div>
          )}
        </div>
      </div>

      <div>
        <h1 className="font-display text-4xl font-bold text-offwhite mb-6">
          {title}
        </h1>
        <p className="text-offwhite/80 leading-relaxed whitespace-pre-line">
          {bio}
        </p>
      </div>
    </section>
  );
}