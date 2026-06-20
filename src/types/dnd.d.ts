import "@hello-pangea/dnd";

declare module "@hello-pangea/dnd" {
    interface DraggingStyle {
        [key: `--radix-${string}`]: string;
    }
    interface NotDraggingStyle {
        [key: `--radix-${string}`]: string;
    }
}