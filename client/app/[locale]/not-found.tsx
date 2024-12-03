import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import notFound from "@/app/public/assets/404.png";

export default async function NotFound() {
  const t = await getTranslations("");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <Image src={notFound} alt="404" width={200} height={200} />
        </div>

        <div className="space-y-4">
          <p className="text-gray-500 max-w-md mx-auto">
            Oops! The page you're looking for seems to have vanished into thin air. Let's get
            you back on track.
          </p>

          <Link
            href={`${t("locale")}/dashboard`}
            className="inline-block px-6 py-3 rounded-lg bg-primary text-white 
              hover:bg-primary/70 transition-colors duration-200 shadow-lg
              hover:shadow-xl"
          >
            Return to Dashboard
          </Link>
        </div>

        {/* Optional decorative elements */}
        <div className="mt-8 text-gray-400">
          <div className="inline-block animate-bounce">↓</div>
        </div>
      </div>
    </div>
  );
}
