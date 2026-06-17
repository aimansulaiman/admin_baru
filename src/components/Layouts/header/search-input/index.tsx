"use client";

import { CloseIcon, SearchIcon } from "@/assets/icons";
import { NAV_DATA } from "@/components/Layouts/sidebar/data";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { Command } from "cmdk";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type CommandItem = {
  value: string;
  label: string;
  href: string;
  group: string;
  description?: string;
};

function buildCommandItems(): CommandItem[] {
  const items: CommandItem[] = [];

  NAV_DATA.forEach((section) => {
    section.items.forEach((item) => {
      if (item.items.length) {
        item.items.forEach((subItem) => {
          items.push({
            value: `${section.label} ${item.title} ${subItem.title} ${subItem.url}`,
            label: subItem.title,
            href: subItem.url,
            group: `${section.label} / ${item.title}`,
            description: subItem.url,
          });
        });
        return;
      }

      const href: string =
        "url" in item
          ? String(item.url)
          : "/" + item.title.toLowerCase().split(" ").join("-");

      items.push({
        value: `${section.label} ${item.title} ${href}`,
        label: item.title,
        href,
        group: section.label,
        description: href,
      });
    });
  });

  return items;
}

export function SearchInput() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3.5 rounded-full border bg-gray-2 p-3 ring-primary transition-colors outline-none focus-visible:ring-1 min-[1015px]:w-75 min-[1015px]:px-5 dark:border-dark-3 dark:bg-dark-2 dark:hover:border-dark-4 dark:hover:bg-dark-3 dark:hover:text-dark-6"
        aria-label="Open search"
      >
        <SearchIcon className="max-[1015px]:size-5" />
        <span className="max-[1015px]:sr-only">Search</span>
      </button>

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <CommandPalette onClose={() => setIsOpen(false)} />
      </Modal>
    </>
  );
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const commandItems = useMemo(() => buildCommandItems(), []);

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="flex h-full w-full flex-col rounded-xl border border-neutral-200 bg-white p-0 dark:border-none dark:bg-dark dark:text-gray-5">
      <h2 id="search-dialog-title" className="sr-only">
        Search dialog
      </h2>

      <div className="flex flex-1 flex-col overflow-y-auto">
        <Command
          shouldFilter
          className="flex flex-1 flex-col overflow-hidden rounded-xl"
        >
          <div className="sticky top-0 z-10 border-b border-stroke bg-white dark:border-dark-3 dark:bg-dark">
            <div className="relative">
              <Command.Input
                autoFocus
                placeholder="Site Search..."
                className={cn(
                  "h-18 w-full border-0 bg-transparent pr-4 pl-15 text-dark outline-none placeholder:text-dark-4 placeholder:opacity-100 dark:bg-dark dark:text-gray-5 dark:placeholder:text-dark-6",
                )}
              />

              <SearchIcon
                width={20}
                height={20}
                className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 cursor-pointer"
              />
            </div>
          </div>

          <Command.List className="flex-1 overflow-y-auto">
            <Command.Empty>
              <div className="py-12 text-center">
                Enter keywords to see results...
              </div>
            </Command.Empty>

            {groupItems(commandItems).map((group) => (
              <Command.Group
                key={group.label}
                heading={group.label}
                className="**:[[cmdk-group-heading]]:sr-only"
              >
                {group.items.map((item) => (
                  <Command.Item
                    key={item.href + item.label}
                    value={item.value}
                    onSelect={() => handleSelect(item.href)}
                    className={cn(
                      "flex items-center gap-4 px-5.5 py-3.5 outline-none",
                      "aria-selected:bg-gray-2 aria-selected:dark:bg-slate-800",
                    )}
                  >
                    <div className="w-full">
                      <h3 className="text-base font-medium text-dark dark:text-gray-400">
                        {item.label}
                      </h3>

                      <div className="flex gap-1 text-sm text-dark-5 dark:text-dark-6">
                        <span>{item.group}:</span>
                        <span className="truncate">
                          {item.description ?? item.href}
                        </span>
                      </div>
                    </div>

                    {pathname === item.href && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Current
                      </span>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="absolute top-0 right-0 grid size-11 translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-2 bg-white transition-colors outline-none hover:bg-gray-3 focus-visible:bg-gray-3 dark:border-dark-3 dark:bg-dark-2 dark:hover:bg-dark-3 dark:focus-visible:bg-dark-3"
        aria-label="Close search"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

function groupItems(items: CommandItem[]) {
  const groups = new Map<string, CommandItem[]>();

  items.forEach((item) => {
    const list = groups.get(item.group) ?? [];
    list.push(item);
    groups.set(item.group, list);
  });

  return Array.from(groups.entries()).map(([label, groupItems]) => ({
    label,
    items: groupItems,
  }));
}
