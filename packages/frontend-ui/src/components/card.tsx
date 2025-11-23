import type { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../lib/utils";

export function Card({
  className,
  asChild,
  ...props
}: ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="card"
      className={cn(
        "flex size-full flex-col items-center gap-1 lg:gap-2",
        "bg-fd-card text-fd-card-foreground hover:bg-fd-accent/80 rounded-xl border transition-colors",
        "p-4",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col items-center gap-y-3 text-center",
        className,
      )}
      {...props}
    />
  );
}

export function CardIcon({
  className,
  asChild,
  ...props
}: ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="card-icon"
      className={cn(
        "not-prose bg-fd-muted text-fd-muted-foreground w-fit rounded-lg border p-1.5 shadow-md [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  asChild,
  ...props
}: ComponentProps<"h3"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "h3";

  return (
    <Comp
      data-slot="card-title"
      className={cn("not-prose text-sm font-medium", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-fd-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("max-w-md px-6 pt-2 text-center md:max-w-lg", className)}
      {...props}
    />
  );
}

export function CardsContainer({
  className,
  asChild,
  ...props
}: ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="cards-container"
      className={cn(
        "flex flex-col items-center gap-x-5 gap-y-5 md:gap-y-10 lg:gap-10",
        "pb-6 shadow-inner md:py-8",
        className,
      )}
      {...props}
    />
  );
}
