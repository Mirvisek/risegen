"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";

interface Props {
    initialOrder: string;
    onOrderChange: (newOrder: string) => void;
    labels?: Record<string, string>;
}

const DEFAULT_LABELS: Record<string, string> = {
    hero: "Sekcja Hero (Baner)",
    stats: "Licznik Sukcesów",
    action: "Centrum Akcji",
    news: "Aktualności",
    events: "Nadchodzące Wydarzenia",
    projects: "Wyróżnione Projekty",
    partners: "Partnerzy",
};

export function SectionOrderSortable({ initialOrder, onOrderChange, labels = DEFAULT_LABELS }: Props) {
    const [items, setItems] = useState(
        initialOrder
            .split(",")
            .filter((id) => labels[id]) // Filter out unknown IDs
            .map((id) => ({ id, label: labels[id] }))
    );

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const newItems = Array.from(items);
        const [reorderedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, reorderedItem);

        setItems(newItems);
        onOrderChange(newItems.map((item) => item.id).join(","));
    };

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Kolejność sekcji (przeciągnij, aby zmienić)
            </h4>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2"
                        >
                            {items.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm ${snapshot.isDragging ? "ring-2 ring-indigo-500 z-50" : ""
                                                }`}
                                        >
                                            <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                {item.label}
                                            </span>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Zmiany tutaj wpływają na kolejność wyświetlania sekcji na stronie głównej. Pamiętaj, aby zapisać formularz po zmianie kolejności.
            </p>
        </div>
    );
}
