"use client";
import { liteClient } from "algoliasearch/lite";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { useDocsSearch } from "fumadocs-core/search/client";
import { useI18n } from "fumadocs-ui/contexts/i18n";

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "Your Algolia App ID";
const apiKey =
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY ||
  "Your Algolia Search API Key";
const indexName = process.env.ALGOLIA_INDEX_NAME || "document";
const client = liteClient(appId, apiKey);

export default function CustomSearchDialog(props: SharedProps) {
  const { locale } = useI18n();
  const { search, setSearch, query } = useDocsSearch({
    type: "algolia",
    client,
    indexName,
    locale,
  });

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== "empty" ? query.data : null} />
        <SearchDialogFooter>
          <a
            href="https://algolia.com"
            rel="noreferrer noopener"
            className="ms-auto text-xs text-fd-muted-foreground"
          >
            Powered By Algolia
          </a>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
