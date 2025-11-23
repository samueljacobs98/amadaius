import type { ComponentProps } from "react";
import { Loader2Icon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@frontend/ui/components";
import { cn } from "@frontend/ui/utils";

export function NotFoundContainer({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center",
        className,
      )}
      {...props}
    />
  );
}

export function NotFoundCard({
  className,
  ...props
}: ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn("hover:bg-fd-card w-fit px-6 py-12", className)}
      {...props}
    />
  );
}

export function NotFoundCardHeader(props: ComponentProps<typeof CardHeader>) {
  return <CardHeader {...props} />;
}

export function NotFoundContent(props: ComponentProps<typeof CardContent>) {
  return <CardContent {...props} />;
}

export function NotFoundLoader({ className, ...props }: ComponentProps<"p">) {
  return (
    <p className={cn("text-fd-muted-foreground text-sm", className)} {...props}>
      Finding Alternatives... <Loader2Icon className="size-4 animate-spin" />
    </p>
  );
}

export function NotFoundTitle(props: ComponentProps<typeof CardTitle>) {
  return <CardTitle {...props} />;
}

export function NotFoundSubtitle(
  props: ComponentProps<typeof CardDescription>,
) {
  return <CardDescription {...props} />;
}
