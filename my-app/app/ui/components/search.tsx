"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    const cleanedTerm = term.trim();

    if (cleanedTerm) {
      params.set("query", cleanedTerm);
    } else {
      params.delete("query");
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  return (
    <input
      placeholder={placeholder}
      onChange={(e) => handleSearch(e.target.value)}
      defaultValue={searchParams.get("query")?.toString() || ""}
    />
  );
}