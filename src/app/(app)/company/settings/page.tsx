
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SchemaFormDialog } from "./schema-form-dialog";
import { mockEvaluationSchemas } from "@/lib/mock-data"; 
import type { EvaluationSchema } from "@/lib/types";

export default function EvaluationSchemasPage() {
    const [schemas, setSchemas] = useState<EvaluationSchema[]>(mockEvaluationSchemas);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSchema, setSelectedSchema] = useState<EvaluationSchema | null>(null);

    const handleAddNew = () => {
        setSelectedSchema(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (schema: EvaluationSchema) => {
        setSelectedSchema(schema);
        setIsDialogOpen(true);
    };
    
    const handleSaveSchema = (schemaData: EvaluationSchema) => {
        if (selectedSchema) {
            // Update existing schema
            setSchemas(schemas.map(s => s.id === schemaData.id ? schemaData : s));
        } else {
            // Add new schema
            setSchemas([...schemas, { ...schemaData, id: `schema-${Date.now()}` }]);
        }
    };

    return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight">
                Evaluation Schemas
            </h2>
            <p className="text-muted-foreground">
                Manage the criteria and scoring for your candidate evaluations.
            </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Schema
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {schemas.map(schema => (
            <Card key={schema.id}>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                       <span>{schema.name}</span>
                       <Badge variant={schema.isActive ? 'default' : 'outline'}>
                            {schema.isActive ? 'Active' : 'Inactive'}
                       </Badge>
                    </CardTitle>
                    <CardDescription>{schema.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Criteria ({schema.criteria.length})</h4>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground">
                            {schema.criteria.slice(0, 3).map(crit => <li key={crit.id}>{crit.name}</li>)}
                            {schema.criteria.length > 3 && <li>...and {schema.criteria.length - 3} more</li>}
                        </ul>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(schema)}>
                        <Settings className="mr-2 h-4 w-4" /> Edit
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>
       <SchemaFormDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSave={handleSaveSchema}
            schema={selectedSchema}
        />
    </div>
    );
}
