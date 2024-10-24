"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface AnimeFilterProps {
  categories: string[];
  setSelectedTab: (selectedTab: string) => void;
  currentPage: number;
  handlePageChange: (pageNumber: number) => void;
}

export default function AnimeFilter({
  categories,
  setSelectedTab,
  currentPage,
  handlePageChange,
}: AnimeFilterProps) {
  const totalPages = 5;
  return (
    <div className="flex flex-col md:flex-row items-center justify-between">
      <Tabs
        defaultValue={categories[0].toLowerCase()}
        className="w-full md:max-w-[300px] mt-2"
        onValueChange={(value) => setSelectedTab(value)}
      >
        <TabsList
          className="grid w-full bg-background"
          style={{
            gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))`,
          }} // Corrected style usage
        >
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category.toLowerCase()}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {category.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="mt-2">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        >
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
