import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnimeFilterProps {
  categories: string[];
  setSelectedTab: (selectedTab: string) => void;
}

export default function AnimeFilter({
  categories,
  setSelectedTab,
}: AnimeFilterProps) {
  return (
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
  );
}
