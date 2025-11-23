import Link from "next/link";
import * as lucideIcons from "lucide-react";
import type { MDXComponents } from "mdx/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardIcon,
  CardsContainer,
  CardTitle,
} from "@frontend/ui/components";

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...Object.fromEntries(
      Object.entries(lucideIcons)
        .filter(([key]) => key !== "default")
        .map(([key, value]) => [key, value]),
    ),
    Card,
    CardHeader,
    CardIcon,
    CardTitle,
    CardContent,
    CardDescription,
    CardsContainer,
    Link,
    ...components,
  };
}
