// file: app/(pos)/pos/components/table-selection-modal.tsx (Phiên bản nâng cấp với Tabs)
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BanResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo } from "react";

// Import hằng số vị trí để có label đẹp
import { locations } from "@/constants/locations";

interface TableSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables?: BanResponse[];
  isLoading: boolean;
  onSelectTable: (table: BanResponse) => void;
}

export const TableSelectionModal = ({
  isOpen,
  onClose,
  tables,
  isLoading,
  onSelectTable,
}: TableSelectionModalProps) => {
  const handleSelect = (table: BanResponse) => {
    if (table.trangThaiBan === "TRONG") {
      onSelectTable(table);
      onClose();
    }
  };

  // Sử dụng useMemo để nhóm các bàn theo vị trí một lần duy nhất
  const groupedTables = useMemo(() => {
    if (!tables) return {};
    return tables.reduce(
      (acc, table) => {
        const location = table.viTri;
        if (!acc[location]) {
          acc[location] = [];
        }
        acc[location].push(table);
        return acc;
      },
      {} as Record<string, BanResponse[]>
    );
  }, [tables]);

  // Lấy danh sách các vị trí có bàn
  const availableLocations = Object.keys(groupedTables);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Chọn Bàn</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="p-4">
            <Skeleton className="h-10 w-full mb-4" />
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        ) : (
          <Tabs
            defaultValue={availableLocations[0] || "default"}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              {availableLocations.map((locationKey) => {
                const locationLabel =
                  locations.find((l) => l.value === locationKey)?.label ||
                  locationKey;
                return (
                  <TabsTrigger key={locationKey} value={locationKey}>
                    {locationLabel}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {availableLocations.map((locationKey) => (
              <TabsContent key={locationKey} value={locationKey}>
                <ScrollArea className="max-h-[50vh]">
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-4 p-4">
                    {groupedTables[locationKey].map((table) => (
                      <Button
                        key={table.id}
                        variant={
                          table.trangThaiBan === "TRONG"
                            ? "outline"
                            : "secondary"
                        }
                        disabled={table.trangThaiBan !== "TRONG"}
                        className={cn("h-16 flex-col", {
                          "border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600":
                            table.trangThaiBan === "TRONG",
                          "cursor-not-allowed": table.trangThaiBan !== "TRONG",
                        })}
                        onClick={() => handleSelect(table)}
                      >
                        <span className="font-bold">{table.soBan}</span>
                        <span className="text-xs">
                          {table.trangThaiBan === "TRONG"
                            ? "Trống"
                            : "Có khách"}
                        </span>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};
