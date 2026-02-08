import React from "react";
import { useQuery } from "@tanstack/react-query";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { GlobalSearch } from "@/shared/ui/search/GlobalSearch";
import { regionsApi } from "@/features/regions/api/regionsApi";
import { regionsQueryKeys } from "@/features/regions/api/regionsQueryKeys";
import { outagesApi } from "@/features/outages/api/outagesApi";
import { outagesQueryKeys } from "@/features/outages/api/outagesQueryKeys";

export const Topbar: React.FC = () => {
  const { data: regionsData } = useQuery({
    queryKey: regionsQueryKeys.list({ page: 1, pageSize: 31 }),
    queryFn: () => regionsApi.getRegions({ page: 1, pageSize: 31 }),
    staleTime: 60000,
  });

  const { data: outagesData } = useQuery({
    queryKey: outagesQueryKeys.list({ page: 1, pageSize: 50 }),
    queryFn: () => outagesApi.getOutages({ page: 1, pageSize: 50 }),
    staleTime: 30000,
  });

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex-1 max-w-md">
        <GlobalSearch
          regions={regionsData?.data ?? []}
          outages={outagesData?.data ?? []}
        />
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
};
