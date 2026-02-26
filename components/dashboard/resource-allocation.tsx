"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Truck } from "lucide-react"
import type { ResourceItem } from "@/lib/types"
import { useTranslation, translateResourceType, translateStatus } from "@/lib/translations"
import { cn } from "@/lib/utils"

interface ResourceAllocationProps {
  resources: ResourceItem[]
}

const statusStyles: Record<string, string> = {
  Deployed: "bg-risk-high-bg text-risk-high border-risk-high/30",
  "En Route": "bg-risk-medium-bg text-risk-medium border-risk-medium/30",
  Standby: "bg-risk-low-bg text-risk-low border-risk-low/30",
}

export function ResourceAllocation({ resources }: ResourceAllocationProps) {
  const { t } = useTranslation()

  return (
    <Card className="border-border/60 bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
          <Truck className="h-5 w-5 text-primary" />
          {t.resourceAllocation}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/60 overflow-x-auto">
          <Table className="min-w-[400px]">
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="text-card-foreground font-semibold">{t.resourceType}</TableHead>
                <TableHead className="text-center text-card-foreground font-semibold">{t.quantity}</TableHead>
                <TableHead className="text-right text-card-foreground font-semibold">{t.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource.type} className="hover:bg-secondary/30">
                  <TableCell className="font-medium text-card-foreground">{translateResourceType(resource.type, t)}</TableCell>
                  <TableCell className="text-center font-mono text-sm text-card-foreground">
                    {resource.quantity.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className={cn("text-xs font-semibold", statusStyles[resource.status])}
                    >
                      {translateStatus(resource.status, t)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
